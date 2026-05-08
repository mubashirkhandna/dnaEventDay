import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { signToken } from '../lib/jwt';
import { judgeAuth } from '../middleware/auth';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required' });
    return;
  }

  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  if (!settings?.judgePortal) {
    res.status(403).json({ error: 'Judge portal is currently closed' });
    return;
  }

  const judge = await prisma.judge.findUnique({ where: { email } });
  if (!judge) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const valid = await bcrypt.compare(password, judge.passwordHash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = signToken({ role: 'judge', judgeId: judge.id, email: judge.email, name: judge.name });
  res.json({ token, email: judge.email, name: judge.name });
});

router.get('/me/scores', judgeAuth, async (req, res) => {
  const { judgeId } = req.judge as Record<string, string>;
  const scores = await prisma.judgeScore.findMany({
    where: { judgeId },
    include: { team: { select: { id: true, name: true, theme: true } } },
    orderBy: { createdAt: 'asc' },
  });
  res.json(scores);
});

export default router;
