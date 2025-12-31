
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { weatherService, DailyWeather } from '../services/weatherService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  WiDaySunny,
  WiDayCloudy,
  WiCloud,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog
} from 'react-icons/wi';

const WidgetContainer = styled.div`
  background: white; // linear-gradient(135deg, #4fd1c5 0%, #38b2ac 100%);
  border-radius: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(56, 178, 172, 0.15); // Soft teal shadow
  border: 1px solid #e6fffa;
  color: #2c7a7b;
`;

const Title = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #234e52; // Dark teal
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg { font-size: 1.5rem; }
`;

const ForecastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.5rem;

  @media (max-width: 600px) {
    grid-template-columns: repeat(4, 1fr); // Show 4 on very small screens, scroll or wrap
    overflow-x: auto;
    padding-bottom: 0.5rem;
    
    // Hide scrollbar but keep functionality
    &::-webkit-scrollbar { display: none; }
    -ms-overflow-style: none; /* IE as well */
  }
`;

const DayCard = styled.div`
  background: rgba(255, 255, 255, 0.6);
  border-radius: 1rem;
  padding: 0.75rem 0.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;

  &:hover {
    background: white;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .day-name {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 0.25rem;
    color: #285e61;
  }

  .icon {
    font-size: 2rem;
    margin: 0.25rem 0;
    color: #38b2ac;
  }

  .temps {
    font-size: 0.85rem;
    font-weight: 600;
    color: #2d3748;
    
    .max { color: #e53e3e; margin-right: 4px; }
    .min { color: #3182ce; }
  }

  .precip {
    font-size: 0.7rem;
    color: #3182ce;
    margin-top: 0.25rem;
    font-weight: 500;
  }
`;

const getWeatherIcon = (code: number) => {
  // WMO Weather interpretation codes (WW)
  // 0: Clear sky
  if (code === 0) return <WiDaySunny color="#ecc94b" />;
  // 1, 2, 3: Mainly clear, partly cloudy, and overcast
  if (code <= 3) return <WiDayCloudy color="#a0aec0" />;
  // 45, 48: Fog
  if (code <= 48) return <WiFog color="#cbd5e0" />;
  // 51-67: Drizzle and Rain
  if (code <= 67) return <WiRain color="#4299e1" />;
  // 71-77: Snow
  if (code <= 77) return <WiSnow color="#63b3ed" />;
  // 80-82: Rain showers
  if (code <= 82) return <WiRain color="#4299e1" />;
  // 95-99: Thunderstorm
  return <WiThunderstorm color="#805ad5" />;
};

export const WeatherWidget: React.FC = () => {
  const [forecast, setForecast] = useState<DailyWeather[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await weatherService.getWeeklyForecast();
      setForecast(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return null; // Or skeleton

  return (
    <WidgetContainer>
      <Title><WiDaySunny /> Pronóstico Semanal (Olivos)</Title>
      <ForecastGrid>
        {forecast.map((day) => (
          <DayCard key={day.date}>
            <div className="day-name">
              {format(new Date(day.date + 'T00:00:00'), 'EEE', { locale: es })}
            </div>
            <div className="icon">
              {getWeatherIcon(day.weatherCode)}
            </div>
            <div className="temps">
              <span className="max">{Math.round(day.maxTemp)}°</span>
              <span className="min">{Math.round(day.minTemp)}°</span>
            </div>
            {day.precipitation > 0 && (
              <div className="precip">{day.precipitation}mm</div>
            )}
          </DayCard>
        ))}
      </ForecastGrid>
    </WidgetContainer>
  );
};
