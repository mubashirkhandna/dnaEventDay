import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireAdmin } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'POST') return res.status(405).end();
  await prisma.$transaction([
    prisma.judgeScore.deleteMany(),
    prisma.scoreRequest.deleteMany(),
    prisma.audienceVote.deleteMany(),
    prisma.quizSubmission.deleteMany(),
    prisma.team.updateMany({ data: { status: 'WAITING' } }),
    prisma.appSettings.update({ where: { id: 1 }, data: { activeTeamId: null, pitchEndTime: null, quizEndTime: null, judgePortal: true, audiencePortal: true, quizPortal: true } }),
  ]);
  res.json({ success: true });
}
