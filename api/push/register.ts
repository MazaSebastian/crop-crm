import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!url || !serviceKey) return res.status(500).json({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' });

  const { endpoint, keys, userId } = req.body as { endpoint: string; keys: { p256dh: string; auth: string }; userId?: string };
  if (!endpoint || !keys?.p256dh || !keys?.auth) return res.status(400).json({ error: 'Invalid payload' });

  const supabase = createClient(url, serviceKey);
  const { error } = await supabase.from('push_subscriptions').upsert({
    user_id: userId || null,
    endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth,
  });
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true });
}


