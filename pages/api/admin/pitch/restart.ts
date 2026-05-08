import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'POST') return res.status(405).end();
  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  if (!settings?.activeTeamId) return res.status(400).json({ error: 'No active pitch' });
  const pitchEndTime = new Date(Date.now() + (settings.pitchDuration * 60 * 1000));
  const updated = await prisma.appSettings.update({ where: { id: 1 }, data: { pitchEndTime } });
  res.json(updated);
}
