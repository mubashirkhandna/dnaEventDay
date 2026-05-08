import http from 'http';
import { WebSocketServer } from 'ws';
import { initWss } from './lib/broadcast';
import app from './app';

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });
initWss(wss);

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
