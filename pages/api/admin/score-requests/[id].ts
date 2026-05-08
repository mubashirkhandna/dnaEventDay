import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'PATCH') return res.status(405).end();
  const updated = await prisma.scoreRequest.update({
    where: { id: req.query.id as string },
    data: { status: req.body.status },
    include: { judge: { select: { id: true, email: true, name: true } }, team: { select: { id: true, name: true } } },
  });
  res.json(updated);
}
