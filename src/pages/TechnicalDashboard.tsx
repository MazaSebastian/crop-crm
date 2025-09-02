import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTechnical } from '../context/TechnicalContext';
import { 
  FaTools, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaClock, 
  FaWrench,
  FaChartLine,
  FaThermometerHalf,
  FaBatteryThreeQuarters,
  FaSignal,
  FaLightbulb,
  FaVolumeUp,
  FaDesktop,
  FaServer,
  FaNetworkWired,
  FaWifi,
  FaBluetooth,
  FaUsb,
  FaHdd,
  FaMemory,
  FaMicrochip
} from 'react-icons/fa';

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
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

const EquipmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const EquipmentCard = styled.div<{ status: 'online' | 'offline' | 'warning' | 'maintenance' }>`
  background: ${props => {
    switch (props.status) {
      case 'online': return '#f0fdf4';
      case 'offline': return '#fef2f2';
      case 'warning': return '#fffbeb';
      case 'maintenance': return '#f0f9ff';
      default: return '#f8fafc';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'online': return '#bbf7d0';
      case 'offline': return '#fecaca';
      case 'warning': return '#fed7aa';
      case 'maintenance': return '#bfdbfe';
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
  
  .equipment-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    
    .equipment-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      color: white;
      background: ${props => {
        switch (props.status) {
          case 'online': return '#10b981';
          case 'offline': return '#ef4444';
          case 'warning': return '#f59e0b';
          case 'maintenance': return '#3b82f6';
          default: return '#6b7280';
        }
      }};
    }
    
    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${props => {
        switch (props.status) {
          case 'online': return '#10b981';
          case 'offline': return '#ef4444';
          case 'warning': return '#f59e0b';
          case 'maintenance': return '#3b82f6';
          default: return '#6b7280';
        }
      }};
    }
  }
  
  .equipment-name {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.25rem;
    font-size: 0.875rem;
  }
  
  .equipment-info {
    font-size: 0.75rem;
    color: #64748b;
  }
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TaskItem = styled.div<{ priority: 'high' | 'medium' | 'low' }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border-left: 4px solid ${props => {
    switch (props.priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  }};
  
  .task-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    color: white;
    background: ${props => {
      switch (props.priority) {
        case 'high': return '#ef4444';
        case 'medium': return '#f59e0b';
        case 'low': return '#10b981';
        default: return '#6b7280';
      }
    }};
  }
  
  .task-content {
    flex: 1;
    
    .task-title {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }
    
    .task-description {
      font-size: 0.75rem;
      color: #64748b;
    }
  }
  
  .task-time {
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 500;
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
  const { state } = useTechnical();
  const { equipment, tasks, alerts, stats } = state;

  // Mapear el estado del equipo a iconos
  const getEquipmentIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'audio': return FaVolumeUp;
      case 'player': return FaDesktop;
      case 'server': return FaServer;
      case 'network': return FaNetworkWired;
      case 'computer': return FaDesktop;
      case 'storage': return FaHdd;
      default: return FaTools;
    }
  };

  const getEquipmentStatus = (status: string) => {
    switch (status) {
      case 'operational': return 'online';
      case 'maintenance': return 'maintenance';
      case 'repair': return 'offline';
      case 'retired': return 'offline';
      default: return 'online';
    }
  };

  const getStatusCount = (status: string) => {
    return equipment.filter(eq => eq.status === status).length;
  };

  const getPriorityCount = (priority: string) => {
    return tasks.filter(task => task.priority === priority).length;
  };

  return (
    <DashboardContainer>
      <Header>
        <h1>Dashboard Técnico</h1>
        <p>Monitoreo y gestión del equipamiento técnico</p>
      </Header>

      <StatsGrid>
        <StatCard variant="success">
          <div className="stat-header">
            <div className="stat-icon">
              <FaTools />
            </div>
            <div className="stat-trend">+2.5%</div>
          </div>
          <div className="stat-value">{stats.onlineEquipment}/{stats.totalEquipment}</div>
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
              <FaClock />
            </div>
            <div className="stat-trend">75%</div>
          </div>
          <div className="stat-value">{getPriorityCount('high')}</div>
          <div className="stat-label">Tareas Urgentes</div>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <MainSection>
          <Section>
            <SectionHeader>
              <h3>Estado del Equipamiento</h3>
              <div className="section-actions">
                <Button variant="secondary">Filtrar</Button>
                <Button>Actualizar</Button>
              </div>
            </SectionHeader>
            <EquipmentGrid>
              {equipment.map((eq) => {
                const IconComponent = getEquipmentIcon(eq.category);
                const status = getEquipmentStatus(eq.status);
                return (
                  <EquipmentCard key={eq.id} status={status}>
                    <div className="equipment-header">
                      <div className="equipment-icon">
                        <IconComponent />
                      </div>
                      <div className="status-indicator"></div>
                    </div>
                    <div className="equipment-name">{eq.name}</div>
                    <div className="equipment-info">{eq.category}</div>
                  </EquipmentCard>
                );
              })}
            </EquipmentGrid>
          </Section>

          <Section>
            <SectionHeader>
              <h3>Tareas Pendientes</h3>
              <div className="section-actions">
                <Button variant="secondary">Ver Todas</Button>
                <Button>Nueva Tarea</Button>
              </div>
            </SectionHeader>
            <TaskList>
              {tasks.slice(0, 5).map((task) => (
                <TaskItem key={task.id} priority={task.priority}>
                  <div className="task-icon">
                    <FaWrench />
                  </div>
                  <div className="task-content">
                    <div className="task-title">{task.title}</div>
                    <div className="task-description">{task.description}</div>
                  </div>
                  <div className="task-time">{task.time}</div>
                </TaskItem>
              ))}
            </TaskList>
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
