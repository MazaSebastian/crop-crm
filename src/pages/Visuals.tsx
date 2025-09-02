import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaDownload, 
  FaPlay,
  FaPause,
  FaVideo,
  FaImage,
  FaFileVideo,
  FaExternalLinkAlt,
  FaEye,
  FaClock,
  FaFileArchive,
  FaExpand,
  FaCompress
} from 'react-icons/fa';

interface VisualItem {
  id: string;
  name: string;
  category: string;
  duration: string;
  fileSize: string;
  format: string;
  resolution: string;
  description: string;
  previewUrl: string;
  downloadUrl: string;
  tags: string[];
  usage: string;
}

const VisualsContainer = styled.div`
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

const CategorySection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
`;

const CategoryIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
`;

const CategoryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const CategoryDescription = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
`;

const VisualsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const VisualCard = styled.div`
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.2s;
  
  &:hover {
    border-color: #8b5cf6;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const PreviewSection = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background: #000;
  overflow: hidden;
`;

const PreviewImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
`;

const PreviewOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  
  ${VisualCard}:hover & {
    opacity: 1;
  }
`;

const PreviewButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(139, 92, 246, 0.9);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(139, 92, 246, 1);
    transform: scale(1.1);
  }
`;

const VisualInfo = styled.div`
  padding: 1.25rem;
`;

const VisualHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const VisualInfoLeft = styled.div`
  flex: 1;
`;

const VisualName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
`;

const VisualMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
`;

const VisualMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const VisualActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
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
  background: ${props => props.variant === 'primary' ? '#8b5cf6' : '#f3f4f6'};
  color: ${props => props.variant === 'primary' ? 'white' : '#6b7280'};
  
  &:hover {
    background: ${props => props.variant === 'primary' ? '#7c3aed' : '#e5e7eb'};
    transform: translateY(-1px);
  }
`;

const VisualDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
`;

const VisualTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
`;

const UsageInfo = styled.div`
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border-left: 3px solid #8b5cf6;
`;

const UsageTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UsageText = styled.p`
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
`;

const ModalVideo = styled.video`
  width: 100%;
  height: auto;
  max-height: 80vh;
`;

const ModalImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
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

const VisualsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedVisual, setSelectedVisual] = useState<VisualItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Datos de visuales para pantallas de salones
  const visualItems: VisualItem[] = [
    // Visuales de Fondo
    {
      id: '1',
      name: 'Fondo Dinámico - Partículas',
      category: 'Visuales de Fondo',
      duration: '10:00',
      fileSize: '45.2 MB',
      format: 'MP4',
      resolution: '1920x1080',
      description: 'Fondo animado con partículas flotantes en movimiento constante, ideal para momentos de transición.',
      previewUrl: 'https://via.placeholder.com/450x250/8b5cf6/ffffff?text=Partículas',
      downloadUrl: '#',
      tags: ['Fondo', 'Partículas', 'Animado', 'Transición'],
      usage: 'Ideal para momentos de transición entre canciones o durante presentaciones'
    },
    {
      id: '2',
      name: 'Fondo - Olas de Luz',
      category: 'Visuales de Fondo',
      duration: '15:00',
      fileSize: '67.8 MB',
      format: 'MP4',
      resolution: '1920x1080',
      description: 'Ondas de luz que se mueven de forma fluida, creando un ambiente relajante y elegante.',
      previewUrl: 'https://via.placeholder.com/450x250/7c3aed/ffffff?text=Olas+de+Luz',
      downloadUrl: '#',
      tags: ['Fondo', 'Olas', 'Luz', 'Elegante'],
      usage: 'Perfecto para eventos elegantes, cenas o momentos románticos'
    },
    {
      id: '3',
      name: 'Fondo - Geometría',
      category: 'Visuales de Fondo',
      duration: '12:00',
      fileSize: '52.1 MB',
      format: 'MP4',
      resolution: '1920x1080',
      description: 'Formas geométricas que se transforman y rotan, creando un efecto moderno y dinámico.',
      previewUrl: 'https://via.placeholder.com/450x250/6d28d9/ffffff?text=Geometría',
      downloadUrl: '#',
      tags: ['Fondo', 'Geometría', 'Moderno', 'Dinámico'],
      usage: 'Excelente para eventos modernos, corporativos o fiestas electrónicas'
    },

    // Visuales Temáticos
    {
      id: '4',
      name: 'Cumpleaños - Confeti',
      category: 'Visuales Temáticos',
      duration: '8:00',
      fileSize: '38.4 MB',
      format: 'MP4',
      resolution: '1920x1080',
      description: 'Celebración animada con confeti colorido y globos, perfecta para cumpleaños.',
      previewUrl: 'https://via.placeholder.com/450x250/ec4899/ffffff?text=Cumpleaños',
      downloadUrl: '#',
      tags: ['Cumpleaños', 'Confeti', 'Celebración', 'Colorido'],
      usage: 'Especialmente diseñado para celebraciones de cumpleaños'
    },
    {
      id: '5',
      name: 'Boda - Pétalos',
      category: 'Visuales Temáticos',
      duration: '20:00',
      fileSize: '89.5 MB',
      format: 'MP4',
      resolution: '1920x1080',
      description: 'Pétalos de rosa cayendo suavemente sobre un fondo romántico, ideal para bodas.',
      previewUrl: 'https://via.placeholder.com/450x250/f472b6/ffffff?text=Boda',
      downloadUrl: '#',
      tags: ['Boda', 'Pétalos', 'Romántico', 'Elegante'],
      usage: 'Perfecto para ceremonias de boda, primeros bailes y momentos románticos'
    },
    {
      id: '6',
      name: 'XV Años - Sparkles',
      category: 'Visuales Temáticos',
      duration: '10:00',
      fileSize: '56.2 MB',
      format: 'MP4',
      resolution: '1920x1080',
      description: 'Efectos de brillos y sparkles con colores vibrantes, diseñado para XV años.',
      previewUrl: 'https://via.placeholder.com/450x250/db2777/ffffff?text=XV+Años',
      downloadUrl: '#',
      tags: ['XV Años', 'Sparkles', 'Brillos', 'Vibrante'],
      usage: 'Especialmente creado para celebraciones de XV años'
    },

    // Visuales Musicales
    {
      id: '7',
      name: 'Equalizer - Clásico',
      category: 'Visuales Musicales',
      duration: '∞',
      fileSize: '12.3 MB',
      format: 'MP4',
      resolution: '1920x1080',
      description: 'Equalizador clásico que responde al audio en tiempo real, con barras verticales.',
      previewUrl: 'https://via.placeholder.com/450x250/10b981/ffffff?text=Equalizer',
      downloadUrl: '#',
      tags: ['Equalizer', 'Audio', 'Tiempo Real', 'Clásico'],
      usage: 'Funciona con cualquier música, responde al audio en tiempo real'
    },
    {
      id: '8',
      name: 'Ondas - Fluido',
      category: 'Visuales Musicales',
      duration: '∞',
      fileSize: '18.7 MB',
      format: 'MP4',
      resolution: '1920x1080',
      description: 'Ondas fluidas que se mueven al ritmo de la música, creando un efecto hipnótico.',
      previewUrl: 'https://via.placeholder.com/450x250/059669/ffffff?text=Ondas',
      downloadUrl: '#',
      tags: ['Ondas', 'Fluido', 'Hipnótico', 'Ritmo'],
      usage: 'Ideal para música electrónica, house y géneros con ritmo constante'
    },
    {
      id: '9',
      name: 'Partículas - Reactivas',
      category: 'Visuales Musicales',
      duration: '∞',
      fileSize: '25.1 MB',
      format: 'MP4',
      resolution: '1920x1080',
      description: 'Partículas que explotan y se mueven según los beats de la música.',
      previewUrl: 'https://via.placeholder.com/450x250/047857/ffffff?text=Partículas+Reactivas',
      downloadUrl: '#',
      tags: ['Partículas', 'Reactivas', 'Beats', 'Explosión'],
      usage: 'Perfecto para música con beats marcados, reggaeton, trap'
    },

    // Visuales Corporativos
    {
      id: '10',
      name: 'Corporativo - Minimalista',
      category: 'Visuales Corporativos',
      duration: '30:00',
      fileSize: '34.8 MB',
      format: 'MP4',
      resolution: '1920x1080',
      description: 'Diseño minimalista con elementos corporativos, ideal para eventos empresariales.',
      previewUrl: 'https://via.placeholder.com/450x250/6b7280/ffffff?text=Corporativo',
      downloadUrl: '#',
      tags: ['Corporativo', 'Minimalista', 'Profesional', 'Empresarial'],
      usage: 'Diseñado para eventos corporativos, presentaciones y reuniones empresariales'
    },
    {
      id: '11',
      name: 'Presentación - Elegante',
      category: 'Visuales Corporativos',
      duration: '45:00',
      fileSize: '67.2 MB',
      format: 'MP4',
      resolution: '1920x1080',
      description: 'Fondo elegante para presentaciones con transiciones suaves y elementos profesionales.',
      previewUrl: 'https://via.placeholder.com/450x250/4b5563/ffffff?text=Presentación',
      downloadUrl: '#',
      tags: ['Presentación', 'Elegante', 'Profesional', 'Transiciones'],
      usage: 'Ideal para presentaciones de productos, conferencias y eventos formales'
    }
  ];

  const categories = Array.from(new Set(visualItems.map(item => item.category)));

  const handlePreview = (visual: VisualItem) => {
    setSelectedVisual(visual);
    setIsModalOpen(true);
  };

  const handleDownload = (visual: VisualItem) => {
    // En producción, esto descargaría el archivo real
    window.open(visual.downloadUrl, '_blank');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVisual(null);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Visuales de Fondo':
        return <FaImage />;
      case 'Visuales Temáticos':
        return <FaVideo />;
      case 'Visuales Musicales':
        return <FaPlay />;
      case 'Visuales Corporativos':
        return <FaFileVideo />;
      default:
        return <FaVideo />;
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'Visuales de Fondo':
        return 'Fondos animados para momentos de transición y ambiente';
      case 'Visuales Temáticos':
        return 'Visuales específicos para eventos especiales';
      case 'Visuales Musicales':
        return 'Visuales que responden al audio en tiempo real';
      case 'Visuales Corporativos':
        return 'Material profesional para eventos empresariales';
      default:
        return 'Material visual para pantallas de salones';
    }
  };

  return (
    <VisualsContainer>
      <HeaderSection>
        <HeaderContent>
          <HeaderLeft>
            <BackButton onClick={() => navigate('/dashboard')} title="Volver al Dashboard">
              <FaArrowLeft />
              Dashboard
            </BackButton>
            <div>
              <PageTitle>Material Visual</PageTitle>
              <PageSubtitle>Visuales para pantallas de salones y eventos</PageSubtitle>
            </div>
          </HeaderLeft>
          <HeaderRight>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Material Profesional
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                {visualItems.length} visuales disponibles
              </div>
            </div>
          </HeaderRight>
        </HeaderContent>
      </HeaderSection>

      <MainContent>
        {categories.length > 0 ? (
          categories.map(category => (
            <CategorySection key={category}>
              <CategoryHeader>
                <CategoryIcon>
                  {getCategoryIcon(category)}
                </CategoryIcon>
                <div>
                  <CategoryTitle>{category}</CategoryTitle>
                  <CategoryDescription>{getCategoryDescription(category)}</CategoryDescription>
                </div>
              </CategoryHeader>
              
              <VisualsGrid>
                {visualItems
                  .filter(item => item.category === category)
                  .map(visual => (
                    <VisualCard key={visual.id}>
                      <PreviewSection>
                        <PreviewImage imageUrl={visual.previewUrl} />
                        <PreviewOverlay>
                          <PreviewButton onClick={() => handlePreview(visual)}>
                            <FaEye />
                          </PreviewButton>
                        </PreviewOverlay>
                      </PreviewSection>
                      
                      <VisualInfo>
                        <VisualHeader>
                          <VisualInfoLeft>
                            <VisualName>{visual.name}</VisualName>
                            <VisualMeta>
                              <VisualMetaItem>
                                <FaClock />
                                {visual.duration}
                              </VisualMetaItem>
                              <VisualMetaItem>
                                <FaFileArchive />
                                {visual.fileSize}
                              </VisualMetaItem>
                              <VisualMetaItem>
                                <FaVideo />
                                {visual.resolution}
                              </VisualMetaItem>
                            </VisualMeta>
                          </VisualInfoLeft>
                          <VisualActions>
                            <ActionButton
                              variant="primary"
                              onClick={() => handleDownload(visual)}
                              title="Descargar"
                            >
                              <FaDownload />
                              Descargar
                            </ActionButton>
                          </VisualActions>
                        </VisualHeader>
                        
                        <VisualDescription>{visual.description}</VisualDescription>
                        
                        <VisualTags>
                          {visual.tags.map(tag => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                        </VisualTags>
                        
                        <UsageInfo>
                          <UsageTitle>
                            <FaEye />
                            Uso Recomendado
                          </UsageTitle>
                          <UsageText>{visual.usage}</UsageText>
                        </UsageInfo>
                      </VisualInfo>
                    </VisualCard>
                  ))}
              </VisualsGrid>
            </CategorySection>
          ))
        ) : (
          <EmptyState>
            <div className="empty-icon">
              <FaVideo />
            </div>
            <h3>No hay visuales disponibles</h3>
            <p>El material visual aparecerá aquí cuando esté disponible</p>
          </EmptyState>
        )}
      </MainContent>

      <Modal isOpen={isModalOpen} onClick={closeModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={closeModal}>
            <FaCompress />
          </CloseButton>
          {selectedVisual && (
            <div>
              {selectedVisual.format === 'MP4' ? (
                <ModalVideo controls autoPlay>
                  <source src={selectedVisual.previewUrl} type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </ModalVideo>
              ) : (
                <ModalImage src={selectedVisual.previewUrl} alt={selectedVisual.name} />
              )}
            </div>
          )}
        </ModalContent>
      </Modal>
    </VisualsContainer>
  );
};

export default VisualsPage;
