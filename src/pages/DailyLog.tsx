import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { addDailyRecord, getCrops, getDailyRecords, mockCropPartners } from '../services/mockDataService';
import type { Crop, DailyRecord } from '../types';

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
  const [temp, setTemp] = useState('');
  const [hum, setHum] = useState('');
  const [soil, setSoil] = useState('');
  const [ph, setPh] = useState('');
  const [ec, setEc] = useState('');
  const [notes, setNotes] = useState('');
  const [listVersion, setListVersion] = useState(0);

  const records = useMemo(() => cropId ? getDailyRecords(cropId) : [], [cropId, listVersion]);

  const handleSubmit = (e: React.FormEvent) => {
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
    setTemp(''); setHum(''); setSoil(''); setPh(''); setEc(''); setNotes('');
    setListVersion(v => v + 1);
  };

  return (
    <Page>
      <h1>Registro Diario</h1>
      <Card>
        <form onSubmit={handleSubmit}>
          <Row>
            <div>
              <Label>Cultivo</Label>
              <select value={cropId} onChange={e => setCropId(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}>
                {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <Label>Fecha</Label>
              <Input type="date" value={new Date().toISOString().slice(0,10)} readOnly />
            </div>
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





