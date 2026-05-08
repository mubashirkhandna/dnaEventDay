import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'POST') return res.status(405).end();
  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  if (settings?.activeTeamId) await prisma.team.update({ where: { id: settings.activeTeamId }, data: { status: 'COMPLETED' } });
  const updated = await prisma.appSettings.update({ where: { id: 1 }, data: { activeTeamId: null, pitchEndTime: null } });
  const teams = await prisma.team.findMany({ include: { members: true }, orderBy: { order: 'asc' } });
  res.json({ settings: updated, teams });
}
