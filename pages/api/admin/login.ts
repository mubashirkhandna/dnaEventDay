import type { NextApiRequest, NextApiResponse } from 'next';
import { signToken } from '../../../lib/jwt';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, password } = req.body;
  const validUser = process.env.ADMIN_USERNAME || 'smon';
  const validPass = process.env.ADMIN_PASSWORD || 'focusshadman';
  if (username !== validUser || password !== validPass) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = signToken({ role: 'admin', username });
  res.json({ token });
}
