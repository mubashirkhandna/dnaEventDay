import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'GET') return res.status(405).end();
  const scores = await prisma.judgeScore.findMany({
    include: { judge: { select: { id: true, email: true, name: true } }, team: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'asc' },
  });
  res.json(scores);
}
