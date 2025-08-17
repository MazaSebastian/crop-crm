import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.15);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
  z-index: 1000;
`;

const Popover = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  width: 92%;
  max-width: 520px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
`;

const Header = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
`;

const Body = styled.div`
  padding: 0.75rem 1rem;
  display: grid;
  gap: 0.75rem;
`;

const Section = styled.div`
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
`;

const Actions = styled.div`
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  background: ${p => p.variant === 'secondary' ? '#e5e7eb' : '#10b981'};
  color: ${p => p.variant === 'secondary' ? '#111827' : 'white'};
`;

export interface DayPopoverProps {
  isOpen: boolean;
  date: string; // ISO
  events: { title: string }[];
  records: { humidityPct: number; temperatureC: number }[];
  onClose: () => void;
  onAddRecord: () => void;
  onAddEvent: () => void;
}

const DayPopover: React.FC<DayPopoverProps> = ({ isOpen, date, events, records, onClose, onAddRecord, onAddEvent }) => {
  if (!isOpen) return null;
  return (
    <Overlay onClick={onClose}>
      <Popover onClick={(e) => e.stopPropagation()}>
        <Header>
          <div>Detalles del {date}</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: 16 }}>✕</button>
        </Header>
        <Body>
          <div style={{ display: 'grid', gap: 8 }}>
            <Button onClick={onAddRecord}>➕ Registrar Parámetros Diarios</Button>
            <Button variant="secondary" onClick={onAddEvent}>🗓️ Registrar Evento</Button>
          </div>
          <Section>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Eventos planificados</div>
            {events.length === 0 ? (
              <div style={{ color: '#64748b' }}>Sin eventos para esta fecha.</div>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {events.map((ev, i) => (
                  <li key={i}>{ev.title}</li>
                ))}
              </ul>
            )}
          </Section>
          <Section>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Parámetros registrados</div>
            {records.length === 0 ? (
              <div style={{ color: '#64748b' }}>Sin registros para esta fecha.</div>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {records.map((r, i) => (
                  <li key={i}>Hum: {r.humidityPct}% • Temp: {r.temperatureC} °C</li>
                ))}
              </ul>
            )}
          </Section>
        </Body>
      </Popover>
    </Overlay>
  );
};

export default DayPopover;



