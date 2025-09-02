import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  FaClipboardCheck, 
  FaTools, 
  FaVolumeUp, 
  FaLightbulb,
  FaMicrochip,
  FaThermometerHalf,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaSave,
  FaBuilding,
  FaComments,
  FaArrowLeft
} from 'react-icons/fa';

// Interfaces
interface TechItem {
  id: string;
  category: string;
  name: string;
  description: string;
  status: 'ok' | 'issue' | 'not-checked';
  issueDescription: string;
}

interface TechCheck {
  id: string;
  salon: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  technician: string;
  items: TechItem[];
  notes: string;
  submittedAt: string;
}

// Styled Components
const TechCheckContainer = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1000px;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1rem;
    opacity: 0.9;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.75rem;
  font-weight: 400;
  opacity: 0.8;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    opacity: 1;
    transform: translateY(-1px);
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
`;

const FormSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1000px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  label {
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    transition: border-color 0.2s;
    
    &:focus {
      outline: none;
      border-color: #667eea;
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 80px;
  }
`;

const ChecklistSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1000px;
`;

const CategoryGroup = styled.div`
  margin-bottom: 2rem;
  
  .category-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e5e7eb;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ChecklistItem = styled.div`
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 2px solid transparent;
  transition: all 0.2s;
  
  &:hover {
    border-color: #e5e7eb;
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ItemInfo = styled.div`
  flex: 1;
  
  .item-name {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }
  
  .item-description {
    font-size: 0.875rem;
    color: #64748b;
  }
`;

const StatusButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StatusButton = styled.button<{ status: 'ok' | 'issue' | 'not-checked'; active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => {
    if (props.status === 'ok') {
      return `
        border-color: ${props.active ? '#10b981' : '#d1fae5'};
        background: ${props.active ? '#10b981' : 'white'};
        color: ${props.active ? 'white' : '#10b981'};
        
        &:hover {
          background: ${props.active ? '#059669' : '#ecfdf5'};
        }
      `;
    } else if (props.status === 'issue') {
      return `
        border-color: ${props.active ? '#ef4444' : '#fee2e2'};
        background: ${props.active ? '#ef4444' : 'white'};
        color: ${props.active ? 'white' : '#ef4444'};
        
        &:hover {
          background: ${props.active ? '#dc2626' : '#fef2f2'};
        }
      `;
    } else {
      return `
        border-color: ${props.active ? '#6b7280' : '#f3f4f6'};
        background: ${props.active ? '#6b7280' : 'white'};
        color: ${props.active ? 'white' : '#6b7280'};
        
        &:hover {
          background: ${props.active ? '#4b5563' : '#f9fafb'};
        }
      `;
    }
  }}
`;

const IssueDescription = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  
  label {
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }
  
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    resize: vertical;
    min-height: 80px;
    
    &:focus {
      outline: none;
      border-color: #ef4444;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
  width: 100%;
  max-width: 1000px;
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: #667eea;
    color: white;
    
    &:hover {
      background: #5a67d8;
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const TechCheckPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSalon, setSelectedSalon] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [technician, setTechnician] = useState('');
  const [notes, setNotes] = useState('');
  
  const [checklistItems, setChecklistItems] = useState<TechItem[]>([
    // Sistema de Sonido
    { id: '1', category: 'Sistema de Sonido', name: 'Cabezales de Sonido', description: 'Verificar funcionamiento de todos los cabezales', status: 'not-checked', issueDescription: '' },
    { id: '2', category: 'Sistema de Sonido', name: 'Potencia de Sonido', description: 'Comprobar niveles de potencia y distorsión', status: 'not-checked', issueDescription: '' },
    { id: '3', category: 'Sistema de Sonido', name: 'Micrófonos', description: 'Probar todos los micrófonos inalámbricos y cableados', status: 'not-checked', issueDescription: '' },
    { id: '4', category: 'Sistema de Sonido', name: 'Consola de Mezcla', description: 'Verificar funcionamiento de faders y controles', status: 'not-checked', issueDescription: '' },
    
    // Efectos Visuales
    { id: '5', category: 'Efectos Visuales', name: 'Máquina de Humo', description: 'Comprobar funcionamiento y nivel de líquido', status: 'not-checked', issueDescription: '' },
    { id: '6', category: 'Efectos Visuales', name: 'Láseres', description: 'Verificar alineación y funcionamiento de láseres', status: 'not-checked', issueDescription: '' },
    { id: '7', category: 'Efectos Visuales', name: 'Luces LED', description: 'Probar todas las luces LED y efectos', status: 'not-checked', issueDescription: '' },
    { id: '8', category: 'Efectos Visuales', name: 'Máquina de Burbujas', description: 'Verificar funcionamiento y nivel de líquido', status: 'not-checked', issueDescription: '' },
    
    // Equipamiento Electrónico
    { id: '9', category: 'Equipamiento Electrónico', name: 'Computadora DJ', description: 'Verificar funcionamiento del software y hardware', status: 'not-checked', issueDescription: '' },
    { id: '10', category: 'Equipamiento Electrónico', name: 'Controladores MIDI', description: 'Probar todos los controladores y pads', status: 'not-checked', issueDescription: '' },
    { id: '11', category: 'Equipamiento Electrónico', name: 'Conexiones WiFi', description: 'Verificar estabilidad de conexión inalámbrica', status: 'not-checked', issueDescription: '' },
    { id: '12', category: 'Equipamiento Electrónico', name: 'Cables y Conexiones', description: 'Revisar estado de todos los cables', status: 'not-checked', issueDescription: '' },
    
    // Climatización
    { id: '13', category: 'Climatización', name: 'Aire Acondicionado', description: 'Verificar funcionamiento y temperatura', status: 'not-checked', issueDescription: '' },
    { id: '14', category: 'Climatización', name: 'Ventilación', description: 'Comprobar extractores y circulación de aire', status: 'not-checked', issueDescription: '' },
    
    // Seguridad
    { id: '15', category: 'Seguridad', name: 'Sistema de Emergencia', description: 'Verificar luces y alarmas de emergencia', status: 'not-checked', issueDescription: '' },
    { id: '16', category: 'Seguridad', name: 'Extintores', description: 'Comprobar ubicación y estado de extintores', status: 'not-checked', issueDescription: '' }
  ]);

  const handleStatusChange = (itemId: string, status: 'ok' | 'issue' | 'not-checked') => {
    setChecklistItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, status, issueDescription: status !== 'issue' ? '' : item.issueDescription }
        : item
    ));
  };

  const handleIssueDescriptionChange = (itemId: string, description: string) => {
    setChecklistItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, issueDescription: description }
        : item
    ));
  };

  const handleSubmit = () => {
    const techCheck: TechCheck = {
      id: Date.now().toString(),
      salon: selectedSalon,
      eventDate: eventDate,
      startTime: startTime,
      endTime: endTime,
      technician: technician,
      items: checklistItems,
      notes: notes,
      submittedAt: new Date().toISOString()
    };
    
    // Aquí se enviaría al backend
    console.log('Tech Check enviado:', techCheck);
    alert('Check In Técnico enviado exitosamente al departamento de técnica');
  };

  const handleReset = () => {
    setSelectedSalon('');
    setEventDate('');
    setStartTime('');
    setEndTime('');
    setTechnician('');
    setNotes('');
    setChecklistItems(prev => prev.map(item => ({ ...item, status: 'not-checked', issueDescription: '' })));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Sistema de Sonido': return <FaVolumeUp />;
      case 'Efectos Visuales': return <FaLightbulb />;
      case 'Equipamiento Electrónico': return <FaMicrochip />;
      case 'Climatización': return <FaThermometerHalf />;
      case 'Seguridad': return <FaExclamationTriangle />;
      default: return <FaTools />;
    }
  };

  const categories = ['Sistema de Sonido', 'Efectos Visuales', 'Equipamiento Electrónico', 'Climatización', 'Seguridad'];

  return (
    <TechCheckContainer>
      <HeaderSection>
        <HeaderContent>
          <HeaderLeft>
            <h1>
              <FaClipboardCheck />
              Check In Técnico
            </h1>
            <p>Verificación post-evento de equipamiento técnico</p>
          </HeaderLeft>
          <HeaderRight>
            <BackButton onClick={() => navigate('/dashboard')} title="Volver al Dashboard">
              <FaArrowLeft />
              Dashboard
            </BackButton>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Técnico</div>
              <div style={{ fontWeight: 600 }}>Juan Pérez</div>
            </div>
          </HeaderRight>
        </HeaderContent>
      </HeaderSection>

      <MainContent>
        <FormSection>
          <SectionTitle>
            <FaBuilding />
            Información del Evento
          </SectionTitle>
                     <FormGrid>
             <FormGroup>
               <label>Salón</label>
               <select value={selectedSalon} onChange={(e) => setSelectedSalon(e.target.value)}>
                 <option value="">Seleccionar salón</option>
                 <option value="San Telmo">San Telmo</option>
                 <option value="Palermo">Palermo</option>
                 <option value="Recoleta">Recoleta</option>
                 <option value="Belgrano">Belgrano</option>
               </select>
             </FormGroup>
             <FormGroup>
               <label>Fecha del Evento</label>
               <input 
                 type="date" 
                 value={eventDate} 
                 onChange={(e) => setEventDate(e.target.value)}
               />
             </FormGroup>
             <FormGroup>
               <label>Horario de Inicio</label>
               <input 
                 type="time" 
                 value={startTime} 
                 onChange={(e) => setStartTime(e.target.value)}
               />
             </FormGroup>
             <FormGroup>
               <label>Horario de Finalización</label>
               <input 
                 type="time" 
                 value={endTime} 
                 onChange={(e) => setEndTime(e.target.value)}
               />
             </FormGroup>
             <FormGroup>
               <label>Técnico Responsable</label>
               <input 
                 type="text" 
                 value={technician} 
                 onChange={(e) => setTechnician(e.target.value)}
                 placeholder="Nombre del técnico"
               />
             </FormGroup>
           </FormGrid>
        </FormSection>

        <ChecklistSection>
          <SectionTitle>
            <FaClipboardCheck />
            Checklist Técnico
          </SectionTitle>
          
          {categories.map(category => (
            <CategoryGroup key={category}>
              <div className="category-title">
                {getCategoryIcon(category)}
                {category}
              </div>
              
              {checklistItems
                .filter(item => item.category === category)
                .map(item => (
                  <ChecklistItem key={item.id}>
                    <ItemHeader>
                      <ItemInfo>
                        <div className="item-name">{item.name}</div>
                        <div className="item-description">{item.description}</div>
                      </ItemInfo>
                      <StatusButtons>
                        <StatusButton
                          status="ok"
                          active={item.status === 'ok'}
                          onClick={() => handleStatusChange(item.id, 'ok')}
                        >
                          <FaCheckCircle />
                          OK
                        </StatusButton>
                        <StatusButton
                          status="issue"
                          active={item.status === 'issue'}
                          onClick={() => handleStatusChange(item.id, 'issue')}
                        >
                          <FaTimesCircle />
                          Problema
                        </StatusButton>
                        <StatusButton
                          status="not-checked"
                          active={item.status === 'not-checked'}
                          onClick={() => handleStatusChange(item.id, 'not-checked')}
                        >
                          No Verificado
                        </StatusButton>
                      </StatusButtons>
                    </ItemHeader>
                    
                    {item.status === 'issue' && (
                      <IssueDescription>
                        <label>Descripción del Problema</label>
                        <textarea
                          value={item.issueDescription}
                          onChange={(e) => handleIssueDescriptionChange(item.id, e.target.value)}
                          placeholder="Describe detalladamente el problema encontrado..."
                        />
                      </IssueDescription>
                    )}
                  </ChecklistItem>
                ))}
            </CategoryGroup>
          ))}
        </ChecklistSection>

        <FormSection>
          <SectionTitle>
            <FaComments />
            Notas Adicionales
          </SectionTitle>
          <FormGroup>
            <label>Observaciones Generales</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agregar cualquier observación adicional sobre el estado general del equipamiento..."
            />
          </FormGroup>
        </FormSection>

        <ActionButtons>
          <ActionButton variant="secondary" onClick={handleReset}>
            <FaTimesCircle />
            Limpiar Formulario
          </ActionButton>
          <ActionButton variant="primary" onClick={handleSubmit}>
            <FaSave />
            Enviar a Técnica
          </ActionButton>
        </ActionButtons>
      </MainContent>
    </TechCheckContainer>
  );
};

export default TechCheckPage;
