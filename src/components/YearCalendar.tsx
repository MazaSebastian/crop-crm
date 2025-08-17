import React from 'react';
import styled from 'styled-components';
import type { PlannedEvent } from '../types';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const Month = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const MonthHeader = styled.div`
  background: #f8fafc;
  padding: 0.5rem;
  text-align: center;
  font-weight: 700;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  padding: 0.5rem;
`;

const DayCell = styled.button<{ isToday: boolean; status?: 'red' | 'yellow' | 'green' }>`
  padding: 0.5rem 0;
  border: 1px solid #e5e7eb;
  background: ${p => p.status === 'red' ? '#fca5a5' : p.status === 'yellow' ? '#fde68a' : p.status === 'green' ? '#dcfce7' : 'white'};
  color: ${p => p.isToday ? '#2563eb' : '#374151'};
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  &:hover {
    background: ${p => p.status === 'red' ? '#f87171' : p.status === 'yellow' ? '#facc15' : p.status === 'green' ? '#bbf7d0' : '#f1f5f9'};
  }
  transform: ${p => (p.isToday || p.status === 'yellow' || p.status === 'red') ? 'scale(1.12)' : p.status ? 'scale(1.05)' : 'none'};
  font-weight: ${p => (p.isToday ? 700 : 500)};
  box-shadow: ${p => p.isToday
    ? '0 0 0 2px rgba(37,99,235,0.35)'
    : p.status === 'red' ? '0 0 0 2px rgba(239,68,68,0.45)'
    : p.status === 'yellow' ? '0 0 0 2px rgba(250,204,21,0.45)'
    : p.status === 'green' ? 'inset 0 0 0 2px #16a34a'
    : 'none'};
`;

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  padding: 0 0.5rem;
  font-size: 0.75rem;
  color: #64748b;
`;

function getMonthMatrix(year: number, monthIndex: number) {
  // monthIndex: 0-11
  const first = new Date(year, monthIndex, 1);
  const last = new Date(year, monthIndex + 1, 0);
  const startDay = (first.getDay() + 6) % 7; // convertir a Lun=0..Dom=6
  const days = last.getDate();
  const cells: (number | null)[] = Array(startDay).fill(null).concat(
    Array.from({ length: days }, (_, i) => i + 1)
  );
  // completar a múltiplos de 7
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export interface YearCalendarProps {
  year: number;
  planned: PlannedEvent[];
  onSelectDate?: (isoDate: string) => void;
}

const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const weekNames = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

const YearCalendar: React.FC<YearCalendarProps> = ({ year, planned, onSelectDate }) => {
  const redSet = new Set(planned.filter(p => p.status === 'red').map(p => p.date));
  const yellowSet = new Set(planned.filter(p => p.status === 'yellow').map(p => p.date));
  const greenSet = new Set(planned.filter(p => p.status === 'green').map(p => p.date));
  const todayIso = new Date().toISOString().slice(0,10);
  const today = new Date();
  const todayMonthIdx = year === today.getFullYear() ? today.getMonth() : -1;
  const todayMonthRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (todayMonthRef.current) {
      todayMonthRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <Wrapper>
      {Array.from({ length: 12 }, (_, m) => (
        <Month key={m} ref={m === todayMonthIdx ? todayMonthRef : undefined}>
          <MonthHeader>{monthNames[m]} {year}</MonthHeader>
          <WeekHeader>
            {weekNames.map(d => (<div key={d} style={{ textAlign:'center' }}>{d}</div>))}
          </WeekHeader>
          <Grid>
            {getMonthMatrix(year, m).map((day, idx) => {
              if (day === null) return <div key={idx}></div>;
              const iso = new Date(year, m, day).toISOString().slice(0,10);
              const isToday = iso === todayIso;
              const status = redSet.has(iso) ? 'red' : yellowSet.has(iso) ? 'yellow' : greenSet.has(iso) ? 'green' : undefined;
              return (
                <DayCell key={idx} isToday={isToday} status={status as any} onClick={() => onSelectDate?.(iso)}>
                  {day}
                </DayCell>
              );
            })}
          </Grid>
        </Month>
      ))}
    </Wrapper>
  );
};

export default YearCalendar;
