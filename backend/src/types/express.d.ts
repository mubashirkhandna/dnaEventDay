import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    admin?: Record<string, unknown>;
    judge?: Record<string, unknown>;
    audience?: Record<string, unknown>;
    quizUser?: Record<string, unknown>;
  }
}
