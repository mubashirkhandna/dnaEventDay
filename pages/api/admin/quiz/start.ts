import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'POST') return res.status(405).end();
  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  const quizEndTime = new Date(Date.now() + (settings!.quizDuration * 60 * 1000));
  const updated = await prisma.appSettings.update({ where: { id: 1 }, data: { quizEndTime } });
  res.json(updated);
}
