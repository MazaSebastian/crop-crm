import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { getCrops, getDailyRecords } from '../services/cropService';
import type { Crop, DailyRecord } from '../types';

const Page = styled.div`
  padding: 1rem;
  padding-top: 5rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th, td {
    padding: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
  }

  th { background: #f8fafc; }
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
`;

const Badge = styled.span<{ color: string }>`
  background: ${p => p.color}20;
  color: ${p => p.color};
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
`;

const Parameters: React.FC = () => {
  const crops: Crop[] = useMemo(() => getCrops(), []);
  const [cropId, setCropId] = useState<string>(crops[0]?.id ?? '');
  const records: DailyRecord[] = useMemo(() => cropId ? getDailyRecords(cropId) : [], [cropId]);

  const colorForTemp = (t?: number) => t == null ? '#64748b' : t < 15 ? '#0ea5e9' : t > 30 ? '#ef4444' : '#16a34a';
  const colorForHum = (h?: number) => h == null ? '#64748b' : h < 40 ? '#f59e0b' : h > 80 ? '#0ea5e9' : '#16a34a';

  return (
    <Page>
      <h1>Parámetros</h1>
      <div style={{ margin: '0.5rem 0 1rem' }}>
        <Select value={cropId} onChange={e => setCropId(e.target.value)}>
          {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
      </div>
      <Card>
        <Table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Temp</th>
              <th>Humedad</th>
              <th>Suelo</th>
              <th>pH</th>
              <th>EC</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td><Badge color={colorForTemp(r.params.temperatureC)}>{r.params.temperatureC} °C</Badge></td>
                <td><Badge color={colorForHum(r.params.humidityPct)}>{r.params.humidityPct}%</Badge></td>
                <td>{r.params.soilMoisturePct != null ? `${r.params.soilMoisturePct}%` : '—'}</td>
                <td>{r.params.ph ?? '—'}</td>
                <td>{r.params.ecMs ?? '—'}</td>
                <td style={{ color: '#64748b' }}>{r.notes ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Page>
  );
};

export default Parameters;


