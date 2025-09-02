import React from 'react';
import { useCoordination } from '../context/CoordinationContext';
import styled from 'styled-components';

const CompleteContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background-color: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  font-size: 2rem;
  color: white;
`;

const Title = styled.h1`
  color: #1e293b;
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: 600;
`;

const Subtitle = styled.h2`
  color: #374151;
  margin-bottom: 2rem;
  font-size: 1.25rem;
  font-weight: 500;
`;

const Description = styled.p`
  color: #64748b;
  margin-bottom: 2rem;
  font-size: 1rem;
  line-height: 1.6;
`;

const EventSummary = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
`;

const SummaryTitle = styled.h3`
  color: #1e293b;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SummaryLabel = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

const SummaryValue = styled.span`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &.primary {
    background-color: #3b82f6;
    color: white;

    &:hover {
      background-color: #2563eb;
    }
  }

  &.secondary {
    background-color: #f3f4f6;
    color: #374151;

    &:hover {
      background-color: #e5e7eb;
    }
  }
`;

const ContactInfo = styled.div`
  background-color: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const ContactTitle = styled.h4`
  color: #1e40af;
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
`;

const ContactText = styled.p`
  color: #1e40af;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const CoordinationComplete: React.FC = () => {
  const { state, resetSession } = useCoordination();

  const handleNewCoordination = () => {
    resetSession();
    // Redirigir al menú principal de coordinación
    window.location.href = '/coordination';
  };

  const handleBackToDashboard = () => {
    // Aquí podrías redirigir al dashboard
    window.location.href = '/dashboard';
  };

  if (!state.eventInfo) {
    return null;
  }

  return (
    <CompleteContainer>
      <SuccessIcon>✓</SuccessIcon>
      
      <Title>¡Coordinación Completada!</Title>
      <Subtitle>Gracias por completar la coordinación con el DJ</Subtitle>
      
      <Description>
        Hemos recibido toda la información necesaria para tu evento. 
        El DJ oficial se pondrá en contacto contigo pronto para confirmar los detalles.
      </Description>

      <EventSummary>
        <SummaryTitle>Resumen del Evento</SummaryTitle>
        <SummaryGrid>
          <SummaryItem>
            <SummaryLabel>Cliente</SummaryLabel>
            <SummaryValue>{state.eventInfo.clientName}</SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryLabel>Tipo de Evento</SummaryLabel>
            <SummaryValue>{state.eventInfo.eventType}</SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryLabel>Fecha</SummaryLabel>
            <SummaryValue>{state.eventInfo.eventDate}</SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryLabel>Hora</SummaryLabel>
            <SummaryValue>{state.eventInfo.eventTime}</SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryLabel>Invitados</SummaryLabel>
            <SummaryValue>{state.eventInfo.guestCount}</SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryLabel>Lugar</SummaryLabel>
            <SummaryValue>{state.eventInfo.venue}</SummaryValue>
          </SummaryItem>
        </SummaryGrid>
      </EventSummary>

      <ContactInfo>
        <ContactTitle>¿Tienes alguna pregunta?</ContactTitle>
        <ContactText>
          Si necesitas hacer algún cambio o tienes preguntas adicionales, 
          no dudes en contactarnos al +1 (555) 123-4567 o enviar un email a coordinacion@janos.com
        </ContactText>
      </ContactInfo>

      <ButtonGroup>
        <Button className="secondary" onClick={handleNewCoordination}>
          Nueva Coordinación
        </Button>
        <Button className="primary" onClick={handleBackToDashboard}>
          Volver al Dashboard
        </Button>
      </ButtonGroup>
    </CompleteContainer>
  );
};

export default CoordinationComplete;
