import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'POST') return res.status(405).end();
  const { teamId } = req.body;
  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  if (settings?.activeTeamId === teamId) await prisma.appSettings.update({ where: { id: 1 }, data: { activeTeamId: null, pitchEndTime: null } });
  await prisma.team.update({ where: { id: teamId }, data: { status: 'WAITING' } });
  const [updatedSettings, teams] = await Promise.all([
    prisma.appSettings.findUnique({ where: { id: 1 } }),
    prisma.team.findMany({ include: { members: true }, orderBy: { order: 'asc' } }),
  ]);
  res.json({ settings: updatedSettings, teams });
}
