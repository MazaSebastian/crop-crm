import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Card as UiCard, Button as UiButton, Input as UiInput, Select as UiSelect } from '../components/ui';

const Page = styled.div`
  padding: 1rem;
  padding-top: 5rem;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  gap: 1rem;
`;

const Card = UiCard;

const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 0.5rem;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

interface Movement {
  id: string;
  type: 'INGRESO' | 'EGRESO';
  concept: string;
  amount: number;
  date: string; // ISO
  owner: 'Santiago' | 'Sebastian';
}

const Expenses: React.FC = () => {
  const [balance, setBalance] = useState<number>(() => Number(localStorage.getItem('chakra_balance') || 0));
  const [list, setList] = useState<Movement[]>(() => JSON.parse(localStorage.getItem('chakra_movs') || '[]'));
  const [type, setType] = useState<Movement['type']>('EGRESO');
  const [owner, setOwner] = useState<Movement['owner']>('Sebastian');
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');

  const total = useMemo(() => list.reduce((acc, m) => acc + (m.type === 'INGRESO' ? m.amount : -m.amount), 0), [list]);
  const byOwner = useMemo(() => ({
    Sebastian: list.filter(m => m.owner === 'Sebastian').reduce((a, m) => a + (m.type === 'INGRESO' ? m.amount : -m.amount), 0),
    Santiago: list.filter(m => m.owner === 'Santiago').reduce((a, m) => a + (m.type === 'INGRESO' ? m.amount : -m.amount), 0),
  }), [list]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amount);
    if (!concept.trim() || !val) return;
    const mov: Movement = { id: `mov-${Date.now()}`, type, concept: concept.trim(), amount: val, date: new Date().toISOString().slice(0,10), owner };
    const next = [mov, ...list];
    setList(next);
    const newBalance = balance + (type === 'INGRESO' ? val : -val);
    setBalance(newBalance);
    localStorage.setItem('chakra_movs', JSON.stringify(next));
    localStorage.setItem('chakra_balance', String(newBalance));
    setConcept(''); setAmount(''); setType('EGRESO'); setOwner('Sebastian');
  };

  return (
    <Page>
      <Card>
        <h2>Saldo Chakra</h2>
        <div style={{ fontSize: 28, fontWeight: 800 }}>${balance.toLocaleString('es-AR')}</div>
        <div style={{ color: '#64748b' }}>Resultado (histórico): ${total.toLocaleString('es-AR')}</div>
        <div style={{ display:'flex', gap:16, marginTop:8 }}>
          <div>Saldo Sebastian: <strong>${byOwner.Sebastian.toLocaleString('es-AR')}</strong></div>
          <div>Saldo Santiago: <strong>${byOwner.Santiago.toLocaleString('es-AR')}</strong></div>
        </div>
      </Card>

      <Card>
        <h3>Nuevo movimiento</h3>
        <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
          <Row>
            <UiSelect value={type} onChange={e => setType(e.target.value as any)}>
              <option>EGRESO</option>
              <option>INGRESO</option>
            </UiSelect>
            <UiSelect value={owner} onChange={e => setOwner(e.target.value as any)}>
              <option>Sebastian</option>
              <option>Santiago</option>
            </UiSelect>
            <UiInput placeholder="Concepto" value={concept} onChange={e => setConcept(e.target.value)} />
            <UiInput placeholder="Monto" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
            <UiButton type="submit">Agregar</UiButton>
          </Row>
        </form>
      </Card>

      <Card>
        <h3>Movimientos</h3>
        <div style={{ display:'grid', gap:8 }}>
          {list.map(m => (
            <div key={m.id} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 2fr 1fr 1fr', gap:8, padding:'6px 8px', background:'#f8fafc', border:'1px solid #e5e7eb', borderRadius:8 }}>
              <div style={{ color: m.type === 'INGRESO' ? '#16a34a' : '#ef4444', fontWeight:700 }}>{m.type}</div>
              <div style={{ color:'#374151' }}>{m.owner}</div>
              <div>{m.concept}</div>
              <div style={{ textAlign:'right' }}>${m.amount.toLocaleString('es-AR')}</div>
              <div style={{ textAlign:'right', color:'#64748b' }}>{m.date}</div>
            </div>
          ))}
          {list.length === 0 && <div style={{ color:'#64748b' }}>Sin movimientos aún.</div>}
        </div>
      </Card>
    </Page>
  );
};

export default Expenses;


