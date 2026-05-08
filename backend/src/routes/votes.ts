import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { audienceAuth } from '../middleware/auth';
import { broadcast } from '../lib/broadcast';

const router = Router();

router.get('/', async (_req, res) => {
  const teams = await prisma.team.findMany({
    include: { _count: { select: { votes: true } } },
    orderBy: { order: 'asc' },
  });
  res.json(
    teams.map((t) => ({
      teamId: t.id,
      teamName: t.name,
      voteCount: t._count.votes,
    }))
  );
});

router.post('/', audienceAuth, async (req, res) => {
  const { whatsapp, name } = req.audience as Record<string, string>;
  const { teamId } = req.body;

  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  if (!settings?.audiencePortal) {
    res.status(403).json({ error: 'Audience portal is currently closed' });
    return;
  }

  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) {
    res.status(404).json({ error: 'Team not found' });
    return;
  }

  const existing = await prisma.audienceVote.findUnique({ where: { whatsapp } });
  if (existing) {
    res.status(409).json({ error: 'You have already voted', votedTeamId: existing.teamId });
    return;
  }

  const vote = await prisma.audienceVote.create({ data: { whatsapp, name, teamId } });
  broadcast({ type: 'votes_update' });
  res.status(201).json(vote);
});

router.get('/mine', audienceAuth, async (req, res) => {
  const { whatsapp } = req.audience as Record<string, string>;
  const vote = await prisma.audienceVote.findUnique({ where: { whatsapp } });
  res.json({ hasVoted: !!vote, votedTeamId: vote?.teamId || null });
});

export default router;
