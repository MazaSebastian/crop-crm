import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaPlus, 
  FaSearch, 
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaUsers,
  FaMapMarkerAlt,
  FaMusic,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaBars,
  FaWhatsapp,
  FaArrowLeft,
  FaHandshake
} from 'react-icons/fa';
import { Event } from '../types';

const EventsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: float 8s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-30px) rotate(180deg); }
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    opacity: 0.9;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.75rem;
  font-weight: 400;
  opacity: 0.8;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    opacity: 1;
    transform: translateY(-1px);
  }
`;

const FilterSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;
  margin-bottom: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }
  
  select {
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    background: white;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  background: ${props => props.variant === 'primary' ? '#3b82f6' : '#f3f4f6'};
  color: ${props => props.variant === 'primary' ? 'white' : '#374151'};
  
  &:hover {
    background: ${props => props.variant === 'primary' ? '#2563eb' : '#e5e7eb'};
    transform: translateY(-1px);
  }
`;

const CurrentView = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  .view-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
  }
  
  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #64748b;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 1rem;
`;

const MonthCalendar = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const MonthHeader = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    text-transform: uppercase;
  }
`;

const DaysHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 0.5rem;
`;

const DayHeader = styled.div`
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  padding: 0.5rem 0;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

const DayCell = styled.div<{ 
  isCurrentMonth?: boolean; 
  isToday?: boolean; 
  hasEvent?: boolean;
  isWeekend?: boolean;
  isCoordinated?: boolean;
}>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: ${props => props.isToday ? '700' : '500'};
  border: 1px solid #e2e8f0;
  cursor: ${props => props.hasEvent ? 'pointer' : 'default'};
  transition: all 0.2s ease-in-out;
  position: relative;
  
  background: ${props => {
    if (props.hasEvent && props.isCoordinated) return '#dcfce7'; // Verde para eventos coordinados
    if (props.hasEvent && !props.isCoordinated) return '#fee2e2'; // Rojo para eventos no coordinados
    if (props.isToday) return '#3b82f6';
    if (props.isWeekend) return '#f8fafc';
    return 'white';
  }};
  
  color: ${props => {
    if (props.isToday) return 'white';
    if (props.hasEvent && props.isCoordinated) return '#166534'; // Verde oscuro para texto
    if (props.hasEvent && !props.isCoordinated) return '#991b1b'; // Rojo oscuro para texto
    if (!props.isCurrentMonth) return '#cbd5e1';
    return '#374151';
  }};
  
  &:hover {
    background: ${props => {
      if (props.hasEvent && props.isCoordinated) return '#bbf7d0'; // Verde más claro al hover
      if (props.hasEvent && !props.isCoordinated) return '#fecaca'; // Rojo más claro al hover
      return '#f1f5f9';
    }};
    transform: scale(1.05);
    z-index: 1;
  }
  
  ${props => !props.isCurrentMonth && `
    background: #f8fafc;
    color: #cbd5e1;
  `}
`;

const LegendSection = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const LegendTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.75rem 0;
`;

const LegendGrid = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const LegendColor = styled.div<{ coordinated: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background: ${props => props.coordinated ? '#dcfce7' : '#fee2e2'};
  border: 1px solid ${props => props.coordinated ? '#166534' : '#991b1b'};
`;

const LegendText = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
`;

const EventTooltip = styled.div`
  position: fixed;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 280px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease-in-out;
  pointer-events: auto;
  
  &.visible {
    opacity: 1;
    visibility: visible;
  }
`;

const TooltipHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

const TooltipTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const TooltipStatus = styled.span<{ coordinated: boolean }>`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  background: ${props => props.coordinated ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.coordinated ? '#166534' : '#991b1b'};
`;

const TooltipContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TooltipLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  min-width: 80px;
`;

const TooltipValue = styled.span`
  font-size: 0.875rem;
  color: #1e293b;
`;

const WhatsAppButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #25d366;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  pointer-events: auto;
  
  &:hover {
    background: #128c7e;
    transform: translateY(-1px);
  }
`;

const CoordinationButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  pointer-events: auto;
  
  &:hover {
    background: #059669;
    transform: translateY(-1px);
  }
`;

const Events: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSalon, setSelectedSalon] = useState('San Telmo');
  const [selectedZone, setSelectedZone] = useState('TODAS');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [tooltipData, setTooltipData] = useState<{
    visible: boolean;
    event: any;
    position: { x: number; y: number };
    isHovered?: boolean;
  } | null>(null);

  // Datos de ejemplo para eventos - Todo el año 2025 con estado de coordinación
  const events = [
    // ENERO 2025
    { 
      date: '2025-01-03', 
      coordinated: false,
      type: 'XV',
      time: '21:00',
      client: 'María González',
      phone: '+54 9 11 1234-5678'
    },
    { 
      date: '2025-01-04', 
      coordinated: true,
      type: 'Casamiento',
      time: '20:00',
      client: 'Carlos Rodríguez',
      phone: '+54 9 11 2345-6789'
    },
    { 
      date: '2025-01-10', 
      coordinated: false,
      type: 'Cumpleaños',
      time: '22:00',
      client: 'Ana López',
      phone: '+54 9 11 3456-7890'
    },
    { 
      date: '2025-01-11', 
      coordinated: true,
      type: 'Religioso',
      time: '19:00',
      client: 'Pedro Martínez',
      phone: '+54 9 11 4567-8901'
    },
    { 
      date: '2025-01-17', 
      coordinated: false,
      type: 'XV',
      time: '21:30',
      client: 'Lucía Fernández',
      phone: '+54 9 11 5678-9012'
    },
    { 
      date: '2025-01-18', 
      coordinated: true,
      type: 'Casamiento',
      time: '20:30',
      client: 'Roberto Silva',
      phone: '+54 9 11 6789-0123'
    },
    { 
      date: '2025-01-24', 
      coordinated: false,
      type: 'Cumpleaños',
      time: '22:30',
      client: 'Carmen Ruiz',
      phone: '+54 9 11 7890-1234'
    },
    { 
      date: '2025-01-25', 
      coordinated: true,
      type: 'Religioso',
      time: '19:30',
      client: 'Diego Morales',
      phone: '+54 9 11 8901-2345'
    },
    { 
      date: '2025-01-31', 
      coordinated: false,
      type: 'XV',
      time: '21:00',
      client: 'Valentina Castro',
      phone: '+54 9 11 9012-3456'
    },
    
    // FEBRERO 2025
    { 
      date: '2025-02-01', 
      coordinated: true,
      type: 'Casamiento',
      time: '19:00',
      client: 'Sofía y Martín',
      phone: '+54 9 11 1111-2222'
    },
    { 
      date: '2025-02-07', 
      coordinated: false,
      type: 'XV',
      time: '21:30',
      client: 'Valentina Morales',
      phone: '+54 9 11 2222-3333'
    },
    { 
      date: '2025-02-08', 
      coordinated: true,
      type: 'Cumpleaños',
      time: '22:00',
      client: 'Roberto Silva',
      phone: '+54 9 11 3333-4444'
    },
    { 
      date: '2025-02-14', 
      coordinated: true,
      type: 'San Valentín',
      time: '20:00',
      client: 'Carla y Juan',
      phone: '+54 9 11 4444-5555'
    },
    { 
      date: '2025-02-15', 
      coordinated: false,
      type: 'Religioso',
      time: '18:30',
      client: 'Padre Miguel',
      phone: '+54 9 11 5555-6666'
    },
    { 
      date: '2025-02-21', 
      coordinated: true,
      type: 'XV',
      time: '21:00',
      client: 'Camila Fernández',
      phone: '+54 9 11 6666-7777'
    },
    { 
      date: '2025-02-22', 
      coordinated: false,
      type: 'Casamiento',
      time: '20:30',
      client: 'Ana y Carlos',
      phone: '+54 9 11 7777-8888'
    },
    { 
      date: '2025-02-28', 
      coordinated: true,
      type: 'Cumpleaños',
      time: '22:30',
      client: 'Diego López',
      phone: '+54 9 11 8888-9999'
    },
    
    // MARZO 2025
    { 
      date: '2025-03-01', 
      coordinated: false,
      type: 'XV',
      time: '21:00',
      client: 'Lucía Castro',
      phone: '+54 9 11 9999-0000'
    },
    { 
      date: '2025-03-07', 
      coordinated: true,
      type: 'Casamiento',
      time: '19:30',
      client: 'María y Pedro',
      phone: '+54 9 11 0000-1111'
    },
    { 
      date: '2025-03-08', 
      coordinated: false,
      type: 'Cumpleaños',
      time: '22:00',
      client: 'Alejandro Ruiz',
      phone: '+54 9 11 1111-2222'
    },
    { 
      date: '2025-03-14', 
      coordinated: true,
      type: 'Religioso',
      time: '18:00',
      client: 'Padre José',
      phone: '+54 9 11 2222-3333'
    },
    { 
      date: '2025-03-15', 
      coordinated: false,
      type: 'XV',
      time: '21:30',
      client: 'Florencia Torres',
      phone: '+54 9 11 3333-4444'
    },
    { 
      date: '2025-03-21', 
      coordinated: true,
      type: 'Casamiento',
      time: '20:00',
      client: 'Carolina y Luis',
      phone: '+54 9 11 4444-5555'
    },
    { 
      date: '2025-03-22', 
      coordinated: false,
      type: 'Cumpleaños',
      time: '22:30',
      client: 'Gabriel Morales',
      phone: '+54 9 11 5555-6666'
    },
    { 
      date: '2025-03-28', 
      coordinated: true,
      type: 'XV',
      time: '21:00',
      client: 'Agustina Silva',
      phone: '+54 9 11 6666-7777'
    },
    { 
      date: '2025-03-29', 
      coordinated: false,
      type: 'Religioso',
      time: '19:00',
      client: 'Padre Carlos',
      phone: '+54 9 11 7777-8888'
    },
    
    // ABRIL 2025
    { 
      date: '2025-04-04', 
      coordinated: true,
      type: 'Casamiento',
      time: '19:00',
      client: 'Natalia y Roberto',
      phone: '+54 9 11 8888-9999'
    },
    { 
      date: '2025-04-05', 
      coordinated: false,
      type: 'XV',
      time: '21:30',
      client: 'Julieta Morales',
      phone: '+54 9 11 9999-0000'
    },
    { 
      date: '2025-04-11', 
      coordinated: true,
      type: 'Cumpleaños',
      time: '22:00',
      client: 'Fernando López',
      phone: '+54 9 11 0000-1111'
    },
    { 
      date: '2025-04-12', 
      coordinated: false,
      type: 'Religioso',
      time: '18:30',
      client: 'Padre Antonio',
      phone: '+54 9 11 1111-2222'
    },
    { 
      date: '2025-04-18', 
      coordinated: true,
      type: 'XV',
      time: '21:00',
      client: 'Valeria Castro',
      phone: '+54 9 11 2222-3333'
    },
    { 
      date: '2025-04-19', 
      coordinated: false,
      type: 'Casamiento',
      time: '20:30',
      client: 'Daniela y Marcos',
      phone: '+54 9 11 3333-4444'
    },
    { 
      date: '2025-04-25', 
      coordinated: true,
      type: 'Cumpleaños',
      time: '22:30',
      client: 'Ricardo Silva',
      phone: '+54 9 11 4444-5555'
    },
    { 
      date: '2025-04-26', 
      coordinated: false,
      type: 'Religioso',
      time: '19:00',
      client: 'Padre Francisco',
      phone: '+54 9 11 5555-6666'
    },
    
    // MAYO 2025
    { 
      date: '2025-05-02', 
      coordinated: true,
      type: 'Casamiento',
      time: '19:30',
      client: 'Paula y Sebastián',
      phone: '+54 9 11 6666-7777'
    },
    { 
      date: '2025-05-03', 
      coordinated: false,
      type: 'XV',
      time: '21:00',
      client: 'Micaela Torres',
      phone: '+54 9 11 7777-8888'
    },
    { 
      date: '2025-05-09', 
      coordinated: true,
      type: 'Cumpleaños',
      time: '22:00',
      client: 'Lucas Morales',
      phone: '+54 9 11 8888-9999'
    },
    { 
      date: '2025-05-10', 
      coordinated: false,
      type: 'Religioso',
      time: '18:00',
      client: 'Padre Roberto',
      phone: '+54 9 11 9999-0000'
    },
    { 
      date: '2025-05-16', 
      coordinated: true,
      type: 'XV',
      time: '21:30',
      client: 'Agustina Ruiz',
      phone: '+54 9 11 0000-1111'
    },
    { 
      date: '2025-05-17', 
      coordinated: false,
      type: 'Casamiento',
      time: '20:00',
      client: 'Romina y Alejandro',
      phone: '+54 9 11 1111-2222'
    },
    { 
      date: '2025-05-23', 
      coordinated: true,
      type: 'Cumpleaños',
      time: '22:30',
      client: 'Gustavo López',
      phone: '+54 9 11 2222-3333'
    },
    { 
      date: '2025-05-24', 
      coordinated: false,
      type: 'Religioso',
      time: '19:00',
      client: 'Padre Daniel',
      phone: '+54 9 11 3333-4444'
    },
    { 
      date: '2025-05-25', 
      coordinated: true,
      type: 'Día de la Patria',
      time: '20:30',
      client: 'Municipalidad',
      phone: '+54 9 11 4444-5555'
    },
    { 
      date: '2025-05-30', 
      coordinated: false,
      type: 'XV',
      time: '21:00',
      client: 'Bianca Silva',
      phone: '+54 9 11 5555-6666'
    },
    { 
      date: '2025-05-31', 
      coordinated: true,
      type: 'Casamiento',
      time: '19:30',
      client: 'Victoria y Nicolás',
      phone: '+54 9 11 6666-7777'
    },
    
    // JUNIO 2025
    { 
      date: '2025-06-06', 
      coordinated: true,
      type: 'XV',
      time: '21:00',
      client: 'Sofía Morales',
      phone: '+54 9 11 7777-8888'
    },
    { 
      date: '2025-06-07', 
      coordinated: false,
      type: 'Casamiento',
      time: '19:00',
      client: 'Lucía y Federico',
      phone: '+54 9 11 8888-9999'
    },
    { 
      date: '2025-06-13', 
      coordinated: true,
      type: 'Cumpleaños',
      time: '22:00',
      client: 'Matías Castro',
      phone: '+54 9 11 9999-0000'
    },
    { 
      date: '2025-06-14', 
      coordinated: false,
      type: 'Religioso',
      time: '18:30',
      client: 'Padre Luis',
      phone: '+54 9 11 0000-1111'
    },
    { 
      date: '2025-06-20', 
      coordinated: true,
      type: 'XV',
      time: '21:30',
      client: 'Valentina Ruiz',
      phone: '+54 9 11 1111-2222'
    },
    { 
      date: '2025-06-21', 
      coordinated: false,
      type: 'Casamiento',
      time: '20:00',
      client: 'Camila y Diego',
      phone: '+54 9 11 2222-3333'
    },
    { 
      date: '2025-06-27', 
      coordinated: true,
      type: 'Cumpleaños',
      time: '22:30',
      client: 'Javier López',
      phone: '+54 9 11 3333-4444'
    },
    { 
      date: '2025-06-28', 
      coordinated: false,
      type: 'Religioso',
      time: '19:00',
      client: 'Padre Andrés',
      phone: '+54 9 11 4444-5555'
    },
    
    // JULIO 2025
    { 
      date: '2025-07-04', 
      coordinated: false,
      type: 'XV',
      time: '21:00',
      client: 'Mariana Silva',
      phone: '+54 9 11 5555-6666'
    },
    { 
      date: '2025-07-05', 
      coordinated: true,
      type: 'Casamiento',
      time: '19:30',
      client: 'Florencia y Martín',
      phone: '+54 9 11 6666-7777',
      music: 'Música romántica, vals, cumbia',
      equipment: 'Sonido completo + iluminación LED',
      notes: 'Cliente solicita música específica para entrada de novios'
    },
    { 
      date: '2025-07-09', 
      coordinated: true,
      type: 'Día de la Independencia',
      time: '20:00',
      client: 'Municipalidad',
      phone: '+54 9 11 7777-8888',
      music: 'Música folklórica y patriótica',
      equipment: 'Sonido de plaza + pantalla gigante',
      notes: 'Evento al aire libre, coordinar con seguridad municipal'
    },
    { 
      date: '2025-07-11', 
      coordinated: false,
      type: 'Cumpleaños',
      time: '22:00',
      client: 'Ezequiel Torres',
      phone: '+54 9 11 8888-9999'
    },
    { 
      date: '2025-07-12', 
      coordinated: true,
      type: 'Religioso',
      time: '18:00',
      client: 'Padre Miguel',
      phone: '+54 9 11 9999-0000'
    },
    { 
      date: '2025-07-18', 
      coordinated: false,
      type: 'XV',
      time: '21:30',
      client: 'Candela Morales',
      phone: '+54 9 11 0000-1111'
    },
    { 
      date: '2025-07-19', 
      coordinated: true,
      type: 'Casamiento',
      time: '20:00',
      client: 'Natalia y Pablo',
      phone: '+54 9 11 1111-2222',
      music: 'Música variada, rock nacional, pop',
      equipment: 'Sonido + luces + máquina de humo',
      notes: 'Cliente trae su propia música en USB'
    },
    { 
      date: '2025-07-25', 
      coordinated: false,
      type: 'Cumpleaños',
      time: '22:30',
      client: 'Facundo López',
      phone: '+54 9 11 2222-3333'
    },
    { 
      date: '2025-07-26', 
      coordinated: true,
      type: 'Religioso',
      time: '19:00',
      client: 'Padre Juan',
      phone: '+54 9 11 3333-4444'
    },
    
    // AGOSTO 2025
    { 
      date: '2025-08-01', 
      coordinated: true,
      type: 'XV',
      time: '21:00',
      client: 'Luciana Castro',
      phone: '+54 9 11 4444-5555'
    },
    { 
      date: '2025-08-02', 
      coordinated: false,
      type: 'Casamiento',
      time: '19:00',
      client: 'Carolina y Tomás',
      phone: '+54 9 11 5555-6666'
    },
    { 
      date: '2025-08-08', 
      coordinated: true,
      type: 'Cumpleaños',
      time: '22:00',
      client: 'Bruno Morales',
      phone: '+54 9 11 6666-7777'
    },
    { 
      date: '2025-08-09', 
      coordinated: false,
      type: 'Religioso',
      time: '18:30',
      client: 'Padre Carlos',
      phone: '+54 9 11 7777-8888'
    },
    { 
      date: '2025-08-15', 
      coordinated: true,
      type: 'XV',
      time: '21:30',
      client: 'Antonella Ruiz',
      phone: '+54 9 11 8888-9999'
    },
    { 
      date: '2025-08-16', 
      coordinated: false,
      type: 'Casamiento',
      time: '20:00',
      client: 'Valentina y Santiago',
      phone: '+54 9 11 9999-0000'
    },
    { 
      date: '2025-08-22', 
      coordinated: true,
      type: 'Cumpleaños',
      time: '22:30',
      client: 'Thiago López',
      phone: '+54 9 11 0000-1111'
    },
    { 
      date: '2025-08-23', 
      coordinated: false,
      type: 'Religioso',
      time: '19:00',
      client: 'Padre Alejandro',
      phone: '+54 9 11 1111-2222'
    },
    { 
      date: '2025-08-29', 
      coordinated: true,
      type: 'XV',
      time: '21:00',
      client: 'Morena Silva',
      phone: '+54 9 11 2222-3333'
    },
    { 
      date: '2025-08-30', 
      coordinated: false,
      type: 'Casamiento',
      time: '19:30',
      client: 'Agustina y Lucas',
      phone: '+54 9 11 3333-4444'
    },
    
    // SEPTIEMBRE 2025
    { 
      date: '2025-09-05', 
      coordinated: false,
      type: 'XV',
      time: '21:00',
      client: 'Isabella Torres',
      phone: '+54 9 11 4444-5555'
    },
    { 
      date: '2025-09-06', 
      coordinated: true,
      type: 'Casamiento',
      time: '19:00',
      client: 'Sofía y Gabriel',
      phone: '+54 9 11 5555-6666'
    },
    { 
      date: '2025-09-12', 
      coordinated: false,
      type: 'Cumpleaños',
      time: '22:00',
      client: 'Mateo Castro',
      phone: '+54 9 11 6666-7777'
    },
    { 
      date: '2025-09-13', 
      coordinated: true,
      type: 'Religioso',
      time: '18:30',
      client: 'Padre Francisco',
      phone: '+54 9 11 7777-8888'
    },
    { 
      date: '2025-09-19', 
      coordinated: false,
      type: 'XV',
      time: '21:30',
      client: 'Emma Morales',
      phone: '+54 9 11 8888-9999'
    },
    { 
      date: '2025-09-20', 
      coordinated: true,
      type: 'Casamiento',
      time: '20:00',
      client: 'Valeria y Nicolás',
      phone: '+54 9 11 9999-0000'
    },
    { 
      date: '2025-09-26', 
      coordinated: false,
      type: 'Cumpleaños',
      time: '22:30',
      client: 'Benjamín López',
      phone: '+54 9 11 0000-1111'
    },
    { 
      date: '2025-09-27', 
      coordinated: true,
      type: 'Religioso',
      time: '19:00',
      client: 'Padre Roberto',
      phone: '+54 9 11 1111-2222'
    },
    
    // OCTUBRE 2025
    { 
      date: '2025-10-03', 
      coordinated: true,
      type: 'XV',
      time: '21:00',
      client: 'Olivia Silva',
      phone: '+54 9 11 2222-3333'
    },
    { 
      date: '2025-10-04', 
      coordinated: false,
      type: 'Casamiento',
      time: '19:00',
      client: 'Camila y Sebastián',
      phone: '+54 9 11 3333-4444'
    },
    { 
      date: '2025-10-10', 
      coordinated: true,
      type: 'Cumpleaños',
      time: '22:00',
      client: 'Dante Morales',
      phone: '+54 9 11 4444-5555'
    },
    { 
      date: '2025-10-11', 
      coordinated: false,
      type: 'Religioso',
      time: '18:30',
      client: 'Padre Daniel',
      phone: '+54 9 11 5555-6666'
    },
    { 
      date: '2025-10-17', 
      coordinated: true,
      type: 'XV',
      time: '21:30',
      client: 'Mía Castro',
      phone: '+54 9 11 6666-7777'
    },
    { 
      date: '2025-10-18', 
      coordinated: false,
      type: 'Casamiento',
      time: '20:00',
      client: 'Luna y Alejandro',
      phone: '+54 9 11 7777-8888'
    },
    { 
      date: '2025-10-24', 
      coordinated: true,
      type: 'Cumpleaños',
      time: '22:30',
      client: 'Noah López',
      phone: '+54 9 11 8888-9999'
    },
    { 
      date: '2025-10-25', 
      coordinated: false,
      type: 'Religioso',
      time: '19:00',
      client: 'Padre José',
      phone: '+54 9 11 9999-0000'
    },
    { 
      date: '2025-10-31', 
      coordinated: true,
      type: 'Halloween',
      time: '21:00',
      client: 'Empresa TechCorp',
      phone: '+54 9 11 0000-1111'
    },
    
    // NOVIEMBRE 2025
    { 
      date: '2025-11-01', 
      coordinated: false,
      type: 'XV',
      time: '21:00',
      client: 'Aria Torres',
      phone: '+54 9 11 1111-2222'
    },
    { 
      date: '2025-11-07', 
      coordinated: true,
      type: 'Casamiento',
      time: '19:00',
      client: 'Zoe y Mateo',
      phone: '+54 9 11 2222-3333'
    },
    { 
      date: '2025-11-08', 
      coordinated: false,
      type: 'Cumpleaños',
      time: '22:00',
      client: 'Leo Castro',
      phone: '+54 9 11 3333-4444'
    },
    { 
      date: '2025-11-14', 
      coordinated: true,
      type: 'Religioso',
      time: '18:30',
      client: 'Padre Luis',
      phone: '+54 9 11 4444-5555'
    },
    { 
      date: '2025-11-15', 
      coordinated: false,
      type: 'XV',
      time: '21:30',
      client: 'Nina Morales',
      phone: '+54 9 11 5555-6666'
    },
    { 
      date: '2025-11-21', 
      coordinated: true,
      type: 'Casamiento',
      time: '20:00',
      client: 'Eva y Lucas',
      phone: '+54 9 11 6666-7777'
    },
    { 
      date: '2025-11-22', 
      coordinated: false,
      type: 'Cumpleaños',
      time: '22:30',
      client: 'Ian López',
      phone: '+54 9 11 7777-8888'
    },
    { 
      date: '2025-11-28', 
      coordinated: true,
      type: 'Religioso',
      time: '19:00',
      client: 'Padre Andrés',
      phone: '+54 9 11 8888-9999'
    },
    { 
      date: '2025-11-29', 
      coordinated: false,
      type: 'XV',
      time: '21:00',
      client: 'Sara Silva',
      phone: '+54 9 11 9999-0000'
    },
    
    // DICIEMBRE 2025
    { 
      date: '2025-12-05', 
      coordinated: true,
      type: 'Casamiento',
      time: '19:00',
      client: 'Maya y Theo',
      phone: '+54 9 11 0000-1111'
    },
    { 
      date: '2025-12-06', 
      coordinated: false,
      type: 'XV',
      time: '21:00',
      client: 'Lola Castro',
      phone: '+54 9 11 1111-2222'
    },
    { 
      date: '2025-12-12', 
      coordinated: true,
      type: 'Cumpleaños',
      time: '22:00',
      client: 'Axel Morales',
      phone: '+54 9 11 2222-3333'
    },
    { 
      date: '2025-12-13', 
      coordinated: false,
      type: 'Religioso',
      time: '18:30',
      client: 'Padre Miguel',
      phone: '+54 9 11 3333-4444'
    },
    { 
      date: '2025-12-19', 
      coordinated: true,
      type: 'XV',
      time: '21:30',
      client: 'Mila Torres',
      phone: '+54 9 11 4444-5555'
    },
    { 
      date: '2025-12-20', 
      coordinated: false,
      type: 'Casamiento',
      time: '20:00',
      client: 'Ava y Kai',
      phone: '+54 9 11 5555-6666'
    },
    { 
      date: '2025-12-24', 
      coordinated: true,
      type: 'Nochebuena',
      time: '21:00',
      client: 'Hotel Plaza',
      phone: '+54 9 11 6666-7777'
    },
    { 
      date: '2025-12-26', 
      coordinated: false,
      type: 'Cumpleaños',
      time: '22:30',
      client: 'Rex López',
      phone: '+54 9 11 7777-8888'
    },
    { 
      date: '2025-12-27', 
      coordinated: true,
      type: 'Religioso',
      time: '19:00',
      client: 'Padre Carlos',
      phone: '+54 9 11 8888-9999'
    },
    { 
      date: '2025-12-31', 
      coordinated: true,
      type: 'Año Nuevo',
      time: '23:00',
      client: 'Restaurant El Cielo',
      phone: '+54 9 11 9999-0000'
    }
  ];

  const months = [
    { name: 'ENERO', year: 2025, month: 0 },
    { name: 'FEBRERO', year: 2025, month: 1 },
    { name: 'MARZO', year: 2025, month: 2 },
    { name: 'ABRIL', year: 2025, month: 3 },
    { name: 'MAYO', year: 2025, month: 4 },
    { name: 'JUNIO', year: 2025, month: 5 },
    { name: 'JULIO', year: 2025, month: 6 },
    { name: 'AGOSTO', year: 2025, month: 7 },
    { name: 'SEPTIEMBRE', year: 2025, month: 8 },
    { name: 'OCTUBRE', year: 2025, month: 9 },
    { name: 'NOVIEMBRE', year: 2025, month: 10 },
    { name: 'DICIEMBRE', year: 2025, month: 11 }
  ];

  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab', 'Dom'];

  const handleMouseEnter = (event: any, day: number, month: number, year: number) => {
    const dateString = new Date(year, month, day).toISOString().split('T')[0];
    const eventData = events.find(event => event.date === dateString);
    
    if (eventData) {
      // Calcular posición del tooltip cerca del cursor
      let offsetX = 15; // 15px a la derecha del cursor
      let offsetY = -10; // 10px arriba del cursor
      
      // Asegurar que el tooltip no se salga de la pantalla
      const tooltipWidth = 280; // Ancho mínimo del tooltip
      const tooltipHeight = 150; // Altura aproximada del tooltip
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Si se sale por la derecha, mostrar a la izquierda del cursor
      if (event.clientX + offsetX + tooltipWidth > windowWidth) {
        offsetX = -tooltipWidth - 15;
      }
      
      // Si se sale por abajo, mostrar arriba del cursor
      if (event.clientY + offsetY + tooltipHeight > windowHeight) {
        offsetY = -tooltipHeight - 10;
      }
      
      // Si se sale por arriba, mostrar abajo del cursor
      if (event.clientY + offsetY < 0) {
        offsetY = 30;
      }
      
      setTooltipData({
        visible: true,
        event: eventData,
        position: { 
          x: event.clientX + offsetX, 
          y: event.clientY + offsetY 
        },
        isHovered: false
      });
    }
  };

  const handleMouseLeave = () => {
    // Usar un timeout para dar tiempo a que el usuario mueva el cursor al tooltip
    setTimeout(() => {
      setTooltipData(prev => {
        // Solo ocultar si el tooltip no está siendo hovered
        if (prev && !prev.isHovered) {
          return null;
        }
        return prev;
      });
    }, 100);
  };

  const handleTooltipMouseEnter = () => {
    // Mantener el tooltip visible cuando el mouse entra en él
    if (tooltipData) {
      setTooltipData({
        ...tooltipData,
        visible: true,
        isHovered: true
      });
    }
  };

  const handleTooltipMouseLeave = () => {
    // Ocultar el tooltip cuando el mouse sale de él
    setTooltipData(null);
  };

  const handleWhatsAppClick = (phone: string) => {
    const message = encodeURIComponent('Hola! Soy coordinador de Janos\'s Técnica. ¿Podemos coordinar los detalles del evento?');
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleViewCoordination = (event: any) => {
    // Aquí se abriría una modal o navegación a la página de coordinación
    // Por ahora simulamos con un alert
    alert(`Coordinación del evento: ${event.type}\nCliente: ${event.client}\nFecha: ${event.date}\nHorario: ${event.time}\n\nDetalles de la coordinación:\n- Música: ${event.music || 'A definir'}\n- Equipamiento: ${event.equipment || 'Estándar'}\n- Notas: ${event.notes || 'Sin notas adicionales'}\n\nEstado: Coordinado ✓`);
  };

  const handleStartCoordination = (event: any) => {
    // Redirigir a la sección de Coordinación DJ
    navigate('/coordination');
  };

  const renderMonthCalendar = (monthData: { name: string; year: number; month: number }) => {
    const { year, month } = monthData;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    
    // Ajustar para que la semana empiece en lunes (0 = lunes, 6 = domingo)
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;
    
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    
    const days = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < adjustedStartDay; i++) {
      days.push(<DayCell key={`empty-${i}`} isCurrentMonth={false} />);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const isToday = today.getDate() === day && today.getFullYear() === year && today.getMonth() === month;
      const eventData = events.find(event => event.date === dateString);
      const hasEvent = !!eventData;
      const isCoordinated = eventData?.coordinated || false;
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      days.push(
        <DayCell
          key={day}
          isCurrentMonth={true}
          isToday={isToday}
          hasEvent={hasEvent}
          isWeekend={isWeekend}
          isCoordinated={isCoordinated}
          onMouseEnter={(e) => hasEvent && handleMouseEnter(e, day, month, year)}
          onMouseLeave={handleMouseLeave}
        >
          {day}
        </DayCell>
      );
    }
    
    return days;
  };

  return (
    <EventsContainer>
        <HeaderSection>
          <HeaderContent>
            <HeaderLeft>
              <FaBars style={{ fontSize: '1.25rem' }} />
              <h1>Janos's Tecnica</h1>
            </HeaderLeft>
            <HeaderRight>
                          <BackButton onClick={() => navigate('/dashboard')} title="Volver al Dashboard">
              <FaArrowLeft />
              Dashboard
            </BackButton>
              <div className="user-info">
                <FaUsers />
                <span>sebastian_maza</span>
              </div>
            </HeaderRight>
          </HeaderContent>
        </HeaderSection>

        <FilterSection>
          <FilterGrid>
            <FilterGroup>
              <label>Salon:</label>
              <select value={selectedSalon} onChange={(e) => setSelectedSalon(e.target.value)}>
                <option value="San Telmo">San Telmo</option>
                <option value="Palermo">Palermo</option>
                <option value="Recoleta">Recoleta</option>
                <option value="Belgrano">Belgrano</option>
              </select>
            </FilterGroup>
            
            <FilterGroup>
              <label>Zona:</label>
              <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
                <option value="TODAS">TODAS</option>
                <option value="NORTE">NORTE</option>
                <option value="SUR">SUR</option>
                <option value="ESTE">ESTE</option>
                <option value="OESTE">OESTE</option>
              </select>
            </FilterGroup>
            
            <FilterGroup>
              <label>Año:</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </FilterGroup>
          </FilterGrid>
          
          <ButtonGroup>
            <ActionButton variant="primary">
              <FaFilter />
              Filtrar
            </ActionButton>
            <ActionButton variant="secondary">
              <FaDownload />
              Exportar
            </ActionButton>
          </ButtonGroup>
        </FilterSection>

        <CurrentView>
          <div>
            <div className="view-title">{selectedSalon} - {selectedYear}</div>
            <div className="section-title">Eventos</div>
          </div>
        </CurrentView>

        <LegendSection>
          <LegendTitle>Leyenda</LegendTitle>
          <LegendGrid>
            <LegendItem>
              <LegendColor coordinated={true} />
              <LegendText>Coordinado</LegendText>
            </LegendItem>
            <LegendItem>
              <LegendColor coordinated={false} />
              <LegendText>Sin Coordinar</LegendText>
            </LegendItem>
          </LegendGrid>
        </LegendSection>

        {tooltipData && (
          <EventTooltip 
            className={tooltipData.visible ? 'visible' : ''}
            style={{
              left: tooltipData.position.x,
              top: tooltipData.position.y
            }}
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
          >
            <TooltipHeader>
              <TooltipTitle>Detalles del Evento</TooltipTitle>
              <TooltipStatus coordinated={tooltipData.event.coordinated}>
                {tooltipData.event.coordinated ? 'Coordinado' : 'Sin Coordinar'}
              </TooltipStatus>
            </TooltipHeader>
            <TooltipContent>
              <TooltipRow>
                <TooltipLabel>Tipo:</TooltipLabel>
                <TooltipValue>{tooltipData.event.type}</TooltipValue>
              </TooltipRow>
              <TooltipRow>
                <TooltipLabel>Horario:</TooltipLabel>
                <TooltipValue>{tooltipData.event.time}</TooltipValue>
              </TooltipRow>
              <TooltipRow>
                <TooltipLabel>Cliente:</TooltipLabel>
                <TooltipValue>{tooltipData.event.client}</TooltipValue>
              </TooltipRow>
              <WhatsAppButton onClick={() => handleWhatsAppClick(tooltipData.event.phone)}>
                <FaWhatsapp />
                Contactar
              </WhatsAppButton>
              {tooltipData.event.coordinated ? (
                <CoordinationButton onClick={() => handleViewCoordination(tooltipData.event)}>
                  <FaEye />
                  Ver Coordinación
                </CoordinationButton>
              ) : (
                <CoordinationButton onClick={() => handleStartCoordination(tooltipData.event)}>
                  <FaHandshake />
                  Realizar Coordinación
                </CoordinationButton>
              )}
            </TooltipContent>
          </EventTooltip>
        )}

        <CalendarGrid>
          {months.map((month) => (
            <MonthCalendar key={month.month}>
              <MonthHeader>
                <h3>{month.name}</h3>
              </MonthHeader>
              
              <DaysHeader>
                {dayNames.map((day) => (
                  <DayHeader key={day}>{day}</DayHeader>
                ))}
              </DaysHeader>
              
              <DaysGrid>
                {renderMonthCalendar(month)}
              </DaysGrid>
            </MonthCalendar>
          ))}
        </CalendarGrid>
      </EventsContainer>
  );
};

export default Events;
