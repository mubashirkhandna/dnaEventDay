const WS_URL = (() => {
  const base = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3001';
  return base.replace(/^http/, 'ws') + '/ws';
})();

type MessageHandler = (data: Record<string, unknown>) => void;

export function createWebSocket(onMessage: MessageHandler): WebSocket {
  const ws = new WebSocket(WS_URL);

  ws.onopen = () => console.log('[WS] Connected');
  ws.onclose = () => console.log('[WS] Disconnected');
  ws.onerror = (e) => console.error('[WS] Error', e);

  ws.onmessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data as string) as Record<string, unknown>;
      onMessage(data);
    } catch (e) {
      console.error('[WS] Parse error', e);
    }
  };

  return ws;
}
