import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 480px;
  padding: 1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`;

const Header = styled.div`
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.75rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  background: ${p => p.variant === 'secondary' ? '#e5e7eb' : '#10b981'};
  color: ${p => p.variant === 'secondary' ? '#111827' : 'white'};
`;

interface RecordModalProps {
  isOpen: boolean;
  initialDate: string; // ISO
  onClose: () => void;
  onSave: (data: { date: string; humidity: number; temperature: number; ec?: number; ph?: number; notes?: string; status?: 'green' | 'yellow' | 'red' }) => void;
}

const RecordModal: React.FC<RecordModalProps> = ({ isOpen, initialDate, onClose, onSave }) => {
  const [date, setDate] = React.useState(initialDate);
  const [stage, setStage] = React.useState<'vegetative' | 'flowering'>('vegetative');
  const [humidity, setHumidity] = React.useState('');
  const [temperature, setTemperature] = React.useState('');
  const [ec, setEc] = React.useState('');
  const [ph, setPh] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [status, setStatus] = React.useState<'green' | 'yellow' | 'red'>('green');

  React.useEffect(() => {
    setDate(initialDate);
    setStage('vegetative');
    setHumidity('');
    setTemperature('');
    setEc(''); setPh(''); setNotes('');
    setStatus('green');
  }, [initialDate, isOpen]);

  if (!isOpen) return null;

  const humidityNum = Number(humidity || NaN);
  const temperatureNum = Number(temperature || NaN);

  const ranges = stage === 'vegetative'
    ? { hMin: 40, hMax: 60, tMin: 22, tMax: 28 }
    : { hMin: 30, hMax: 50, tMin: 20, tMax: 26 };

  const humidityValid = !isNaN(humidityNum);
  const temperatureValid = !isNaN(temperatureNum);
  const canSave = true; // mostramos aviso explícito si faltan campos

  return (
    <Overlay>
      <Modal>
        <Header>Registrar Parámetros</Header>
        <div style={{ marginBottom: '0.5rem' }}>
          <Label>Etapa</Label>
          <select value={stage} onChange={e => setStage(e.target.value as any)} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}>
            <option value="vegetative">Vegetativa</option>
            <option value="flowering">Floración</option>
          </select>
          <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>
            Rangos sugeridos (no bloquean) • Temp: {ranges.tMin}–{ranges.tMax} °C • Hum: {ranges.hMin}–{ranges.hMax}%
          </div>
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <Label>Fecha</Label>
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <Row>
          <div>
            <Label>Humedad (%)</Label>
            <Input type="number" value={humidity} onChange={e => setHumidity(e.target.value)} placeholder="Ej: 55" />
            {humidity === '' && (
              <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>Obligatorio</div>
            )}
            {!humidityValid && humidity !== '' && (
              <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>Ingrese un número válido</div>
            )}
          </div>
          <div>
            <Label>Temperatura (°C)</Label>
            <Input type="number" value={temperature} onChange={e => setTemperature(e.target.value)} placeholder="Ej: 23" />
            {temperature === '' && (
              <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>Obligatorio</div>
            )}
            {!temperatureValid && temperature !== '' && (
              <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>Ingrese un número válido</div>
            )}
          </div>
        </Row>
        <Row>
          <div>
            <Label>EC (mS/cm)</Label>
            <Input type="number" step="0.1" value={ec} onChange={e => setEc(e.target.value)} placeholder="Ej: 1.8" />
          </div>
          <div>
            <Label>pH</Label>
            <Input type="number" step="0.1" value={ph} onChange={e => setPh(e.target.value)} placeholder="Ej: 6.3" />
          </div>
        </Row>
        <div>
          <Label>Observaciones (opcional)</Label>
          <Textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notas" />
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <Label>Estado</Label>
          <div style={{ display: 'flex', gap: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="radio" name="status" checked={status==='green'} onChange={() => setStatus('green')} />
              <span style={{ color: '#16a34a' }}>Verde (OK)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="radio" name="status" checked={status==='yellow'} onChange={() => setStatus('yellow')} />
              <span style={{ color: '#f59e0b' }}>Amarillo (Advertencia)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="radio" name="status" checked={status==='red'} onChange={() => setStatus('red')} />
              <span style={{ color: '#ef4444' }}>Rojo (Acción)</span>
            </label>
          </div>
        </div>
        <Actions>
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
          <Button
            type="button"
            disabled={!canSave}
            onClick={() => {
              if (humidity.trim() === '' || temperature.trim() === '') {
                alert('OBLIGATORIO: Humedad y Temperatura para registrar');
                return;
              }
              onSave({ date, humidity: Number(humidity || 0), temperature: Number(temperature || 0), ec: ec ? Number(ec) : undefined, ph: ph ? Number(ph) : undefined, notes: notes.trim() || undefined, status });
            }}
          >
            Guardar
          </Button>
        </Actions>
      </Modal>
    </Overlay>
  );
};

export default RecordModal;


