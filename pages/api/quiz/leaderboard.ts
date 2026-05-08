import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const submissions = await prisma.quizSubmission.findMany({ orderBy: [{ score: 'desc' }, { timeTaken: 'asc' }, { submitTime: 'asc' }] });
  res.json(submissions.map((s, i) => ({ ...s, rank: i + 1 })));
}
