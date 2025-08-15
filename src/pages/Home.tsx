import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { getCrops, getAnnouncements, addAnnouncement, getActivities, addActivity, mockCropPartners, getInboxCount, getPlannedEvents, getDailyRecords } from '../services/cropService';
import type { Announcement, Activity, Crop, ActivityType } from '../types';
import { useNavigate } from 'react-router-dom';
// Iconos reemplazados por emojis para evitar incompatibilidades de tipos en algunos entornos

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
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  h3 { font-size: 1rem; }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
`;

const Button = styled.button`
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background: #10b981;
  color: white;
`;

const List = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const Item = styled.div`
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
`;

const Badge = styled.span<{ variant?: 'green' | 'yellow' | 'gray' }>`
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  background: ${p => p.variant === 'green' ? '#dcfce7' : p.variant === 'yellow' ? '#fef3c7' : '#e5e7eb'};
  color: ${p => p.variant === 'green' ? '#166534' : p.variant === 'yellow' ? '#92400e' : '#374151'};
`;

const Home: React.FC = () => {
  const crops: Crop[] = useMemo(() => getCrops(), []);
  const [announcements, setAnnouncements] = useState<Announcement[]>(getAnnouncements());
  const [activities, setActivities] = useState<Activity[]>(getActivities());

  const [newMsg, setNewMsg] = useState('');
  const navigate = useNavigate();

  // Quick add de actividad
  const [actCropId, setActCropId] = useState<string>(crops[0]?.id ?? '');
  const [actType, setActType] = useState<ActivityType>('fertilization');
  const [actDate, setActDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [actTitle, setActTitle] = useState<string>('');
  const [actDetails, setActDetails] = useState<string>('');

  const addMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    const a: Announcement = {
      id: `ann-${Date.now()}`,
      message: newMsg.trim(),
      type: 'info',
      createdBy: mockCropPartners[0].id,
      createdAt: new Date().toISOString()
    };
    addAnnouncement(a);
    setAnnouncements(prev => [a, ...prev]);
    setNewMsg('');
  };

  const addQuickActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actCropId) return;
    const title = actTitle.trim() || (actType === 'fertilization' ? 'Fertilización' : actType === 'compost_tea' ? 'Té de compost' : 'Acción');
    const activity: Activity = {
      id: `act-${Date.now()}`,
      cropId: actCropId,
      type: actType,
      title,
      details: actDetails || undefined,
      date: actDate
    };
    addActivity(activity);
    setActivities(prev => [activity, ...prev]);
    setActTitle('');
    setActDetails('');
  };

  const nextReminders = useMemo(() => {
    const today = new Date().toISOString().slice(0,10);
    const upcoming: { title: string; date: string; cropId: string }[] = [];
    for (const crop of crops) {
      const evs = getPlannedEvents(crop.id) || [];
      for (const ev of evs) {
        if (ev.date >= today) {
          upcoming.push({ title: ev.title, date: ev.date, cropId: crop.id });
        }
      }
    }
    upcoming.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    return upcoming.slice(0, 6);
  }, [crops]);

  return (
    <Page>
      <Grid>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <Card>
            <SectionHeader>
              <h3>🔔 Comunicaciones</h3>
            </SectionHeader>
            <form onSubmit={addMsg} style={{ display: 'grid', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Input placeholder="Escribe un aviso para tu socio..." value={newMsg} onChange={e => setNewMsg(e.target.value)} />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit">➕&nbsp;Agregar</Button>
              </div>
            </form>
            <List>
              {announcements.map(a => (
                <Item key={a.id}>
                  <div style={{ fontSize: '0.875rem' }}>{a.message}</div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{new Date(a.createdAt).toLocaleString('es-AR')}</div>
                </Item>
              ))}
            </List>
          </Card>

          <Card>
            <SectionHeader>
              <h3>✅ Últimas acciones</h3>
            </SectionHeader>
            <List>
              {activities.slice(0, 6).map(act => (
                <Item key={act.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 600 }}>{act.title}</div>
                    <Badge variant="green">{act.date}</Badge>
                  </div>
                  {act.details && <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{act.details}</div>}
                </Item>
              ))}
            </List>
          </Card>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <Card>
            <SectionHeader>
              <h3>🌱 Resumen de cultivos</h3>
            </SectionHeader>
            <List>
              {crops.map(c => (
                <Item key={c.id}>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Socios: {c.partners.map(p => p.name).join(' & ')}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>Estado:</span>
                    <Badge variant={c.status === 'active' ? 'green' : c.status === 'paused' ? 'yellow' : 'gray'}>{c.status}</Badge>
                    {(() => {
                      const unread = getInboxCount(c.id);
                      if (!unread) return null;
                      // última fecha con cambio
                      const recs = getDailyRecords(c.id);
                      const plans = getPlannedEvents(c.id);
                      const latestRec = recs[0]?.createdAt ? recs[0].createdAt : undefined;
                      const latestPlan = plans[0]?.createdAt ? plans[0].createdAt : undefined;
                      const latestTs = [latestRec, latestPlan].filter(Boolean).sort((a: any, b: any) => (a! > b! ? -1 : 1))[0] as string | undefined;
                      const latestDate = latestTs ? new Date(latestTs).toISOString().slice(0,10) : new Date().toISOString().slice(0,10);
                      return (
                        <button
                          onClick={() => navigate(`/daily-log?crop=${encodeURIComponent(c.id)}&date=${latestDate}`)}
                          title="NUEVAS NOTIFICACIONES"
                          style={{ color: '#1d4ed8', background: '#dbeafe', padding: '2px 8px', borderRadius: 9999, border: '1px solid #3b82f6', fontSize: 12, cursor: 'pointer' }}
                        >
                          NUEVAS NOTIFICACIONES ({unread})
                        </button>
                      );
                    })()}
                  </div>
                </Item>
              ))}
            </List>
          </Card>

          <Card>
            <SectionHeader>
              <h3>Próximos recordatorios</h3>
            </SectionHeader>
            <List>
              {nextReminders.length === 0 && (
                <div style={{ color: '#64748b' }}>Sin recordatorios calculados aún.</div>
              )}
              {nextReminders.map((r, idx) => (
                <Item key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>{r.title}</div>
                    <div style={{ fontWeight: 600 }}>{r.date}</div>
                  </div>
                </Item>
              ))}
            </List>
          </Card>

          <Card>
            <SectionHeader>
              <h3>Registrar acción</h3>
            </SectionHeader>
            <form onSubmit={addQuickActivity} style={{ display: 'grid', gap: '0.5rem' }}>
              <Row>
                <div>
                  <label>Cultivo</label>
                  <Select value={actCropId} onChange={e => setActCropId(e.target.value)}>
                    {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Select>
                </div>
                <div>
                  <label>Tipo</label>
                  <Select value={actType} onChange={e => setActType(e.target.value as ActivityType)}>
                    <option value="fertilization">Fertilización</option>
                    <option value="compost_tea">Té de compost</option>
                    <option value="watering">Riego</option>
                    <option value="pruning">Poda</option>
                    <option value="harvest">Cosecha</option>
                    <option value="other">Otra</option>
                  </Select>
                </div>
              </Row>
              <Row>
                <div>
                  <label>Fecha</label>
                  <Input type="date" value={actDate} onChange={e => setActDate(e.target.value)} />
                </div>
                <div>
                  <label>Título</label>
                  <Input value={actTitle} onChange={e => setActTitle(e.target.value)} placeholder="Ej: NPK 10-10-10" />
                </div>
              </Row>
              <div>
                <label>Detalles</label>
                <Input value={actDetails} onChange={e => setActDetails(e.target.value)} placeholder="Notas (opcional)" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit">💾&nbsp;Guardar</Button>
              </div>
            </form>
          </Card>
        </div>
      </Grid>
    </Page>
  );
};

export default Home;

