import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { signToken } from '../../../lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, whatsapp } = req.body;
  if (!name || !whatsapp) return res.status(400).json({ error: 'Name and WhatsApp number required' });
  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  if (!settings?.audiencePortal) return res.status(403).json({ error: 'Audience portal is currently closed' });
  const existing = await prisma.audienceVote.findUnique({ where: { whatsapp } });
  const token = signToken({ role: 'audience', name, whatsapp });
  res.json({ token, name, whatsapp, hasVoted: !!existing, votedTeamId: existing?.teamId || null });
}
