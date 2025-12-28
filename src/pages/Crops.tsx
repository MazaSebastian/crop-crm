import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  FaSeedling,
  FaThermometerHalf,
  FaTint,
  FaTasks,
  FaPlus,
  FaCalendarAlt,
  FaMapMarkerAlt
} from 'react-icons/fa';
import type { Crop } from '../types';
import { getCrops } from '../services/mockDataService';

const Page = styled.div`
  padding: 2rem;
  padding-top: 5rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #f8fafc;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    font-weight: 800;
    color: #1a202c;
    letter-spacing: -0.05rem;
    background: linear-gradient(135deg, #2f855a 0%, #38b2ac 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
  border: 1px solid #edf2f7;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  padding: 1.25rem;
  background: #f0fff4;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .icon {
    width: 40px;
    height: 40px;
    background: white;
    color: #38a169;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .title {
    font-weight: 700;
    color: #2d3748;
    font-size: 1.1rem;
  }
`;

const CardBody = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.9rem;

  svg { color: #a0aec0; }
`;

const Badge = styled.span<{ variant?: 'green' | 'yellow' | 'gray' }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background: ${p => p.variant === 'green' ? '#c6f6d5' : p.variant === 'yellow' ? '#fefcbf' : '#edf2f7'};
  color: ${p => p.variant === 'green' ? '#22543d' : p.variant === 'yellow' ? '#744210' : '#4a5568'};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ActionBar = styled.div`
  padding: 1rem 1.25rem;
  border-top: 1px solid #edf2f7;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.75rem;
  background: #fafafa;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  background: white;
  color: #4a5568;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #ebf8ff;
    color: #3182ce;
    border-color: #bee3f8;
  }
`;

const CreateButton = styled.button`
  background: #3182ce;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(49, 130, 206, 0.3);

  &:hover {
    background: #2b6cb0;
    transform: translateY(-2px);
  }
`;

const Crops: React.FC = () => {
  const crops: Crop[] = useMemo(() => getCrops(), []);

  const statusVariant = (s: Crop['status']): 'green' | 'yellow' | 'gray' => {
    if (s === 'active') return 'green';
    if (s === 'paused') return 'yellow';
    return 'gray';
  };

  const getDaysSince = (dateStr: string) => {
    const diff = new Date().getTime() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <Page>
      <Header>
        <h1>Mis Cultivos</h1>
        <CreateButton><FaPlus /> Nuevo Cultivo</CreateButton>
      </Header>

      <Grid>
        {crops.map(c => (
          <Card key={c.id}>
            <CardHeader>
              <div className="icon"><FaSeedling /></div>
              <div className="title">{c.name}</div>
            </CardHeader>
            <CardBody>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Badge variant={statusVariant(c.status)}>{c.status}</Badge>
                <span style={{ fontSize: '0.8rem', color: '#718096' }}>ID: {c.id.split('-')[1]}</span>
              </div>

              <InfoRow>
                <FaMapMarkerAlt /> {c.location ?? 'Sin ubicación'}
              </InfoRow>
              <InfoRow>
                <FaCalendarAlt /> Inicio: {new Date(c.startDate).toLocaleDateString('es-AR')} ({getDaysSince(c.startDate)} días)
              </InfoRow>

              {/* Future: Add mini stats or recent activity summary here */}
            </CardBody>
            <ActionBar>
              <ActionButton title="Registro Diario"><FaThermometerHalf /> Diario</ActionButton>
              <ActionButton title="Parámetros"><FaTint /> Riego</ActionButton>
              <ActionButton title="Tareas"><FaTasks /> Tareas</ActionButton>
            </ActionBar>
          </Card>
        ))}
      </Grid>
    </Page>
  );
};

export default Crops;
