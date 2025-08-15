import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import type { Crop } from '../types';
import { getCrops } from '../services/cropService';

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
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  overflow: hidden;
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

const ActionBar = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e2e8f0;
`;

const Button = styled.button`
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background: #3b82f6;
  color: white;
  font-size: 0.875rem;
`;

const Crops: React.FC = () => {
  const crops: Crop[] = useMemo(() => getCrops(), []);
  const [selected, setSelected] = useState<Crop | null>(crops[0] ?? null);

  const statusVariant = (s: Crop['status']): 'green' | 'yellow' | 'gray' => {
    if (s === 'active') return 'green';
    if (s === 'paused') return 'yellow';
    return 'gray';
  };

  return (
    <Page>
      <Header>
        <h1>Mis Cultivos</h1>
        <Button>➕&nbsp;Nuevo</Button>
      </Header>

      <Grid>
        {crops.map(c => (
          <Card key={c.id} onClick={() => setSelected(c)}>
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
            <ActionBar>
              <Button title="Registro Diario">🌡️</Button>
              <Button title="Parámetros">💧</Button>
              <Button title="Tareas">📋</Button>
            </ActionBar>
          </Card>
        ))}
      </Grid>
    </Page>
  );
};

export default Crops;

