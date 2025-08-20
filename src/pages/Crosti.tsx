import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Card as UiCard, Button as UiButton, Input as UiInput, Select as UiSelect } from '../components/ui';
import Stock from './Stock';
import { supabase } from '../services/supabaseClient';
import { CashMovement, createCashMovementSupabase, syncCashMovementsFromSupabase } from '../services/cropService';
import { useToast } from '../components/feedback';

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
  grid-template-columns: 2fr 2fr 1fr;
  gap: 0.5rem;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

type Owner = 'CROSTI';

interface Movement {
  id: string;
  type: 'INGRESO' | 'EGRESO';
  concept: string;
  amount: number;
  date: string; // ISO
  owner: Owner;
}

const Crosti: React.FC = () => {
  const [tab, setTab] = useState<'saldo'|'stock'>('saldo');
  const [balance, setBalance] = useState<number>(0);
  const [list, setList] = useState<Movement[]>([]);
  const [type, setType] = useState<Movement['type']>('EGRESO');
  const [actor, setActor] = useState<'Sebastian'|'Santiago'>('Sebastian');
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');
  const toast = useToast();

  const total = useMemo(() => list.reduce((acc, m) => acc + (m.type === 'INGRESO' ? m.amount : -m.amount), 0), [list]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amount);
    if (!concept.trim() || !val) return;
    // Persistimos actor dentro del concepto para no cambiar el esquema (ej: "[Sebastian] Compra de insumos")
    const decoratedConcept = `[${actor}] ${concept.trim()}`;
    const mov: Movement = { id: `mov-${Date.now()}`, type, concept: decoratedConcept, amount: val, date: new Date().toISOString().slice(0,10), owner: 'CROSTI' };
    const next = [mov, ...list];
    setList(next);
    const newBalance = balance + (type === 'INGRESO' ? val : -val);
    setBalance(newBalance);
    const ok = await createCashMovementSupabase(mov as unknown as CashMovement);
    if (!ok) toast.push('No se pudo sincronizar el movimiento', 'error');
    else toast.push('Movimiento guardado', 'success');
    setConcept(''); setAmount(''); setType('EGRESO'); setActor('Sebastian');
  };

  React.useEffect(() => {
    (async () => {
      const server = await syncCashMovementsFromSupabase();
      if (server) {
        const filtered = (server as any as Movement[]).filter(m => (m.owner as any) === 'CROSTI');
        setList(filtered);
        const bal = filtered.reduce((acc, m) => acc + (m.type === 'INGRESO' ? m.amount : -m.amount), 0);
        setBalance(bal);
      } else {
        const local = JSON.parse(localStorage.getItem('chakra_movs') || '[]');
        const filtered = (local as Movement[]).filter(m => m.owner === 'CROSTI');
        setList(filtered);
        const bal = filtered.reduce((acc: number, m: Movement) => acc + (m.type === 'INGRESO' ? m.amount : -m.amount), 0);
        setBalance(bal);
      }
    })();

    if (supabase) {
      const ch = supabase
        .channel('realtime:cash-crosti')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'cash_movements' }, (payload: any) => {
          const r = payload.new;
          if (!r || r.owner !== 'CROSTI') return;
          const mov: Movement = { id: r.id, type: r.type, concept: r.concept, amount: Number(r.amount||0), date: r.date, owner: r.owner } as Movement;
          setList(prev => (prev.some(x => x.id === mov.id) ? prev : [mov, ...prev]));
          setBalance(prev => prev + (mov.type === 'INGRESO' ? mov.amount : -mov.amount));
        })
        .subscribe();
      return () => { supabase.removeChannel(ch); };
    }
  }, []);

  return (
    <Page>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        <UiButton variant={tab==='saldo'?'primary':'ghost'} onClick={() => setTab('saldo')}>Saldo Crosti</UiButton>
        <UiButton variant={tab==='stock'?'primary':'ghost'} onClick={() => setTab('stock')}>Control de Stock</UiButton>
      </div>

      {tab === 'saldo' && (
        <>
          <Card>
            <h2>Saldo Crosti</h2>
            <div style={{ fontSize: 28, fontWeight: 800 }}>${balance.toLocaleString('es-AR')}</div>
            <div style={{ color: '#64748b' }}>Resultado (histórico): ${total.toLocaleString('es-AR')}</div>
          </Card>

          <Card>
            <h3>Nuevo movimiento</h3>
            <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
              <Row>
                <UiSelect value={type} onChange={e => setType(e.target.value as any)}>
                  <option>EGRESO</option>
                  <option>INGRESO</option>
                </UiSelect>
                <UiSelect value={actor} onChange={e => setActor(e.target.value as any)}>
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
            <h3>Movimientos (Crosti)</h3>
            <div style={{ display:'grid', gap:8 }}>
              {list.map(m => {
                const match = m.concept.match(/^\[(Sebastian|Santiago)\]\s*/);
                const who = match ? match[1] : undefined;
                const cleanConcept = match ? m.concept.replace(match[0], '') : m.concept;
                return (
                  <div key={m.id} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 2fr 1fr 1fr', gap:8, padding:'6px 8px', background:'#f8fafc', border:'1px solid #e5e7eb', borderRadius:8 }}>
                    <div style={{ color: m.type === 'INGRESO' ? '#16a34a' : '#ef4444', fontWeight:700 }}>{m.type}</div>
                    <div style={{ color:'#374151' }}>{who || '-'}</div>
                    <div>{cleanConcept}</div>
                    <div style={{ textAlign:'right' }}>${m.amount.toLocaleString('es-AR')}</div>
                    <div style={{ textAlign:'right', color:'#64748b' }}>{m.date}</div>
                  </div>
                );
              })}
              {list.length === 0 && <div style={{ color:'#64748b' }}>Sin movimientos aún.</div>}
            </div>
          </Card>
        </>
      )}

      {tab === 'stock' && (
        <Card>
          <h2>Control de Stock</h2>
          <div style={{ marginTop: 8 }}>
            <Stock />
          </div>
        </Card>
      )}
    </Page>
  );
};

export default Crosti;


