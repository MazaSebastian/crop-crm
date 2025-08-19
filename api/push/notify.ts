import type { VercelRequest, VercelResponse } from '@vercel/node';
import webpush from 'web-push';

// Espera env vars en Vercel
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY as string;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY as string;
const PUSH_WEBHOOK_SECRET = process.env.PUSH_WEBHOOK_SECRET as string;

webpush.setVapidDetails('mailto:admin@chakra.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (req.headers['x-chakra-secret'] !== PUSH_WEBHOOK_SECRET) return res.status(401).json({ error: 'Unauthorized' });

  const { subscriptions, notification } = req.body as {
    subscriptions: Array<{ endpoint: string; keys: { p256dh: string; auth: string } }>,
    notification: { title: string; body?: string; url?: string }
  };
  if (!Array.isArray(subscriptions)) return res.status(400).json({ error: 'Invalid payload' });

  const results: { ok: boolean; endpoint: string }[] = [];
  await Promise.all(subscriptions.map(async (sub) => {
    try {
      await webpush.sendNotification(sub as any, JSON.stringify(notification));
      results.push({ ok: true, endpoint: sub.endpoint });
    } catch (e: any) {
      results.push({ ok: false, endpoint: sub.endpoint });
    }
  }));

  res.status(200).json({ sent: results.filter(r => r.ok).length, failed: results.filter(r => !r.ok).length });
}


