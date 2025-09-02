import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaDownload, 
  FaPlay,
  FaPause,
  FaMusic,
  FaHeart,
  FaClock,
  FaFileAudio,
  FaExternalLinkAlt,
  FaEye,
  FaFileArchive,
  FaUser,
  FaStar,
  FaList,
  FaUpload
} from 'react-icons/fa';

interface MusicItem {
  id: string;
  title: string;
  artist: string;
  category: string;
  duration: string;
  fileSize: string;
  bpm: string;
  key: string;
  genre: string;
  description: string;
  previewUrl: string;
  downloadUrl: string;
  tags: string[];
  rating: number;
  addedBy: string;
  dateAdded: string;
}

const MusicContainer = styled.div`
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

const UploadSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 2px dashed #e5e7eb;
  transition: all 0.2s;
  
  &:hover {
    border-color: #f59e0b;
    background: #fef3c7;
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
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
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
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }
`;

const FormTextarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  grid-column: 1 / -1;
  
  &:hover {
    background: #d97706;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
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
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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

const MusicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
`;

const MusicCard = styled.div<{ isPlaying: boolean }>`
  background: ${props => props.isPlaying ? '#fef3c7' : 'white'};
  border: 2px solid ${props => props.isPlaying ? '#f59e0b' : '#e5e7eb'};
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.2s;
  
  &:hover {
    border-color: #f59e0b;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const MusicHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const MusicInfo = styled.div`
  flex: 1;
`;

const MusicTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
`;

const MusicArtist = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 0.75rem 0;
  font-weight: 500;
`;

const MusicMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
`;

const MusicMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const MusicActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ variant?: 'play' | 'download' | 'secondary' }>`
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
      case 'play': return '#f59e0b';
      case 'download': return '#10b981';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => props.variant ? 'white' : '#6b7280'};
  
  &:hover {
    background: ${props => {
      switch (props.variant) {
        case 'play': return '#d97706';
        case 'download': return '#059669';
        default: return '#e5e7eb';
      }
    }};
    transform: translateY(-1px);
  }
`;

const MusicDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
`;

const MusicTags = styled.div`
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

const MusicStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border-left: 3px solid #f59e0b;
`;

const StatsLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatsRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Star = styled.span<{ filled: boolean }>`
  color: ${props => props.filled ? '#f59e0b' : '#d1d5db'};
  font-size: 0.875rem;
`;

const MusicInfoSmall = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
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

const MusicPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    artist: '',
    category: '',
    genre: '',
    bpm: '',
    key: '',
    description: '',
    tags: '',
    file: null as File | null
  });
  const [isUploading, setIsUploading] = useState(false);

  // Datos de música para DJs
  const musicItems: MusicItem[] = [
    // Música Electrónica
    {
      id: '1',
      title: 'Midnight Groove',
      artist: 'DJ Pulse',
      category: 'Música Electrónica',
      duration: '3:45',
      fileSize: '8.2 MB',
      bpm: '128',
      key: 'Am',
      genre: 'House',
      description: 'Track de house progresivo con sintetizadores atmosféricos y beats energéticos.',
      previewUrl: '#',
      downloadUrl: '#',
      tags: ['House', 'Progresivo', 'Energético', 'Atmosférico'],
      rating: 4.5,
      addedBy: 'Carlos DJ',
      dateAdded: '2024-01-15'
    },
    {
      id: '2',
      title: 'Neon Lights',
      artist: 'Electro Master',
      category: 'Música Electrónica',
      duration: '4:12',
      fileSize: '9.1 MB',
      bpm: '130',
      key: 'F#m',
      genre: 'Trance',
      description: 'Trance épico con melodías envolventes y drops poderosos.',
      previewUrl: '#',
      downloadUrl: '#',
      tags: ['Trance', 'Épico', 'Melódico', 'Drops'],
      rating: 4.8,
      addedBy: 'María DJ',
      dateAdded: '2024-01-20'
    },
    {
      id: '3',
      title: 'Digital Dreams',
      artist: 'Tech Beats',
      category: 'Música Electrónica',
      duration: '3:58',
      fileSize: '7.8 MB',
      bpm: '125',
      key: 'Cm',
      genre: 'Techno',
      description: 'Techno industrial con ritmos mecánicos y efectos de sintetizador.',
      previewUrl: '#',
      downloadUrl: '#',
      tags: ['Techno', 'Industrial', 'Mecánico', 'Sintetizador'],
      rating: 4.2,
      addedBy: 'Luis DJ',
      dateAdded: '2024-01-18'
    },

    // Reggaeton y Urbano
    {
      id: '4',
      title: 'Fuego Latino',
      artist: 'Urban Flow',
      category: 'Reggaeton y Urbano',
      duration: '3:30',
      fileSize: '6.5 MB',
      bpm: '95',
      key: 'Gm',
      genre: 'Reggaeton',
      description: 'Reggaeton con dembow potente y letras en español.',
      previewUrl: '#',
      downloadUrl: '#',
      tags: ['Reggaeton', 'Dembow', 'Latino', 'Potente'],
      rating: 4.7,
      addedBy: 'Ana DJ',
      dateAdded: '2024-01-22'
    },
    {
      id: '5',
      title: 'Trap Kings',
      artist: 'Beat Maker',
      category: 'Reggaeton y Urbano',
      duration: '3:15',
      fileSize: '5.9 MB',
      bpm: '140',
      key: 'Am',
      genre: 'Trap',
      description: 'Trap con 808s pesados y hi-hats rápidos.',
      previewUrl: '#',
      downloadUrl: '#',
      tags: ['Trap', '808s', 'Hi-hats', 'Pesado'],
      rating: 4.4,
      addedBy: 'Roberto DJ',
      dateAdded: '2024-01-25'
    },
    {
      id: '6',
      title: 'Salsa Moderna',
      artist: 'Latin Groove',
      category: 'Reggaeton y Urbano',
      duration: '4:20',
      fileSize: '8.7 MB',
      bpm: '180',
      key: 'F',
      genre: 'Salsa',
      description: 'Salsa moderna con elementos electrónicos y ritmos tradicionales.',
      previewUrl: '#',
      downloadUrl: '#',
      tags: ['Salsa', 'Latino', 'Tradicional', 'Moderno'],
      rating: 4.6,
      addedBy: 'Carmen DJ',
      dateAdded: '2024-01-28'
    },

    // Pop y Comercial
    {
      id: '7',
      title: 'Summer Vibes',
      artist: 'Pop Star',
      category: 'Pop y Comercial',
      duration: '3:25',
      fileSize: '6.8 MB',
      bpm: '120',
      key: 'C',
      genre: 'Pop',
      description: 'Pop comercial con melodías pegajosas y coros memorables.',
      previewUrl: '#',
      downloadUrl: '#',
      tags: ['Pop', 'Comercial', 'Pegajoso', 'Melódico'],
      rating: 4.3,
      addedBy: 'Sofía DJ',
      dateAdded: '2024-01-30'
    },
    {
      id: '8',
      title: 'Dance Floor',
      artist: 'Club Hits',
      category: 'Pop y Comercial',
      duration: '3:40',
      fileSize: '7.2 MB',
      bpm: '125',
      key: 'Dm',
      genre: 'Dance',
      description: 'Dance pop con ritmos bailables y voces electrónicas.',
      previewUrl: '#',
      downloadUrl: '#',
      tags: ['Dance', 'Pop', 'Bailable', 'Electrónico'],
      rating: 4.5,
      addedBy: 'Diego DJ',
      dateAdded: '2024-02-01'
    },
    {
      id: '9',
      title: 'Retro Mix',
      artist: 'Classic DJ',
      category: 'Pop y Comercial',
      duration: '4:15',
      fileSize: '8.9 MB',
      bpm: '115',
      key: 'G',
      genre: 'Retro',
      description: 'Mix de éxitos retro con sonido moderno y efectos actualizados.',
      previewUrl: '#',
      downloadUrl: '#',
      tags: ['Retro', 'Clásicos', 'Mix', 'Actualizado'],
      rating: 4.7,
      addedBy: 'Patricia DJ',
      dateAdded: '2024-02-03'
    },

    // Rock y Alternativo
    {
      id: '10',
      title: 'Rock Anthem',
      artist: 'Guitar Hero',
      category: 'Rock y Alternativo',
      duration: '4:30',
      fileSize: '9.5 MB',
      bpm: '140',
      key: 'Em',
      genre: 'Rock',
      description: 'Rock clásico con guitarras potentes y ritmos energéticos.',
      previewUrl: '#',
      downloadUrl: '#',
      tags: ['Rock', 'Guitarras', 'Energético', 'Clásico'],
      rating: 4.4,
      addedBy: 'Miguel DJ',
      dateAdded: '2024-02-05'
    },
    {
      id: '11',
      title: 'Alternative Edge',
      artist: 'Indie Sound',
      category: 'Rock y Alternativo',
      duration: '3:55',
      fileSize: '7.8 MB',
      bpm: '110',
      key: 'Bm',
      genre: 'Alternative',
      description: 'Rock alternativo con sonidos experimentales y letras profundas.',
      previewUrl: '#',
      downloadUrl: '#',
      tags: ['Alternative', 'Experimental', 'Profundo', 'Indie'],
      rating: 4.1,
      addedBy: 'Laura DJ',
      dateAdded: '2024-02-07'
    },
    {
      id: '12',
      title: 'Metal Fusion',
      artist: 'Heavy Beats',
      category: 'Rock y Alternativo',
      duration: '5:20',
      fileSize: '11.2 MB',
      bpm: '160',
      key: 'Am',
      genre: 'Metal',
      description: 'Metal con elementos electrónicos y ritmos intensos.',
      previewUrl: '#',
      downloadUrl: '#',
      tags: ['Metal', 'Electrónico', 'Intenso', 'Fusión'],
      rating: 4.0,
      addedBy: 'Alejandro DJ',
      dateAdded: '2024-02-10'
    },

    // Instrumentales y Acapellas
    {
      id: '13',
      title: 'Piano Dreams',
      artist: 'Classical Touch',
      category: 'Instrumentales y Acapellas',
      duration: '3:45',
      fileSize: '5.2 MB',
      bpm: '90',
      key: 'Cm',
      genre: 'Instrumental',
      description: 'Pieza instrumental de piano con arreglos clásicos modernos.',
      previewUrl: '#',
      downloadUrl: '#',
      tags: ['Piano', 'Instrumental', 'Clásico', 'Emocional'],
      rating: 4.6,
      addedBy: 'Elena DJ',
      dateAdded: '2024-02-12'
    },
    {
      id: '14',
      title: 'Acapella Queen',
      artist: 'Vocal Master',
      category: 'Instrumentales y Acapellas',
      duration: '2:50',
      fileSize: '3.8 MB',
      bpm: '120',
      key: 'F',
      genre: 'Acapella',
      description: 'Acapella profesional para remixes y mashups.',
      previewUrl: '#',
      downloadUrl: '#',
      tags: ['Acapella', 'Vocal', 'Remix', 'Profesional'],
      rating: 4.8,
      addedBy: 'Ricardo DJ',
      dateAdded: '2024-02-15'
    },
    {
      id: '15',
      title: 'Jazz Fusion',
      artist: 'Smooth Jazz',
      category: 'Instrumentales y Acapellas',
      duration: '4:15',
      fileSize: '6.7 MB',
      bpm: '100',
      key: 'Dm',
      genre: 'Jazz',
      description: 'Jazz fusión con elementos electrónicos y ritmos suaves.',
      previewUrl: '#',
      downloadUrl: '#',
      tags: ['Jazz', 'Fusión', 'Suave', 'Electrónico'],
      rating: 4.3,
      addedBy: 'Isabel DJ',
      dateAdded: '2024-02-18'
    }
  ];

  const categories = Array.from(new Set(musicItems.map(item => item.category)));

  const handlePlayPause = (musicId: string) => {
    if (currentlyPlaying === musicId) {
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
      setCurrentlyPlaying(musicId);
      
      // Simular fin de reproducción
      setTimeout(() => {
        setCurrentlyPlaying(null);
        setAudioElement(null);
      }, 5000);
    }
  };

  const handleDownload = (music: MusicItem) => {
    // En producción, esto descargaría el archivo real
    window.open(music.downloadUrl, '_blank');
  };

  const handleUploadFormChange = (field: string, value: string | File) => {
    setUploadForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUploadFormChange('file', file);
    }
  };

  const handleUploadSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsUploading(true);
    
    // Simular subida (en producción esto enviaría al servidor)
    setTimeout(() => {
      const newMusic: MusicItem = {
        id: Date.now().toString(),
        title: uploadForm.title,
        artist: uploadForm.artist,
        category: uploadForm.category,
        duration: '3:30', // Simulado
        fileSize: '8.5 MB', // Simulado
        bpm: uploadForm.bpm,
        key: uploadForm.key,
        genre: uploadForm.genre,
        description: uploadForm.description,
        previewUrl: '#',
        downloadUrl: '#',
        tags: uploadForm.tags.split(',').map(tag => tag.trim()),
        rating: 0,
        addedBy: 'Tú', // En producción sería el usuario actual
        dateAdded: new Date().toISOString().split('T')[0]
      };
      
      // Agregar a la lista (en producción esto se haría en el backend)
      musicItems.unshift(newMusic);
      
      // Resetear formulario
      setUploadForm({
        title: '',
        artist: '',
        category: '',
        genre: '',
        bpm: '',
        key: '',
        description: '',
        tags: '',
        file: null
      });
      setShowUploadForm(false);
      setIsUploading(false);
      
      alert('¡Música subida exitosamente! Será revisada por el equipo.');
    }, 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Música Electrónica':
        return <FaMusic />;
      case 'Reggaeton y Urbano':
        return <FaHeart />;
      case 'Pop y Comercial':
        return <FaStar />;
      case 'Rock y Alternativo':
        return <FaList />;
      case 'Instrumentales y Acapellas':
        return <FaFileAudio />;
      default:
        return <FaMusic />;
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'Música Electrónica':
        return 'House, Trance, Techno y otros géneros electrónicos';
      case 'Reggaeton y Urbano':
        return 'Reggaeton, Trap, Salsa y música urbana latina';
      case 'Pop y Comercial':
        return 'Pop, Dance y éxitos comerciales';
      case 'Rock y Alternativo':
        return 'Rock, Metal y música alternativa';
      case 'Instrumentales y Acapellas':
        return 'Pistas instrumentales y acapellas para remixes';
      default:
        return 'Música para enriquecer la biblioteca de DJs';
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} filled={i <= rating}>
          ★
        </Star>
      );
    }
    return stars;
  };

  return (
    <MusicContainer>
      <HeaderSection>
        <HeaderContent>
          <HeaderLeft>
            <BackButton onClick={() => navigate('/dashboard')} title="Volver al Dashboard">
              <FaArrowLeft />
              Dashboard
            </BackButton>
            <div>
              <PageTitle>Biblioteca Musical Compartida</PageTitle>
              <PageSubtitle>Biblioteca colaborativa donde cada DJ comparte música útil con sus compañeros</PageSubtitle>
            </div>
          </HeaderLeft>
          <HeaderRight>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Biblioteca Colaborativa
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                {musicItems.length} tracks compartidos
              </div>
            </div>
          </HeaderRight>
        </HeaderContent>
      </HeaderSection>

      <MainContent>
        {/* Sección de Subida Colaborativa */}
        <UploadSection>
          <UploadHeader>
            <UploadIcon>
              <FaMusic />
            </UploadIcon>
            <div>
              <UploadTitle>Comparte tu Música</UploadTitle>
              <UploadDescription>
                Contribuye a la biblioteca compartida subiendo tracks que consideres útiles para tus compañeros DJs
              </UploadDescription>
            </div>
          </UploadHeader>
          
          {!showUploadForm ? (
            <UploadButton onClick={() => setShowUploadForm(true)}>
              <FaUpload />
              Subir Nueva Música
            </UploadButton>
          ) : (
            <UploadForm onSubmit={handleUploadSubmit}>
              <FormGroup>
                <FormLabel>Título del Track *</FormLabel>
                <FormInput
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => handleUploadFormChange('title', e.target.value)}
                  placeholder="Ej: Midnight Groove"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Artista *</FormLabel>
                <FormInput
                  type="text"
                  value={uploadForm.artist}
                  onChange={(e) => handleUploadFormChange('artist', e.target.value)}
                  placeholder="Ej: DJ Pulse"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Categoría *</FormLabel>
                <FormSelect
                  value={uploadForm.category}
                  onChange={(e) => handleUploadFormChange('category', e.target.value)}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="Música Electrónica">Música Electrónica</option>
                  <option value="Reggaeton y Urbano">Reggaeton y Urbano</option>
                  <option value="Pop y Comercial">Pop y Comercial</option>
                  <option value="Rock y Alternativo">Rock y Alternativo</option>
                  <option value="Instrumentales y Acapellas">Instrumentales y Acapellas</option>
                </FormSelect>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Género *</FormLabel>
                <FormInput
                  type="text"
                  value={uploadForm.genre}
                  onChange={(e) => handleUploadFormChange('genre', e.target.value)}
                  placeholder="Ej: House, Reggaeton, Pop"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>BPM</FormLabel>
                <FormInput
                  type="number"
                  value={uploadForm.bpm}
                  onChange={(e) => handleUploadFormChange('bpm', e.target.value)}
                  placeholder="Ej: 128"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Tonalidad</FormLabel>
                <FormInput
                  type="text"
                  value={uploadForm.key}
                  onChange={(e) => handleUploadFormChange('key', e.target.value)}
                  placeholder="Ej: Am, C, F#m"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Descripción</FormLabel>
                <FormTextarea
                  value={uploadForm.description}
                  onChange={(e) => handleUploadFormChange('description', e.target.value)}
                  placeholder="Describe el track, su estilo, características especiales..."
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Tags (separados por comas)</FormLabel>
                <FormInput
                  type="text"
                  value={uploadForm.tags}
                  onChange={(e) => handleUploadFormChange('tags', e.target.value)}
                  placeholder="Ej: House, Progresivo, Energético, Atmosférico"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Archivo de Audio *</FormLabel>
                <FormInput
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  required
                />
              </FormGroup>
              
              <div style={{ display: 'flex', gap: '1rem', gridColumn: '1 / -1' }}>
                <UploadButton type="submit" disabled={isUploading}>
                  {isUploading ? 'Subiendo...' : 'Subir Música'}
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
              
              <MusicGrid>
                {musicItems
                  .filter(item => item.category === category)
                  .map(music => (
                    <MusicCard key={music.id} isPlaying={currentlyPlaying === music.id}>
                      <MusicHeader>
                        <MusicInfo>
                          <MusicTitle>{music.title}</MusicTitle>
                          <MusicArtist>{music.artist}</MusicArtist>
                          <MusicMeta>
                            <MusicMetaItem>
                              <FaClock />
                              {music.duration}
                            </MusicMetaItem>
                            <MusicMetaItem>
                              <FaFileArchive />
                              {music.fileSize}
                            </MusicMetaItem>
                            <MusicMetaItem>
                              <FaMusic />
                              {music.bpm} BPM
                            </MusicMetaItem>
                            <MusicMetaItem>
                              <FaStar />
                              {music.key}
                            </MusicMetaItem>
                          </MusicMeta>
                        </MusicInfo>
                        <MusicActions>
                          <ActionButton
                            variant="play"
                            onClick={() => handlePlayPause(music.id)}
                            title={currentlyPlaying === music.id ? 'Pausar' : 'Reproducir'}
                          >
                            {currentlyPlaying === music.id ? <FaPause /> : <FaPlay />}
                            {currentlyPlaying === music.id ? 'Pausar' : 'Play'}
                          </ActionButton>
                          <ActionButton
                            variant="download"
                            onClick={() => handleDownload(music)}
                            title="Descargar"
                          >
                            <FaDownload />
                            Descargar
                          </ActionButton>
                        </MusicActions>
                      </MusicHeader>
                      
                      <MusicDescription>{music.description}</MusicDescription>
                      
                      <MusicTags>
                        {music.tags.map(tag => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </MusicTags>
                      
                      <MusicStats>
                        <StatsLeft>
                          <Rating>
                            {renderStars(music.rating)}
                            <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}>
                              {music.rating}
                            </span>
                          </Rating>
                          <MusicInfoSmall>
                            <FaUser />
                            {music.addedBy}
                          </MusicInfoSmall>
                        </StatsLeft>
                        <StatsRight>
                          <MusicInfoSmall>
                            <FaClock />
                            {music.dateAdded}
                          </MusicInfoSmall>
                        </StatsRight>
                      </MusicStats>
                    </MusicCard>
                  ))}
              </MusicGrid>
            </CategorySection>
          ))
        ) : (
          <EmptyState>
            <div className="empty-icon">
              <FaMusic />
            </div>
            <h3>No hay música disponible</h3>
            <p>La biblioteca musical aparecerá aquí cuando esté disponible</p>
          </EmptyState>
        )}
      </MainContent>
    </MusicContainer>
  );
};

export default MusicPage;
