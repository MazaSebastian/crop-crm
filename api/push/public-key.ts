import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const pub = process.env.VAPID_PUBLIC_KEY || '';
  if (!pub) return res.status(500).json({ error: 'Missing VAPID_PUBLIC_KEY' });
  res.status(200).json({ publicKey: pub });
}


