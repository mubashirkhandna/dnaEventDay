import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireJudge } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const judge = requireJudge(req, res);
  if (!judge) return;
  if (req.method !== 'POST') return res.status(405).end();
  const judgeId = judge.judgeId as string;
  const { teamId, costEffectiveness, medicalImpact, feasibility, technicalExecution, note } = req.body;
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) return res.status(404).json({ error: 'Team not found' });
  let canScore = team.status === 'PRESENTING';
  if (!canScore) {
    const request = await prisma.scoreRequest.findUnique({ where: { judgeId_teamId: { judgeId, teamId } } });
    canScore = request?.status === 'APPROVED';
  }
  if (!canScore) return res.status(403).json({ error: 'You do not have access to score this team right now' });
  const ce = Number(costEffectiveness), mi = Number(medicalImpact), fe = Number(feasibility), te = Number(technicalExecution);
  if (ce < 0 || ce > 35) return res.status(400).json({ error: 'costEffectiveness must be 0-35' });
  if (mi < 0 || mi > 30) return res.status(400).json({ error: 'medicalImpact must be 0-30' });
  if (fe < 0 || fe > 20) return res.status(400).json({ error: 'feasibility must be 0-20' });
  if (te < 0 || te > 15) return res.status(400).json({ error: 'technicalExecution must be 0-15' });
  const score = await prisma.judgeScore.upsert({ where: { judgeId_teamId: { judgeId, teamId } }, update: { costEffectiveness: ce, medicalImpact: mi, feasibility: fe, technicalExecution: te, note: note || '' }, create: { judgeId, teamId, costEffectiveness: ce, medicalImpact: mi, feasibility: fe, technicalExecution: te, note: note || '' }, include: { team: { select: { id: true, name: true } } } });
  res.json(score);
}
