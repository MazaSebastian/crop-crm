import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter, 
  FaDownload,
  FaTools,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaHistory,
  FaFileAlt,
  FaCog,
  FaBarcode,
  FaBox,
  FaShieldAlt,
  FaThermometerHalf,
  FaBatteryThreeQuarters,
  FaSignal
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

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  
  .search-input {
    flex: 1;
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
  
  .filter-button {
    padding: 0.75rem 1rem;
    background: #f1f5f9;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &:hover {
      background: #e2e8f0;
    }
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

const EquipmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const EquipmentCard = styled.div<{ status: 'operational' | 'maintenance' | 'repair' | 'retired' }>`
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
  
  .equipment-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    
    .equipment-info {
      flex: 1;
      
      .equipment-name {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 0.25rem;
      }
      
      .equipment-model {
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
          case 'operational': return '#dcfce7';
          case 'maintenance': return '#fef3c7';
          case 'repair': return '#fee2e2';
          case 'retired': return '#f1f5f9';
          default: return '#f1f5f9';
        }
      }};
      color: ${props => {
        switch (props.status) {
          case 'operational': return '#16a34a';
          case 'maintenance': return '#d97706';
          case 'repair': return '#dc2626';
          case 'retired': return '#6b7280';
          default: return '#6b7280';
        }
      }};
    }
  }
  
  .equipment-details {
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
  
  .equipment-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    
    button {
      padding: 0.5rem;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.2s ease;
      
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
      
      &.maintenance {
        background: #fef3c7;
        color: #d97706;
        
        &:hover {
          background: #fed7aa;
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

const EquipmentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<any>(null);
  const [equipment, setEquipment] = useState([
    {
      id: 1,
      name: 'Mixer Pioneer DJM-900',
      model: 'DJM-900NXS2',
      serialNumber: 'PIO-2023-001',
      category: 'Audio',
      location: 'Sala Principal',
      status: 'operational',
      purchaseDate: '2023-01-15',
      warranty: '2026-01-15',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-04-10',
      assignedTo: 'DJ Carlos',
      notes: 'Equipo en excelente estado'
    },
    {
      id: 2,
      name: 'CDJ-3000 #1',
      model: 'CDJ-3000',
      serialNumber: 'PIO-2023-002',
      category: 'Player',
      location: 'Sala Principal',
      status: 'operational',
      purchaseDate: '2023-02-20',
      warranty: '2026-02-20',
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-04-15',
      assignedTo: 'DJ Carlos',
      notes: 'Funcionando perfectamente'
    },
    {
      id: 3,
      name: 'CDJ-3000 #2',
      model: 'CDJ-3000',
      serialNumber: 'PIO-2023-003',
      category: 'Player',
      location: 'Sala Principal',
      status: 'maintenance',
      purchaseDate: '2023-02-20',
      warranty: '2026-02-20',
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-02-20',
      assignedTo: 'Técnico Juan',
      notes: 'Requiere calibración de plato'
    },
    {
      id: 4,
      name: 'Amplificador Principal',
      model: 'Crown XLS 2502',
      serialNumber: 'CRO-2022-001',
      category: 'Amplification',
      location: 'Sala Principal',
      status: 'repair',
      purchaseDate: '2022-08-10',
      warranty: '2025-08-10',
      lastMaintenance: '2023-12-01',
      nextMaintenance: '2024-03-01',
      assignedTo: 'Servicio Técnico',
      notes: 'Sin señal de salida, enviado a reparación'
    },
    {
      id: 5,
      name: 'Servidor de Música',
      model: 'Dell PowerEdge R740',
      serialNumber: 'DEL-2023-004',
      category: 'Computer',
      location: 'Sala de Control',
      status: 'operational',
      purchaseDate: '2023-03-05',
      warranty: '2026-03-05',
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-04-05',
      assignedTo: 'Sistema',
      notes: 'Servidor principal funcionando correctamente'
    },
    {
      id: 6,
      name: 'Switch de Red',
      model: 'Cisco Catalyst 2960',
      serialNumber: 'CIS-2022-002',
      category: 'Network',
      location: 'Sala de Control',
      status: 'maintenance',
      purchaseDate: '2022-11-15',
      warranty: '2025-11-15',
      lastMaintenance: '2024-01-01',
      nextMaintenance: '2024-02-01',
      assignedTo: 'Técnico Juan',
      notes: 'Actualización de firmware pendiente'
    }
  ]);

  const stats = {
    total: equipment.length,
    operational: equipment.filter(eq => eq.status === 'operational').length,
    maintenance: equipment.filter(eq => eq.status === 'maintenance').length,
    repair: equipment.filter(eq => eq.status === 'repair').length
  };

  const filteredEquipment = equipment.filter(eq =>
    eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEquipment = () => {
    setEditingEquipment(null);
    setIsModalOpen(true);
  };

  const handleEditEquipment = (eq: any) => {
    setEditingEquipment(eq);
    setIsModalOpen(true);
  };

  const handleDeleteEquipment = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      setEquipment(equipment.filter(eq => eq.id !== id));
    }
  };

  const handleSaveEquipment = (equipmentData: any) => {
    if (editingEquipment) {
      setEquipment(equipment.map(eq => 
        eq.id === editingEquipment.id ? { ...equipmentData, id: eq.id } : eq
      ));
    } else {
      setEquipment([...equipment, { ...equipmentData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  return (
    <Container>
      <Header>
        <h1>Gestión de Equipamiento</h1>
        <div className="header-actions">
          <Button variant="secondary">
            <FaDownload />
            Exportar
          </Button>
          <Button onClick={handleAddEquipment}>
            <FaPlus />
            Agregar Equipo
          </Button>
        </div>
      </Header>

      <StatsGrid>
        <StatCard variant="info">
          <div className="stat-header">
            <div className="stat-icon">
              <FaBox />
            </div>
          </div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total de Equipos</div>
        </StatCard>
        <StatCard variant="success">
          <div className="stat-header">
            <div className="stat-icon">
              <FaCheckCircle />
            </div>
          </div>
          <div className="stat-value">{stats.operational}</div>
          <div className="stat-label">Operativos</div>
        </StatCard>
        <StatCard variant="warning">
          <div className="stat-header">
            <div className="stat-icon">
              <FaTools />
            </div>
          </div>
          <div className="stat-value">{stats.maintenance}</div>
          <div className="stat-label">En Mantenimiento</div>
        </StatCard>
        <StatCard variant="error">
          <div className="stat-header">
            <div className="stat-icon">
              <FaExclamationTriangle />
            </div>
          </div>
          <div className="stat-value">{stats.repair}</div>
          <div className="stat-label">En Reparación</div>
        </StatCard>
      </StatsGrid>

      <SearchBar>
        <input
          type="text"
          placeholder="Buscar equipos por nombre, modelo o número de serie..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="filter-button">
          <FaFilter />
          Filtros
        </button>
      </SearchBar>

      <EquipmentGrid>
        {filteredEquipment.map((eq) => (
          <EquipmentCard key={eq.id} status={eq.status as 'operational' | 'maintenance' | 'repair' | 'retired'}>
            <div className="equipment-header">
              <div className="equipment-info">
                <div className="equipment-name">{eq.name}</div>
                <div className="equipment-model">{eq.model}</div>
              </div>
              <div className="status-badge">
                {eq.status === 'operational' && 'Operativo'}
                {eq.status === 'maintenance' && 'Mantenimiento'}
                {eq.status === 'repair' && 'Reparación'}
                {eq.status === 'retired' && 'Retirado'}
              </div>
            </div>
            
            <div className="equipment-details">
              <div className="detail-item">
                <FaBarcode className="detail-icon" />
                <span className="detail-label">S/N:</span>
                <span className="detail-value">{eq.serialNumber}</span>
              </div>
              <div className="detail-item">
                <FaTag className="detail-icon" />
                <span className="detail-label">Categoría:</span>
                <span className="detail-value">{eq.category}</span>
              </div>
              <div className="detail-item">
                <FaMapMarkerAlt className="detail-icon" />
                <span className="detail-label">Ubicación:</span>
                <span className="detail-value">{eq.location}</span>
              </div>
              <div className="detail-item">
                <FaUser className="detail-icon" />
                <span className="detail-label">Asignado:</span>
                <span className="detail-value">{eq.assignedTo}</span>
              </div>
              <div className="detail-item">
                <FaCalendarAlt className="detail-icon" />
                <span className="detail-label">Próximo Mant.:</span>
                <span className="detail-value">{eq.nextMaintenance}</span>
              </div>
              <div className="detail-item">
                <FaShieldAlt className="detail-icon" />
                <span className="detail-label">Garantía:</span>
                <span className="detail-value">{eq.warranty}</span>
              </div>
            </div>
            
            <div className="equipment-actions">
              <button 
                className="maintenance"
                onClick={() => handleEditEquipment(eq)}
                title="Ver detalles"
              >
                <FaHistory />
              </button>
              <button 
                className="edit"
                onClick={() => handleEditEquipment(eq)}
                title="Editar"
              >
                <FaEdit />
              </button>
              <button 
                className="delete"
                onClick={() => handleDeleteEquipment(eq.id)}
                title="Eliminar"
              >
                <FaTrash />
              </button>
            </div>
          </EquipmentCard>
        ))}
      </EquipmentGrid>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <div className="modal-header">
            <h2>{editingEquipment ? 'Editar Equipo' : 'Agregar Nuevo Equipo'}</h2>
            <button className="close-button" onClick={() => setIsModalOpen(false)}>
              ×
            </button>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const equipmentData = {
              name: formData.get('name') as string,
              model: formData.get('model') as string,
              serialNumber: formData.get('serialNumber') as string,
              category: formData.get('category') as string,
              location: formData.get('location') as string,
              status: formData.get('status') as string,
              purchaseDate: formData.get('purchaseDate') as string,
              warranty: formData.get('warranty') as string,
              lastMaintenance: formData.get('lastMaintenance') as string,
              nextMaintenance: formData.get('nextMaintenance') as string,
              assignedTo: formData.get('assignedTo') as string,
              notes: formData.get('notes') as string
            };
            handleSaveEquipment(equipmentData);
          }}>
            <div className="form-grid">
              <div className="form-group">
                <label>Nombre del Equipo</label>
                <input 
                  name="name" 
                  defaultValue={editingEquipment?.name} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Modelo</label>
                <input 
                  name="model" 
                  defaultValue={editingEquipment?.model} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Número de Serie</label>
                <input 
                  name="serialNumber" 
                  defaultValue={editingEquipment?.serialNumber} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select name="category" defaultValue={editingEquipment?.category} required>
                  <option value="">Seleccionar categoría</option>
                  <option value="Audio">Audio</option>
                  <option value="Player">Player</option>
                  <option value="Amplification">Amplificación</option>
                  <option value="Computer">Computadora</option>
                  <option value="Network">Red</option>
                  <option value="Lighting">Iluminación</option>
                  <option value="Video">Video</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ubicación</label>
                <input 
                  name="location" 
                  defaultValue={editingEquipment?.location} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select name="status" defaultValue={editingEquipment?.status} required>
                  <option value="operational">Operativo</option>
                  <option value="maintenance">Mantenimiento</option>
                  <option value="repair">Reparación</option>
                  <option value="retired">Retirado</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fecha de Compra</label>
                <input 
                  type="date" 
                  name="purchaseDate" 
                  defaultValue={editingEquipment?.purchaseDate} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Garantía hasta</label>
                <input 
                  type="date" 
                  name="warranty" 
                  defaultValue={editingEquipment?.warranty} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Último Mantenimiento</label>
                <input 
                  type="date" 
                  name="lastMaintenance" 
                  defaultValue={editingEquipment?.lastMaintenance} 
                />
              </div>
              <div className="form-group">
                <label>Próximo Mantenimiento</label>
                <input 
                  type="date" 
                  name="nextMaintenance" 
                  defaultValue={editingEquipment?.nextMaintenance} 
                />
              </div>
              <div className="form-group">
                <label>Asignado a</label>
                <input 
                  name="assignedTo" 
                  defaultValue={editingEquipment?.assignedTo} 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Notas</label>
              <textarea 
                name="notes" 
                defaultValue={editingEquipment?.notes}
                placeholder="Información adicional sobre el equipo..."
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
                {editingEquipment ? 'Actualizar' : 'Agregar'} Equipo
              </Button>
            </div>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default EquipmentManagement;
