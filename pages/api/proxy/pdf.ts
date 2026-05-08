import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Google Drive file ID required' });
  const url = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;
  try {
    const driveRes = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; H4H/1.0)' }, signal: AbortSignal.timeout(30_000) });
    if (!driveRes.ok) return res.status(502).json({ error: `Drive returned ${driveRes.status}` });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    const reader = driveRes.body!.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
    res.end();
  } catch {
    if (!res.headersSent) res.status(500).json({ error: 'Failed to proxy file' });
  }
}
