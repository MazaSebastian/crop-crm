import React, { useState } from 'react';
import styled from 'styled-components';
import { Card as UiCard, Button as UiButton, Input as UiInput } from '../components/ui';

const Page = styled.div`
  padding: 1rem;
  padding-top: 5rem;
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  gap: 1rem;
`;

const Card = UiCard;

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
          <UiButton onClick={() => setIsOpen(true)}>Agregar Stock</UiButton>
        </div>
        {isOpen && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }} onClick={() => setIsOpen(false)}>
            <div style={{ background:'#fff', border:'1px solid #e5e7eb', padding:16, borderRadius:12, width:360 }} onClick={e => e.stopPropagation()}>
              <h3>Agregar Stock</h3>
              <form onSubmit={add} style={{ display:'grid', gap:8 }}>
                <UiInput placeholder="Variedad" value={name} onChange={e => setName(e.target.value)} />
                <UiInput placeholder="Stock (g)" type="number" value={qty} onChange={e => setQty(e.target.value)} />
                <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                  <UiButton variant="ghost" type="button" onClick={() => setIsOpen(false)}>Cancelar</UiButton>
                  <UiButton type="submit">Guardar</UiButton>
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
              <div style={{ display:'flex', gap:6 }}>
                <UiButton onClick={() => { const next = items.map(x => x.id===it.id?{...x, qty: x.qty + 1}:x); setItems(next); localStorage.setItem('chakra_stock', JSON.stringify(next)); }}>+1</UiButton>
                <UiButton onClick={() => { const next = items.map(x => x.id===it.id?{...x, qty: Math.max(0, x.qty - 1)}:x); setItems(next); localStorage.setItem('chakra_stock', JSON.stringify(next)); }}>-1</UiButton>
                <UiButton onClick={() => { const next = items.map(x => x.id===it.id?{...x, qty: x.qty + 10}:x); setItems(next); localStorage.setItem('chakra_stock', JSON.stringify(next)); }}>+10</UiButton>
                <UiButton onClick={() => { const next = items.map(x => x.id===it.id?{...x, qty: Math.max(0, x.qty - 10)}:x); setItems(next); localStorage.setItem('chakra_stock', JSON.stringify(next)); }}>-10</UiButton>
                <UiButton onClick={() => { const next = items.map(x => x.id===it.id?{...x, qty: x.qty + 100}:x); setItems(next); localStorage.setItem('chakra_stock', JSON.stringify(next)); }}>+100</UiButton>
                <UiButton onClick={() => { const next = items.map(x => x.id===it.id?{...x, qty: Math.max(0, x.qty - 100)}:x); setItems(next); localStorage.setItem('chakra_stock', JSON.stringify(next)); }}>-100</UiButton>
              </div>
              <div style={{ textAlign:'right' }}>
                <UiButton variant="ghost" onClick={() => {
                  const next = items.filter(x => x.id !== it.id);
                  setItems(next); localStorage.setItem('chakra_stock', JSON.stringify(next));
                }}>Eliminar</UiButton>
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


