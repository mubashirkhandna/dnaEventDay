import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireAudience } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const audience = requireAudience(req, res);
  if (!audience) return;
  if (req.method !== 'GET') return res.status(405).end();
  const { whatsapp } = audience as Record<string, string>;
  const vote = await prisma.audienceVote.findUnique({ where: { whatsapp } });
  res.json({ hasVoted: !!vote, votedTeamId: vote?.teamId || null });
}
