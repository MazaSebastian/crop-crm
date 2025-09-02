import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaPlay, 
  FaPause, 
  FaDownload, 
  FaFolder,
  FaMusic,
  FaClock,
  FaFileAudio
} from 'react-icons/fa';

interface ShowTrack {
  id: string;
  title: string;
  category: string;
  duration: string;
  fileSize: string;
  driveUrl: string;
  description?: string;
}

const ShowsContainer = styled.div`
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
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background: #2563eb;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

const TracksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
`;

const TrackCard = styled.div<{ isPlaying: boolean }>`
  background: ${props => props.isPlaying ? '#f0f9ff' : 'white'};
  border: 2px solid ${props => props.isPlaying ? '#3b82f6' : '#e5e7eb'};
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: all 0.2s;
  cursor: pointer;
  
  &:hover {
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const TrackHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const TrackInfo = styled.div`
  flex: 1;
`;

const TrackTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
`;

const TrackMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const TrackMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const TrackActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ variant?: 'play' | 'download' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.variant === 'play' ? '#3b82f6' : '#f3f4f6'};
  color: ${props => props.variant === 'play' ? 'white' : '#6b7280'};
  
  &:hover {
    background: ${props => props.variant === 'play' ? '#2563eb' : '#e5e7eb'};
    transform: scale(1.1);
  }
`;

const TrackDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
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

const ShowsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Datos de shows basados en la carpeta de Google Drive
  const showTracks: ShowTrack[] = [
    // Shows Temáticos
    {
      id: '1',
      title: 'HITMAN NUEVO - 14 MIN',
      category: 'Shows Temáticos',
      duration: '14:00',
      fileSize: '16.1 MB',
      driveUrl: 'https://drive.google.com/drive/folders/10uj-SeJMp7I3aRRSXuLz2KJZEhh8-emm',
      description: 'Show temático de Hitman con efectos especiales y música característica'
    },
    {
      id: '2',
      title: 'INTRO ASTRONAUTAS TROMB',
      category: 'Shows Temáticos',
      duration: '12:24',
      fileSize: '12.4 MB',
      driveUrl: 'https://drive.google.com/drive/folders/10uj-SeJMp7I3aRRSXuLz2KJZEhh8-emm',
      description: 'Intro espectacular con temática espacial y efectos de trombon'
    },
    {
      id: '3',
      title: 'INTRO DADDY YANKEE',
      category: 'Shows Temáticos',
      duration: '9:30',
      fileSize: '9.5 MB',
      driveUrl: 'https://drive.google.com/drive/folders/10uj-SeJMp7I3aRRSXuLz2KJZEhh8-emm',
      description: 'Intro energético con la música característica de Daddy Yankee'
    },
    {
      id: '4',
      title: 'INTRO HARRY POTTER',
      category: 'Shows Temáticos',
      duration: '9:36',
      fileSize: '9.6 MB',
      driveUrl: 'https://drive.google.com/drive/folders/10uj-SeJMp7I3aRRSXuLz2KJZEhh8-emm',
      description: 'Intro mágico con la banda sonora de Harry Potter'
    },
    {
      id: '5',
      title: 'STAR WARS',
      category: 'Shows Temáticos',
      duration: '4:18',
      fileSize: '4.3 MB',
      driveUrl: 'https://drive.google.com/drive/folders/10uj-SeJMp7I3aRRSXuLz2KJZEhh8-emm',
      description: 'Show épico con la música característica de Star Wars'
    },
    
    // Shows Especiales
    {
      id: '6',
      title: 'STICKMAN ALL INCLUSIVE EDIT LAUDJ',
      category: 'Shows Especiales',
      duration: '38:24',
      fileSize: '38.4 MB',
      driveUrl: 'https://drive.google.com/drive/folders/10uj-SeJMp7I3aRRSXuLz2KJZEhh8-emm',
      description: 'Show completo de Stickman con edición especial para eventos all inclusive'
    },
    {
      id: '7',
      title: 'STICKMAN ALL INCLUSIVE',
      category: 'Shows Especiales',
      duration: '38:24',
      fileSize: '38.4 MB',
      driveUrl: 'https://drive.google.com/drive/folders/10uj-SeJMp7I3aRRSXuLz2KJZEhh8-emm',
      description: 'Versión original del show Stickman para eventos all inclusive'
    },
    {
      id: '8',
      title: 'STICKMAN OCTUBRE',
      category: 'Shows Especiales',
      duration: '58:36',
      fileSize: '58.6 MB',
      driveUrl: 'https://drive.google.com/drive/folders/10uj-SeJMp7I3aRRSXuLz2KJZEhh8-emm',
      description: 'Show especial de Stickman con temática de octubre'
    },
    {
      id: '9',
      title: 'THE CAPITOL SHOW JANOS master',
      category: 'Shows Especiales',
      duration: '46:06',
      fileSize: '46.1 MB',
      driveUrl: 'https://drive.google.com/drive/folders/10uj-SeJMp7I3aRRSXuLz2KJZEhh8-emm',
      description: 'Show principal de The Capitol con masterización profesional'
    },
    
    // Pistas Específicas
    {
      id: '10',
      title: 'Hitman Pista Cumple',
      category: 'Pistas Específicas',
      duration: '30:48',
      fileSize: '30.8 MB',
      driveUrl: 'https://drive.google.com/drive/folders/10uj-SeJMp7I3aRRSXuLz2KJZEhh8-emm',
      description: 'Pista especial de Hitman para cumpleaños'
    },
    {
      id: '11',
      title: 'Purga',
      category: 'Pistas Específicas',
      duration: '5:24',
      fileSize: '5.4 MB',
      driveUrl: 'https://drive.google.com/drive/folders/10uj-SeJMp7I3aRRSXuLz2KJZEhh8-emm',
      description: 'Pista de alta energía para momentos intensos'
    }
  ];

  const categories = Array.from(new Set(showTracks.map(track => track.category)));

  const handlePlayPause = (trackId: string) => {
    if (currentlyPlaying === trackId) {
      // Pausar
      if (audioElement) {
        audioElement.pause();
        setAudioElement(null);
      }
      setCurrentlyPlaying(null);
    } else {
      // Reproducir nueva pista
      if (audioElement) {
        audioElement.pause();
      }
      
      // Simular reproducción (en producción esto conectaría con el archivo real)
      const newAudio = new Audio();
      setAudioElement(newAudio);
      setCurrentlyPlaying(trackId);
      
      // Simular fin de reproducción
      setTimeout(() => {
        setCurrentlyPlaying(null);
        setAudioElement(null);
      }, 5000);
    }
  };

  const handleDownload = (track: ShowTrack) => {
    // En producción, esto descargaría el archivo real desde Google Drive
    window.open(track.driveUrl, '_blank');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Shows Temáticos':
        return <FaPlay />;
      case 'Shows Especiales':
        return <FaMusic />;
      case 'Pistas Específicas':
        return <FaFileAudio />;
      default:
        return <FaFolder />;
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'Shows Temáticos':
        return 'Shows con temáticas específicas y efectos especiales';
      case 'Shows Especiales':
        return 'Shows completos para eventos especiales';
      case 'Pistas Específicas':
        return 'Pistas individuales para momentos específicos';
      default:
        return 'Contenido de shows artísticos';
    }
  };

  return (
    <ShowsContainer>
      <HeaderSection>
        <HeaderContent>
          <HeaderLeft>
            <BackButton onClick={() => navigate('/dashboard')}>
              <FaArrowLeft />
              Volver al Dashboard
            </BackButton>
            <div>
              <PageTitle>Shows Artísticos</PageTitle>
              <PageSubtitle>Pistas de audio para los shows de la cartilla de Janos</PageSubtitle>
            </div>
          </HeaderLeft>
          <HeaderRight>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Contenido desde Google Drive
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                {showTracks.length} pistas disponibles
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
              
              <TracksGrid>
                {showTracks
                  .filter(track => track.category === category)
                  .map(track => (
                    <TrackCard 
                      key={track.id} 
                      isPlaying={currentlyPlaying === track.id}
                    >
                      <TrackHeader>
                        <TrackInfo>
                          <TrackTitle>{track.title}</TrackTitle>
                          <TrackMeta>
                            <TrackMetaItem>
                              <FaClock />
                              {track.duration}
                            </TrackMetaItem>
                            <TrackMetaItem>
                              <FaFileAudio />
                              {track.fileSize}
                            </TrackMetaItem>
                          </TrackMeta>
                        </TrackInfo>
                        <TrackActions>
                          <ActionButton
                            variant="play"
                            onClick={() => handlePlayPause(track.id)}
                            title={currentlyPlaying === track.id ? 'Pausar' : 'Reproducir'}
                          >
                            {currentlyPlaying === track.id ? <FaPause /> : <FaPlay />}
                          </ActionButton>
                          <ActionButton
                            onClick={() => handleDownload(track)}
                            title="Descargar"
                          >
                            <FaDownload />
                          </ActionButton>
                        </TrackActions>
                      </TrackHeader>
                      {track.description && (
                        <TrackDescription>{track.description}</TrackDescription>
                      )}
                    </TrackCard>
                  ))}
              </TracksGrid>
            </CategorySection>
          ))
        ) : (
          <EmptyState>
            <div className="empty-icon">
              <FaMusic />
            </div>
            <h3>No hay shows disponibles</h3>
            <p>Los shows artísticos aparecerán aquí cuando estén disponibles</p>
          </EmptyState>
        )}
      </MainContent>
    </ShowsContainer>
  );
};

export default ShowsPage;
