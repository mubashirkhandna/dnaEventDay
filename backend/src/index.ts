import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import { initWss } from './lib/broadcast';
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
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

initWss(wss);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, cb) => {
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

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`[WS] Client connected: ${ip} (${wss.clients.size} total)`);
  ws.on('close', () => console.log(`[WS] Client disconnected (${wss.clients.size} remaining)`));
  ws.on('error', console.error);
});

const PORT = Number(process.env.PORT) || 3001;
server.listen(PORT, () => {
  console.log(`🚀 H4H Backend running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket available at ws://localhost:${PORT}/ws`);
});
