import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    // Allow all origins (since it's an API for our app)
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    const { title, message, targetId } = request.body;

    // Use the same keys (Server-side access to env vars)
    const APP_ID = process.env.REACT_APP_ONESIGNAL_APP_ID;
    const API_KEY = process.env.REACT_APP_ONESIGNAL_API_KEY;

    if (!APP_ID || !API_KEY) {
        return response.status(500).json({ error: 'Server Config Missing' });
    }

    try {
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Basic ${API_KEY}`,
            },
            body: JSON.stringify({
                app_id: APP_ID,
                // Logic: specific device OR all (Note: 'All' segments can take time to update)
                ...(targetId ? { include_player_ids: [targetId] } : { included_segments: ['All'] }),
                headings: { en: title, es: title },
                contents: { en: message, es: message },
                priority: 10,
            }),
        };

        const osResponse = await fetch('https://onesignal.com/api/v1/notifications', options);
        const data = await osResponse.json();

        if (!osResponse.ok) {
            return response.status(osResponse.status).json(data);
        }

        return response.status(200).json(data);

    } catch (error: any) {
        return response.status(500).json({ error: error.message });
    }
}
