import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../lib/prisma';
import { requireAdmin } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return;
  if (req.method === 'GET') {
    const judges = await prisma.judge.findMany({ select: { id: true, email: true, name: true, createdAt: true }, orderBy: { createdAt: 'asc' } });
    return res.json(judges);
  }
  if (req.method === 'POST') {
    const { email, name, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const passwordHash = await bcrypt.hash(password, 10);
    try {
      const judge = await prisma.judge.create({ data: { email, name: name || '', passwordHash }, select: { id: true, email: true, name: true, createdAt: true } });
      return res.status(201).json(judge);
    } catch (e: unknown) {
      if ((e as { code?: string }).code === 'P2002') return res.status(409).json({ error: 'Judge with this email already exists' });
      throw e;
    }
  }
  res.status(405).end();
}
