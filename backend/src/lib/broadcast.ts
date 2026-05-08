import { WebSocketServer, WebSocket } from 'ws';

let wss: WebSocketServer | null = null;

export function initWss(server: WebSocketServer) {
  wss = server;
}

export function broadcast(data: object) {
  if (!wss) return;
  const msg = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}
