import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireJudge } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const judge = requireJudge(req, res);
  if (!judge) return;
  if (req.method !== 'POST') return res.status(405).end();
  const judgeId = judge.judgeId as string;
  const { teamId } = req.body;
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) return res.status(404).json({ error: 'Team not found' });
  const request = await prisma.scoreRequest.upsert({ where: { judgeId_teamId: { judgeId, teamId } }, update: { status: 'PENDING' }, create: { judgeId, teamId, status: 'PENDING' }, include: { judge: { select: { id: true, email: true, name: true } }, team: { select: { id: true, name: true } } } });
  res.json(request);
}
