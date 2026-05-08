import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireQuiz } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = requireQuiz(req, res);
  if (!user) return;
  if (req.method !== 'POST') return res.status(405).end();
  const { email, whatsapp } = user as Record<string, string>;
  const { answers, timeTaken } = req.body as { answers: Record<string, string>; timeTaken: number };
  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  if (!settings?.quizPortal) return res.status(403).json({ error: 'Quiz portal is currently closed' });
  const existing = await prisma.quizSubmission.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Already submitted', score: existing.score });
  const questions = await prisma.quizQuestion.findMany();
  let score = 0;
  for (const q of questions) if (answers[q.id] === q.answer) score += 10;
  const submission = await prisma.quizSubmission.create({ data: { email, whatsapp, score, timeTaken: Number(timeTaken), submitTime: new Date() } });
  res.json({ score: submission.score, timeTaken: submission.timeTaken });
}
