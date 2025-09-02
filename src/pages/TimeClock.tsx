import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  FaClock, 
  FaSignInAlt, 
  FaSignOutAlt, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaFileExcel,
  FaArrowLeft
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTimeClock, TimeRecord } from '../context/TimeClockContext';

const TimeClockContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
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
    margin: 0 0 0.5rem 0;
  }
  
  p {
    font-size: 1rem;
    opacity: 0.9;
    margin: 0;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .current-time {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .current-date {
    font-size: 1rem;
    opacity: 0.9;
  }
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

const ClockInSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LocationInfo = styled.div`
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
`;

const LocationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  .location-icon {
    color: #3b82f6;
    font-size: 1.25rem;
  }
  
  .location-title {
    font-weight: 600;
    color: #1e293b;
  }
`;

const LocationDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  .location-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    
    .label {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }
    
    .value {
      font-size: 1rem;
      color: #1e293b;
      font-weight: 600;
    }
  }
`;

const ClockButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ClockButton = styled.button<{ variant: 'in' | 'out'; disabled?: boolean }>`
  flex: 1;
  padding: 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  
  background: ${props => {
    if (props.disabled) return '#f1f5f9';
    return props.variant === 'in' ? '#10b981' : '#ef4444';
  }};
  
  color: ${props => props.disabled ? '#94a3b8' : 'white'};
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }
  
  .button-icon {
    font-size: 1.5rem;
  }
  
  .button-text {
    font-size: 0.875rem;
  }
`;

const StatusMessage = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  
  background: ${props => {
    switch (props.type) {
      case 'success': return '#dcfce7';
      case 'error': return '#fee2e2';
      case 'info': return '#dbeafe';
    }
  }};
  
  color: ${props => {
    switch (props.type) {
      case 'success': return '#166534';
      case 'error': return '#991b1b';
      case 'info': return '#1e40af';
    }
  }};
  
  border: 1px solid ${props => {
    switch (props.type) {
      case 'success': return '#bbf7d0';
      case 'error': return '#fecaca';
      case 'info': return '#bfdbfe';
    }
  }};
`;

const RecordsSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const RecordsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background: #059669;
    transform: translateY(-1px);
  }
`;

const RecordsTable = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  background: #f8fafc;
  padding: 1rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e2e8f0;
`;

const TableRow = styled.div<{ isToday?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  background: ${props => props.isToday ? '#fef3c7' : 'white'};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f8fafc;
  }
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  
  .status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
    
    &.in {
      background: #dcfce7;
      color: #166534;
    }
    
    &.out {
      background: #fee2e2;
      color: #991b1b;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #3b82f6;
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;



interface Location {
  salon: string;
  address: string;
  distance: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const TimeClock: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    state, 
    clockIn, 
    clockOut, 
    getRecords, 
    getTodayRecord, 
    canClockIn, 
    canClockOut, 
    exportRecords 
  } = useTimeClock();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Simular ubicaciones de salones
  const salonLocations: Location[] = [
    {
      salon: 'San Telmo',
      address: 'Av. San Juan 1234, San Telmo, CABA',
      distance: '0.2 km',
      coordinates: { lat: -34.6208, lng: -58.3736 }
    },
    {
      salon: 'Palermo',
      address: 'Av. Santa Fe 5678, Palermo, CABA',
      distance: '0.5 km',
      coordinates: { lat: -34.5895, lng: -58.4164 }
    },
    {
      salon: 'Recoleta',
      address: 'Av. Alvear 9012, Recoleta, CABA',
      distance: '0.3 km',
      coordinates: { lat: -34.5895, lng: -58.3924 }
    },
    {
      salon: 'Belgrano',
      address: 'Av. Cabildo 3456, Belgrano, CABA',
      distance: '0.8 km',
      coordinates: { lat: -34.5627, lng: -58.4567 }
    }
  ];

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simular detección de ubicación (desactivada temporalmente)
  useEffect(() => {
    const detectLocation = async () => {
      setIsLoadingLocation(true);
      
      // Simular delay de geolocalización
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular ubicación cercana a San Telmo (sin geolocalización real)
      const nearbySalon = salonLocations[0];
      setCurrentLocation(nearbySalon);
      setIsLoadingLocation(false);
    };

    detectLocation();
  }, []);



  const handleClockIn = async () => {
    if (!currentLocation) {
      setStatusMessage({ type: 'error', text: 'No se pudo detectar la ubicación' });
      return;
    }

    try {
      await clockIn(
        user?.id || '1',
        user?.name || 'Usuario',
        currentLocation.salon
      );
      
      setStatusMessage({ type: 'success', text: 'Fichaje de entrada registrado exitosamente' });
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Error al registrar fichaje de entrada' });
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleClockOut = async () => {
    const todayRecord = getTodayRecord();
    
    if (!todayRecord || todayRecord.status !== 'in') {
      setStatusMessage({ type: 'error', text: 'No hay fichaje de entrada para hoy' });
      return;
    }

    try {
      await clockOut(todayRecord.id);
      
      setStatusMessage({ type: 'success', text: 'Fichaje de salida registrado exitosamente' });
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Error al registrar fichaje de salida' });
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleExportRecords = () => {
    setStatusMessage({ type: 'info', text: 'Descargando archivo CSV...' });
    
    try {
      exportRecords();
      setStatusMessage({ type: 'success', text: 'Archivo CSV descargado exitosamente' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Error al exportar registros' });
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const canClockInNow = canClockIn();
  const canClockOutNow = canClockOut();

  return (
    <TimeClockContainer>
        <HeaderSection>
          <HeaderContent>
            <HeaderLeft>
              <h1>Sistema de Fichajes</h1>
              <p>Control de entrada y salida con geolocalización</p>
            </HeaderLeft>
            <HeaderRight>
                          <BackButton onClick={() => navigate('/dashboard')} title="Volver al Dashboard">
              <FaArrowLeft />
              Dashboard
            </BackButton>
              <div>
                <div className="current-time">
                  {currentTime.toLocaleTimeString('es-AR', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit' 
                  })}
                </div>
                <div className="current-date">
                  {currentTime.toLocaleDateString('es-AR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </HeaderRight>
          </HeaderContent>
        </HeaderSection>

        <MainContent>
          <ClockInSection>
            <SectionTitle>
              <FaClock />
              Fichaje de Entrada/Salida
            </SectionTitle>

            <LocationInfo>
              <LocationHeader>
                <FaMapMarkerAlt className="location-icon" />
                <span className="location-title">Ubicación Detectada (Simulada)</span>
              </LocationHeader>
              
              {isLoadingLocation ? (
                <LoadingSpinner>
                  <FaSpinner className="spinner" />
                  Detectando ubicación...
                </LoadingSpinner>
              ) : currentLocation ? (
                <LocationDetails>
                  <div className="location-item">
                    <span className="label">Salón:</span>
                    <span className="value">{currentLocation.salon}</span>
                  </div>
                  <div className="location-item">
                    <span className="label">Distancia:</span>
                    <span className="value">{currentLocation.distance}</span>
                  </div>
                  <div className="location-item">
                    <span className="label">Dirección:</span>
                    <span className="value">{currentLocation.address}</span>
                  </div>
                  <div className="location-item">
                    <span className="label">Estado:</span>
                    <span className="value">
                      <FaCheckCircle style={{ color: '#10b981' }} />
                      Dentro del radio permitido
                    </span>
                  </div>
                </LocationDetails>
              ) : (
                <StatusMessage type="error">
                  <FaExclamationTriangle />
                  No se pudo detectar la ubicación
                </StatusMessage>
              )}
            </LocationInfo>

            <ClockButtons>
              <ClockButton 
                variant="in" 
                onClick={handleClockIn}
                disabled={!canClockInNow || isLoadingLocation || state.isLoading}
              >
                <FaSignInAlt className="button-icon" />
                <span className="button-text">
                  {state.isLoading ? 'Registrando...' : 'Fichar Entrada'}
                </span>
              </ClockButton>
              
              <ClockButton 
                variant="out" 
                onClick={handleClockOut}
                disabled={!canClockOutNow || isLoadingLocation || state.isLoading}
              >
                <FaSignOutAlt className="button-icon" />
                <span className="button-text">
                  {state.isLoading ? 'Registrando...' : 'Fichar Salida'}
                </span>
              </ClockButton>
            </ClockButtons>

            {statusMessage && (
              <StatusMessage type={statusMessage.type}>
                {statusMessage.type === 'success' && <FaCheckCircle />}
                {statusMessage.type === 'error' && <FaExclamationTriangle />}
                {statusMessage.type === 'info' && <FaSpinner className="spinner" />}
                {statusMessage.text}
              </StatusMessage>
            )}

            {getTodayRecord() && (
              <div style={{ marginTop: '1rem' }}>
                <h3 style={{ marginBottom: '0.5rem', color: '#1e293b' }}>Estado de Hoy:</h3>
                <div style={{ 
                  padding: '1rem', 
                  background: '#f8fafc', 
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <strong>Entrada:</strong> {getTodayRecord()?.timeIn || 'No registrada'}
                    </div>
                    <div>
                      <strong>Salida:</strong> {getTodayRecord()?.timeOut || 'No registrada'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ClockInSection>

          <RecordsSection>
            <RecordsHeader>
              <SectionTitle>
                <FaCalendarAlt />
                Historial de Fichajes
              </SectionTitle>
              <ExportButton onClick={handleExportRecords}>
                <FaFileExcel />
                Exportar Excel
              </ExportButton>
            </RecordsHeader>

            <RecordsTable>
              <TableHeader>
                <div>Fecha</div>
                <div>Entrada</div>
                <div>Salida</div>
                <div>Ubicación</div>
                <div>Estado</div>
              </TableHeader>
              
              {getRecords().map((record) => (
                <TableRow key={record.id} isToday={record.date === new Date().toISOString().split('T')[0]}>
                  <TableCell>
                    {new Date(record.date).toLocaleDateString('es-AR', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric' 
                    })}
                  </TableCell>
                  <TableCell>{record.timeIn || '-'}</TableCell>
                  <TableCell>{record.timeOut || '-'}</TableCell>
                  <TableCell>{record.location}</TableCell>
                  <TableCell>
                    <span className={`status-badge ${record.status}`}>
                      {record.status === 'in' ? 'En trabajo' : 
                       record.status === 'out' ? 'Salida' : 'Completo'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </RecordsTable>
          </RecordsSection>
        </MainContent>
      </TimeClockContainer>
  );
};

export default TimeClock;
