import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaClock, 
  FaCalendarAlt,
  FaTools,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUser,
  FaTag,
  FaMapMarkerAlt,
  FaFileAlt,
  FaDownload,
  FaFilter,
  FaSearch,
  FaHistory,
  FaCog,
  FaWrench,
  FaClipboardList,
  FaBell,
  FaCalendarCheck,
  FaCalendarTimes,
  FaCalendarDay
} from 'react-icons/fa';

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
  }
  
  .header-actions {
    display: flex;
    gap: 1rem;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' | 'success' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  background: ${props => {
    switch (props.variant) {
      case 'secondary': return '#f1f5f9';
      case 'danger': return '#fee2e2';
      case 'success': return '#dcfce7';
      default: return '#3b82f6';
    }
  }};
  
  color: ${props => {
    switch (props.variant) {
      case 'secondary': return '#475569';
      case 'danger': return '#dc2626';
      case 'success': return '#16a34a';
      default: return 'white';
    }
  }};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ variant?: 'success' | 'warning' | 'error' | 'info' }>`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  
  .stat-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    
    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: white;
      background: ${props => {
        switch (props.variant) {
          case 'success': return '#10b981';
          case 'warning': return '#f59e0b';
          case 'error': return '#ef4444';
          case 'info': return '#3b82f6';
          default: return '#6b7280';
        }
      }};
    }
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    color: #64748b;
    font-size: 0.875rem;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  flex-wrap: wrap;
  
  .search-input {
    flex: 1;
    min-width: 300px;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
  
  .filter-select {
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    background: white;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
`;

const MaintenanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
`;

const MaintenanceCard = styled.div<{ status: 'scheduled' | 'in-progress' | 'completed' | 'overdue' }>`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'scheduled': return '#3b82f6';
      case 'in-progress': return '#f59e0b';
      case 'completed': return '#10b981';
      case 'overdue': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
  }
  
  .maintenance-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    
    .maintenance-info {
      flex: 1;
      
      .maintenance-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 0.25rem;
      }
      
      .equipment-name {
        color: #64748b;
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
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
          case 'scheduled': return '#dbeafe';
          case 'in-progress': return '#fef3c7';
          case 'completed': return '#dcfce7';
          case 'overdue': return '#fee2e2';
          default: return '#f1f5f9';
        }
      }};
      color: ${props => {
        switch (props.status) {
          case 'scheduled': return '#2563eb';
          case 'in-progress': return '#d97706';
          case 'completed': return '#16a34a';
          case 'overdue': return '#dc2626';
          default: return '#6b7280';
        }
      }};
    }
  }
  
  .maintenance-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
    
    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      
      .detail-icon {
        color: #64748b;
        width: 16px;
      }
      
      .detail-label {
        color: #64748b;
        font-weight: 500;
      }
      
      .detail-value {
        color: #1e293b;
        font-weight: 600;
      }
    }
  }
  
  .maintenance-description {
    background: #f8fafc;
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: #475569;
    line-height: 1.5;
  }
  
  .maintenance-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    
    button {
      padding: 0.5rem;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &.complete {
        background: #dcfce7;
        color: #16a34a;
        
        &:hover {
          background: #bbf7d0;
        }
      }
      
      &.edit {
        background: #dbeafe;
        color: #2563eb;
        
        &:hover {
          background: #bfdbfe;
        }
      }
      
      &.delete {
        background: #fee2e2;
        color: #dc2626;
        
        &:hover {
          background: #fecaca;
        }
      }
    }
  }
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
    }
    
    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #64748b;
      
      &:hover {
        color: #1e293b;
      }
    }
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    label {
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }
    
    input, select, textarea {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      
      &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    }
    
    textarea {
      resize: vertical;
      min-height: 100px;
    }
  }
  
  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }
`;

const MaintenanceSchedule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<any>(null);
  const [maintenance, setMaintenance] = useState([
    {
      id: 1,
      title: 'Calibración CDJ-3000 #2',
      equipment: 'CDJ-3000 #2',
      type: 'Preventivo',
      status: 'scheduled',
      scheduledDate: '2024-02-20',
      assignedTo: 'Técnico Juan',
      priority: 'Alta',
      description: 'Calibración del plato y verificación de sincronización con el mixer',
      estimatedDuration: '2 horas',
      location: 'Sala Principal',
      notes: 'Equipo presenta problemas de sincronización'
    },
    {
      id: 2,
      title: 'Actualización Firmware Switch',
      equipment: 'Switch de Red',
      type: 'Preventivo',
      status: 'in-progress',
      scheduledDate: '2024-02-01',
      assignedTo: 'Técnico Juan',
      priority: 'Media',
      description: 'Actualización del firmware a la versión más reciente para mejorar la estabilidad',
      estimatedDuration: '1 hora',
      location: 'Sala de Control',
      notes: 'Mantenimiento programado mensual'
    },
    {
      id: 3,
      title: 'Revisión Amplificador Principal',
      equipment: 'Amplificador Principal',
      type: 'Correctivo',
      status: 'overdue',
      scheduledDate: '2024-01-15',
      assignedTo: 'Servicio Técnico',
      priority: 'Alta',
      description: 'Diagnóstico y reparación del amplificador que no produce señal de salida',
      estimatedDuration: '4 horas',
      location: 'Sala Principal',
      notes: 'Equipo enviado a servicio técnico externo'
    },
    {
      id: 4,
      title: 'Limpieza Servidor de Música',
      equipment: 'Servidor de Música',
      type: 'Preventivo',
      status: 'completed',
      scheduledDate: '2024-01-05',
      assignedTo: 'Sistema',
      priority: 'Baja',
      description: 'Limpieza de archivos temporales y optimización del sistema',
      estimatedDuration: '30 minutos',
      location: 'Sala de Control',
      notes: 'Mantenimiento completado exitosamente'
    },
    {
      id: 5,
      title: 'Verificación Cableado de Red',
      equipment: 'Cableado Principal',
      type: 'Preventivo',
      status: 'scheduled',
      scheduledDate: '2024-03-01',
      assignedTo: 'Técnico Juan',
      priority: 'Baja',
      description: 'Inspección rutinaria del cableado de red y conexiones',
      estimatedDuration: '1 hora',
      location: 'Sala Principal',
      notes: 'Verificación trimestral programada'
    },
    {
      id: 6,
      title: 'Mantenimiento Mixer DJM-900',
      equipment: 'Mixer Pioneer DJM-900',
      type: 'Preventivo',
      status: 'scheduled',
      scheduledDate: '2024-02-25',
      assignedTo: 'DJ Carlos',
      priority: 'Media',
      description: 'Limpieza de faders y verificación de conectores',
      estimatedDuration: '1.5 horas',
      location: 'Sala Principal',
      notes: 'Mantenimiento semestral'
    }
  ]);

  const stats = {
    total: maintenance.length,
    scheduled: maintenance.filter(m => m.status === 'scheduled').length,
    inProgress: maintenance.filter(m => m.status === 'in-progress').length,
    completed: maintenance.filter(m => m.status === 'completed').length,
    overdue: maintenance.filter(m => m.status === 'overdue').length
  };

  const filteredMaintenance = maintenance.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddMaintenance = () => {
    setEditingMaintenance(null);
    setIsModalOpen(true);
  };

  const handleEditMaintenance = (m: any) => {
    setEditingMaintenance(m);
    setIsModalOpen(true);
  };

  const handleDeleteMaintenance = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este mantenimiento?')) {
      setMaintenance(maintenance.filter(m => m.id !== id));
    }
  };

  const handleCompleteMaintenance = (id: number) => {
    setMaintenance(maintenance.map(m => 
      m.id === id ? { ...m, status: 'completed' } : m
    ));
  };

  const handleSaveMaintenance = (maintenanceData: any) => {
    if (editingMaintenance) {
      setMaintenance(maintenance.map(m => 
        m.id === editingMaintenance.id ? { ...maintenanceData, id: m.id } : m
      ));
    } else {
      setMaintenance([...maintenance, { ...maintenanceData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Programado';
      case 'in-progress': return 'En Progreso';
      case 'completed': return 'Completado';
      case 'overdue': return 'Atrasado';
      default: return status;
    }
  };

  return (
    <Container>
      <Header>
        <h1>Programación de Mantenimiento</h1>
        <div className="header-actions">
          <Button variant="secondary">
            <FaDownload />
            Exportar
          </Button>
          <Button onClick={handleAddMaintenance}>
            <FaPlus />
            Nuevo Mantenimiento
          </Button>
        </div>
      </Header>

      <StatsGrid>
        <StatCard variant="info">
          <div className="stat-header">
            <div className="stat-icon">
              <FaClipboardList />
            </div>
          </div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total de Mantenimientos</div>
        </StatCard>
        <StatCard variant="info">
          <div className="stat-header">
            <div className="stat-icon">
              <FaCalendarCheck />
            </div>
          </div>
          <div className="stat-value">{stats.scheduled}</div>
          <div className="stat-label">Programados</div>
        </StatCard>
        <StatCard variant="warning">
          <div className="stat-header">
            <div className="stat-icon">
              <FaTools />
            </div>
          </div>
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-label">En Progreso</div>
        </StatCard>
        <StatCard variant="success">
          <div className="stat-header">
            <div className="stat-icon">
              <FaCheckCircle />
            </div>
          </div>
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completados</div>
        </StatCard>
        <StatCard variant="error">
          <div className="stat-header">
            <div className="stat-icon">
              <FaCalendarTimes />
            </div>
          </div>
          <div className="stat-value">{stats.overdue}</div>
          <div className="stat-label">Atrasados</div>
        </StatCard>
      </StatsGrid>

      <FilterBar>
        <input
          type="text"
          placeholder="Buscar mantenimientos..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos los estados</option>
          <option value="scheduled">Programados</option>
          <option value="in-progress">En Progreso</option>
          <option value="completed">Completados</option>
          <option value="overdue">Atrasados</option>
        </select>
        <Button variant="secondary">
          <FaFilter />
          Filtros Avanzados
        </Button>
      </FilterBar>

      <MaintenanceGrid>
        {filteredMaintenance.map((m) => (
          <MaintenanceCard key={m.id} status={m.status as 'scheduled' | 'in-progress' | 'completed' | 'overdue'}>
            <div className="maintenance-header">
              <div className="maintenance-info">
                <div className="maintenance-title">{m.title}</div>
                <div className="equipment-name">{m.equipment}</div>
              </div>
              <div className="status-badge">
                {getStatusLabel(m.status)}
              </div>
            </div>
            
            <div className="maintenance-details">
              <div className="detail-item">
                <FaTag className="detail-icon" />
                <span className="detail-label">Tipo:</span>
                <span className="detail-value">{m.type}</span>
              </div>
              <div className="detail-item">
                <FaCalendarAlt className="detail-icon" />
                <span className="detail-label">Fecha:</span>
                <span className="detail-value">{m.scheduledDate}</span>
              </div>
              <div className="detail-item">
                <FaUser className="detail-icon" />
                <span className="detail-label">Asignado:</span>
                <span className="detail-value">{m.assignedTo}</span>
              </div>
              <div className="detail-item">
                <FaClock className="detail-icon" />
                <span className="detail-label">Duración:</span>
                <span className="detail-value">{m.estimatedDuration}</span>
              </div>
              <div className="detail-item">
                <FaMapMarkerAlt className="detail-icon" />
                <span className="detail-label">Ubicación:</span>
                <span className="detail-value">{m.location}</span>
              </div>
              <div className="detail-item">
                <FaExclamationTriangle className="detail-icon" />
                <span className="detail-label">Prioridad:</span>
                <span className="detail-value">{m.priority}</span>
              </div>
            </div>
            
            <div className="maintenance-description">
              {m.description}
            </div>
            
            <div className="maintenance-actions">
              {m.status !== 'completed' && (
                <button 
                  className="complete"
                  onClick={() => handleCompleteMaintenance(m.id)}
                  title="Marcar como completado"
                >
                  <FaCheck />
                </button>
              )}
              <button 
                className="edit"
                onClick={() => handleEditMaintenance(m)}
                title="Editar"
              >
                <FaEdit />
              </button>
              <button 
                className="delete"
                onClick={() => handleDeleteMaintenance(m.id)}
                title="Eliminar"
              >
                <FaTrash />
              </button>
            </div>
          </MaintenanceCard>
        ))}
      </MaintenanceGrid>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <div className="modal-header">
            <h2>{editingMaintenance ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}</h2>
            <button className="close-button" onClick={() => setIsModalOpen(false)}>
              ×
            </button>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const maintenanceData = {
              title: formData.get('title') as string,
              equipment: formData.get('equipment') as string,
              type: formData.get('type') as string,
              status: formData.get('status') as string,
              scheduledDate: formData.get('scheduledDate') as string,
              assignedTo: formData.get('assignedTo') as string,
              priority: formData.get('priority') as string,
              description: formData.get('description') as string,
              estimatedDuration: formData.get('estimatedDuration') as string,
              location: formData.get('location') as string,
              notes: formData.get('notes') as string
            };
            handleSaveMaintenance(maintenanceData);
          }}>
            <div className="form-grid">
              <div className="form-group">
                <label>Título del Mantenimiento</label>
                <input 
                  name="title" 
                  defaultValue={editingMaintenance?.title} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Equipo</label>
                <input 
                  name="equipment" 
                  defaultValue={editingMaintenance?.equipment} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Tipo</label>
                <select name="type" defaultValue={editingMaintenance?.type} required>
                  <option value="">Seleccionar tipo</option>
                  <option value="Preventivo">Preventivo</option>
                  <option value="Correctivo">Correctivo</option>
                  <option value="Predictivo">Predictivo</option>
                </select>
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select name="status" defaultValue={editingMaintenance?.status} required>
                  <option value="scheduled">Programado</option>
                  <option value="in-progress">En Progreso</option>
                  <option value="completed">Completado</option>
                  <option value="overdue">Atrasado</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fecha Programada</label>
                <input 
                  type="date" 
                  name="scheduledDate" 
                  defaultValue={editingMaintenance?.scheduledDate} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Asignado a</label>
                <input 
                  name="assignedTo" 
                  defaultValue={editingMaintenance?.assignedTo} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Prioridad</label>
                <select name="priority" defaultValue={editingMaintenance?.priority} required>
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                  <option value="Crítica">Crítica</option>
                </select>
              </div>
              <div className="form-group">
                <label>Duración Estimada</label>
                <input 
                  name="estimatedDuration" 
                  defaultValue={editingMaintenance?.estimatedDuration} 
                  placeholder="ej: 2 horas"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Ubicación</label>
                <input 
                  name="location" 
                  defaultValue={editingMaintenance?.location} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Descripción</label>
              <textarea 
                name="description" 
                defaultValue={editingMaintenance?.description}
                placeholder="Descripción detallada del mantenimiento..."
                required
              />
            </div>
            
            <div className="form-group">
              <label>Notas</label>
              <textarea 
                name="notes" 
                defaultValue={editingMaintenance?.notes}
                placeholder="Notas adicionales..."
              />
            </div>
            
            <div className="form-actions">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingMaintenance ? 'Actualizar' : 'Crear'} Mantenimiento
              </Button>
            </div>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default MaintenanceSchedule;
