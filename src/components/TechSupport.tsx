import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useLocation } from 'react-router-dom';
import { 
  FaHeadset, 
  FaTimes, 
  FaComments, 
  FaCircle, 
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaClock,
  FaCheck
} from 'react-icons/fa';

interface TechAgent {
  id: string;
  name: string;
  role: string;
  isOnline: boolean;
  lastSeen?: string;
  avatar?: string;
  specialties: string[];
  responseTime: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  message: string;
  timestamp: Date;
  agentId?: string;
}

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const TechSupportContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const FloatingButton = styled.button<{ isOpen: boolean }>`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(239, 68, 68, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  animation: ${props => props.isOpen ? 'none' : pulse} 2s infinite;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    transform: scale(1.15) rotate(5deg);
    box-shadow: 0 12px 40px rgba(239, 68, 68, 0.6);
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  }
  
  &:active {
    transform: scale(0.9);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #ef4444, #dc2626, #b91c1c, #ef4444);
    border-radius: 50%;
    z-index: -1;
    animation: ${props => props.isOpen ? 'none' : 'rotate 3s linear infinite'};
  }
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const OnlineIndicator = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .pulse-dot {
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
    animation: ${pulse} 1.5s infinite;
  }
`;

const ChatWindow = styled.div<{ isOpen: boolean }>`
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  animation: ${props => props.isOpen ? slideIn : slideOut} 0.3s ease;
  overflow: hidden;
  border: 1px solid #e5e7eb;
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 1rem 1rem 0 0;
  
  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .close-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1.125rem;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: background 0.2s;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

const ChatContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const AgentsSection = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  
  .section-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .online-count {
    background: #10b981;
    color: white;
    padding: 0.125rem 0.5rem;
    border-radius: 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
  }
`;

const AgentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AgentCard = styled.div<{ isOnline: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: ${props => props.isOnline ? '#f0fdf4' : '#f9fafb'};
  border: 1px solid ${props => props.isOnline ? '#bbf7d0' : '#e5e7eb'};
  cursor: ${props => props.isOnline ? 'pointer' : 'default'};
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.isOnline ? '#dcfce7' : '#f9fafb'};
    transform: ${props => props.isOnline ? 'translateY(-1px)' : 'none'};
  }
`;

const AgentAvatar = styled.div<{ isOnline: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.isOnline ? '#10b981' : '#9ca3af'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 12px;
    height: 12px;
    background: ${props => props.isOnline ? '#10b981' : '#9ca3af'};
    border: 2px solid white;
    border-radius: 50%;
  }
`;

const AgentInfo = styled.div`
  flex: 1;
  
  .agent-name {
    font-weight: 600;
    font-size: 0.875rem;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }
  
  .agent-role {
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }
  
  .agent-status {
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .online {
    color: #10b981;
  }
  
  .offline {
    color: #9ca3af;
  }
`;

const ChatSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Message = styled.div<{ isUser: boolean }>`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  
  .message-bubble {
    max-width: 80%;
    padding: 0.75rem;
    border-radius: 1rem;
    background: ${props => props.isUser ? '#3b82f6' : '#f3f4f6'};
    color: ${props => props.isUser ? 'white' : '#1f2937'};
    font-size: 0.875rem;
    line-height: 1.4;
    position: relative;
    
    .message-time {
      font-size: 0.75rem;
      opacity: 0.7;
      margin-top: 0.25rem;
    }
  }
`;

const ChatInput = styled.div`
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SendButton = styled.button`
  padding: 0.75rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ContactOptions = styled.div`
  padding: 1rem;
  border-top: 1px solid #f3f4f6;
  
  .section-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
  }
  
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
`;

const ContactButton = styled.button<{ variant: 'whatsapp' | 'phone' | 'email' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => {
    switch (props.variant) {
      case 'whatsapp': return '#25d366';
      case 'phone': return '#3b82f6';
      case 'email': return '#8b5cf6';
      default: return '#6b7280';
    }
  }};
  color: white;
  
  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.1);
  }
`;

const TechSupport: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'agents' | 'chat'>('agents');
  const [selectedAgent, setSelectedAgent] = useState<TechAgent | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Datos simulados de agentes técnicos
  const [agents] = useState<TechAgent[]>([
    {
      id: '1',
      name: 'Carlos Méndez',
      role: 'Técnico Senior',
      isOnline: true,
      lastSeen: 'Ahora',
      specialties: ['Audio', 'Video', 'Iluminación'],
      responseTime: '< 2 min'
    },
    {
      id: '2',
      name: 'Ana Rodríguez',
      role: 'Técnica Especialista',
      isOnline: true,
      lastSeen: 'Ahora',
      specialties: ['Sistemas', 'Redes', 'Software'],
      responseTime: '< 3 min'
    },
    {
      id: '3',
      name: 'Miguel Torres',
      role: 'Técnico de Campo',
      isOnline: false,
      lastSeen: 'Hace 15 min',
      specialties: ['Hardware', 'Mantenimiento'],
      responseTime: '5-10 min'
    }
  ]);

  const onlineAgents = agents.filter(agent => agent.isOnline);

  useEffect(() => {
    // Simular mensajes automáticos cuando se abre el chat
    if (isOpen && activeView === 'chat' && selectedAgent) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'agent',
        message: `¡Hola! Soy ${selectedAgent.name}, ${selectedAgent.role}. ¿En qué puedo ayudarte hoy?`,
        timestamp: new Date(),
        agentId: selectedAgent.id
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, activeView, selectedAgent]);

  // Solo mostrar en todas las páginas EXCEPTO en el login
  if (location.pathname === '/login') {
    return null;
  }

  const handleAgentSelect = (agent: TechAgent) => {
    if (agent.isOnline) {
      setSelectedAgent(agent);
      setActiveView('chat');
      setMessages([]);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedAgent) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        message: newMessage.trim(),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // Simular respuesta automática
      setTimeout(() => {
        const responses = [
          'Entiendo el problema. Déjame revisar eso para ti.',
          'Perfecto, voy a ayudarte con eso inmediatamente.',
          'Ese es un problema común. Te explico la solución.',
          'Gracias por reportarlo. Lo estamos solucionando.',
          'Excelente, ya tengo la información que necesito.'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const agentMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          message: randomResponse,
          timestamp: new Date(),
          agentId: selectedAgent.id
        };
        
        setMessages(prev => [...prev, agentMessage]);
      }, 1000 + Math.random() * 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hola, necesito asistencia técnica urgente.');
    window.open(`https://wa.me/5491112345678?text=${message}`, '_blank');
  };

  const handlePhone = () => {
    window.open('tel:+5491112345678', '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('Soporte Técnico - Urgente');
    const body = encodeURIComponent('Hola equipo técnico,\n\nNecesito asistencia con el siguiente problema:\n\n[Describir el problema aquí]\n\nGracias.');
    window.open(`mailto:soporte@janos.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <TechSupportContainer>
      <FloatingButton 
        isOpen={isOpen} 
        onClick={() => setIsOpen(!isOpen)}
        title="Guardia Técnica"
      >
        <FaHeadset />
        <OnlineIndicator>
          <div className="pulse-dot" />
        </OnlineIndicator>
      </FloatingButton>

      {isOpen && (
        <ChatWindow isOpen={isOpen}>
          <ChatHeader>
            <h3>
              {activeView === 'agents' ? 'Guardia Técnica' : `Chat con ${selectedAgent?.name}`}
            </h3>
            <button 
              className="close-btn" 
              onClick={() => {
                setIsOpen(false);
                setActiveView('agents');
                setSelectedAgent(null);
                setMessages([]);
              }}
            >
              <FaTimes />
            </button>
          </ChatHeader>

          <ChatContent>
            {activeView === 'agents' ? (
              <>
                <AgentsSection>
                  <div className="section-title">
                    <FaCircle style={{ color: '#10b981' }} />
                    Agentes Disponibles
                    <span className="online-count">{onlineAgents.length}</span>
                  </div>
                  <AgentList>
                    {agents.map(agent => (
                      <AgentCard 
                        key={agent.id} 
                        isOnline={agent.isOnline}
                        onClick={() => handleAgentSelect(agent)}
                      >
                        <AgentAvatar isOnline={agent.isOnline}>
                          {agent.name.split(' ').map(n => n[0]).join('')}
                        </AgentAvatar>
                        <AgentInfo>
                          <div className="agent-name">{agent.name}</div>
                          <div className="agent-role">{agent.role}</div>
                          <div className={`agent-status ${agent.isOnline ? 'online' : 'offline'}`}>
                            <FaCircle style={{ fontSize: '0.5rem' }} />
                            {agent.isOnline ? 'En línea' : `Última vez: ${agent.lastSeen}`}
                          </div>
                        </AgentInfo>
                      </AgentCard>
                    ))}
                  </AgentList>
                </AgentsSection>

                <ContactOptions>
                  <div className="section-title">Contacto Directo</div>
                  <div className="contact-grid">
                    <ContactButton variant="whatsapp" onClick={handleWhatsApp}>
                      <FaWhatsapp />
                      WhatsApp
                    </ContactButton>
                    <ContactButton variant="phone" onClick={handlePhone}>
                      <FaPhone />
                      Llamar
                    </ContactButton>
                    <ContactButton variant="email" onClick={handleEmail}>
                      <FaEnvelope />
                      Email
                    </ContactButton>
                  </div>
                </ContactOptions>
              </>
            ) : (
              <ChatSection>
                <ChatMessages>
                  {messages.map(message => (
                    <Message key={message.id} isUser={message.sender === 'user'}>
                      <div className="message-bubble">
                        {message.message}
                        <div className="message-time">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </Message>
                  ))}
                </ChatMessages>
                
                <ChatInput>
                  <Input
                    type="text"
                    placeholder="Escribe tu mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <SendButton 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <FaCheck />
                  </SendButton>
                </ChatInput>
              </ChatSection>
            )}
          </ChatContent>
        </ChatWindow>
      )}
    </TechSupportContainer>
  );
};

export default TechSupport;
