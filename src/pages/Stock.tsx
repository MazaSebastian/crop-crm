import React, { useState } from 'react';
import styled from 'styled-components';
import { Card as UiCard, Button as UiButton, Input as UiInput } from '../components/ui';
import { supabase } from '../services/supabaseClient';
import { StockItem, syncStockItemsFromSupabase, createStockItemSupabase, updateStockQtySupabase, deleteStockItemSupabase } from '../services/cropService';

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
  const [items, setItems] = useState<Item[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const q = Number(qty);
    if (!name.trim() || !q) return;
    const nextItem = { id: `it-${Date.now()}`, name: name.trim(), qty: q, unit: 'g' };
    const next = [nextItem, ...items];
    setItems(next);
    await createStockItemSupabase(nextItem as StockItem);
    setName(''); setQty(''); setIsOpen(false);
  };

  React.useEffect(() => {
    (async () => {
      const server = await syncStockItemsFromSupabase();
      if (server) setItems(server as Item[]);
      else setItems(JSON.parse(localStorage.getItem('chakra_stock') || '[]'));
    })();

    if (supabase) {
      const ch = supabase.channel('realtime:stock')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'stock_items' }, (payload: any) => {
          const r = payload.new;
          if (!r) return;
          const it: Item = { id: r.id, name: r.name, qty: r.qty, unit: r.unit };
          setItems(prev => (prev.some(x => x.id === it.id) ? prev : [it, ...prev]));
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'stock_items' }, (payload: any) => {
          const r = payload.new; if (!r) return;
          setItems(prev => prev.map(x => x.id === r.id ? { ...x, qty: r.qty } : x));
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'stock_items' }, (payload: any) => {
          const r = payload.old; if (!r) return;
          setItems(prev => prev.filter(x => x.id !== r.id));
        })
        .subscribe();
      return () => { supabase.removeChannel(ch); };
    }
  }, []);

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
                <UiButton onClick={async () => { const n = items.map(x => x.id===it.id?{...x, qty: x.qty + 1}:x); setItems(n); await updateStockQtySupabase(it.id, it.qty+1); }}>+1</UiButton>
                <UiButton onClick={async () => { const n = items.map(x => x.id===it.id?{...x, qty: Math.max(0, x.qty - 1)}:x); setItems(n); await updateStockQtySupabase(it.id, Math.max(0, it.qty-1)); }}>-1</UiButton>
                <UiButton onClick={async () => { const n = items.map(x => x.id===it.id?{...x, qty: x.qty + 10}:x); setItems(n); await updateStockQtySupabase(it.id, it.qty+10); }}>+10</UiButton>
                <UiButton onClick={async () => { const n = items.map(x => x.id===it.id?{...x, qty: Math.max(0, x.qty - 10)}:x); setItems(n); await updateStockQtySupabase(it.id, Math.max(0, it.qty-10)); }}>-10</UiButton>
                <UiButton onClick={async () => { const n = items.map(x => x.id===it.id?{...x, qty: x.qty + 100}:x); setItems(n); await updateStockQtySupabase(it.id, it.qty+100); }}>+100</UiButton>
                <UiButton onClick={async () => { const n = items.map(x => x.id===it.id?{...x, qty: Math.max(0, x.qty - 100)}:x); setItems(n); await updateStockQtySupabase(it.id, Math.max(0, it.qty-100)); }}>-100</UiButton>
              </div>
              <div style={{ textAlign:'right' }}>
                <UiButton variant="ghost" onClick={async () => {
                  const next = items.filter(x => x.id !== it.id);
                  setItems(next);
                  await deleteStockItemSupabase(it.id);
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


