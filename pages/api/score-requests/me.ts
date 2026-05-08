import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireJudge } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const judge = requireJudge(req, res);
  if (!judge) return;
  if (req.method !== 'GET') return res.status(405).end();
  const requests = await prisma.scoreRequest.findMany({ where: { judgeId: judge.judgeId as string }, include: { team: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } });
  res.json(requests);
}
