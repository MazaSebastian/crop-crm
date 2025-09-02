import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaFilter, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaSearch,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaUser,
  FaTools,
  FaVolumeUp,
  FaLightbulb,
  FaCog,
  FaDownload,
  FaPrint,
  FaEnvelope,
  FaClipboardList
} from 'react-icons/fa';
import { DJReport } from '../types';
import { mockReports } from '../services/mockDataService';
import simpleConnectionService from '../services/simpleConnectionService';

const ReportsContainer = styled.div`
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

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ variant?: 'success' | 'warning' | 'error' | 'info' }>`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  text-align: center;
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
    margin: 0 auto 1rem;
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

const FiltersSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
`;

const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
  }
  
  .filter-icon {
    color: #3b82f6;
  }
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }
  
  select, input {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    background: white;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
`;

const FilterActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  
  .search-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    max-width: 400px;
    
    input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      
      &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    }
    
    .search-icon {
      color: #6b7280;
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  
  background: ${props => {
    switch (props.variant) {
      case 'secondary': return '#f1f5f9';
      case 'success': return '#dcfce7';
      case 'danger': return '#fee2e2';
      default: return '#3b82f6';
    }
  }};
  
  color: ${props => {
    switch (props.variant) {
      case 'secondary': return '#475569';
      case 'success': return '#16a34a';
      case 'danger': return '#dc2626';
      default: return 'white';
    }
  }};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ReportsTable = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 120px;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const ReportRow = styled.div<{ priority: 'low' | 'medium' | 'high' | 'critical' }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 120px;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const ReportCell = styled.div<{ variant?: 'priority' | 'status' | 'actions'; priority?: 'low' | 'medium' | 'high' | 'critical'; status?: 'open' | 'in-progress' | 'resolved' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.variant === 'priority' && `
    .priority-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      background: ${props.priority === 'critical' ? '#fee2e2' : 
                   props.priority === 'high' ? '#fef3c7' : 
                   props.priority === 'medium' ? '#dbeafe' : '#dcfce7'};
      color: ${props.priority === 'critical' ? '#dc2626' : 
              props.priority === 'high' ? '#d97706' : 
              props.priority === 'medium' ? '#2563eb' : '#16a34a'};
    }
  `}
  
  ${props => props.variant === 'status' && `
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      background: ${props.status === 'resolved' ? '#dcfce7' : 
                   props.status === 'in-progress' ? '#fef3c7' : '#fee2e2'};
      color: ${props.status === 'resolved' ? '#16a34a' : 
              props.status === 'in-progress' ? '#d97706' : '#dc2626'};
    }
  `}
  
  ${props => props.variant === 'actions' && `
    justify-content: flex-end;
    
    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
    
    button {
      padding: 0.5rem;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
      
      &.view {
        background: #dbeafe;
        color: #2563eb;
        
        &:hover {
          background: #bfdbfe;
        }
      }
      
      &.resolve {
        background: #dcfce7;
        color: #16a34a;
        
        &:hover {
          background: #bbf7d0;
        }
      }
    }
  `}
  
  @media (max-width: 1024px) {
    justify-content: flex-start;
    
    &:before {
      content: attr(data-label);
      font-weight: 600;
      color: #374151;
      min-width: 100px;
    }
  }
`;

const IssueTypeIcon = styled.div<{ type: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
  background: ${props => {
    switch (props.type) {
      case 'technical': return '#3b82f6';
      case 'equipment': return '#ef4444';
      case 'sound': return '#8b5cf6';
      case 'other': return '#6b7280';
      default: return '#3b82f6';
    }
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #374151;
  }
  
  p {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const ReportsSection: React.FC = () => {
  const [reports, setReports] = useState<DJReport[]>(mockReports);
  const [filteredReports, setFilteredReports] = useState<DJReport[]>(mockReports);
  const [selectedSalon, setSelectedSalon] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Salones disponibles (simulados)
  const salones = [
    'Sala Principal',
    'Sala VIP',
    'Sala Exterior'
  ];

  // Aplicar filtros
  useEffect(() => {
    // Configurar listener para nuevos reportes del sistema de DJs
    simpleConnectionService.onReport((newReport: DJReport) => {
      console.log('📥 Nuevo reporte recibido:', newReport);
      setReports(prev => [newReport, ...prev]);
    });

    let filtered = reports;

    // Filtro por salón
    if (selectedSalon) {
      filtered = filtered.filter(report => 
        report.eventName.includes(selectedSalon)
      );
    }

    // Filtro por fecha
    if (selectedDate) {
      filtered = filtered.filter(report => 
        report.reportDate.startsWith(selectedDate)
      );
    }

    // Filtro por prioridad
    if (selectedPriority) {
      filtered = filtered.filter(report => 
        report.priority === selectedPriority
      );
    }

    // Filtro por estado
    if (selectedStatus) {
      filtered = filtered.filter(report => 
        report.status === selectedStatus
      );
    }

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.djName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  }, [reports, selectedSalon, selectedDate, selectedPriority, selectedStatus, searchTerm]);

  const getIssueTypeIcon = (type: string) => {
    switch (type) {
      case 'technical': return <FaTools />;
      case 'equipment': return <FaCog />;
      case 'sound': return <FaVolumeUp />;
      case 'other': return <FaLightbulb />;
      default: return <FaTools />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewReport = (report: DJReport) => {
    console.log('Ver reporte:', report);
    // Aquí se abriría un modal con los detalles del reporte
  };

  const handleResolveReport = (report: DJReport) => {
    console.log('Resolver reporte:', report);
    // Aquí se marcaría el reporte como resuelto
  };

  const handleExportReports = () => {
    console.log('Exportar reportes');
    // Aquí se exportarían los reportes filtrados
  };

  const handlePrintReports = () => {
    console.log('Imprimir reportes');
    // Aquí se imprimirían los reportes filtrados
  };

  const clearFilters = () => {
    setSelectedSalon('');
    setSelectedDate('');
    setSearchTerm('');
    setSelectedPriority('');
    setSelectedStatus('');
  };

  const stats = {
    total: reports.length,
    open: reports.filter(r => r.status === 'open').length,
    inProgress: reports.filter(r => r.status === 'in-progress').length,
    resolved: reports.filter(r => r.status === 'resolved').length
  };

  return (
    <ReportsContainer>
      <Header>
        <h1>Reportes Técnicos</h1>
        <p>Gestión y seguimiento de reportes técnicos enviados por DJs</p>
      </Header>

      <StatsRow>
        <StatCard variant="info">
          <div className="stat-icon">
            <FaClipboardList />
          </div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Reportes</div>
        </StatCard>
        <StatCard variant="error">
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-value">{stats.open}</div>
          <div className="stat-label">Abiertos</div>
        </StatCard>
        <StatCard variant="warning">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-label">En Progreso</div>
        </StatCard>
        <StatCard variant="success">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-value">{stats.resolved}</div>
          <div className="stat-label">Resueltos</div>
        </StatCard>
      </StatsRow>

      <FiltersSection>
        <FiltersHeader>
          <FaFilter className="filter-icon" />
          <h3>Filtros</h3>
        </FiltersHeader>

        <FiltersGrid>
          <FilterGroup>
            <label>Salón</label>
            <select 
              value={selectedSalon} 
              onChange={(e) => setSelectedSalon(e.target.value)}
            >
              <option value="">Todas las salas</option>
              {salones.map(salon => (
                <option key={salon} value={salon}>{salon}</option>
              ))}
            </select>
          </FilterGroup>

          <FilterGroup>
            <label>Fecha</label>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <label>Prioridad</label>
            <select 
              value={selectedPriority} 
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="">Todas las prioridades</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </FilterGroup>

          <FilterGroup>
            <label>Estado</label>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="open">Abierto</option>
              <option value="in-progress">En Progreso</option>
              <option value="resolved">Resuelto</option>
            </select>
          </FilterGroup>
        </FiltersGrid>

        <FilterActions>
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por DJ, evento o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="action-buttons">
            <Button variant="secondary" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
            <Button variant="secondary" onClick={handleExportReports}>
              <FaDownload />
              Exportar
            </Button>
            <Button variant="secondary" onClick={handlePrintReports}>
              <FaPrint />
              Imprimir
            </Button>
          </div>
        </FilterActions>
      </FiltersSection>

      <ReportsTable>
        <TableHeader>
          <div>DJ / Evento</div>
          <div>Tipo de Problema</div>
          <div>Prioridad</div>
          <div>Estado</div>
          <div>Fecha</div>
          <div>Acciones</div>
        </TableHeader>

        {filteredReports.length === 0 ? (
          <EmptyState>
            <div className="empty-icon">📋</div>
            <h3>No se encontraron reportes</h3>
            <p>Intenta ajustar los filtros para ver más resultados</p>
            <Button onClick={clearFilters}>Limpiar Filtros</Button>
          </EmptyState>
        ) : (
          filteredReports.map((report) => (
            <ReportRow key={report.id} priority={report.priority}>
              <ReportCell data-label="DJ / Evento">
                <div>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>
                    {report.djName}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {report.eventName}
                  </div>
                </div>
              </ReportCell>

              <ReportCell data-label="Tipo de Problema">
                <IssueTypeIcon type={report.issueType}>
                  {getIssueTypeIcon(report.issueType)}
                </IssueTypeIcon>
                <div>
                  <div style={{ fontWeight: 500, color: '#1e293b' }}>
                    {report.issueType === 'technical' && 'Técnico'}
                    {report.issueType === 'equipment' && 'Equipamiento'}
                    {report.issueType === 'sound' && 'Sonido'}
                    {report.issueType === 'other' && 'Otro'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {report.description.substring(0, 50)}...
                  </div>
                </div>
              </ReportCell>

              <ReportCell variant="priority" data-label="Prioridad" priority={report.priority}>
                <div className="priority-badge">
                  {report.priority === 'low' && 'Baja'}
                  {report.priority === 'medium' && 'Media'}
                  {report.priority === 'high' && 'Alta'}
                  {report.priority === 'critical' && 'Crítica'}
                </div>
              </ReportCell>

              <ReportCell variant="status" data-label="Estado" status={report.status}>
                <div className="status-badge">
                  {report.status === 'open' && 'Abierto'}
                  {report.status === 'in-progress' && 'En Progreso'}
                  {report.status === 'resolved' && 'Resuelto'}
                </div>
                {report.assignedTechnician && (
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {report.assignedTechnician}
                  </div>
                )}
              </ReportCell>

              <ReportCell data-label="Fecha">
                <div>
                  <div style={{ fontWeight: 500, color: '#1e293b' }}>
                    {formatDate(report.reportDate)}
                  </div>
                </div>
              </ReportCell>

              <ReportCell variant="actions" data-label="Acciones">
                <div className="action-buttons">
                  <button 
                    className="view" 
                    onClick={() => handleViewReport(report)}
                    title="Ver detalles"
                  >
                    <FaEye />
                  </button>
                  {report.status !== 'resolved' && (
                    <button 
                      className="resolve" 
                      onClick={() => handleResolveReport(report)}
                      title="Marcar como resuelto"
                    >
                      <FaCheckCircle />
                    </button>
                  )}
                </div>
              </ReportCell>
            </ReportRow>
          ))
        )}
      </ReportsTable>
    </ReportsContainer>
  );
};

export default ReportsSection;
