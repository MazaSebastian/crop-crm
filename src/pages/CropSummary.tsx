import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getCrops, getDailyRecords, getPlannedEvents, getTasks } from '../services/cropService';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

const Page = styled.div`
  padding: 1rem;
  padding-top: 5rem;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  gap: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
`;

const Title = styled.h1`
  margin: 0;
`;

const List = styled.div`
  display: grid;
  gap: .5rem;
`;

const Item = styled.div`
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: .5rem;
  padding: .5rem .75rem;
`;

const Stat = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: .5rem;
  text-align: center;
`;

const CropSummary: React.FC = () => {
  const { id } = useParams();
  const crop = useMemo(() => getCrops().find(c => c.id === id), [id]);
  const records = useMemo(() => (id ? getDailyRecords(id) : []), [id]);
  const events = useMemo(() => (id ? getPlannedEvents(id) : []), [id]);
  const tasks = useMemo(() => (id ? getTasks(id) : []), [id]);
  const [rangeDays, setRangeDays] = useState(30);

  // Datos para gráfico (últimos N días)
  const chartData = useMemo(() => {
    const cutoff = new Date(Date.now() - rangeDays * 24 * 3600 * 1000);
    const within = records.filter(r => new Date(r.date) >= cutoff).slice().reverse();
    return within.map(r => ({
      date: r.date,
      temperatureC: r.params.temperatureC,
      humidityPct: r.params.humidityPct
    }));
  }, [records, rangeDays]);

  if (!crop) return (
    <Page>
      <Card>
        <div>El cultivo no existe.</div>
        <div><Link to="/crops">Volver a Cultivos</Link></div>
      </Card>
    </Page>
  );

  const lastRecord = records[0];
  const openTasks = tasks.filter(t => t.status !== 'done');

  return (
    <Page>
      <Title>Resumen: {crop.name}</Title>
      <Grid>
        <div style={{ display:'grid', gap:'1rem' }}>
          <Card>
            <h3>Estado general</h3>
            <Stat>
              <div>
                <div style={{ color:'#64748b', fontSize:12 }}>Registros</div>
                <div style={{ fontWeight:700, fontSize:20 }}>{records.length}</div>
              </div>
              <div>
                <div style={{ color:'#64748b', fontSize:12 }}>Eventos</div>
                <div style={{ fontWeight:700, fontSize:20 }}>{events.length}</div>
              </div>
              <div>
                <div style={{ color:'#64748b', fontSize:12 }}>Tareas abiertas</div>
                <div style={{ fontWeight:700, fontSize:20 }}>{openTasks.length}</div>
              </div>
            </Stat>
          </Card>

          <Card>
            <h3>Último registro</h3>
            {!lastRecord ? (
              <div style={{ color:'#64748b' }}>Sin registros aún.</div>
            ) : (
              <div>
                <div style={{ fontWeight:700 }}>{new Date(lastRecord.createdAt).toLocaleString('es-AR')}</div>
                <div>Temp: {lastRecord.params.temperatureC} °C • Hum: {lastRecord.params.humidityPct}%</div>
                {lastRecord.notes && <div style={{ color:'#64748b' }}>{lastRecord.notes}</div>}
              </div>
            )}
          </Card>

          <Card>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <h3 style={{ margin:0 }}>Tendencias</h3>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <label style={{ fontSize:12, color:'#64748b' }}>Rango</label>
                <select value={rangeDays} onChange={e => setRangeDays(Number(e.target.value))}>
                  <option value={7}>7 días</option>
                  <option value={14}>14 días</option>
                  <option value={30}>30 días</option>
                  <option value={60}>60 días</option>
                </select>
              </div>
            </div>
            <div style={{ width:'100%', height:280 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="temperatureC" name="Temp (°C)" stroke="#ef4444" dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="humidityPct" name="Hum (%)" stroke="#3b82f6" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h3>Registros recientes</h3>
            <List>
              {records.slice(0, 6).map(r => (
                <Item key={r.id}>
                  <div style={{ fontWeight:600 }}>{r.date}</div>
                  <div>Temp: {r.params.temperatureC} °C • Hum: {r.params.humidityPct}%</div>
                  {r.notes && <div style={{ color:'#64748b' }}>{r.notes}</div>}
                </Item>
              ))}
            </List>
          </Card>
        </div>

        <div style={{ display:'grid', gap:'1rem' }}>
          <Card>
            <h3>Próximos eventos</h3>
            <List>
              {events.slice(0, 8).map(e => (
                <Item key={e.id}>
                  <div style={{ fontWeight:600 }}>{e.date}</div>
                  <div>{e.title}</div>
                </Item>
              ))}
              {events.length === 0 && <div style={{ color:'#64748b' }}>Sin eventos planificados.</div>}
            </List>
          </Card>

          <Card>
            <h3>Tareas</h3>
            <List>
              {openTasks.slice(0, 8).map(t => (
                <Item key={t.id}>
                  <div style={{ fontWeight:600 }}>{t.title}</div>
                  <div style={{ color:'#64748b', fontSize:12 }}>{t.priority.toUpperCase()} {t.dueDate ? `• Vence: ${t.dueDate}` : ''}</div>
                </Item>
              ))}
              {openTasks.length === 0 && <div style={{ color:'#64748b' }}>No hay tareas abiertas.</div>}
            </List>
          </Card>
        </div>
      </Grid>
      <div><Link to="/crops">← Volver a Cultivos</Link></div>
    </Page>
  );
};

export default CropSummary;


