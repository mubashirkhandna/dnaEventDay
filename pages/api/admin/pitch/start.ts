import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'POST') return res.status(405).end();
  const { teamId } = req.body;
  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  const pitchEndTime = new Date(Date.now() + (settings!.pitchDuration * 60 * 1000));
  await prisma.team.updateMany({ data: { status: 'WAITING' } });
  await prisma.team.update({ where: { id: teamId }, data: { status: 'PRESENTING' } });
  const updated = await prisma.appSettings.update({ where: { id: 1 }, data: { activeTeamId: teamId, pitchEndTime } });
  const teams = await prisma.team.findMany({ include: { members: true }, orderBy: { order: 'asc' } });
  res.json({ settings: updated, teams });
}
