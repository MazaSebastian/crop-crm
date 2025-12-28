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

import { tasksService } from '../services/tasksService';
import { dailyLogsService } from '../services/dailyLogsService';

// ... (keep styled components) ...

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h3 { margin: 0; color: #2d3748; font-size: 1.25rem; }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #a0aec0;
  cursor: pointer;
  &:hover { color: #e53e3e; }
`;

const TabGroup = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  background: #f7fafc;
  padding: 0.25rem;
  border-radius: 0.5rem;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  background: ${p => p.active ? 'white' : 'transparent'};
  color: ${p => p.active ? '#2f855a' : '#718096'};
  font-weight: ${p => p.active ? '600' : '400'};
  box-shadow: ${p => p.active ? '0 1px 3px 0 rgba(0,0,0,0.1)' : 'none'};
  transition: all 0.2s;
  cursor: pointer;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 0.5rem;
  }
  input, textarea, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 1rem;
    &:focus { outline: none; border-color: #38b2ac; box-shadow: 0 0 0 3px rgba(56, 178, 172, 0.1); }
  }
  textarea { min-height: 100px; resize: vertical; }
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #2f855a 0%, #38b2ac 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.1s;
  &:hover { transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`;


const CropDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [crop, setCrop] = useState<Crop | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'task' | 'log'>('task');

  // Form State
  const [taskForm, setTaskForm] = useState({ title: '', type: 'info', description: '' });
  const [logForm, setLogForm] = useState({ notes: '' });

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

  const handleDayClick = async (day: Date) => {
    setSelectedDate(day);

    // Reset forms
    setTaskForm({ title: '', type: 'info', description: '' });
    setLogForm({ notes: '' });

    // Try to fetch existing log to pre-fill
    if (id) {
      const existingLog = await dailyLogsService.getLogByDate(id, format(day, 'yyyy-MM-dd'));
      if (existingLog) {
        setLogForm({ notes: existingLog.notes });
        setActiveTab('log'); // Switch to log if exists
      } else {
        setActiveTab('task');
      }
    }

    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedDate || !id) return;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    if (activeTab === 'task') {
      await tasksService.createTask({
        title: taskForm.title,
        description: taskForm.description,
        type: taskForm.type as any,
        due_date: dateStr,
        crop_id: id
      });
      alert('Tarea creada exitosamente');
    } else {
      await dailyLogsService.upsertLog({
        crop_id: id,
        date: dateStr,
        notes: logForm.notes
      });
      alert('Registro guardado exitosamente');
    }
    setIsModalOpen(false);
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
              onClick={() => handleDayClick(day)}
              style={{ cursor: 'pointer' }}
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

      {isModalOpen && selectedDate && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <h3>{format(selectedDate, 'EEEE d de MMMM', { locale: es })}</h3>
              <CloseButton onClick={() => setIsModalOpen(false)}>&times;</CloseButton>
            </ModalHeader>

            <TabGroup>
              <Tab active={activeTab === 'task'} onClick={() => setActiveTab('task')}>Nueva Tarea</Tab>
              <Tab active={activeTab === 'log'} onClick={() => setActiveTab('log')}>Diario de Cultivo</Tab>
            </TabGroup>

            {activeTab === 'task' ? (
              <>
                <FormGroup>
                  <label>Título</label>
                  <input
                    value={taskForm.title}
                    onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                    placeholder="Ej: Riego profundo con CalMag"
                  />
                </FormGroup>
                <FormGroup>
                  <label>Tipo</label>
                  <select value={taskForm.type} onChange={e => setTaskForm({ ...taskForm, type: e.target.value as any })}>
                    <option value="info">Info / Recordatorio</option>
                    <option value="warning">Importante</option>
                    <option value="danger">Urgente</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <label>Descripción (Opcional)</label>
                  <textarea
                    value={taskForm.description}
                    onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                  />
                </FormGroup>
              </>
            ) : (
              <FormGroup>
                <label>Notas del Día</label>
                <textarea
                  value={logForm.notes}
                  onChange={e => setLogForm({ ...logForm, notes: e.target.value })}
                  placeholder="¿Cómo se ve la planta hoy? ¿Alguna plaga? ¿Crecimiento?"
                  style={{ minHeight: '200px' }}
                />
              </FormGroup>
            )}

            <PrimaryButton onClick={handleSave}>Guardar</PrimaryButton>
          </Modal>
        </ModalOverlay>
      )}

    </Container>
  );
};

export default CropDetail;
