import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { signToken } from '../../../lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, whatsapp } = req.body;
  if (!email || !whatsapp) return res.status(400).json({ error: 'Email and WhatsApp number required' });
  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  if (!settings?.quizPortal) return res.status(403).json({ error: 'Quiz portal is currently closed' });
  const existing = await prisma.quizSubmission.findUnique({ where: { email } });
  const token = signToken({ role: 'quiz', email, whatsapp });
  res.json({ token, email, whatsapp, hasSubmitted: !!existing, score: existing?.score ?? null });
}
