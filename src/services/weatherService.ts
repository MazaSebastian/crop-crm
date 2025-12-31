
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface DailyWeather {
    date: string;
    maxTemp: number;
    minTemp: number;
    weatherCode: number;
    precipitation: number;
}

const LAT = -33.4489; // Santiago
const LON = -70.6693;

export const weatherService = {
    async getWeeklyForecast(): Promise<DailyWeather[]> {
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
            );
            const data = await response.json();

            if (!data || !data.daily) return [];

            const { time, temperature_2m_max, temperature_2m_min, weathercode, precipitation_sum } = data.daily;

            return time.map((date: string, index: number) => ({
                date,
                maxTemp: temperature_2m_max[index],
                minTemp: temperature_2m_min[index],
                weatherCode: weathercode[index],
                precipitation: precipitation_sum[index]
            })).slice(0, 7); // Ensure only 7 days
        } catch (error) {
            console.error('Error fetching weather:', error);
            return [];
        }
    }
};
