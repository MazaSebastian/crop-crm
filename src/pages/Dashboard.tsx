import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaCalendarAlt, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaPlay,
  FaBell,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaStar,
  FaUserFriends,
  FaHeadphones,
  FaBullhorn,
  FaGraduationCap,
  FaInfoCircle,
  FaExclamationCircle,
  FaTools
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import TechnicalReportModal from '../components/TechnicalReportModal';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1.5rem;
  padding: 1.5rem;
  color: white;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
  
  .welcome-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    
    h1 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    
    p {
      opacity: 0.9;
      font-size: 0.75rem;
    }
  }
  
  .welcome-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(75px, 1fr));
    gap: 0.5rem;
    margin-top: 0.75rem;
    
    .stat-item {
      text-align: center;
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 0.25rem;
      backdrop-filter: blur(10px);
      
      .stat-number {
        font-size: 0.75rem;
        font-weight: 700;
        margin-bottom: 0.125rem;
      }
      
      .stat-label {
        font-size: 0.625rem;
        opacity: 0.8;
      }
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatCard = styled.div<{ color?: string; trend?: string }>`
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color || 'linear-gradient(90deg, #3b82f6, #8b5cf6)'};
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.25rem;
    
    .stat-icon {
      width: 24px;
      height: 24px;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.625rem;
      color: white;
      background: ${props => props.color || '#3b82f6'};
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .stat-trend {
      display: flex;
      align-items: center;
      gap: 0.125rem;
      font-size: 0.5rem;
      font-weight: 600;
      padding: 0.125rem 0.25rem;
      border-radius: 0.375rem;
      background: ${props => props.trend === 'positive' ? '#d1fae5' : '#fee2e2'};
      color: ${props => props.trend === 'positive' ? '#065f46' : '#991b1b'};
    }
  }
  
  .stat-value {
    font-size: 1rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 0.125rem;
    line-height: 1;
  }
  
  .stat-label {
    color: #64748b;
    font-size: 0.5rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
  
  .stat-chart {
    height: 12px;
    background: #f8fafc;
    border-radius: 0.125rem;
    position: relative;
    overflow: hidden;
    
    .chart-bar {
      height: 100%;
      background: ${props => props.color || '#3b82f6'};
      border-radius: 0.125rem;
      transition: width 0.3s ease-in-out;
    }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
    
    h3 {
      font-size: 1rem;
      font-weight: 700;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .view-all {
      color: #3b82f6;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0.375rem 0.75rem;
      border-radius: 0.375rem;
      transition: all 0.2s ease-in-out;
      
      &:hover {
        background: #f0f9ff;
        text-decoration: none;
      }
    }
  }
`;

const AnnouncementList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AnnouncementItem = styled.div<{ type: string }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  
  &:hover {
    background: #f1f5f9;
    transform: translateX(2px);
  }
  
  .announcement-icon {
    width: 36px;
    height: 36px;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    color: white;
    background: ${props => {
      switch (props.type) {
        case 'important': return '#ef4444';
        case 'update': return '#3b82f6';
        case 'training': return '#10b981';
        case 'info': return '#6b7280';
        default: return '#f59e0b';
      }
    }};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .announcement-details {
    flex: 1;
    
    .announcement-title {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.125rem;
      font-size: 0.875rem;
    }
    
    .announcement-description {
      font-size: 0.75rem;
      color: #64748b;
      line-height: 1.4;
      margin-bottom: 0.25rem;
    }
    
    .announcement-meta {
      font-size: 0.625rem;
      color: #9ca3af;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
  
  .announcement-type {
    font-size: 0.625rem;
    font-weight: 600;
    padding: 0.125rem 0.5rem;
    border-radius: 0.75rem;
    text-transform: uppercase;
    background: ${props => {
      switch (props.type) {
        case 'important': return '#fee2e2';
        case 'update': return '#dbeafe';
        case 'training': return '#d1fae5';
        case 'info': return '#f3f4f6';
        default: return '#fef3c7';
      }
    }};
    color: ${props => {
      switch (props.type) {
        case 'important': return '#991b1b';
        case 'update': return '#1e40af';
        case 'training': return '#065f46';
        case 'info': return '#374151';
        default: return '#92400e';
      }
    }};
  }
`;

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AlertItem = styled.div<{ type: string }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: ${props => props.type === 'warning' ? '#fef3c7' : '#dbeafe'};
  border: 1px solid ${props => props.type === 'warning' ? '#f59e0b' : '#3b82f6'};
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: translateX(2px);
  }
  
  .alert-icon {
    color: ${props => props.type === 'warning' ? '#f59e0b' : '#3b82f6'};
    font-size: 1rem;
    margin-top: 0.125rem;
  }
  
  .alert-content {
    flex: 1;
    
    .alert-title {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.75rem;
      margin-bottom: 0.125rem;
    }
    
    .alert-description {
      font-size: 0.625rem;
      color: #64748b;
      line-height: 1.4;
    }
  }
`;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTechnicalReportModalOpen, setIsTechnicalReportModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Datos de eventos para calcular estadísticas
  const allEvents = [
    {
      id: '1',
      title: 'Boda María & Juan',
      date: '2024-08-15',
      time: '20:00',
      client: 'María González',
      guests: 150,
      type: 'wedding',
      status: 'confirmed',
      coordinated: true,
      equipment: [],
      notes: 'Boda elegante con música en vivo'
    },
    {
      id: '2',
      title: 'Cumpleaños 15 Años - Ana',
      date: '2024-08-18',
      time: '19:00',
      client: 'Ana Rodríguez',
      guests: 80,
      type: 'birthday',
      status: 'pending',
      coordinated: false,
      equipment: [],
      notes: 'Tema: Princesas Disney'
    },
    {
      id: '3',
      title: 'Evento Corporativo TechCorp',
      date: '2024-08-20',
      time: '18:00',
      client: 'TechCorp S.A.',
      guests: 200,
      type: 'corporate',
      status: 'confirmed',
      coordinated: true,
      equipment: [],
      notes: 'Presentación de nuevos productos'
    },
    {
      id: '4',
      title: 'Graduación Universidad',
      date: '2024-08-22',
      time: '21:00',
      client: 'Universidad Nacional',
      guests: 300,
      type: 'other',
      status: 'in-progress',
      coordinated: false,
      equipment: [],
      notes: 'Ceremonia de graduación'
    },
    {
      id: '5',
      title: 'Boda Carlos & Laura',
      date: '2024-08-25',
      time: '19:30',
      client: 'Carlos Martínez',
      guests: 120,
      type: 'wedding',
      status: 'confirmed',
      coordinated: true,
      equipment: [],
      notes: 'Boda tradicional'
    },
    {
      id: '6',
      title: 'Cumpleaños Empresarial',
      date: '2024-08-28',
      time: '20:00',
      client: 'Empresa ABC',
      guests: 180,
      type: 'corporate',
      status: 'pending',
      coordinated: false,
      equipment: [],
      notes: 'Celebración 10 años'
    }
  ];

  // Calcular estadísticas basadas en coordinación
  const coordinatedEvents = allEvents.filter(event => event.coordinated).length;
  const uncoordinatedEvents = allEvents.filter(event => !event.coordinated).length;

  const stats = [
    {
      title: 'Eventos Coordinados',
      value: coordinatedEvents.toString(),
      icon: <FaCheckCircle />,
      color: '#10b981',
      trend: 'positive',
      trendValue: `${Math.round((coordinatedEvents / allEvents.length) * 100)}%`,
      chartData: [coordinatedEvents]
    },
    {
      title: 'Eventos Sin Coordinar',
      value: uncoordinatedEvents.toString(),
      icon: <FaExclamationTriangle />,
      color: '#ef4444',
      trend: 'negative',
      trendValue: `${Math.round((uncoordinatedEvents / allEvents.length) * 100)}%`,
      chartData: [uncoordinatedEvents]
    }
  ];

  // Datos de anuncios de gerencia
  const announcements = [
    {
      id: '1',
      title: 'Nueva Capacitación: Protocolos de Seguridad',
      description: 'Todos los empleados deben completar la capacitación obligatoria sobre nuevos protocolos de seguridad antes del 30 de agosto.',
      type: 'training',
      author: 'Gerencia General',
      date: '2024-08-13',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Actualización del Sistema de Reservas',
      description: 'El sistema de reservas será actualizado este fin de semana. Habrá interrupciones temporales el sábado de 2:00 AM a 6:00 AM.',
      type: 'update',
      author: 'Departamento IT',
      date: '2024-08-12',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Cambios en Horarios de Trabajo',
      description: 'A partir del próximo mes, los horarios de trabajo se ajustarán. Revisen sus nuevos horarios en el portal de empleados.',
      type: 'important',
      author: 'Recursos Humanos',
      date: '2024-08-11',
      priority: 'high'
    },
    {
      id: '4',
      title: 'Nuevas Políticas de Limpieza',
      description: 'Se han implementado nuevas políticas de limpieza y desinfección. Todos deben familiarizarse con los nuevos procedimientos.',
      type: 'info',
      author: 'Mantenimiento',
      date: '2024-08-10',
      priority: 'medium'
    }
  ];

  const alerts = [
    {
      id: '1',
      title: 'Eventos Sin Coordinar',
      description: `${uncoordinatedEvents} eventos requieren coordinación inmediata`,
      type: 'warning',
      time: 'Ahora'
    },
    {
      id: '2',
      title: 'Coordinación Completada',
      description: 'Boda María & Juan y Evento TechCorp ya están coordinados',
      type: 'info',
      time: '1 hora'
    },
    {
      id: '3',
      title: 'Recordatorio de Coordinación',
      description: 'Cumpleaños 15 Años necesita coordinación antes del 18 de agosto',
      type: 'warning',
      time: '2 horas'
    }
  ];

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'important': return <FaExclamationCircle />;
      case 'update': return <FaInfoCircle />;
      case 'training': return <FaGraduationCap />;
      case 'info': return <FaInfoCircle />;
      default: return <FaBullhorn />;
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <DashboardContainer>
      <WelcomeSection>
        <div className="welcome-header">
          <div>
            <h1>{getGreeting()}, {user?.name}!</h1>
            <p>Aquí tienes un resumen completo de las actividades del día</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
              {currentTime.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              {currentTime.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
        
        <div className="welcome-stats">
          <div className="stat-item">
            <div className="stat-number">{allEvents.length}</div>
            <div className="stat-label">Total Eventos</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{coordinatedEvents}</div>
            <div className="stat-label">Coordinados</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{uncoordinatedEvents}</div>
            <div className="stat-label">Sin Coordinar</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{Math.round((coordinatedEvents / allEvents.length) * 100)}%</div>
            <div className="stat-label">Tasa de Coordinación</div>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '1rem',
          gap: '1rem'
        }}>
          <button
            onClick={() => setIsTechnicalReportModalOpen(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <FaTools />
            Reportar Problema Técnico
          </button>
        </div>
      </WelcomeSection>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index} color={stat.color} trend={stat.trend}>
            <div className="stat-header">
              <div className="stat-icon">
                {stat.icon}
              </div>
              <div className="stat-trend">
                {stat.trend === 'positive' ? <FaArrowUp /> : <FaArrowDown />}
                {stat.trendValue}
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.title}</div>
            <div className="stat-chart">
              <div 
                className="chart-bar" 
                style={{ 
                  width: `${Math.max(...stat.chartData)}%`,
                  background: stat.color 
                }}
              />
            </div>
          </StatCard>
        ))}
      </StatsGrid>

      <ContentGrid>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Section>
            <div className="section-header">
              <h3>
                <FaBullhorn />
                Anuncios
              </h3>
              <span className="view-all">Ver todos</span>
            </div>
            <AnnouncementList>
              {announcements.map((announcement) => (
                <AnnouncementItem key={announcement.id} type={announcement.type}>
                  <div className="announcement-icon">
                    {getAnnouncementIcon(announcement.type)}
                  </div>
                  <div className="announcement-details">
                    <div className="announcement-title">{announcement.title}</div>
                    <div className="announcement-description">
                      {announcement.description}
                    </div>
                    <div className="announcement-meta">
                      <span>{announcement.author}</span>
                      <span>•</span>
                      <span>{new Date(announcement.date).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}</span>
                    </div>
                  </div>
                  <div className="announcement-type">
                    {announcement.type === 'important' && 'Importante'}
                    {announcement.type === 'update' && 'Actualización'}
                    {announcement.type === 'training' && 'Capacitación'}
                    {announcement.type === 'info' && 'Información'}
                  </div>
                </AnnouncementItem>
              ))}
            </AnnouncementList>
          </Section>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Section>
            <div className="section-header">
              <h3>
                <FaBell />
                Alertas y Notificaciones
              </h3>
            </div>
            <AlertList>
              {alerts.map((alert) => (
                <AlertItem key={alert.id} type={alert.type}>
                  <div className="alert-icon">
                    {alert.type === 'warning' ? <FaExclamationTriangle /> : <FaCheckCircle />}
                  </div>
                  <div className="alert-content">
                    <div className="alert-title">{alert.title}</div>
                    <div className="alert-description">
                      {alert.description}
                      <span style={{ marginLeft: '0.5rem', fontWeight: '500' }}>
                        • Hace {alert.time}
                      </span>
                    </div>
                  </div>
                </AlertItem>
              ))}
            </AlertList>
          </Section>
        </div>
      </ContentGrid>
      
      <TechnicalReportModal
        isOpen={isTechnicalReportModalOpen}
        onClose={() => setIsTechnicalReportModalOpen(false)}
        djId={user?.id}
        djName={user?.name}
        eventId="current-event"
        eventName="Evento Actual"
      />
    </DashboardContainer>
  );
};

export default Dashboard;

