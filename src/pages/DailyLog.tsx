import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { addDailyRecord, getCrops, getDailyRecords, mockCropPartners, getPlannedEvents, addPlannedEvent, readInbox, syncDailyRecordsFromSupabase, createDailyRecordSupabase, syncPlannedEventsFromSupabase, createPlannedEventSupabase } from '../services/cropService';
import { supabase } from '../services/supabaseClient';
import type { Crop, DailyRecord, PlannedEvent } from '../types';
import YearCalendar from '../components/YearCalendar';
import EventModal from '../components/EventModal';
import DayPopover from '../components/DayPopover';
import RecordModal from '../components/RecordModal';

const Page = styled.div`
  padding: 1rem;
  padding-top: 5rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
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

const Button = styled.button`
  background: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
`;

const List = styled.div`
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Item = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
`;

const DailyLog: React.FC = () => {
  const crops: Crop[] = useMemo(() => getCrops(), []);
  const [cropId, setCropId] = useState<string>(crops[0]?.id ?? '');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [planned, setPlanned] = useState<PlannedEvent[]>(cropId ? getPlannedEvents(cropId) : []);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [temp, setTemp] = useState('');
  const [hum, setHum] = useState('');
  const [soil, setSoil] = useState('');
  const [ph, setPh] = useState('');
  const [ec, setEc] = useState('');
  const [notes, setNotes] = useState('');
  const [records, setRecords] = useState<DailyRecord[]>(cropId ? getDailyRecords(cropId) : []);

  // actualizar eventos planificados al cambiar cultivo
  React.useEffect(() => {
    if (cropId) {
      setPlanned(getPlannedEvents(cropId));
      setRecords(getDailyRecords(cropId));
    }
  }, [cropId]);
  // Al abrir esta vista, marcar como revisadas las notificaciones del cultivo actual
  React.useEffect(() => {
    // Soporte de deep-link desde Home con ?crop=&date=
    const params = new URLSearchParams(window.location.search);
    const qCrop = params.get('crop');
    const qDate = params.get('date');
    if (qCrop && qCrop !== cropId) setCropId(qCrop);
    if (qDate) setSelectedDate(qDate);
    if (cropId) readInbox(cropId);
    // Sync inicial con Supabase
    (async () => {
      if (!cropId) return;
      const srvRec = await syncDailyRecordsFromSupabase(cropId);
      if (srvRec) setRecords(srvRec);
      const srvPlan = await syncPlannedEventsFromSupabase(cropId);
      if (srvPlan) setPlanned(srvPlan);
    })();

    // Realtime listeners
    if (supabase && cropId) {
      const ch = supabase.channel('realtime:daily');
      ch.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'daily_records', filter: `crop_id=eq.${cropId}` }, async (_payload: any) => {
        const srvRec = await syncDailyRecordsFromSupabase(cropId);
        if (srvRec) setRecords(srvRec);
      });
      ch.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'planned_events', filter: `crop_id=eq.${cropId}` }, (_payload: any) => {
        (async () => {
          const srvPlan = await syncPlannedEventsFromSupabase(cropId);
          if (srvPlan) setPlanned(srvPlan);
        })();
      });
      ch.subscribe();
      const onFocus = async () => {
        const srvRec = await syncDailyRecordsFromSupabase(cropId);
        if (srvRec) setRecords(srvRec);
        const srvPlan = await syncPlannedEventsFromSupabase(cropId);
        if (srvPlan) setPlanned(srvPlan);
      };
      window.addEventListener('focus', onFocus);
      const iv = window.setInterval(onFocus, 10000);
      return () => {
        window.removeEventListener('focus', onFocus);
        window.clearInterval(iv);
        supabase.removeChannel(ch);
      };
    }
  }, [cropId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropId) return;
    const rec: DailyRecord = {
      id: `rec-${Date.now()}`,
      cropId,
      date: new Date().toISOString().slice(0, 10),
      params: {
        temperatureC: Number(temp || 0),
        humidityPct: Number(hum || 0),
        soilMoisturePct: soil ? Number(soil) : undefined,
        ph: ph ? Number(ph) : undefined,
        ecMs: ec ? Number(ec) : undefined
      },
      notes: notes || undefined,
      photos: [],
      createdBy: mockCropPartners[0].id,
      createdAt: new Date().toISOString()
    };
    addDailyRecord(rec);
    setRecords(prev => [rec, ...prev]);
    await createDailyRecordSupabase(rec);
    setTemp(''); setHum(''); setSoil(''); setPh(''); setEc(''); setNotes('');
  };

  // quickRecordForDate removido (no se usa)

  return (
    <Page>
      <h1>Registro Diario</h1>
      <Card style={{ marginBottom: '1rem' }}>
        <Row>
          <div>
            <Label>Año</Label>
            <Input type="number" value={year} onChange={e => setYear(Number(e.target.value || new Date().getFullYear()))} />
          </div>
          <div>
            <Label>Cultivo</Label>
            <select value={cropId} onChange={e => setCropId(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}>
              {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          {/* Eliminamos el botón de Agregar Evento para usar el menú del día */}
          <div>
            <Label>&nbsp;</Label>
            <Button type="button" onClick={async () => {
              if (!cropId) return;
              const srvRec = await syncDailyRecordsFromSupabase(cropId);
              if (srvRec) setRecords(srvRec);
              const srvPlan = await syncPlannedEventsFromSupabase(cropId);
              if (srvPlan) setPlanned(srvPlan);
            }}>🔄 Forzar sync</Button>
          </div>
        </Row>
        <div style={{ marginTop: '0.5rem' }}>
          <YearCalendar
            year={year}
            planned={planned}
            onSelectDate={(iso) => {
              if (!cropId) return;
              setSelectedDate(iso);
              setIsPopoverOpen(true);
            }}
          />
          <div style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Tip: haz clic en un día para registrar Humedad y Temperatura. Usa “Agregar Evento” para planificar hitos (resaltados en amarillo).
          </div>
        </div>
      </Card>
      <DayPopover
        isOpen={isPopoverOpen}
        date={selectedDate}
        events={planned.filter(p => p.date === selectedDate).map(p => ({ title: p.title }))}
        records={records.filter(r => r.date === selectedDate).map(r => ({ humidityPct: r.params.humidityPct, temperatureC: r.params.temperatureC }))}
        onClose={() => setIsPopoverOpen(false)}
        onAddRecord={() => { setIsPopoverOpen(false); setIsRecordOpen(true); }}
        onAddEvent={() => { setIsPopoverOpen(false); setIsEventOpen(true); }}
      />
      <RecordModal
        isOpen={isRecordOpen}
        initialDate={selectedDate}
        onClose={() => setIsRecordOpen(false)}
        onSave={async ({ date, humidity, temperature, notes, status }) => {
          const rec: DailyRecord = {
            id: `rec-${Date.now()}`,
            cropId,
            date,
            params: { temperatureC: temperature, humidityPct: humidity },
            notes,
            createdBy: mockCropPartners[0].id,
            createdAt: new Date().toISOString()
          };
          addDailyRecord(rec);
          setRecords(prev => [rec, ...prev]);
          await createDailyRecordSupabase(rec);
          setIsRecordOpen(false);
          // Estado visual 100% decidido por el usuario: guarda verde/amarillo/rojo
          if (status || notes) {
            const evStatus: 'green' | 'yellow' | 'red' = status || 'green';
            const evTitle = notes || (evStatus === 'yellow' ? 'Advertencia' : evStatus === 'red' ? 'Acción requerida' : 'OK');
            const ev: PlannedEvent = { id: `pl-${Date.now()}-flag`, cropId, date, title: evTitle, type: 'other', status: evStatus };
            addPlannedEvent(ev);
            setPlanned(prev => [ev, ...prev]);
          }
        }}
      />
      <EventModal
        isOpen={isEventOpen}
        initialDate={selectedDate}
        onClose={() => setIsEventOpen(false)}
        onSave={async ({ date, description }) => {
          if (!cropId) return setIsEventOpen(false);
          const ev: PlannedEvent = { id: `pl-${Date.now()}`, cropId, date, title: description || 'Evento', type: 'milestone' };
          addPlannedEvent(ev);
          await createPlannedEventSupabase(ev);
          setPlanned(prev => [ev, ...prev]);
          setSelectedDate(date);
          setIsEventOpen(false);
        }}
      />
      <Card>
        <form onSubmit={handleSubmit}>
          <Row>
            <div>
              <Label>Fecha</Label>
              <Input type="date" value={new Date().toISOString().slice(0,10)} readOnly />
            </div>
            <div></div>
          </Row>
          <Row>
            <div>
              <Label>Temperatura (°C)</Label>
              <Input type="number" value={temp} onChange={e => setTemp(e.target.value)} required />
            </div>
            <div>
              <Label>Humedad (%)</Label>
              <Input type="number" value={hum} onChange={e => setHum(e.target.value)} required />
            </div>
          </Row>
          <Row>
            <div>
              <Label>Humedad Suelo (%)</Label>
              <Input type="number" value={soil} onChange={e => setSoil(e.target.value)} />
            </div>
            <div>
              <Label>pH</Label>
              <Input type="number" step="0.1" value={ph} onChange={e => setPh(e.target.value)} />
            </div>
          </Row>
          <Row>
            <div>
              <Label>EC (mS/cm)</Label>
              <Input type="number" step="0.1" value={ec} onChange={e => setEc(e.target.value)} />
            </div>
            <div></div>
          </Row>
          <div style={{ marginBottom: '0.75rem' }}>
            <Label>Observaciones</Label>
            <Textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <Button type="submit">Guardar</Button>
        </form>
      </Card>

      <h2 style={{ margin: '1rem 0 0.5rem' }}>Últimos registros</h2>
      <List>
        {records.map(r => (
          <Item key={r.id}>
            <div style={{ fontWeight: 600 }}>{new Date(r.createdAt).toLocaleString('es-AR')}</div>
            <div>Temp: {r.params.temperatureC} °C • Hum: {r.params.humidityPct}% {r.params.soilMoisturePct != null ? `• Suelo: ${r.params.soilMoisturePct}%` : ''}</div>
            {r.notes && <div style={{ color: '#64748b' }}>{r.notes}</div>}
          </Item>
        ))}
      </List>
    </Page>
  );
};

export default DailyLog;

