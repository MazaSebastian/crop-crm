export default async function handler(request, response) {
    // SECURITY: Vercel Cron Jobs send a specific header. 
    // We can also allow manual testing if needed, but in production, we might want to restrict this.
    // For now, open access is fine since it just sends a weather report.

    // TELEGRAM CONFIGURATION
    const BOT_TOKEN = "8599613524:AAHfQlPMy9dXTwLPBSIyQHh5rm45alpg-Jw";
    const CHAT_IDS = [
        "870522507", // Sebastian
        // "123456789" // Santiago (Pendiente)
    ];

    // WEATHER CONFIGURATION (Munro/Olivos)
    const LAT = -34.5175;
    const LON = -58.5331;

    try {
        // 1. Fetch Weather
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=America%2FArgentina%2FBuenos_Aires&forecast_days=1`;

        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        if (!weatherData || !weatherData.daily) {
            throw new Error("Failed to fetch weather data");
        }

        const today = weatherData.daily;
        const max = Math.round(today.temperature_2m_max[0]);
        const min = Math.round(today.temperature_2m_min[0]);
        const rain = today.precipitation_sum[0];
        const code = today.weathercode[0];

        // Interpret Code (Simplified WMO)
        let condition = "Despejado ☀️";
        if (code > 3) condition = "Nublado ☁️";
        if (code > 45) condition = "Niebla 🌫️";
        if (code > 50) condition = "Llovizna 💧";
        if (code > 60) condition = "Lluvia 🌧️";
        if (code > 80) condition = "Tormenta ⛈️";
        if (code > 95) condition = "Tormenta Eléctrica ⚡";

        // 2. Format Message
        const message = `
📅 *Pronóstico de Hoy*

${condition}
🌡️ *Máx:* ${max}°C  |  *Mín:* ${min}°C
💧 *Lluvia:* ${rain} mm

_¡Buenos días! Que tengas una excelente jornada en la huerta._ 🌱
        `.trim();

        // 3. Send to Telegram
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        const sendPromises = CHAT_IDS.map(chatId =>
            fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'Markdown'
                })
            })
        );

        await Promise.all(sendPromises);

        return response.status(200).json({ success: true, weather: condition });

    } catch (error) {
        console.error("Cron Error:", error);
        return response.status(500).json({ error: error.message });
    }
}
