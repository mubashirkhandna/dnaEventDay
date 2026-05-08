import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { signToken } from '../../../lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, whatsapp } = req.body;
  if (!email || !whatsapp) return res.status(400).json({ error: 'Email and WhatsApp number required' });

  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  if (!settings?.quizPortal) return res.status(403).json({ error: 'Quiz portal is currently closed' });

  // Check registration list — only registered participants may enter
  const registration = await prisma.quizRegistration.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!registration) {
    return res.status(403).json({ error: 'You are not registered for this quiz. Only registered participants can participate.' });
  }

  const existing = await prisma.quizSubmission.findUnique({ where: { email: email.toLowerCase().trim() } });
  const token = signToken({ role: 'quiz', email: email.toLowerCase().trim(), whatsapp });
  res.json({ token, email: email.toLowerCase().trim(), whatsapp, hasSubmitted: !!existing, score: existing?.score ?? null });
}
