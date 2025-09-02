import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { getCrops, getTasks, upsertTask, mockCropPartners } from '../services/mockDataService';
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
  @media (max-width: 640px) { grid-template-columns: 1fr; }
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
  background: #f8fafc;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
`;

const Tasks: React.FC = () => {
  const crops: Crop[] = useMemo(() => getCrops(), []);
  const [cropId, setCropId] = useState<string>(crops[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<CropTask['priority']>('medium');
  const [assignee, setAssignee] = useState<string>('');
  const [status, setStatus] = useState<CropTask['status']>('pending');
  const [dueDate, setDueDate] = useState('');
  const [version, setVersion] = useState(0);

  const tasks = useMemo(() => cropId ? getTasks(cropId) : [], [cropId, version]);

  const addTask = (e: React.FormEvent) => {
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
    setTitle(''); setAssignee(''); setDueDate(''); setStatus('pending'); setPriority('medium');
    setVersion(v => v + 1);
  };

  const toggleDone = (t: CropTask) => {
    const updated: CropTask = {
      ...t,
      status: t.status === 'done' ? 'pending' : 'done',
      completedAt: t.status === 'done' ? undefined : new Date().toISOString()
    };
    upsertTask(updated);
    setVersion(v => v + 1);
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
          <div style={{ marginTop: '0.5rem' }}>
            <Button type="submit">Agregar</Button>
          </div>
        </form>
      </Card>

      <h2 style={{ margin: '1rem 0 0.5rem' }}>Tareas</h2>
      <List>
        {tasks.map(t => (
          <Item key={t.id} status={t.status}>
            <div>
              <div style={{ fontWeight: 600 }}>{t.title}</div>
              <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
                {t.priority.toUpperCase()} {t.dueDate ? `• Vence: ${t.dueDate}` : ''}
              </div>
            </div>
            <div>
              <button onClick={() => toggleDone(t)} style={{ padding: '0.375rem 0.75rem', borderRadius: 6, background: '#e5e7eb' }}>
                {t.status === 'done' ? 'Deshacer' : 'Marcar'}
              </button>
            </div>
          </Item>
        ))}
      </List>
    </Page>
  );
};

export default Tasks;





