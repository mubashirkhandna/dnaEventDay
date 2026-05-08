import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireAdmin } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return;
  if (req.method === 'GET') {
    const s = await prisma.appSettings.findUnique({ where: { id: 1 } });
    return res.json(s);
  }
  if (req.method === 'PATCH') {
    const { judgePortal, audiencePortal, quizPortal, pitchDuration, quizDuration, liveStreamUrl } = req.body;
    const updated = await prisma.appSettings.update({
      where: { id: 1 },
      data: {
        ...(judgePortal !== undefined && { judgePortal }),
        ...(audiencePortal !== undefined && { audiencePortal }),
        ...(quizPortal !== undefined && { quizPortal }),
        ...(pitchDuration !== undefined && { pitchDuration }),
        ...(quizDuration !== undefined && { quizDuration }),
        ...(liveStreamUrl !== undefined && { liveStreamUrl: liveStreamUrl || null }),
      },
    });
    return res.json(updated);
  }
  res.status(405).end();
}
