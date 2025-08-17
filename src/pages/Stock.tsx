import React, { useState } from 'react';
import styled from 'styled-components';

const Page = styled.div`
  padding: 1rem;
  padding-top: 5rem;
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  gap: 1rem;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
`;

interface Item { id: string; name: string; qty: number; unit?: string; }

const Stock: React.FC = () => {
  const [items, setItems] = useState<Item[]>(() => JSON.parse(localStorage.getItem('chakra_stock') || '[]'));
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState('');

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const q = Number(qty);
    if (!name.trim() || !q) return;
    const next = [{ id: `it-${Date.now()}`, name: name.trim(), qty: q, unit: unit.trim() || undefined }, ...items];
    setItems(next);
    localStorage.setItem('chakra_stock', JSON.stringify(next));
    setName(''); setQty(''); setUnit('');
  };

  return (
    <Page>
      <Card>
        <h2>Stock</h2>
        <form onSubmit={add} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:8 }}>
          <input placeholder="Ítem" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Cantidad" type="number" value={qty} onChange={e => setQty(e.target.value)} />
          <input placeholder="Unidad (opcional)" value={unit} onChange={e => setUnit(e.target.value)} />
          <button type="submit">Agregar</button>
        </form>
      </Card>
      <Card>
        <h3>Listado</h3>
        <div style={{ display:'grid', gap:8 }}>
          {items.map(it => (
            <div key={it.id} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:8, padding:'6px 8px', background:'#f8fafc', border:'1px solid #e5e7eb', borderRadius:8 }}>
              <div style={{ fontWeight:600 }}>{it.name}</div>
              <div>{it.qty} {it.unit || ''}</div>
              <div style={{ textAlign:'right' }}>
                <button onClick={() => {
                  const next = items.filter(x => x.id !== it.id);
                  setItems(next); localStorage.setItem('chakra_stock', JSON.stringify(next));
                }}>Eliminar</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div style={{ color:'#64748b' }}>Sin ítems aún.</div>}
        </div>
      </Card>
    </Page>
  );
};

export default Stock;


