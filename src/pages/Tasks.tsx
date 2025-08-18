import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { getCrops, getTasks, upsertTask, mockCropPartners, syncTasksFromSupabase, createTaskSupabase, updateTaskSupabase } from '../services/cropService';
import { supabase } from '../services/supabaseClient';
import type { Crop, CropTask } from '../types';

const Page = styled.div`
  padding: 1rem;
  padding-top: 5rem;
  max-width: 900px;
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
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border-radius: 0.5rem;
`;

const List = styled.div`
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Item = styled.div<{ status: CropTask['status'] }>`
  border: 1px solid #e2e8f0;
  border-left: 4px solid ${p => p.status === 'done' ? '#10b981' : p.status === 'in-progress' ? '#f59e0b' : '#94a3b8'};
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: ${p => p.status === 'done' ? '#dcfce7' : '#f8fafc'};
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
  ${p => p.status === 'done' ? 'text-decoration: line-through; color: #166534;' : ''}
  transition: background-color .25s ease, color .25s ease, border-color .25s ease;
`;

const Tasks: React.FC = () => {
  const crops: Crop[] = useMemo(() => getCrops(), []);
  const [cropId, setCropId] = useState<string>(crops[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<CropTask['priority']>('medium');
  const [assignee, setAssignee] = useState<string>('');
  const [status, setStatus] = useState<CropTask['status']>('pending');
  const [dueDate, setDueDate] = useState('');
  const [tasks, setTasks] = useState<CropTask[]>(cropId ? getTasks(cropId) : []);

  React.useEffect(() => {
    (async () => {
      const srv = await syncTasksFromSupabase(cropId, 4);
      if (srv) setTasks(srv);
      else setTasks(cropId ? getTasks(cropId) : []);
    })();
    if (supabase && cropId) {
      const ch = supabase.channel('realtime:tasks')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `crop_id=eq.${cropId}` }, async () => {
          const srv = await syncTasksFromSupabase(cropId, 4);
          if (srv) setTasks(srv);
        })
        .subscribe();
      return () => { supabase.removeChannel(ch); };
    }
  }, [cropId]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropId || !title.trim()) return;
    const task: CropTask = {
      id: `task-${Date.now()}`,
      cropId,
      title: title.trim(),
      priority,
      status,
      assignedTo: assignee || undefined,
      dueDate: dueDate || undefined,
      createdAt: new Date().toISOString(),
      createdBy: mockCropPartners[0].id
    };
    upsertTask(task);
    setTasks(prev => [task, ...prev].slice(0, 4));
    await createTaskSupabase(task);
    setTitle(''); setAssignee(''); setDueDate(''); setStatus('pending'); setPriority('medium');
  };

  const toggleDone = async (t: CropTask) => {
    const updated: CropTask = {
      ...t,
      status: t.status === 'done' ? 'pending' : 'done',
      completedAt: t.status === 'done' ? undefined : new Date().toISOString()
    };
    upsertTask(updated);
    setTasks(prev => prev.map(x => x.id === updated.id ? updated : x));
    await updateTaskSupabase(updated);
  };

  return (
    <Page>
      <h1>Tareas Compartidas</h1>
      <Card>
        <form onSubmit={addTask}>
          <Row>
            <div>
              <label>Cultivo</label>
              <Select value={cropId} onChange={e => setCropId(e.target.value)} style={{ width: '100%' }}>
                {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </div>
            <div>
              <label>Título</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Podar sector A" />
            </div>
          </Row>
          <Row>
            <div>
              <label>Prioridad</label>
              <Select value={priority} onChange={e => setPriority(e.target.value as CropTask['priority'])}>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </Select>
            </div>
            <div>
              <label>Asignado a</label>
              <Select value={assignee} onChange={e => setAssignee(e.target.value)}>
                <option value="">—</option>
                {mockCropPartners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
            </div>
          </Row>
          <Row>
            <div>
              <label>Estado</label>
              <Select value={status} onChange={e => setStatus(e.target.value as CropTask['status'])}>
                <option value="pending">Pendiente</option>
                <option value="in-progress">En Progreso</option>
                <option value="done">Hecha</option>
              </Select>
            </div>
            <div>
              <label>Vence</label>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </Row>
          <div style={{ marginTop: '0.5rem', display:'flex', gap:8 }}>
            <Button type="submit" onClick={async (e) => {
              // si hay _editingId, hacer update y limpiar bandera
              const id = (addTask as any)._editingId as string | undefined;
              if (id) {
                e.preventDefault();
                if (!cropId || !title.trim()) return;
                const updated: CropTask = {
                  id,
                  cropId,
                  title: title.trim(),
                  priority,
                  status,
                  assignedTo: assignee || undefined,
                  dueDate: dueDate || undefined,
                  createdAt: new Date().toISOString(),
                  createdBy: mockCropPartners[0].id
                };
                upsertTask(updated);
                setTasks(prev => prev.map(x => x.id === id ? updated : x).slice(0,4));
                await updateTaskSupabase(updated);
                (addTask as any)._editingId = undefined;
                setTitle(''); setAssignee(''); setDueDate(''); setStatus('pending'); setPriority('medium');
                return;
              }
            }}>Guardar</Button>
            {(addTask as any)._editingId && (
              <Button type="button" onClick={() => { (addTask as any)._editingId = undefined; setTitle(''); setAssignee(''); setDueDate(''); setStatus('pending'); setPriority('medium'); }} style={{ background:'#e5e7eb', color:'#111827' }}>Cancelar</Button>
            )}
          </div>
        </form>
      </Card>

      <h2 style={{ margin: '1rem 0 0.5rem' }}>Tareas</h2>
      <List>
        {tasks.slice(0,4).map(t => (
          <Item key={t.id} status={t.status}>
            <div>
              <div style={{ fontWeight: 600, display:'flex', alignItems:'center', gap:8 }}>
                <span>{t.title}</span>
                <button
                  title="Editar"
                  onClick={() => {
                    setTitle(t.title);
                    setPriority(t.priority);
                    setAssignee(t.assignedTo || '');
                    setStatus(t.status);
                    setDueDate(t.dueDate || '');
                    // reutilizamos el formulario para editar: guardamos el id en un atributo temporal
                    (addTask as any)._editingId = t.id;
                  }}
                  style={{ background:'transparent', border:'1px solid #e5e7eb', borderRadius:6, padding:'2px 6px', cursor:'pointer' }}
                >✏️</button>
              </div>
              <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
                {t.priority.toUpperCase()} {t.dueDate ? `• Vence: ${t.dueDate}` : ''}
              </div>
            </div>
            <div>
              <button onClick={() => toggleDone(t)} style={{ padding: '0.375rem 0.75rem', borderRadius: 6, background: t.status==='done' ? '#10b981' : '#e5e7eb', color: t.status==='done' ? '#fff' : '#111827' }}>
                {t.status === 'done' ? 'Completado' : 'Marcar como completado'}
              </button>
            </div>
          </Item>
        ))}
      </List>
    </Page>
  );
};

export default Tasks;


