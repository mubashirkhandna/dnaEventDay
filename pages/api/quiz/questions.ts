import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireQuiz } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireQuiz(req, res)) return;
  if (req.method !== 'GET') return res.status(405).end();
  const questions = await prisma.quizQuestion.findMany({ select: { id: true, question: true, options: true, order: true }, orderBy: { order: 'asc' } });
  res.json(questions);
}
