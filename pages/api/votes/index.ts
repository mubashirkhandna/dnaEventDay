import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireAudience } from '../../../lib/auth';

function getClientIp(req: NextApiRequest): string | null {
  // Vercel sets x-real-ip to the original client IP (most reliable)
  const realIp = req.headers['x-real-ip'];
  if (realIp && typeof realIp === 'string' && realIp.trim()) return realIp.trim();
  // x-forwarded-for may be a comma-separated list; first entry is the client
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    const ip = raw.split(',')[0].trim();
    if (ip) return ip;
  }
  return req.socket?.remoteAddress ?? null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const teams = await prisma.team.findMany({ include: { _count: { select: { votes: true } } }, orderBy: { order: 'asc' } });
    return res.json(teams.map((t: { id: string; name: string; _count: { votes: number } }) => ({ teamId: t.id, teamName: t.name, voteCount: t._count.votes })));
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
    const ip = getClientIp(req);
    const vote = await prisma.audienceVote.create({ data: { whatsapp, name, teamId, ip } });
    return res.status(201).json(vote);
  }
  res.status(405).end();
}
