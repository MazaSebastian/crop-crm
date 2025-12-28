import React from 'react';
import styled from 'styled-components';
import { 
  FaSeedling, 
  FaThermometerHalf, 
  FaTint, 
  FaWind, 
  FaExclamationTriangle, 
  FaCalendarCheck,
  FaLeaf,
  FaChartLine,
  FaPlus
} from 'react-icons/fa';

// --- Styled Components (Premium Eco-Tech Theme) ---

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  padding-top: 5rem; // Space for TopNav
  background-color: #f8fafc;
`;

const WelcomeHeader = styled.div`
  margin-bottom: 2.5rem;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1a202c;
    margin: 0;
    letter-spacing: -0.05rem;
    background: linear-gradient(135deg, #2f855a 0%, #38b2ac 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 1.1rem;
    color: #718096;
    margin-top: 0.5rem;
    font-weight: 500;
  }
`;

const KPISection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const KPICard = styled.div<{ active?: boolean, alert?: boolean }>`
  background: white;
  border-radius: 1.25rem;
  padding: 1.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
  border: 1px solid ${props => props.alert ? '#feb2b2' : '#edf2f7'};
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }

  /* Decorative accent line */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: ${props => props.alert ? '#e53e3e' : props.active ? '#38a169' : '#cbd5e0'};
  }

  .icon-wrapper {
    display: inline-flex;
    padding: 0.75rem;
    border-radius: 1rem;
    background: ${props => props.alert ? '#fff5f5' : '#f0fff4'};
    color: ${props => props.alert ? '#c53030' : '#2f855a'};
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .label {
    font-size: 0.875rem;
    color: #718096;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  .value {
    font-size: 2rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0.25rem 0;
    display: flex;
    align-items: baseline;
    gap: 0.25rem;

    .unit {
      font-size: 1rem;
      color: #a0aec0;
      font-weight: 500;
    }
  }

  .subtext {
    font-size: 0.8rem;
    color: ${props => props.alert ? '#e53e3e' : '#718096'};
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3748;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const MainCard = styled.div`
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #edf2f7;
`;

const CropRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #edf2f7;

  &:last-child {
    border-bottom: none;
  }

  .crop-info {
    display: flex;
    align-items: center;
    gap: 1rem;

    .crop-icon {
      width: 48px;
      height: 48px;
      background: #c6f6d5;
      color: #2f855a;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .details {
      h4 { margin: 0; color: #2d3748; font-size: 1rem; font-weight: 600; }
      p { margin: 0; color: #718096; font-size: 0.85rem; }
    }
  }

  .crop-stats {
    display: flex;
    gap: 1.5rem;
    
    .stat {
      text-align: right;
      .val { font-weight: 600; color: #2d3748; }
      .lbl { font-size: 0.75rem; color: #a0aec0; }
    }
  }

  .status-badge {
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    background: #e6fffa;
    color: #2c7a7b;

    &.warning { background: #fffaf0; color: #c05621; }
    &.danger { background: #fff5f5; color: #c53030; }
  }
`;

const AlertItem = styled.div`
  background: #fffaf0;
  border-left: 4px solid #ed8936;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: start;
  gap: 0.75rem;

  .icon { color: #ed8936; margin-top: 0.2rem; }
  
  .content {
    h5 { margin: 0; color: #744210; font-weight: 600; }
    p { margin: 0.25rem 0 0; color: #975a16; font-size: 0.85rem; }
  }
`;

const QuickActionButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #3182ce;
  color: white;
  border: none;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 1rem;
  margin-top: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(49, 130, 206, 0.3);

  &:hover {
    background: #2b6cb0;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(49, 130, 206, 0.4);
  }
`;

const Dashboard: React.FC = () => {
  // TODO: Replace with real data from Supabase
  return (
    <Container>
      <WelcomeHeader>
        <h1>Panel de Control</h1>
        <p>Bienvenido de nuevo. Aquí está el estado actual de tus cultivos.</p>
      </WelcomeHeader>

      <KPISection>
        <KPICard active>
          <div className="icon-wrapper"><FaSeedling /></div>
          <div className="label">Cultivos Activos</div>
          <div className="value">4 <span className="unit">variedades</span></div>
          <div className="subtext"><FaChartLine /> +1 esta semana</div>
        </KPICard>

        <KPICard>
          <div className="icon-wrapper"><FaThermometerHalf /></div>
          <div className="label">Temperatura (Prom)</div>
          <div className="value">24.5 <span className="unit">°C</span></div>
          <div className="subtext" style={{ color: '#38a169' }}>En rango óptimo</div>
        </KPICard>

        <KPICard>
          <div className="icon-wrapper"><FaTint /></div>
          <div className="label">Humedad (Prom)</div>
          <div className="value">58 <span className="unit">%</span></div>
          <div className="subtext">Fase Vegetativa</div>
        </KPICard>

        <KPICard alert>
          <div className="icon-wrapper"><FaExclamationTriangle /></div>
          <div className="label">Alertas</div>
          <div className="value">2 <span className="unit">pendientes</span></div>
          <div className="subtext">Requiere atención</div>
        </KPICard>
      </KPISection>

      <ContentGrid>
        <div>
          <SectionTitle><FaLeaf /> Cultivos Destacados</SectionTitle>
          <MainCard>
            {[
              { name: 'Gorilla Glue #4', stage: 'Floración (Sem 3)', health: 'Excelente', temp: '25°C', hum: '45%' },
              { name: 'Lemon Haze', stage: 'Vegetativo (Día 40)', health: 'Bueno', temp: '24°C', hum: '60%' },
              { name: 'OG Kush', stage: 'Plántula', health: 'Normal', temp: '26°C', hum: '70%' },
            ].map((crop, i) => (
              <CropRow key={i}>
                <div className="crop-info">
                  <div className="crop-icon"><FaSeedling /></div>
                  <div className="details">
                    <h4>{crop.name}</h4>
                    <p>{crop.stage}</p>
                  </div>
                </div>
                <div className="crop-stats">
                  <div className="stat">
                    <div className="val">{crop.temp}</div>
                    <div className="lbl">Temp</div>
                  </div>
                  <div className="stat">
                    <div className="val">{crop.hum}</div>
                    <div className="lbl">Hum</div>
                  </div>
                </div>
                <div className="status-badge">{crop.health}</div>
              </CropRow>
            ))}
          </MainCard>
        </div>

        <div>
           <SectionTitle><FaExclamationTriangle /> Alertas & Tareas</SectionTitle>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
             <AlertItem>
               <div className="icon"><FaExclamationTriangle /></div>
               <div className="content">
                 <h5>Nivel de Agua Bajo</h5>
                 <p>Tanque principal al 15%. Rellenar antes de las 18:00.</p>
               </div>
             </AlertItem>

             <AlertItem style={{  background: '#ebf8ff', borderLeftColor: '#4299e1' }}>
               <div className="icon" style={{ color: '#4299e1' }}><FaCalendarCheck /></div>
               <div className="content">
                 <h5 style={{ color: '#2b6cb0' }}>Poda Apical Programada</h5>
                 <p style={{ color: '#2c5282' }}>Hoy para: Lemon Haze</p>
               </div>
             </AlertItem>

             <QuickActionButton>
               <FaPlus /> Nuevo Cultivo
             </QuickActionButton>
             <QuickActionButton style={{ background: '#38a169' }}>
               <FaTint /> Registrar Riego
             </QuickActionButton>
           </div>
        </div>
      </ContentGrid>
    </Container>
  );
};

export default Dashboard;
