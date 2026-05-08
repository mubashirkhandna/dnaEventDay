import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';

type Role = 'admin' | 'judge' | 'audience' | 'quiz';

function makeAuthMiddleware(role: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const payload = verifyToken(token) as Record<string, unknown>;
      if (payload.role !== role) {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }
      if (role === 'admin') req.admin = payload;
      else if (role === 'judge') req.judge = payload;
      else if (role === 'audience') req.audience = payload;
      else if (role === 'quiz') req.quizUser = payload;
      next();
    } catch {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

export const adminAuth = makeAuthMiddleware('admin');
export const judgeAuth = makeAuthMiddleware('judge');
export const audienceAuth = makeAuthMiddleware('audience');
export const quizAuth = makeAuthMiddleware('quiz');
