import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaTools, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaWrench,
  FaUsers,
  FaCalendarAlt,
  FaComments
} from 'react-icons/fa';
import { 
  TechnicalAlert,
  LiveEvent,
  TechnicalStats
} from '../types';
import simpleConnectionService from '../services/simpleConnectionService';
import { 
  mockLiveEvents, 
  mockStats, 
  mockAlerts, 
  mockCheckIns, 
  mockReports,
  simulateRealTimeUpdates
} from '../services/mockDataService';

const DashboardContainer = styled.div`
  padding: 2rem;
  padding-top: calc(2rem + 70px);
  max-width: 1400px;
  margin: 0 auto;
  background: #f8fafc;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #64748b;
    font-size: 1.125rem;
  }
`;

const ConnectionStatus = styled.div<{ isConnected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.isConnected ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.isConnected ? '#16a34a' : '#dc2626'};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    animation: ${props => props.isConnected ? 'pulse 2s infinite' : 'none'};
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ variant?: 'success' | 'warning' | 'error' | 'info' }>`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
  }
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
      background: ${props => {
        switch (props.variant) {
          case 'success': return '#10b981';
          case 'warning': return '#f59e0b';
          case 'error': return '#ef4444';
          case 'info': return '#3b82f6';
          default: return '#3b82f6';
        }
      }};
    }
    
    .stat-trend {
      font-size: 0.875rem;
      color: ${props => {
        switch (props.variant) {
          case 'success': return '#10b981';
          case 'warning': return '#f59e0b';
          case 'error': return '#ef4444';
          default: return '#3b82f6';
        }
      }};
      font-weight: 600;
    }
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    color: #64748b;
    font-size: 0.875rem;
    font-weight: 500;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
  }
  
  .section-actions {
    display: flex;
    gap: 0.5rem;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  
  background: ${props => {
    switch (props.variant) {
      case 'secondary': return '#f1f5f9';
      case 'danger': return '#fee2e2';
      default: return '#3b82f6';
    }
  }};
  
  color: ${props => {
    switch (props.variant) {
      case 'secondary': return '#475569';
      case 'danger': return '#dc2626';
      default: return 'white';
    }
  }};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const LiveEventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const EventCard = styled.div<{ status: 'upcoming' | 'active' | 'completed' }>`
  background: ${props => {
    switch (props.status) {
      case 'active': return '#f0fdf4';
      case 'upcoming': return '#f0f9ff';
      case 'completed': return '#f8fafc';
      default: return '#f8fafc';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'active': return '#bbf7d0';
      case 'upcoming': return '#bfdbfe';
      case 'completed': return '#e2e8f0';
      default: return '#e2e8f0';
    }
  }};
  border-radius: 0.75rem;
  padding: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
    
    .event-info {
      flex: 1;
      
      .event-name {
        font-size: 1rem;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 0.25rem;
      }
      
      .event-dj {
        color: #64748b;
        font-size: 0.875rem;
      }
    }
    
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      background: ${props => {
        switch (props.status) {
          case 'active': return '#dcfce7';
          case 'upcoming': return '#dbeafe';
          case 'completed': return '#f1f5f9';
          default: return '#f1f5f9';
        }
      }};
      color: ${props => {
        switch (props.status) {
          case 'active': return '#16a34a';
          case 'upcoming': return '#2563eb';
          case 'completed': return '#6b7280';
          default: return '#6b7280';
        }
      }};
    }
  }
  
  .equipment-status {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    
    .status-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      color: #64748b;
    }
  }
  
  .event-actions {
    display: flex;
    gap: 0.5rem;
    
    button {
      padding: 0.25rem 0.5rem;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &.view {
        background: #dbeafe;
        color: #2563eb;
        
        &:hover {
          background: #bfdbfe;
        }
      }
      
      &.chat {
        background: #dcfce7;
        color: #16a34a;
        
        &:hover {
          background: #bbf7d0;
        }
      }
    }
  }
`;

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AlertItem = styled.div<{ type: 'error' | 'warning' | 'info' }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${props => {
    switch (props.type) {
      case 'error': return '#fef2f2';
      case 'warning': return '#fffbeb';
      case 'info': return '#f0f9ff';
      default: return '#f8fafc';
    }
  }};
  border: 1px solid ${props => {
    switch (props.type) {
      case 'error': return '#fecaca';
      case 'warning': return '#fed7aa';
      case 'info': return '#bfdbfe';
      default: return '#e2e8f0';
    }
  }};
  border-radius: 0.5rem;
  
  .alert-icon {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: white;
    background: ${props => {
      switch (props.type) {
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        case 'info': return '#3b82f6';
        default: return '#6b7280';
      }
    }};
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
  
  .alert-content {
    flex: 1;
    
    .alert-title {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }
    
    .alert-description {
      font-size: 0.75rem;
      color: #64748b;
      line-height: 1.4;
    }
  }
  
  .alert-time {
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 500;
    flex-shrink: 0;
  }
`;

const TechnicalDashboard: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState<TechnicalStats>(mockStats);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>(mockLiveEvents);
  const [alerts, setAlerts] = useState<TechnicalAlert[]>(mockAlerts);

  useEffect(() => {
    // Configurar listeners para eventos del sistema de DJs
    // Comentado temporalmente para pruebas independientes
    /*
    djConnectionService.onCheckIn((checkIn) => {
      setCheckIns(prev => [checkIn, ...prev]);
    });

    djConnectionService.onReport((report) => {
      setReports(prev => [report, ...prev]);
    });
    */

    /*
    simpleConnectionService.onEventStatusChange((event: LiveEvent) => {
      setLiveEvents(prev => 
        prev.map(e => e.id === event.id ? event : e)
      );
    });

    simpleConnectionService.onStatsUpdate((newStats: TechnicalStats) => {
      setStats(newStats);
    });
    */

    // Verificar conexión
    const checkConnection = () => {
      setIsConnected(simpleConnectionService.isConnectedToDJSystem());
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);

    // Cargar datos iniciales - usando datos de prueba
    // loadInitialData();

    // Simular actualizaciones en tiempo real
    const cleanupSimulation = simulateRealTimeUpdates((data) => {
      if (data.type === 'new-alert') {
        setAlerts(prev => [data.data, ...prev]);
      }
    });

    return () => {
      clearInterval(interval);
      cleanupSimulation();
    };


  }, []);

  const loadInitialData = async () => {
    try {
      const [events, statsData, checkInsData, reportsData] = await Promise.all([
        simpleConnectionService.getActiveEvents(),
        simpleConnectionService.getTechnicalStats(),
        simpleConnectionService.getPendingCheckIns(),
        simpleConnectionService.getOpenReports()
      ]);

      setLiveEvents(events);
      setStats(statsData);
      // setCheckIns(checkInsData);
      // setReports(reportsData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const handleViewEvent = (eventId: string) => {
    // Navegar a vista detallada del evento
    console.log('View event:', eventId);
  };

  const handleOpenChat = (eventId: string) => {
    // Abrir chat para el evento
    console.log('Open chat for event:', eventId);
  };

  return (
    <DashboardContainer>
      <Header>
        <h1>Dashboard Técnico - Janos</h1>
        <p>Sistema de gestión técnica conectado con DJs</p>
      </Header>

      <ConnectionStatus isConnected={isConnected}>
        <div className="status-dot"></div>
        {isConnected ? 'Conectado al Sistema de DJs' : 'Desconectado del Sistema de DJs'}
      </ConnectionStatus>

      <StatsGrid>
        <StatCard variant="success">
          <div className="stat-header">
            <div className="stat-icon">
              <FaTools />
            </div>
            <div className="stat-trend">+2.5%</div>
          </div>
          <div className="stat-value">{stats.operationalEquipment}/{stats.totalEquipment}</div>
          <div className="stat-label">Equipos Operativos</div>
        </StatCard>

        <StatCard variant="warning">
          <div className="stat-header">
            <div className="stat-icon">
              <FaWrench />
            </div>
            <div className="stat-trend">-1</div>
          </div>
          <div className="stat-value">{stats.maintenanceNeeded}</div>
          <div className="stat-label">En Mantenimiento</div>
        </StatCard>

        <StatCard variant="error">
          <div className="stat-header">
            <div className="stat-icon">
              <FaExclamationTriangle />
            </div>
            <div className="stat-trend">+1</div>
          </div>
          <div className="stat-value">{stats.criticalAlerts}</div>
          <div className="stat-label">Alertas Críticas</div>
        </StatCard>

        <StatCard variant="info">
          <div className="stat-header">
            <div className="stat-icon">
              <FaCalendarAlt />
            </div>
            <div className="stat-trend">75%</div>
          </div>
          <div className="stat-value">{stats.activeEvents}</div>
          <div className="stat-label">Eventos Activos</div>
        </StatCard>

        <StatCard variant="info">
          <div className="stat-header">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-trend">+2</div>
          </div>
          <div className="stat-value">{stats.onlineDjs}</div>
          <div className="stat-label">DJs Conectados</div>
        </StatCard>

        <StatCard variant="warning">
          <div className="stat-header">
            <div className="stat-icon">
              <FaComments />
            </div>
            <div className="stat-trend">+3</div>
          </div>
          <div className="stat-value">{stats.pendingReports}</div>
          <div className="stat-label">Reportes Pendientes</div>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <MainSection>
          <Section>
            <SectionHeader>
              <h3>Eventos en Vivo</h3>
              <div className="section-actions">
                <Button variant="secondary">Ver Todos</Button>
                <Button>Actualizar</Button>
              </div>
            </SectionHeader>
            <LiveEventsGrid>
              {liveEvents.map((event) => (
                <EventCard key={event.id} status={event.status}>
                  <div className="event-header">
                    <div className="event-info">
                      <div className="event-name">{event.name}</div>
                      <div className="event-dj">DJ: {event.djName}</div>
                    </div>
                    <div className="status-badge">
                      {event.status === 'active' && 'Activo'}
                      {event.status === 'upcoming' && 'Próximo'}
                      {event.status === 'completed' && 'Completado'}
                    </div>
                  </div>
                  
                  <div className="equipment-status">
                    <div className="status-item">
                      <FaCheckCircle style={{ color: '#10b981' }} />
                      {event.equipmentStatus.operational} Operativo
                    </div>
                    <div className="status-item">
                      <FaExclamationTriangle style={{ color: '#f59e0b' }} />
                      {event.equipmentStatus.issues} Problemas
                    </div>
                  </div>
                  
                  <div className="event-actions">
                    <button className="view" onClick={() => handleViewEvent(event.id)}>
                      Ver Detalles
                    </button>
                    <button className="chat" onClick={() => handleOpenChat(event.id)}>
                      Chat
                    </button>
                  </div>
                </EventCard>
              ))}
            </LiveEventsGrid>
          </Section>
        </MainSection>

        <Section>
          <SectionHeader>
            <h3>Alertas del Sistema</h3>
            <div className="section-actions">
              <Button variant="secondary">Limpiar</Button>
            </div>
          </SectionHeader>
          <AlertList>
            {alerts.map((alert) => (
              <AlertItem key={alert.id} type={alert.type}>
                <div className="alert-icon">
                  {alert.type === 'error' && <FaExclamationTriangle />}
                  {alert.type === 'warning' && <FaExclamationTriangle />}
                  {alert.type === 'info' && <FaCheckCircle />}
                </div>
                <div className="alert-content">
                  <div className="alert-title">{alert.title}</div>
                  <div className="alert-description">{alert.description}</div>
                </div>
                <div className="alert-time">{alert.time}</div>
              </AlertItem>
            ))}
          </AlertList>
        </Section>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default TechnicalDashboard;
