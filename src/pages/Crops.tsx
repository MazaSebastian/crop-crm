import React from 'react';
import styled from 'styled-components';
import type { Crop } from '../types';
import { getCrops, syncCropsFromSupabase } from '../services/cropService';
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
      </Header>

      <Grid>
        {crops.map(c => (
          <Card key={c.id} onClick={() => navigate(`/crops/${c.id}`)}>
            <CardHeader>
              🌱 {c.name}
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
    </Page>
  );
};

export default Crops;

