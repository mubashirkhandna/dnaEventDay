import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireJudge } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const judge = requireJudge(req, res);
  if (!judge) return;
  if (req.method !== 'POST') return res.status(405).end();
  const judgeId = judge.judgeId as string;
  const { teamId, innovation, feasibility, impact, ethicsAndSafety, presentationAndClarity, note } = req.body;
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) return res.status(404).json({ error: 'Team not found' });
  let canScore = team.status === 'PRESENTING';
  if (!canScore) {
    const request = await prisma.scoreRequest.findUnique({ where: { judgeId_teamId: { judgeId, teamId } } });
    canScore = request?.status === 'APPROVED';
  }
  if (!canScore) return res.status(403).json({ error: 'You do not have access to score this team right now' });
  const inn = Number(innovation), fe = Number(feasibility), imp = Number(impact), eth = Number(ethicsAndSafety), pres = Number(presentationAndClarity);
  if (inn < 0 || inn > 20) return res.status(400).json({ error: 'innovation must be 0-20' });
  if (fe < 0 || fe > 20) return res.status(400).json({ error: 'feasibility must be 0-20' });
  if (imp < 0 || imp > 25) return res.status(400).json({ error: 'impact must be 0-25' });
  if (eth < 0 || eth > 20) return res.status(400).json({ error: 'ethicsAndSafety must be 0-20' });
  if (pres < 0 || pres > 15) return res.status(400).json({ error: 'presentationAndClarity must be 0-15' });
  const score = await prisma.judgeScore.upsert({ where: { judgeId_teamId: { judgeId, teamId } }, update: { innovation: inn, feasibility: fe, impact: imp, ethicsAndSafety: eth, presentationAndClarity: pres, note: note || '' }, create: { judgeId, teamId, innovation: inn, feasibility: fe, impact: imp, ethicsAndSafety: eth, presentationAndClarity: pres, note: note || '' }, include: { team: { select: { id: true, name: true } } } });
  res.json(score);
}
