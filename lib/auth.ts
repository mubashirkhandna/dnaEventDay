import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from './jwt';

type Payload = Record<string, unknown>;

function extract(req: NextApiRequest, role: string): Payload | null {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    const p = verifyToken(token) as Payload;
    return p.role === role ? p : null;
  } catch { return null; }
}

export function requireAdmin(req: NextApiRequest, res: NextApiResponse): Payload | false {
  const p = extract(req, 'admin');
  if (!p) { res.status(401).json({ error: 'Unauthorized' }); return false; }
  return p;
}
export function requireJudge(req: NextApiRequest, res: NextApiResponse): Payload | false {
  const p = extract(req, 'judge');
  if (!p) { res.status(401).json({ error: 'Unauthorized' }); return false; }
  return p;
}
export function requireAudience(req: NextApiRequest, res: NextApiResponse): Payload | false {
  const p = extract(req, 'audience');
  if (!p) { res.status(401).json({ error: 'Unauthorized' }); return false; }
  return p;
}
export function requireQuiz(req: NextApiRequest, res: NextApiResponse): Payload | false {
  const p = extract(req, 'quiz');
  if (!p) { res.status(401).json({ error: 'Unauthorized' }); return false; }
  return p;
}
