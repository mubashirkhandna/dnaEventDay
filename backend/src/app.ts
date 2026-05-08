import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import adminRouter from './routes/admin';
import teamsRouter from './routes/teams';
import judgesRouter from './routes/judges';
import scoresRouter from './routes/scores';
import scoreRequestsRouter from './routes/scoreRequests';
import audienceRouter from './routes/audience';
import votesRouter from './routes/votes';
import quizRouter from './routes/quiz';
import stateRouter from './routes/state';
import proxyRouter from './routes/proxy';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, cb) => {
      // allow same-origin (no Origin header) and listed origins
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/admin', adminRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/judges', judgesRouter);
app.use('/api/scores', scoresRouter);
app.use('/api/score-requests', scoreRequestsRouter);
app.use('/api/audience', audienceRouter);
app.use('/api/votes', votesRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/state', stateRouter);
app.use('/api/proxy', proxyRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));


app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
