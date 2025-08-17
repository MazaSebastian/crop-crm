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
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const q = Number(qty);
    if (!name.trim() || !q) return;
    const next = [{ id: `it-${Date.now()}`, name: name.trim(), qty: q, unit: 'g' }, ...items];
    setItems(next);
    localStorage.setItem('chakra_stock', JSON.stringify(next));
    setName(''); setQty(''); setIsOpen(false);
  };

  return (
    <Page>
      <Card>
        <h2>Stock</h2>
        <div style={{ display:'flex', justifyContent:'flex-end' }}>
          <button onClick={() => setIsOpen(true)}>Agregar Stock</button>
        </div>
        {isOpen && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }} onClick={() => setIsOpen(false)}>
            <div style={{ background:'#fff', border:'1px solid #e5e7eb', padding:16, borderRadius:12, width:360 }} onClick={e => e.stopPropagation()}>
              <h3>Agregar Stock</h3>
              <form onSubmit={add} style={{ display:'grid', gap:8 }}>
                <input placeholder="Variedad" value={name} onChange={e => setName(e.target.value)} />
                <input placeholder="Stock (g)" type="number" value={qty} onChange={e => setQty(e.target.value)} />
                <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                  <button type="button" onClick={() => setIsOpen(false)}>Cancelar</button>
                  <button type="submit">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Card>
      <Card>
        <h3>Listado</h3>
        <div style={{ display:'grid', gap:8 }}>
          {items.map(it => (
            <div key={it.id} style={{ display:'grid', gridTemplateColumns:'2fr 2fr 2fr 1fr', gap:8, padding:'6px 8px', background:'#f8fafc', border:'1px solid #e5e7eb', borderRadius:8 }}>
              <div style={{ fontWeight:600 }}>{it.name}</div>
              <div>{it.qty} g</div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => { const next = items.map(x => x.id===it.id?{...x, qty: x.qty + 10}:x); setItems(next); localStorage.setItem('chakra_stock', JSON.stringify(next)); }}>+10 g</button>
                <button onClick={() => { const next = items.map(x => x.id===it.id?{...x, qty: Math.max(0, x.qty - 10)}:x); setItems(next); localStorage.setItem('chakra_stock', JSON.stringify(next)); }}>-10 g</button>
              </div>
              <div style={{ textAlign:'right' }}>
                <button onClick={() => {
                  const next = items.filter(x => x.id !== it.id);
                  setItems(next); localStorage.setItem('chakra_stock', JSON.stringify(next));
                }}>Eliminar</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div style={{ color:'#64748b' }}>Sin ítems aún. Usa “Agregar Stock”.</div>}
        </div>
      </Card>
    </Page>
  );
};

export default Stock;


