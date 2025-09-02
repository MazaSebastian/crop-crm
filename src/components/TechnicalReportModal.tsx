import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaTimes, 
  FaExclamationTriangle, 
  FaTools, 
  FaVolumeUp, 
  FaCog, 
  FaLightbulb,
  FaPaperPlane,
  FaSpinner
} from 'react-icons/fa';
import technicalConnectionService from '../services/technicalConnectionService';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 1.25rem;
    color: #64748b;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    
    &:hover {
      background: #f1f5f9;
      color: #374151;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
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
    font-size: 0.875rem;
    transition: all 0.2s ease;
    
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
`;

const IssueTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const IssueTypeOption = styled.div<{ isSelected: boolean; issueType?: string }>`
  padding: 1rem;
  border: 2px solid ${props => props.isSelected ? '#3b82f6' : '#e5e7eb'};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isSelected ? '#eff6ff' : 'white'};
  
  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
  
  .option-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    
    .option-icon {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      color: white;
      background: ${props => {
        switch (props.issueType) {
          case 'technical': return '#3b82f6';
          case 'equipment': return '#ef4444';
          case 'sound': return '#8b5cf6';
          case 'other': return '#6b7280';
          default: return '#3b82f6';
        }
      }};
    }
    
    .option-title {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.875rem;
    }
  }
  
  .option-description {
    font-size: 0.75rem;
    color: #64748b;
    line-height: 1.4;
  }
`;

const PriorityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
`;

const PriorityOption = styled.div<{ isSelected: boolean; priority: string }>`
  padding: 0.75rem;
  border: 2px solid ${props => props.isSelected ? 
    (props.priority === 'critical' ? '#dc2626' : 
     props.priority === 'high' ? '#d97706' : 
     props.priority === 'medium' ? '#2563eb' : '#16a34a') : '#e5e7eb'};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  background: ${props => props.isSelected ? 
    (props.priority === 'critical' ? '#fee2e2' : 
     props.priority === 'high' ? '#fef3c7' : 
     props.priority === 'medium' ? '#dbeafe' : '#dcfce7') : 'white'};
  
  color: ${props => props.isSelected ? 
    (props.priority === 'critical' ? '#dc2626' : 
     props.priority === 'high' ? '#d97706' : 
     props.priority === 'medium' ? '#2563eb' : '#16a34a') : '#64748b'};
  
  &:hover {
    border-color: ${props => 
      props.priority === 'critical' ? '#dc2626' : 
      props.priority === 'high' ? '#d97706' : 
      props.priority === 'medium' ? '#2563eb' : '#16a34a'};
    background: ${props => 
      props.priority === 'critical' ? '#fee2e2' : 
      props.priority === 'high' ? '#fef3c7' : 
      props.priority === 'medium' ? '#dbeafe' : '#dcfce7'};
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'success' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
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
      default: return '#3b82f6';
    }
  }};
  
  color: ${props => {
    switch (props.variant) {
      case 'secondary': return '#475569';
      case 'success': return '#16a34a';
      default: return 'white';
    }
  }};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 600;
`;

interface TechnicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId?: string;
  eventName?: string;
  djId?: string;
  djName?: string;
}

const TechnicalReportModal: React.FC<TechnicalReportModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventName,
  djId,
  djName
}) => {
  const [issueType, setIssueType] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const issueTypes = [
    {
      id: 'technical',
      title: 'Técnico',
      description: 'Problemas de configuración, software o conexiones',
      icon: FaTools
    },
    {
      id: 'equipment',
      title: 'Equipamiento',
      description: 'Fallas de hardware, equipos dañados o defectuosos',
      icon: FaCog
    },
    {
      id: 'sound',
      title: 'Sonido',
      description: 'Problemas de audio, altavoces o micrófonos',
      icon: FaVolumeUp
    },
    {
      id: 'other',
      title: 'Otro',
      description: 'Otros problemas no categorizados',
      icon: FaLightbulb
    }
  ];

  const priorities = [
    { id: 'low', label: 'Baja' },
    { id: 'medium', label: 'Media' },
    { id: 'high', label: 'Alta' },
    { id: 'critical', label: 'Crítica' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!issueType || !priority || !description.trim()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);

    try {
      // Verificar conexión con el sistema técnico
      const isConnected = await technicalConnectionService.checkConnection();
      
      if (!isConnected) {
        alert('No hay conexión con el sistema técnico. Verifica que esté funcionando.');
        return;
      }

      // Enviar reporte al sistema técnico
      const report = {
        djId: djId || 'dj-unknown',
        djName: djName || 'DJ Desconocido',
        eventId: eventId || 'event-unknown',
        eventName: eventName || 'Evento Desconocido',
        issueType: issueType as 'technical' | 'equipment' | 'sound' | 'other',
        description: description.trim(),
        priority: priority as 'low' | 'medium' | 'high' | 'critical'
      };

      const success = await technicalConnectionService.sendTechnicalReport(report);
      
      if (success) {
        setIsSuccess(true);
        
        // Cerrar modal después de 2 segundos
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          // Resetear formulario
          setIssueType('');
          setPriority('');
          setDescription('');
        }, 2000);
      } else {
        alert('Error al enviar el reporte. Intenta nuevamente.');
      }
      
    } catch (error) {
      console.error('Error enviando reporte:', error);
      alert('Error al enviar el reporte. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>
            <FaExclamationTriangle style={{ color: '#f59e0b' }} />
            Reporte Técnico
          </h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </ModalHeader>

        {isSuccess ? (
          <SuccessMessage>
            ✅ Reporte enviado exitosamente al equipo técnico
          </SuccessMessage>
        ) : (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <label>Evento</label>
              <input 
                type="text" 
                value={eventName || 'No especificado'} 
                disabled 
              />
            </FormGroup>

            <FormGroup>
              <label>Tipo de Problema *</label>
              <IssueTypeGrid>
                {issueTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <IssueTypeOption
                      key={type.id}
                      isSelected={issueType === type.id}
                      issueType={type.id}
                      onClick={() => setIssueType(type.id)}
                    >
                      <div className="option-header">
                        <div className="option-icon">
                          <IconComponent />
                        </div>
                        <div className="option-title">{type.title}</div>
                      </div>
                      <div className="option-description">{type.description}</div>
                    </IssueTypeOption>
                  );
                })}
              </IssueTypeGrid>
            </FormGroup>

            <FormGroup>
              <label>Prioridad *</label>
              <PriorityGrid>
                {priorities.map((priorityOption) => (
                  <PriorityOption
                    key={priorityOption.id}
                    isSelected={priority === priorityOption.id}
                    priority={priorityOption.id}
                    onClick={() => setPriority(priorityOption.id)}
                  >
                    {priorityOption.label}
                  </PriorityOption>
                ))}
              </PriorityGrid>
            </FormGroup>

            <FormGroup>
              <label>Descripción del Problema *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe detalladamente el problema que estás experimentando..."
                required
              />
            </FormGroup>

            <FormActions>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="success" 
                disabled={isSubmitting || !issueType || !priority || !description.trim()}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                    Enviando...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Enviar Reporte
                  </>
                )}
              </Button>
            </FormActions>
          </Form>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default TechnicalReportModal;
