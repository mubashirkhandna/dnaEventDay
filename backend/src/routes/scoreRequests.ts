import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { judgeAuth } from '../middleware/auth';
import { broadcast } from '../lib/broadcast';

const router = Router();

router.post('/', judgeAuth, async (req, res) => {
  const { judgeId } = req.judge as Record<string, string>;
  const { teamId } = req.body;

  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) {
    res.status(404).json({ error: 'Team not found' });
    return;
  }

  const request = await prisma.scoreRequest.upsert({
    where: { judgeId_teamId: { judgeId, teamId } },
    update: { status: 'PENDING' },
    create: { judgeId, teamId, status: 'PENDING' },
    include: {
      judge: { select: { id: true, email: true, name: true } },
      team: { select: { id: true, name: true } },
    },
  });

  broadcast({ type: 'score_request_new', data: request });
  res.json(request);
});

router.get('/me', judgeAuth, async (req, res) => {
  const { judgeId } = req.judge as Record<string, string>;
  const requests = await prisma.scoreRequest.findMany({
    where: { judgeId },
    include: { team: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(requests);
});

export default router;
