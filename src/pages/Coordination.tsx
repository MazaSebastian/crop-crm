import React, { useState } from 'react';
import { useCoordination } from '../context/CoordinationContext';
import styled from 'styled-components';
import CoordinationComplete from './CoordinationComplete';
import TestCodes from '../components/TestCodes';

const CoordinationContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StepContainer = styled.div`
  margin-bottom: 2rem;
`;

const StepTitle = styled.h2`
  color: #1e293b;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

const StepDescription = styled.p`
  color: #64748b;
  margin-bottom: 2rem;
  font-size: 1rem;
  line-height: 1.6;
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
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  &.error {
    border-color: #ef4444;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  &.error {
    border-color: #ef4444;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  &.error {
    border-color: #ef4444;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }
`;

const RadioInput = styled.input`
  margin: 0;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }
`;

const CheckboxInput = styled.input`
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
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

    &:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
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

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #64748b;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 2rem;
`;

const ProgressFill = styled.div<{ percentage: number }>`
  height: 100%;
  background-color: #3b82f6;
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const EventInfoCard = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const EventInfoTitle = styled.h3`
  color: #1e293b;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
`;

const EventInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const EventInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const EventInfoLabel = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

const EventInfoValue = styled.span`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
`;

const Coordination: React.FC = () => {
  const {
    state,
    verifyEventCode,
    startCoordination,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    completeSession,
    resetSession,
    getCurrentQuestion,
    getProgress
  } = useCoordination();

  const [eventCode, setEventCode] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState<string | string[] | number>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleEventCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventCode.trim()) {
      setErrors({ eventCode: 'El código de evento es requerido' });
      return;
    }

    try {
      const eventInfo = await verifyEventCode(eventCode);
      await startCoordination(eventInfo);
      setErrors({});
    } catch (error) {
      setErrors({ eventCode: 'Código de evento no válido' });
    }
  };

  const handleCodeSelect = (code: string) => {
    setEventCode(code);
    if (errors.eventCode) {
      setErrors(prev => ({ ...prev, eventCode: '' }));
    }
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentQuestion = getCurrentQuestion();
    
    if (!currentQuestion) return;

    if (currentQuestion.required && !currentAnswer) {
      setErrors({ answer: 'Esta pregunta es requerida' });
      return;
    }

    answerQuestion(currentQuestion.id, currentAnswer);
    setCurrentAnswer('');
    setErrors({});
    nextQuestion();
  };

  const handleCompleteSession = () => {
    completeSession();
    setIsCompleted(true);
  };

  const handlePreviousQuestion = () => {
    const progress = getProgress();
    
    // Si estamos en la primera pregunta, regresar al inicio
    if (progress.current === 1) {
      resetSession();
      setEventCode('');
      setCurrentAnswer('');
      setErrors({});
      setIsCompleted(false);
    } else {
      // Si no es la primera pregunta, ir a la anterior
      previousQuestion();
    }
  };

  const handleInputChange = (value: string | string[] | number) => {
    setCurrentAnswer(value);
    if (errors.answer) {
      setErrors(prev => ({ ...prev, answer: '' }));
    }
  };

  const renderQuestionInput = (question: any) => {
    switch (question.type) {
      case 'text':
        return (
          <Input
            type="text"
            value={currentAnswer as string}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Escribe tu respuesta..."
            className={errors.answer ? 'error' : ''}
          />
        );

      case 'textarea':
        return (
          <TextArea
            value={currentAnswer as string}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Escribe tu respuesta..."
            className={errors.answer ? 'error' : ''}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={currentAnswer as number}
            onChange={(e) => handleInputChange(Number(e.target.value))}
            placeholder="Ingresa un número..."
            className={errors.answer ? 'error' : ''}
          />
        );

      case 'select':
        return (
          <Select
            value={currentAnswer as string}
            onChange={(e) => handleInputChange(e.target.value)}
            className={errors.answer ? 'error' : ''}
          >
            <option value="">Selecciona una opción...</option>
            {question.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup>
            {question.options?.map((option: string) => (
              <RadioLabel key={option}>
                <RadioInput
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e) => handleInputChange(e.target.value)}
                />
                {option}
              </RadioLabel>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <CheckboxGroup>
            {question.options?.map((option: string) => (
              <CheckboxLabel key={option}>
                <CheckboxInput
                  type="checkbox"
                  value={option}
                  checked={(currentAnswer as string[])?.includes(option) || false}
                  onChange={(e) => {
                    const currentArray = (currentAnswer as string[]) || [];
                    if (e.target.checked) {
                      handleInputChange([...currentArray, option]);
                    } else {
                      handleInputChange(currentArray.filter(item => item !== option));
                    }
                  }}
                />
                {option}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        );

      default:
        return null;
    }
  };

  // Mostrar página de confirmación si está completada
  if (isCompleted) {
    return <CoordinationComplete />;
  }

  // Paso 1: Ingreso del código de evento
  if (!state.eventInfo) {
    return (
      <CoordinationContainer>
        <StepContainer>
          <StepTitle>Coordinación con DJ</StepTitle>
          <StepDescription>
            Ingresa el código de tu evento para comenzar la coordinación con el DJ oficial.
          </StepDescription>

          <TestCodes onCodeSelect={handleCodeSelect} />

          <Form onSubmit={handleEventCodeSubmit}>
            <FormGroup>
              <Label htmlFor="eventCode">Código del Evento *</Label>
              <Input
                id="eventCode"
                type="text"
                value={eventCode}
                onChange={(e) => {
                  setEventCode(e.target.value);
                  if (errors.eventCode) {
                    setErrors(prev => ({ ...prev, eventCode: '' }));
                  }
                }}
                placeholder="Ej: EVT-2024-001"
                className={errors.eventCode ? 'error' : ''}
              />
              {errors.eventCode && <ErrorMessage>{errors.eventCode}</ErrorMessage>}
            </FormGroup>

            <Button type="submit" className="primary" disabled={state.isLoading}>
              {state.isLoading ? 'Verificando...' : 'Continuar'}
            </Button>
          </Form>

          {state.error && <ErrorMessage>{state.error}</ErrorMessage>}
        </StepContainer>
      </CoordinationContainer>
    );
  }

  // Paso 2: Preguntas consecutivas
  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();

  if (!currentQuestion) {
    return <LoadingSpinner>Cargando preguntas...</LoadingSpinner>;
  }

  return (
    <CoordinationContainer>
      <StepContainer>
        <StepTitle>Coordinación con DJ</StepTitle>
        
        <EventInfoCard>
          <EventInfoTitle>Información del Evento</EventInfoTitle>
          <EventInfoGrid>
            <EventInfoItem>
              <EventInfoLabel>Cliente</EventInfoLabel>
              <EventInfoValue>{state.eventInfo.clientName}</EventInfoValue>
            </EventInfoItem>
            <EventInfoItem>
              <EventInfoLabel>Tipo de Evento</EventInfoLabel>
              <EventInfoValue>{state.eventInfo.eventType}</EventInfoValue>
            </EventInfoItem>
            <EventInfoItem>
              <EventInfoLabel>Fecha</EventInfoLabel>
              <EventInfoValue>{state.eventInfo.eventDate}</EventInfoValue>
            </EventInfoItem>
            <EventInfoItem>
              <EventInfoLabel>Hora</EventInfoLabel>
              <EventInfoValue>{state.eventInfo.eventTime}</EventInfoValue>
            </EventInfoItem>
          </EventInfoGrid>
        </EventInfoCard>

        <ProgressBar>
          <ProgressFill percentage={progress.percentage} />
        </ProgressBar>

        <StepDescription>
          Pregunta {progress.current} de {progress.total}
        </StepDescription>

        <Form onSubmit={handleAnswerSubmit}>
          <FormGroup>
            <Label>
              {currentQuestion.question}
              {currentQuestion.required && <span style={{ color: '#ef4444' }}> *</span>}
            </Label>
            {renderQuestionInput(currentQuestion)}
            {errors.answer && <ErrorMessage>{errors.answer}</ErrorMessage>}
          </FormGroup>

          <ButtonGroup>
            <Button
              type="button"
              className="secondary"
              onClick={handlePreviousQuestion}
            >
              {progress.current === 1 ? 'Volver al Inicio' : 'Anterior'}
            </Button>
            
            {progress.current === progress.total ? (
              <Button
                type="button"
                className="primary"
                onClick={handleCompleteSession}
              >
                Finalizar Coordinación
              </Button>
            ) : (
              <Button
                type="submit"
                className="primary"
                disabled={currentQuestion.required && !currentAnswer}
              >
                Siguiente
              </Button>
            )}
          </ButtonGroup>
        </Form>
      </StepContainer>
    </CoordinationContainer>
  );
};

export default Coordination;
