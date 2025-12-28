import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  eachMonthOfInterval,
  startOfYear,
  endOfYear
} from 'date-fns';
import es from 'date-fns/locale/es';
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaSeedling,
  FaMapMarkerAlt,
  FaTint,
  FaChevronLeft,
  FaChevronRight,
  FaLeaf,
  FaChartLine
} from 'react-icons/fa';

import { cropsService } from '../services/cropsService';
import { Crop } from '../types';

// --- Styled Components ---

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  padding-top: 5rem;
  background-color: #f8fafc;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #718096;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1rem;
  padding: 0;
  font-size: 0.95rem;

  &:hover {
    color: #2f855a;
  }
`;

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const CropTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg { color: #38a169; }
`;

const MetaGrid = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.75rem;
  color: #4a5568;
  font-size: 0.95rem;

  div {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
`;

const CalendarContainer = styled.div`
  background: white;
  border-radius: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #edf2f7;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    color: #2d3748;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const MonthNav = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  button {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 0.5rem;
    cursor: pointer;
    color: #4a5568;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover { background: #f7fafc; color: #2f855a; }
  }

  span {
    font-weight: 600;
    min-width: 120px;
    text-align: center;
  }
`;

// Monthly View Grid
const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e2e8f0; // Grid lines
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;

  > div {
    background: white;
    min-height: 100px;
    padding: 0.5rem;
    position: relative;
  }
`;

const DayHeader = styled.div`
  background: #f7fafc !important;
  min-height: auto !important;
  font-weight: 600;
  color: #718096;
  font-size: 0.85rem;
  text-align: center;
  padding: 0.75rem !important;
  text-transform: uppercase;
`;

const DayCell = styled.div<{ isCurrentMonth?: boolean, isToday?: boolean }>`
  opacity: ${props => props.isCurrentMonth ? 1 : 0.4};
  background: ${props => props.isToday ? '#f0fff4 !important' : 'white'};
  
  .day-number {
    font-weight: 600;
    font-size: 0.9rem;
    color: ${props => props.isToday ? '#2f855a' : '#2d3748'};
    margin-bottom: 0.5rem;
    display: block;
  }

  &:hover {
    background: #fafafa;
  }
`;

// Annual Heatmap
const HeatmapContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 1rem;
`;

const HeatmapMonth = styled.div`
  flex: 1;
  min-width: 80px;
`;

const HeatmapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

const HeatmapCell = styled.div<{ level: number }>`
  aspect-ratio: 1;
  border-radius: 2px;
  background-color: ${p => {
    if (p.level === 0) return '#ebedf0';
    if (p.level === 1) return '#9be9a8';
    if (p.level === 2) return '#40c463';
    if (p.level === 3) return '#30a14e';
    return '#216e39';
  }};
  transition: transform 0.1s;
  
  &:hover { transform: scale(1.2); }
`;


const CropDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [crop, setCrop] = useState<Crop | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (id) {
      loadCrop(id);
    }
  }, [id]);

  const loadCrop = async (cropId: string) => {
    const data = await cropsService.getCropById(cropId);
    if (!data) {
      navigate('/crops'); // Redirect if not found
    }
    setCrop(data);
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Calendar Logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Annual Logic for 2025 (Mock data for now)
  const yearStart = startOfYear(new Date());
  const yearMonths = eachMonthOfInterval({
    start: mapYearStart(new Date()),
    end: new Date()
  }).slice(-12); // Show last 12 months or simple current year


  function mapYearStart(date: Date) {
    return startOfYear(date);
  }

  if (!crop) return <div>Cargando...</div>;

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/crops')}>
          <FaArrowLeft /> Volver a Cultivos
        </BackButton>

        <TitleSection>
          <div>
            <CropTitle><FaLeaf /> {crop.name}</CropTitle>
            <MetaGrid>
              <div><FaMapMarkerAlt /> {crop.location}</div>
              <div><FaCalendarAlt /> Inicio: {format(new Date(crop.startDate), 'dd MMM yyyy', { locale: es })}</div>
              {crop.estimatedHarvestDate && (
                <div><FaSeedling /> Cosecha: {format(new Date(crop.estimatedHarvestDate), 'MMM yyyy', { locale: es })}</div>
              )}
            </MetaGrid>
          </div>
        </TitleSection>
      </Header>

      {/* Monthly View */}
      <CalendarContainer>
        <CalendarHeader>
          <h2><FaCalendarAlt /> Calendario Mensual</h2>
          <MonthNav>
            <button onClick={prevMonth}><FaChevronLeft /></button>
            <span>{format(currentDate, 'MMMM yyyy', { locale: es })}</span>
            <button onClick={nextMonth}><FaChevronRight /></button>
          </MonthNav>
        </CalendarHeader>

        <MonthGrid>
          {weekDays.map(day => (
            <DayHeader key={day}>{day}</DayHeader>
          ))}

          {calendarDays.map((day, idx) => (
            <DayCell
              key={idx}
              isCurrentMonth={isSameMonth(day, monthStart)}
              isToday={isSameDay(day, new Date())}
            >
              <span className="day-number">{format(day, 'd')}</span>
              {/* Events would go here */}
            </DayCell>
          ))}
        </MonthGrid>
      </CalendarContainer>

      {/* Annual Overview (Visual concept) */}
      <CalendarContainer>
        <CalendarHeader>
          <h2><FaChartLine /> Actividad Anual</h2>
        </CalendarHeader>
        <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1rem' }}>Densidad de registros y tareas completadas.</p>

        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {/* Simple mockup for Monthly Intensity Blocks */}
          {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((m) => (
            <div key={m} style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#a0aec0', marginBottom: '4px' }}>{m}</div>
              <div style={{ display: 'grid', gridTemplateRows: 'repeat(5, 1fr)', gridAutoFlow: 'column', gap: '3px' }}>
                {[...Array(20)].map((_, i) => (
                  <HeatmapCell key={i} level={Math.floor(Math.random() * 5)} style={{ width: '12px', height: '12px' }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CalendarContainer>

    </Container>
  );
};

export default CropDetail;
