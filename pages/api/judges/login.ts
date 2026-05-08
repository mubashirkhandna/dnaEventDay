import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../lib/prisma';
import { signToken } from '../../../lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  if (!settings?.judgePortal) return res.status(403).json({ error: 'Judge portal is currently closed' });
  const judge = await prisma.judge.findUnique({ where: { email } });
  if (!judge) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, judge.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken({ role: 'judge', judgeId: judge.id, email: judge.email, name: judge.name });
  res.json({ token, email: judge.email, name: judge.name });
}
