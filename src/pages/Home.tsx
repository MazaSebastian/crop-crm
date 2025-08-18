import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Card as UiCard, Button as UiButton, SectionHeader as UiSectionHeader } from '../components/ui';
import { getCrops, getAnnouncements, addAnnouncement, getActivities, addActivity, mockCropPartners, getPlannedEvents, getDailyRecords, syncAnnouncementsFromSupabase, createAnnouncementSupabase, removeAnnouncementLocal, deleteAnnouncementSupabase, syncActivitiesFromSupabase, createActivitySupabase } from '../services/cropService';
import { supabase } from '../services/supabaseClient';
import type { Announcement, Activity, Crop, ActivityType } from '../types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// Iconos reemplazados por emojis para evitar incompatibilidades de tipos en algunos entornos

const Page = styled.div`
  padding: 1rem;
  padding-top: 4rem;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  gap: 0.75rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = UiCard;

const SectionHeader = UiSectionHeader;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
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

const Button = UiButton;

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
  // const [lastSync, setLastSync] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>(getActivities());
  const [notifCount, setNotifCount] = useState<Record<string, number>>({});

  const [newMsg, setNewMsg] = useState('');
  const navigate = useNavigate();

  // Quick add de actividad
  const [actCropId, setActCropId] = useState<string>(crops[0]?.id ?? '');
  const [actType, setActType] = useState<ActivityType>('fertilization');
  const [actDate, setActDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [actTitle, setActTitle] = useState<string>('');
  const [actDetails, setActDetails] = useState<string>('');

  React.useEffect(() => {
    // Carga inicial desde Supabase (si está configurado)
    (async () => {
      const server = await syncAnnouncementsFromSupabase();
      if (server) setAnnouncements(server);
      const acts = await syncActivitiesFromSupabase(4);
      if (acts) setActivities(acts);
    })();

    // Realtime: escuchar inserts en announcements
    if (supabase) {
      const channel = supabase
        .channel('realtime:announcements')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'announcements' },
          (payload: any) => {
            const r = payload.new;
            if (!r) return;
            const a: Announcement = {
              id: r.id,
              message: r.message,
              type: r.type || 'info',
              createdBy: r.createdBy || 'partner-1',
              createdAt: r.createdAt,
            };
            setAnnouncements(prev => {
              const next = prev.some(x => x.id === a.id) ? prev : [a, ...prev];
              return next.slice(0, 4);
            });
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'announcements' },
          (payload: any) => {
            const r = payload.old;
            if (!r) return;
            setAnnouncements(prev => prev.filter(x => x.id !== r.id));
          }
        )
        .subscribe();

      const chActs = supabase
        .channel('realtime:activities')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activities' }, async () => {
          const acts = await syncActivitiesFromSupabase(4);
          if (acts) setActivities(acts);
        })
        .subscribe();

      // Inicializar contadores (últimos 2 días) por cultivo
      (async () => {
        const since = new Date(Date.now() - 2*24*3600*1000).toISOString();
        const ids = crops.map(c => c.id);
        const counts: Record<string, number> = {};
        for (const id of ids) counts[id] = 0;
        const { data: dr } = await supabase
          .from('daily_records')
          .select('id,crop_id,created_at')
          .gte('created_at', since)
          .in('crop_id', ids as any);
        const { data: pe } = await supabase
          .from('planned_events')
          .select('id,crop_id,created_at')
          .gte('created_at', since)
          .in('crop_id', ids as any);
        (dr || []).forEach((r: any) => { counts[r.crop_id] = (counts[r.crop_id] || 0) + 1; });
        (pe || []).forEach((r: any) => { counts[r.crop_id] = (counts[r.crop_id] || 0) + 1; });
        setNotifCount(counts);
      })();

      // Realtime: aumentar contador al insertar
      const chNotif = supabase
        .channel('realtime:home-notif')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'daily_records' }, (payload: any) => {
          const r = payload.new; if (!r) return;
          setNotifCount(prev => ({ ...prev, [r.crop_id]: (prev[r.crop_id] || 0) + 1 }));
        })
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'planned_events' }, (payload: any) => {
          const r = payload.new; if (!r) return;
          setNotifCount(prev => ({ ...prev, [r.crop_id]: (prev[r.crop_id] || 0) + 1 }));
        })
        .subscribe();

      // Al volver el foco, refrescar lista completa (por si hubo desconexión)
      const onFocus = async () => {
        const server = await syncAnnouncementsFromSupabase();
        if (server) setAnnouncements(server);
        // refrescar contadores
        const since = new Date(Date.now() - 2*24*3600*1000).toISOString();
        const ids = crops.map(c => c.id);
        const counts: Record<string, number> = {};
        for (const id of ids) counts[id] = 0;
        const { data: dr } = await supabase
          .from('daily_records')
          .select('id,crop_id,created_at')
          .gte('created_at', since)
          .in('crop_id', ids as any);
        const { data: pe } = await supabase
          .from('planned_events')
          .select('id,crop_id,created_at')
          .gte('created_at', since)
          .in('crop_id', ids as any);
        (dr || []).forEach((r: any) => { counts[r.crop_id] = (counts[r.crop_id] || 0) + 1; });
        (pe || []).forEach((r: any) => { counts[r.crop_id] = (counts[r.crop_id] || 0) + 1; });
        setNotifCount(counts);
      };
      window.addEventListener('focus', onFocus);
      // Polling de respaldo cada 10s por si se pierde la suscripción
      const iv = window.setInterval(onFocus, 10000);

      return () => {
        window.removeEventListener('focus', onFocus);
        window.clearInterval(iv);
        supabase.removeChannel(channel);
        supabase.removeChannel(chActs);
        supabase.removeChannel(chNotif);
      };
    }
  }, []);

  const addMsg = async (e: React.FormEvent) => {
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
    const ok = await createAnnouncementSupabase(a);
    if (!ok) {
      // feedback mínimo en UI si falla el insert remoto
      alert('No se pudo sincronizar con el servidor. El aviso quedó local. Revisa consola.');
    }
    setAnnouncements(prev => [a, ...prev].slice(0, 4));
    setNewMsg('');
  };

  // función de sync manual eliminada

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
    setActivities(prev => [activity, ...prev].slice(0, 4));
    createActivitySupabase(activity);
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
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}> 
          <Card>
            <SectionHeader>
              <h3>🔔 Comunicaciones</h3>
            </SectionHeader>
            <form onSubmit={addMsg} style={{ display: 'grid', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Input placeholder="Escribe un aviso para tu socio..." value={newMsg} onChange={e => setNewMsg(e.target.value)} />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit">➕&nbsp;Agregar</Button>
              </div>
            </form>
            <List>
              {announcements.slice(0, 4).map(a => (
                <Item key={a.id} style={{ display:'grid', gridTemplateColumns:'1fr auto', alignItems:'center', gap:8 }}>
                  <div>
                    <div style={{ fontSize: '0.875rem' }}>{a.message}</div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{new Date(a.createdAt).toLocaleString('es-AR')}</div>
                  </div>
                  <button
                    title="Marcar como leído"
                    onClick={async () => {
                      removeAnnouncementLocal(a.id);
                      setAnnouncements(prev => prev.filter(x => x.id !== a.id));
                      await deleteAnnouncementSupabase(a.id);
                    }}
                    style={{ background:'#dcfce7', border:'1px solid #86efac', color:'#166534', borderRadius:8, padding:'4px 10px', cursor:'pointer' }}
                  >✔️ Leído</button>
                </Item>
              ))}
            </List>
          </Card>
          </motion.div>

          {/* Registrar acción se mueve aquí para ocupar el espacio entre Comunicaciones y Últimas acciones */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03, duration: 0.25 }}>
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
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.25 }}>
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
          </motion.div>
        </div>

        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.25 }}>
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
                      const unread = notifCount[c.id] || 0;
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
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.25 }}>
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
          </motion.div>
        </div>
      </Grid>
    </Page>
  );
};

export default Home;

