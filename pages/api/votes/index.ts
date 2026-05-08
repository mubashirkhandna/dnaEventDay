import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireAudience } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const teams = await prisma.team.findMany({ include: { _count: { select: { votes: true } } }, orderBy: { order: 'asc' } });
    return res.json(teams.map(t => ({ teamId: t.id, teamName: t.name, voteCount: t._count.votes })));
  }
  if (req.method === 'POST') {
    const audience = requireAudience(req, res);
    if (!audience) return;
    const { whatsapp, name } = audience as Record<string, string>;
    const { teamId } = req.body;
    const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
    if (!settings?.audiencePortal) return res.status(403).json({ error: 'Audience portal is currently closed' });
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return res.status(404).json({ error: 'Team not found' });
    const existing = await prisma.audienceVote.findUnique({ where: { whatsapp } });
    if (existing) return res.status(409).json({ error: 'You have already voted', votedTeamId: existing.teamId });
    const vote = await prisma.audienceVote.create({ data: { whatsapp, name, teamId } });
    return res.status(201).json(vote);
  }
  res.status(405).end();
}
