import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'POST') return res.status(405).end();
  const { orderedIds } = req.body as { orderedIds: string[] };
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) return res.status(400).json({ error: 'orderedIds array required' });
  await prisma.$transaction(orderedIds.map((id, index) => prisma.team.update({ where: { id }, data: { order: index + 1 } })));
  res.json({ success: true });
}
