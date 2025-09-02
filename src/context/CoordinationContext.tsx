import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  CoordinationSession, 
  EventCode, 
  CoordinationAnswer, 
  CoordinationQuestion
} from '../types';
import { JanosService } from '../utils/janosService';

interface CoordinationState {
  currentSession: CoordinationSession | null;
  eventInfo: EventCode | null;
  currentQuestionIndex: number;
  questions: CoordinationQuestion[];
  isLoading: boolean;
  error: string | null;
}

type CoordinationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_EVENT_INFO'; payload: EventCode }
  | { type: 'SET_QUESTIONS'; payload: CoordinationQuestion[] }
  | { type: 'SET_CURRENT_QUESTION'; payload: number }
  | { type: 'ADD_ANSWER'; payload: CoordinationAnswer }
  | { type: 'UPDATE_ANSWER'; payload: CoordinationAnswer }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'RESET_SESSION' };

const initialState: CoordinationState = {
  currentSession: null,
  eventInfo: null,
  currentQuestionIndex: 0,
  questions: [],
  isLoading: false,
  error: null,
};

const coordinationReducer = (state: CoordinationState, action: CoordinationAction): CoordinationState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_EVENT_INFO':
      return { ...state, eventInfo: action.payload };
    
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };
    
    case 'SET_CURRENT_QUESTION':
      return { ...state, currentQuestionIndex: action.payload };
    
    case 'ADD_ANSWER':
      return {
        ...state,
        currentSession: state.currentSession ? {
          ...state.currentSession,
          answers: [...state.currentSession.answers, action.payload]
        } : null
      };
    
    case 'UPDATE_ANSWER':
      return {
        ...state,
        currentSession: state.currentSession ? {
          ...state.currentSession,
          answers: state.currentSession.answers.map(answer =>
            answer.questionId === action.payload.questionId ? action.payload : answer
          )
        } : null
      };
    
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1)
      };
    
    case 'PREVIOUS_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
      };
    
    case 'COMPLETE_SESSION':
      return {
        ...state,
        currentSession: state.currentSession ? {
          ...state.currentSession,
          completed: true,
          currentStep: state.questions.length,
          updatedAt: new Date().toISOString()
        } : null
      };
    
    case 'RESET_SESSION':
      return initialState;
    
    default:
      return state;
  }
};

interface CoordinationContextType {
  state: CoordinationState;
  verifyEventCode: (code: string) => Promise<EventCode>;
  startCoordination: (eventInfo: EventCode) => Promise<void>;
  answerQuestion: (questionId: string, answer: string | string[] | number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeSession: () => void;
  resetSession: () => void;
  getCurrentQuestion: () => CoordinationQuestion | null;
  getProgress: () => { current: number; total: number; percentage: number };
}

const CoordinationContext = createContext<CoordinationContextType | undefined>(undefined);

export const useCoordination = () => {
  const context = useContext(CoordinationContext);
  if (!context) {
    throw new Error('useCoordination debe ser usado dentro de CoordinationProvider');
  }
  return context;
};

interface CoordinationProviderProps {
  children: ReactNode;
}

export const CoordinationProvider: React.FC<CoordinationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(coordinationReducer, initialState);

  // Verificar código de evento con el sistema de Janos
  const verifyEventCode = async (code: string): Promise<EventCode> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const eventData = await JanosService.verifyEventCode(code);
      dispatch({ type: 'SET_LOADING', payload: false });
      return eventData;
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_ERROR', payload: 'Error al verificar el código de evento' });
      throw error;
    }
  };

  // Iniciar sesión de coordinación
  const startCoordination = async (eventInfo: EventCode): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Obtener preguntas según el tipo de evento
      const questions = getQuestionsByEventType(eventInfo.eventType);
      
      const session: CoordinationSession = {
        id: `session_${Date.now()}`,
        eventCode: eventInfo.code,
        eventInfo,
        answers: [],
        currentStep: 1,
        totalSteps: questions.length,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'SET_EVENT_INFO', payload: eventInfo });
      dispatch({ type: 'SET_QUESTIONS', payload: questions });
      dispatch({ type: 'SET_CURRENT_QUESTION', payload: 0 });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_ERROR', payload: 'Error al iniciar la coordinación' });
    }
  };

  // Obtener preguntas según el tipo de evento
  const getQuestionsByEventType = (eventType: EventCode['eventType']): CoordinationQuestion[] => {
    const eventSpecificQuestions: Record<EventCode['eventType'], CoordinationQuestion[]> = {
              Casamiento: [
          {
            id: 'wedding_entrance_song',
            question: '¿Qué canción prefieres para el ingreso del novio/a en la ceremonia?',
            type: 'text',
            required: true,
            order: 1,
            category: 'music'
          },
          {
            id: 'wedding_choreographies',
            question: '¿Habrá coreografías durante la boda?',
            type: 'select',
            options: ['Sí', 'No', 'No estoy seguro/a'],
            required: true,
            order: 2,
            category: 'logistics'
          },
          {
            id: 'wedding_toast_song',
            question: '¿Qué canción prefieres para el momento del brindis?',
            type: 'text',
            required: true,
            order: 3,
            category: 'music'
          },
          {
            id: 'wedding_bouquet_whiskey',
            question: '¿Qué canción prefieres para tirar el ramo (mujeres) y whisky (hombres)?',
            type: 'text',
            required: true,
            order: 4,
            category: 'music'
          },
          {
            id: 'wedding_carioca_entrance',
            question: '¿Qué canción prefieres para la entrada en carioca?',
            type: 'text',
            required: true,
            order: 5,
            category: 'music'
          }
        ],
              Cumpleaños: [
          {
            id: 'birthday_entrance_song',
            question: '¿Qué canción de ingreso al salón o canción para comenzar la primera tanda de baile?',
            type: 'text',
            required: true,
            order: 1,
            category: 'music'
          },
          {
            id: 'birthday_choreographies',
            question: '¿Habrá coreografías?',
            type: 'select',
            options: ['Sí', 'No', 'No estoy seguro/a'],
            required: true,
            order: 2,
            category: 'logistics'
          },
          {
            id: 'birthday_toast_song',
            question: '¿Qué canción para el brindis?',
            type: 'text',
            required: true,
            order: 3,
            category: 'music'
          },
          {
            id: 'birthday_carioca_entrance',
            question: '¿Qué canción para la entrada en carioca o para iniciar la tanda carioca?',
            type: 'text',
            required: true,
            order: 4,
            category: 'music'
          }
        ],
              Corporativo: [
          {
            id: 'corporate_type',
            question: '¿Qué tipo de evento corporativo es?',
            type: 'select',
            options: ['Conferencia', 'Cena de gala', 'Team building', 'Presentación', 'Otro'],
            required: true,
            order: 1,
            category: 'general'
          },
          {
            id: 'corporate_formality',
            question: '¿Qué nivel de formalidad prefieres?',
            type: 'select',
            options: ['Muy formal', 'Semi-formal', 'Casual'],
            required: true,
            order: 2,
            category: 'general'
          }
        ],
              XV: [
          {
            id: 'quince_reception_entrance',
            question: '¿Hace ingreso a recepción?',
            type: 'select',
            options: ['Sí', 'No'],
            required: true,
            order: 1,
            category: 'logistics'
          },
          {
            id: 'quince_reception_song',
            question: '¿Con qué canción ingresa a recepción?',
            type: 'text',
            required: true,
            order: 2,
            category: 'music'
          },
          {
            id: 'quince_salon_entrance_song',
            question: '¿Qué canción para el ingreso al salón?',
            type: 'text',
            required: true,
            order: 3,
            category: 'music'
          },
          {
            id: 'quince_waltz_songs',
            question: '¿Qué canciones para bailar el vals?',
            type: 'textarea',
            required: true,
            order: 4,
            category: 'music'
          },
          {
            id: 'quince_candle_ceremony',
            question: '¿Hace ceremonia de velas?',
            type: 'select',
            options: ['Sí', 'No'],
            required: true,
            order: 5,
            category: 'logistics'
          },
          {
            id: 'quince_choreographies',
            question: '¿Habrá coreografías?',
            type: 'select',
            options: ['Sí', 'No', 'No estoy seguro/a'],
            required: true,
            order: 6,
            category: 'logistics'
          },
          {
            id: 'quince_toast_song',
            question: '¿Qué canción para el momento del brindis?',
            type: 'text',
            required: true,
            order: 7,
            category: 'music'
          },
          {
            id: 'quince_carioca_entrance',
            question: '¿Qué canción para la entrada en carioca?',
            type: 'text',
            required: true,
            order: 8,
            category: 'music'
          }
        ],
              Graduación: [
          {
            id: 'graduation_type',
            question: '¿Qué tipo de graduación es?',
            type: 'select',
            options: ['Universidad', 'Secundaria', 'Primaria', 'Otro'],
            required: true,
            order: 1,
            category: 'general'
          },
          {
            id: 'graduation_music',
            question: '¿Qué tipo de música prefieres?',
            type: 'select',
            options: ['Pop', 'Rock', 'Electrónica', 'Mixta'],
            required: true,
            order: 2,
            category: 'music'
          }
        ],
              Otro: [
          {
            id: 'other_type',
            question: '¿Qué tipo de evento es?',
            type: 'text',
            required: true,
            order: 1,
            category: 'general'
          },
          {
            id: 'other_description',
            question: 'Describe brevemente el evento',
            type: 'textarea',
            required: true,
            order: 2,
            category: 'general'
          }
        ]
    };

    return eventSpecificQuestions[eventType] || [];
  };

  const answerQuestion = (questionId: string, answer: string | string[] | number) => {
    const answerObj: CoordinationAnswer = { questionId, answer };
    
    const existingAnswerIndex = state.currentSession?.answers.findIndex(
      a => a.questionId === questionId
    );

    if (existingAnswerIndex !== undefined && existingAnswerIndex >= 0) {
      dispatch({ type: 'UPDATE_ANSWER', payload: answerObj });
    } else {
      dispatch({ type: 'ADD_ANSWER', payload: answerObj });
    }
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const previousQuestion = () => {
    dispatch({ type: 'PREVIOUS_QUESTION' });
  };

  const completeSession = () => {
    dispatch({ type: 'COMPLETE_SESSION' });
  };

  const resetSession = () => {
    dispatch({ type: 'RESET_SESSION' });
  };

  const getCurrentQuestion = (): CoordinationQuestion | null => {
    return state.questions[state.currentQuestionIndex] || null;
  };

  const getProgress = () => {
    const current = state.currentQuestionIndex + 1;
    const total = state.questions.length;
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    return { current, total, percentage };
  };

  const value: CoordinationContextType = {
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
  };

  return (
    <CoordinationContext.Provider value={value}>
      {children}
    </CoordinationContext.Provider>
  );
};
