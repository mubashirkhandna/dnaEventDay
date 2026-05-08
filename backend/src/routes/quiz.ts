import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { signToken } from '../lib/jwt';
import { quizAuth } from '../middleware/auth';
import { broadcast } from '../lib/broadcast';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, whatsapp } = req.body;
  if (!email || !whatsapp) {
    res.status(400).json({ error: 'Email and WhatsApp number required' });
    return;
  }

  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  if (!settings?.quizPortal) {
    res.status(403).json({ error: 'Quiz portal is currently closed' });
    return;
  }

  const existing = await prisma.quizSubmission.findUnique({ where: { email } });
  const token = signToken({ role: 'quiz', email, whatsapp });
  res.json({
    token,
    email,
    whatsapp,
    hasSubmitted: !!existing,
    score: existing?.score ?? null,
  });
});

router.get('/questions', quizAuth, async (_req, res) => {
  const questions = await prisma.quizQuestion.findMany({
    select: { id: true, question: true, options: true, order: true },
    orderBy: { order: 'asc' },
  });
  res.json(questions);
});

router.post('/submit', quizAuth, async (req, res) => {
  const { email, whatsapp } = req.quizUser as Record<string, string>;
  const { answers, timeTaken } = req.body as {
    answers: Record<string, string>;
    timeTaken: number;
  };

  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  if (!settings?.quizPortal) {
    res.status(403).json({ error: 'Quiz portal is currently closed' });
    return;
  }

  const existing = await prisma.quizSubmission.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: 'Already submitted', score: existing.score });
    return;
  }

  const questions = await prisma.quizQuestion.findMany();
  let score = 0;
  for (const q of questions) {
    if (answers[q.id] === q.answer) score += 10;
  }

  const submission = await prisma.quizSubmission.create({
    data: { email, whatsapp, score, timeTaken: Number(timeTaken), submitTime: new Date() },
  });

  broadcast({ type: 'quiz_update' });
  res.json({ score: submission.score, timeTaken: submission.timeTaken });
});

router.get('/leaderboard', async (_req, res) => {
  const submissions = await prisma.quizSubmission.findMany({
    orderBy: [{ score: 'desc' }, { timeTaken: 'asc' }, { submitTime: 'asc' }],
  });
  res.json(submissions.map((s, i) => ({ ...s, rank: i + 1 })));
});

export default router;
