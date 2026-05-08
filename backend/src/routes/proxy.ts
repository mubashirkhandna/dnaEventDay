import { Router } from 'express';

const router = Router();

// Proxy Google Drive PDFs to avoid CORS issues in the browser
router.get('/pdf', async (req, res) => {
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    res.status(400).json({ error: 'Google Drive file ID required' });
    return;
  }

  // Newer Google Drive direct download URL — works for public files
  const url = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;

  try {
    const driveRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; H4H-Event-Day/1.0)',
      },
      signal: AbortSignal.timeout(30_000),
    });

    if (!driveRes.ok) {
      res.status(502).json({ error: `Google Drive returned ${driveRes.status}` });
      return;
    }

    // Force application/pdf so react-pdf can render it regardless of what Drive sends
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const reader = driveRes.body!.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
      res.end();
    };
    await pump();
  } catch (err: unknown) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to proxy file from Google Drive' });
    }
  }
});

export default router;
