import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaUpload, 
  FaImage,
  FaStar,
  FaTrophy,
  FaChartLine,
  FaCalendarAlt,
  FaFileImage,
  FaTrash,
  FaEye,
  FaDownload,
  FaMedal,
  FaCrown,
  FaGem
} from 'react-icons/fa';

interface ReturnItem {
  id: string;
  title: string;
  description: string;
  screenshotUrl: string;
  dateSubmitted: string;
  rating: number;
  feedback: string;
  category: string;
  eventType: string;
  clientName: string;
}

interface UserLevel {
  level: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  returnsNeeded: number;
  description: string;
}

const ReturnsContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.75rem;
  font-weight: 400;
  opacity: 0.8;
  
  &:hover {
    background: rgba(59, 130, 246, 0.2);
    opacity: 1;
    transform: translateY(-1px);
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const PageSubtitle = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 1rem;
`;

const MainContent = styled.div`
  display: grid;
  gap: 2rem;
`;

// Sección de Nivel del Usuario
const LevelSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1.5rem;
  padding: 2.5rem;
  color: white;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: float 10s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-25px) rotate(180deg); }
  }
`;

const LevelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const LevelInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LevelIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const LevelDetails = styled.div`
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }
  
  p {
    margin: 0;
    opacity: 0.9;
    font-size: 0.875rem;
  }
`;

const LevelStats = styled.div`
  text-align: right;
  
  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.875rem;
    opacity: 0.8;
  }
`;

const ProgressSection = styled.div`
  margin-top: 1.5rem;
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percentage: number }>`
  height: 100%;
  background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
  border-radius: 6px;
`;

// Sección de Subida
const UploadSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 2px dashed #e5e7eb;
  transition: all 0.2s;
  
  &:hover {
    border-color: #667eea;
    background: #f8fafc;
  }
`;

const UploadHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const UploadIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
`;

const UploadTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const UploadDescription = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
`;

const UploadForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const FormInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const FormSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const FormTextarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;
  
  &:hover {
    border-color: #667eea;
    background: #f8fafc;
  }
  
  &.has-file {
    border-color: #10b981;
    background: #f0fdf4;
  }
`;

const FileUploadIcon = styled.div`
  font-size: 2rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const FileUploadText = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  grid-column: 1 / -1;
  
  &:hover {
    background: #5a67d8;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

// Sección de Devoluciones
const ReturnsSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
`;

const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const ReturnsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
`;

const ReturnCard = styled.div`
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.2s;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const ScreenshotSection = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background: #f3f4f6;
  overflow: hidden;
`;

const ScreenshotImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ScreenshotOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  
  ${ReturnCard}:hover & {
    opacity: 1;
  }
`;

const OverlayButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  color: #1f2937;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: white;
    transform: scale(1.05);
  }
`;

const ReturnInfo = styled.div`
  padding: 1.5rem;
`;

const ReturnHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ReturnTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
`;

const ReturnRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #f59e0b;
  font-size: 0.875rem;
`;

const ReturnMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
`;

const ReturnMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ReturnDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
`;

const ReturnActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  background: ${props => {
    switch (props.variant) {
      case 'primary': return '#667eea';
      case 'danger': return '#ef4444';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => props.variant === 'primary' ? 'white' : props.variant === 'danger' ? 'white' : '#6b7280'};
  
  &:hover {
    background: ${props => {
      switch (props.variant) {
        case 'primary': return '#5a67d8';
        case 'danger': return '#dc2626';
        default: return '#e5e7eb';
      }
    }};
    transform: translateY(-1px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  
  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.875rem;
  }
`;

const ReturnsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: '',
    eventType: '',
    clientName: '',
    rating: 5,
    feedback: '',
    screenshot: null as File | null
  });

  // Datos de devoluciones (simulados)
  const [returns, setReturns] = useState<ReturnItem[]>([
    {
      id: '1',
      title: 'Excelente servicio en XV años',
      description: 'La familia quedó muy satisfecha con la música y el ambiente creado.',
      screenshotUrl: 'https://via.placeholder.com/400x200/667eea/ffffff?text=Screenshot+1',
      dateSubmitted: '2024-01-15',
      rating: 5,
      feedback: 'Muy profesional, puntual y excelente selección musical',
      category: 'XV Años',
      eventType: 'Fiesta',
      clientName: 'María González'
    },
    {
      id: '2',
      title: 'Casamiento perfecto',
      description: 'Todo salió según lo planeado, los invitados disfrutaron mucho.',
      screenshotUrl: 'https://via.placeholder.com/400x200/10b981/ffffff?text=Screenshot+2',
      dateSubmitted: '2024-01-10',
      rating: 5,
      feedback: 'Increíble trabajo, superó nuestras expectativas',
      category: 'Casamiento',
      eventType: 'Ceremonia',
      clientName: 'Carlos y Ana'
    }
  ]);

  // Sistema de niveles
  const userLevels: UserLevel[] = [
    { level: 1, title: 'Nivel 1', icon: <FaStar />, color: '#6b7280', returnsNeeded: 0, description: 'Comenzando el camino' },
    { level: 2, title: 'Nivel 2', icon: <FaMedal />, color: '#10b981', returnsNeeded: 5, description: 'Primeras devoluciones' },
    { level: 3, title: 'Nivel 3', icon: <FaTrophy />, color: '#f59e0b', returnsNeeded: 15, description: 'Experiencia demostrada' },
    { level: 4, title: 'Nivel 4', icon: <FaCrown />, color: '#ef4444', returnsNeeded: 30, description: 'Excelencia reconocida' },
    { level: 5, title: 'Nivel 5', icon: <FaGem />, color: '#8b5cf6', returnsNeeded: 50, description: 'Referente del equipo' }
  ];

  const currentReturns = returns.length;
  const currentLevel = userLevels.find(level => currentReturns >= level.returnsNeeded) || userLevels[0];
  const nextLevel = userLevels.find(level => level.returnsNeeded > currentReturns);
  
  const progressPercentage = nextLevel 
    ? ((currentReturns - currentLevel.returnsNeeded) / (nextLevel.returnsNeeded - currentLevel.returnsNeeded)) * 100
    : 100;

  const handleUploadFormChange = (field: string, value: string | number | File) => {
    setUploadForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUploadFormChange('screenshot', file);
    }
  };

  const handleUploadSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsUploading(true);
    
    // Simular subida
    setTimeout(() => {
      const newReturn: ReturnItem = {
        id: Date.now().toString(),
        title: uploadForm.title,
        description: uploadForm.description,
        screenshotUrl: uploadForm.screenshot ? URL.createObjectURL(uploadForm.screenshot) : 'https://via.placeholder.com/400x200/667eea/ffffff?text=Nueva+Devolución',
        dateSubmitted: new Date().toISOString().split('T')[0],
        rating: uploadForm.rating,
        feedback: uploadForm.feedback,
        category: uploadForm.category,
        eventType: uploadForm.eventType,
        clientName: uploadForm.clientName
      };
      
      setReturns(prev => [newReturn, ...prev]);
      
      // Resetear formulario
      setUploadForm({
        title: '',
        description: '',
        category: '',
        eventType: '',
        clientName: '',
        rating: 5,
        feedback: '',
        screenshot: null
      });
      setShowUploadForm(false);
      setIsUploading(false);
      
      alert('¡Devolución subida exitosamente!');
    }, 2000);
  };

  const handleDeleteReturn = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta devolución?')) {
      setReturns(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleViewScreenshot = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <ReturnsContainer>
      <HeaderSection>
        <HeaderContent>
          <HeaderLeft>
            <BackButton onClick={() => navigate('/dashboard')} title="Volver al Dashboard">
              <FaArrowLeft />
              Dashboard
            </BackButton>
            <div>
              <PageTitle>Devoluciones</PageTitle>
              <PageSubtitle>Registra y gestiona las devoluciones de tus eventos</PageSubtitle>
            </div>
          </HeaderLeft>
          <HeaderRight>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Sistema de Niveles
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                {returns.length} devoluciones registradas
              </div>
            </div>
          </HeaderRight>
        </HeaderContent>
      </HeaderSection>

      <MainContent>
        {/* Sección de Nivel */}
        <LevelSection>
          <LevelHeader>
            <LevelInfo>
              <LevelIcon color={currentLevel.color}>
                {currentLevel.icon}
              </LevelIcon>
              <LevelDetails>
                <h2>{currentLevel.title}</h2>
                <p>{currentLevel.description}</p>
              </LevelDetails>
            </LevelInfo>
            <LevelStats>
              <div className="stat-number">{currentReturns}</div>
              <div className="stat-label">Devoluciones</div>
            </LevelStats>
          </LevelHeader>
          
          <ProgressSection>
            <ProgressInfo>
              <span>Progreso al siguiente nivel</span>
              <span>{nextLevel ? `${currentReturns}/${nextLevel.returnsNeeded}` : 'Nivel máximo alcanzado'}</span>
            </ProgressInfo>
            <ProgressBar>
              <ProgressFill percentage={progressPercentage} />
            </ProgressBar>
            {nextLevel && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.8 }}>
                Siguiente: {nextLevel.title} ({nextLevel.returnsNeeded - currentReturns} devoluciones más)
              </div>
            )}
          </ProgressSection>
        </LevelSection>

        {/* Sección de Subida */}
        <UploadSection>
          <UploadHeader>
            <UploadIcon>
              <FaUpload />
            </UploadIcon>
            <div>
              <UploadTitle>Registrar Nueva Devolución</UploadTitle>
              <UploadDescription>
                Sube las devoluciones que recibes de forma privada para mejorar tu perfil
              </UploadDescription>
            </div>
          </UploadHeader>
          
          {!showUploadForm ? (
            <UploadButton onClick={() => setShowUploadForm(true)}>
              <FaUpload />
              Subir Devolución
            </UploadButton>
          ) : (
            <UploadForm onSubmit={handleUploadSubmit}>
              <FormGroup>
                <FormLabel>Título de la Devolución *</FormLabel>
                <FormInput
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => handleUploadFormChange('title', e.target.value)}
                  placeholder="Ej: Excelente servicio en XV años"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Categoría del Evento *</FormLabel>
                <FormSelect
                  value={uploadForm.category}
                  onChange={(e) => handleUploadFormChange('category', e.target.value)}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="XV Años">XV Años</option>
                  <option value="Casamiento">Casamiento</option>
                  <option value="Cumpleaños">Cumpleaños</option>
                  <option value="Evento Corporativo">Evento Corporativo</option>
                  <option value="Fiesta Privada">Fiesta Privada</option>
                  <option value="Otro">Otro</option>
                </FormSelect>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Tipo de Evento *</FormLabel>
                <FormSelect
                  value={uploadForm.eventType}
                  onChange={(e) => handleUploadFormChange('eventType', e.target.value)}
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Fiesta">Fiesta</option>
                  <option value="Ceremonia">Ceremonia</option>
                  <option value="Recepción">Recepción</option>
                  <option value="After Party">After Party</option>
                  <option value="Otro">Otro</option>
                </FormSelect>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Nombre del Cliente</FormLabel>
                <FormInput
                  type="text"
                  value={uploadForm.clientName}
                  onChange={(e) => handleUploadFormChange('clientName', e.target.value)}
                  placeholder="Ej: María González"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Calificación *</FormLabel>
                <FormSelect
                  value={uploadForm.rating}
                  onChange={(e) => handleUploadFormChange('rating', parseInt(e.target.value))}
                  required
                >
                  <option value={5}>⭐⭐⭐⭐⭐ Excelente (5)</option>
                  <option value={4}>⭐⭐⭐⭐ Muy Bueno (4)</option>
                  <option value={3}>⭐⭐⭐ Bueno (3)</option>
                  <option value={2}>⭐⭐ Regular (2)</option>
                  <option value={1}>⭐ Malo (1)</option>
                </FormSelect>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Descripción</FormLabel>
                <FormTextarea
                  value={uploadForm.description}
                  onChange={(e) => handleUploadFormChange('description', e.target.value)}
                  placeholder="Describe brevemente la devolución..."
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Feedback Detallado</FormLabel>
                <FormTextarea
                  value={uploadForm.feedback}
                  onChange={(e) => handleUploadFormChange('feedback', e.target.value)}
                  placeholder="Comentarios específicos del cliente..."
                />
              </FormGroup>
              
              <FormGroup style={{ gridColumn: '1 / -1' }}>
                <FormLabel>Screenshot de la Devolución *</FormLabel>
                <FileUploadArea 
                  className={uploadForm.screenshot ? 'has-file' : ''}
                  onClick={() => document.getElementById('screenshot-upload')?.click()}
                >
                  <FileUploadIcon>
                    <FaImage />
                  </FileUploadIcon>
                  <FileUploadText>
                    {uploadForm.screenshot 
                      ? `Archivo seleccionado: ${uploadForm.screenshot.name}`
                      : 'Haz clic para seleccionar una imagen'
                    }
                  </FileUploadText>
                </FileUploadArea>
                <input
                  id="screenshot-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  required
                />
              </FormGroup>
              
              <div style={{ display: 'flex', gap: '1rem', gridColumn: '1 / -1' }}>
                <UploadButton type="submit" disabled={isUploading}>
                  {isUploading ? 'Subiendo...' : 'Subir Devolución'}
                </UploadButton>
                <UploadButton 
                  type="button" 
                  onClick={() => setShowUploadForm(false)}
                  style={{ background: '#6b7280' }}
                >
                  Cancelar
                </UploadButton>
              </div>
            </UploadForm>
          )}
        </UploadSection>

        {/* Sección de Devoluciones */}
        <ReturnsSection>
          <SectionHeader>
            <SectionIcon>
              <FaChartLine />
            </SectionIcon>
            <SectionTitle>Mis Devoluciones</SectionTitle>
          </SectionHeader>
          
          {returns.length > 0 ? (
            <ReturnsGrid>
              {returns.map(returnItem => (
                <ReturnCard key={returnItem.id}>
                  <ScreenshotSection>
                    <ScreenshotImage src={returnItem.screenshotUrl} alt="Screenshot" />
                    <ScreenshotOverlay>
                      <OverlayButton onClick={() => handleViewScreenshot(returnItem.screenshotUrl)}>
                        <FaEye />
                        Ver Imagen
                      </OverlayButton>
                    </ScreenshotOverlay>
                  </ScreenshotSection>
                  
                  <ReturnInfo>
                    <ReturnHeader>
                      <div>
                        <ReturnTitle>{returnItem.title}</ReturnTitle>
                        <ReturnRating>
                          {[...Array(returnItem.rating)].map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </ReturnRating>
                      </div>
                    </ReturnHeader>
                    
                    <ReturnMeta>
                      <ReturnMetaItem>
                        <FaCalendarAlt />
                        {returnItem.dateSubmitted}
                      </ReturnMetaItem>
                      <ReturnMetaItem>
                        <FaFileImage />
                        {returnItem.category}
                      </ReturnMetaItem>
                      {returnItem.clientName && (
                        <ReturnMetaItem>
                          {returnItem.clientName}
                        </ReturnMetaItem>
                      )}
                    </ReturnMeta>
                    
                    <ReturnDescription>{returnItem.description}</ReturnDescription>
                    
                    {returnItem.feedback && (
                      <div style={{ 
                        background: '#f9fafb', 
                        padding: '0.75rem', 
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                        fontSize: '0.8rem',
                        color: '#6b7280',
                        fontStyle: 'italic'
                      }}>
                        "{returnItem.feedback}"
                      </div>
                    )}
                    
                    <ReturnActions>
                      <ActionButton
                        variant="primary"
                        onClick={() => handleViewScreenshot(returnItem.screenshotUrl)}
                      >
                        <FaEye />
                        Ver
                      </ActionButton>
                      <ActionButton
                        onClick={() => window.open(returnItem.screenshotUrl, '_blank')}
                      >
                        <FaDownload />
                        Descargar
                      </ActionButton>
                      <ActionButton
                        variant="danger"
                        onClick={() => handleDeleteReturn(returnItem.id)}
                      >
                        <FaTrash />
                        Eliminar
                      </ActionButton>
                    </ReturnActions>
                  </ReturnInfo>
                </ReturnCard>
              ))}
            </ReturnsGrid>
          ) : (
            <EmptyState>
              <div className="empty-icon">
                <FaChartLine />
              </div>
              <h3>No hay devoluciones registradas</h3>
              <p>Comienza subiendo tu primera devolución para mejorar tu perfil</p>
            </EmptyState>
          )}
        </ReturnsSection>
      </MainContent>
    </ReturnsContainer>
  );
};

export default ReturnsPage;
