const WS_URL = (() => {
  const explicit = import.meta.env.VITE_API_URL as string | undefined;
  if (explicit) return explicit.replace(/^http/, 'ws') + '/ws';
  // Derive from current page origin (works in both dev proxy and production)
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${window.location.host}/ws`;
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
