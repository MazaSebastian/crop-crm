import React from 'react';
import styled from 'styled-components';
import type { Crop } from '../types';
import { getCrops, syncCropsFromSupabase, createCropSupabase, updateCropSupabase } from '../services/cropService';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const Page = styled.div`
  padding: 1rem;
  padding-top: 5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  h1 {
    font-size: 1.25rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease;
  &:hover { transform: scale(1.02); box-shadow: 0 10px 20px rgba(0,0,0,0.06); }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
`;

const CardBody = styled.div`
  padding: 0.75rem 1rem;
  display: grid;
  gap: 0.5rem;
`;

const Badge = styled.span<{ variant?: 'green' | 'yellow' | 'gray' }>`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 9999px;
  background: ${p => p.variant === 'green' ? '#dcfce7' : p.variant === 'yellow' ? '#fef3c7' : '#e5e7eb'};
  color: ${p => p.variant === 'green' ? '#166534' : p.variant === 'yellow' ? '#92400e' : '#374151'};
`;

// (se quitaron botones de acciones para un diseño más limpio)

const Crops: React.FC = () => {
  const [crops, setCrops] = React.useState<Crop[]>(() => getCrops());
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const navigate = useNavigate();
  const statusVariant = (s: Crop['status']): 'green' | 'yellow' | 'gray' => {
    if (s === 'active') return 'green';
    if (s === 'paused') return 'yellow';
    return 'gray';
  };

  React.useEffect(() => {
    (async () => {
      const server = await syncCropsFromSupabase();
      if (server) setCrops(server);
      else setCrops(getCrops());
    })();

    if (supabase) {
      const ch = supabase.channel('realtime:crops')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'crops' }, async () => {
          const server = await syncCropsFromSupabase();
          if (server) setCrops(server);
        })
        .subscribe();
      return () => { supabase.removeChannel(ch); };
    }
  }, []);

  return (
    <Page>
      <Header>
        <h1>Mis Cultivos</h1>
        <button onClick={() => setIsOpen(true)} style={{ padding:'8px 12px', borderRadius:8, background:'#10b981', color:'#fff', border:'none', cursor:'pointer' }}>Nuevo cultivo</button>
      </Header>

      <Grid>
        {crops.map(c => (
          <Card key={c.id} onClick={(e) => {
            // evitar que el click en eliminar navegue
            const target = e.target as HTMLElement;
            if (target.closest('[data-action="edit"]')) return;
            navigate(`/crops/${c.id}`);
          }}>
            <CardHeader>
              <span>🌱 {c.name}</span>
              <button
                data-action="edit"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(true); setName(c.name); setLocation(c.location || '');
                  // guardamos id temporal en dataset del botón para usar en submit
                  (e.currentTarget as any).dataset.editingId = c.id;
                  // usamos atributo en el estado del componente en lugar de dataset
                  (setIsOpen as any)._editingId = c.id;
                }}
                title="Editar cultivo"
                style={{ marginLeft:'auto', background:'transparent', border:'none', cursor:'pointer' }}
              >✏️</button>
            </CardHeader>
            <CardBody>
              <div>Ubicación: {c.location ?? '—'}</div>
              <div>Inicio: {new Date(c.startDate).toLocaleDateString('es-AR')}</div>
              <div>Socios: {c.partners.map(p => p.name).join(' & ')}</div>
              <div>
                Estado: <Badge variant={statusVariant(c.status)}>{c.status}</Badge>
              </div>
            </CardBody>
          </Card>
        ))}
      </Grid>

      {isOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }} onClick={() => setIsOpen(false)}>
          <div style={{ background:'#fff', border:'1px solid #e5e7eb', padding:16, borderRadius:12, width:360 }} onClick={e => e.stopPropagation()}>
            <h3>Nuevo cultivo</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const nm = name.trim();
              if (!nm) return;
              const editingId = (setIsOpen as any)._editingId as string | undefined;
              if (editingId) {
                const updated: Crop = { id: editingId, name: nm, location: location.trim() || undefined, startDate: new Date().toISOString().slice(0,10), partners: [], status: 'active' };
                setCrops(prev => prev.map(x => x.id === editingId ? { ...x, name: updated.name, location: updated.location } : x));
                await updateCropSupabase(updated);
                (setIsOpen as any)._editingId = undefined;
              } else {
                const id = `crop-${Date.now()}`;
                const newCrop: Crop = { id, name: nm, location: location.trim() || undefined, startDate: new Date().toISOString().slice(0,10), partners: [], status: 'active' };
                setCrops(prev => [newCrop, ...prev]);
                await createCropSupabase(newCrop);
              }
              setName(''); setLocation(''); setIsOpen(false);
            }} style={{ display:'grid', gap:8 }}>
              <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} style={{ padding:'8px 10px', border:'1px solid #d1d5db', borderRadius:8 }} />
              <input placeholder="Ubicación (opcional)" value={location} onChange={e => setLocation(e.target.value)} style={{ padding:'8px 10px', border:'1px solid #d1d5db', borderRadius:8 }} />
              <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                <button type="button" onClick={() => setIsOpen(false)} style={{ padding:'8px 12px', borderRadius:8, background:'#e5e7eb', border:'1px solid #d1d5db' }}>Cancelar</button>
                <button type="submit" style={{ padding:'8px 12px', borderRadius:8, background:'#10b981', color:'#fff', border:'none' }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Page>
  );
};

export default Crops;

