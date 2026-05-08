import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { signToken } from '../lib/jwt';

const router = Router();

router.post('/login', async (req, res) => {
  const { name, whatsapp } = req.body;
  if (!name || !whatsapp) {
    res.status(400).json({ error: 'Name and WhatsApp number required' });
    return;
  }

  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  if (!settings?.audiencePortal) {
    res.status(403).json({ error: 'Audience portal is currently closed' });
    return;
  }

  const existingVote = await prisma.audienceVote.findUnique({ where: { whatsapp } });
  const token = signToken({ role: 'audience', name, whatsapp });
  res.json({
    token,
    name,
    whatsapp,
    hasVoted: !!existingVote,
    votedTeamId: existingVote?.teamId || null,
  });
});

export default router;
