import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { 
  FaComments, 
  FaPaperPlane, 
  FaTimes, 
  FaExclamationTriangle,
  FaBell
} from 'react-icons/fa';
import { ChatMessage } from '../types';
import simpleConnectionService from '../services/simpleConnectionService';
import { mockChatMessages, simulateChatMessage } from '../services/mockDataService';

const ChatContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 400px;
  height: 500px;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(100%)'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: all 0.3s ease;
  z-index: 1000;
  
  @media (max-width: 768px) {
    width: calc(100vw - 2rem);
    height: calc(100vh - 4rem);
    bottom: 1rem;
    right: 1rem;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 1rem 1rem 0 0;
  
  .header-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    .chat-icon {
      font-size: 1.25rem;
    }
    
    .header-text {
      h3 {
        font-size: 1rem;
        font-weight: 600;
        margin: 0;
      }
      
      .connection-status {
        font-size: 0.75rem;
        opacity: 0.9;
      }
    }
  }
  
  .header-actions {
    display: flex;
    gap: 0.5rem;
    
    button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 0.25rem;
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }
`;

const ChatBody = styled.div`
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
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
    
    &:hover {
      background: #94a3b8;
    }
  }
`;

const MessageBubble = styled.div<{ isOwn: boolean; isUrgent: boolean }>`
  display: flex;
  flex-direction: column;
  max-width: 80%;
  align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  
  .message-content {
    background: ${props => {
      if (props.isUrgent) return '#fee2e2';
      return props.isOwn ? '#3b82f6' : '#f1f5f9';
    }};
    color: ${props => {
      if (props.isUrgent) return '#dc2626';
      return props.isOwn ? 'white' : '#1e293b';
    }};
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    line-height: 1.4;
    word-wrap: break-word;
    border: ${props => props.isUrgent ? '2px solid #fecaca' : 'none'};
    
    ${props => props.isOwn && `
      border-bottom-right-radius: 0.25rem;
    `}
    
    ${props => !props.isOwn && `
      border-bottom-left-radius: 0.25rem;
    `}
  }
  
  .message-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: ${props => props.isOwn ? '0 0 0.25rem 0' : '0 0 0.25rem 0'};
    justify-content: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
    
    .sender-name {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
    }
    
    .message-time {
      font-size: 0.75rem;
      color: #94a3b8;
    }
    
    .urgent-badge {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      color: #dc2626;
      font-weight: 600;
    }
  }
`;

const ChatInput = styled.div`
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  
  .input-container {
    display: flex;
    gap: 0.5rem;
    align-items: flex-end;
    
    .message-input {
      flex: 1;
      border: 1px solid #d1d5db;
      border-radius: 1.5rem;
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      resize: none;
      outline: none;
      transition: all 0.2s ease;
      font-family: inherit;
      
      &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      
      &::placeholder {
        color: #9ca3af;
      }
    }
    
    .send-button {
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background: #2563eb;
        transform: scale(1.05);
      }
      
      &:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        transform: none;
      }
    }
  }
  
  .input-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.5rem;
    
    .urgency-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #64748b;
      
      input[type="checkbox"] {
        accent-color: #dc2626;
      }
    }
    
    .character-count {
      font-size: 0.75rem;
      color: #94a3b8;
    }
  }
`;

const ChatToggle = styled.button<{ hasUnread: boolean }>`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 999;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  }
  
  .unread-indicator {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 20px;
    height: 20px;
    background: #ef4444;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    border: 2px solid white;
    opacity: ${props => props.hasUnread ? '1' : '0'};
    transition: opacity 0.3s ease;
  }
  
  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
  }
`;

const SystemMessage = styled.div`
  text-align: center;
  padding: 0.5rem;
  margin: 0.5rem 0;
  
  .system-content {
    background: #f1f5f9;
    color: #64748b;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-style: italic;
  }
`;

interface LiveChatProps {
  eventId?: string;
  eventName?: string;
}

const LiveChat: React.FC<LiveChatProps> = ({ eventId, eventName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const loadChatHistory = async () => {
    try {
      const history = await simpleConnectionService.getChatHistory(eventId);
      setMessages(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  useEffect(() => {
    // Configurar listeners para mensajes del chat
    simpleConnectionService.onChatMessage((message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
      if (!isOpen) {
        setHasUnread(true);
      }
    });

    // Verificar conexión
    const checkConnection = () => {
      setIsConnected(simpleConnectionService.isConnectedToDJSystem());
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);

    // Cargar historial de chat
    if (eventId) {
      loadChatHistory();
    }

    // Simular mensajes de chat en tiempo real
    const cleanupChatSimulation = simulateChatMessage((newMessage) => {
      setMessages(prev => [...prev, newMessage]);
      if (!isOpen) {
        setHasUnread(true);
      }
    });

    return () => {
      clearInterval(interval);
      cleanupChatSimulation();
    };
  }, [eventId, isOpen]);

  useEffect(() => {
    // Auto-scroll al último mensaje
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isConnected) return;

    const message: Omit<ChatMessage, 'id' | 'timestamp'> = {
      senderId: 'technical-user',
      senderName: 'Técnico',
      senderType: 'technician',
      message: newMessage.trim(),
      eventId,
      isUrgent
    };

    simpleConnectionService.sendChatMessage(message);
    setNewMessage('');
    setIsUrgent(false);
    
    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setHasUnread(false);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSenderTypeColor = (senderType: string) => {
    switch (senderType) {
      case 'dj': return '#10b981';
      case 'technician': return '#3b82f6';
      case 'admin': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  return (
    <>
      <ChatToggle hasUnread={hasUnread} onClick={toggleChat}>
        <FaComments />
        {hasUnread && (
          <div className="unread-indicator">
            <FaBell />
          </div>
        )}
      </ChatToggle>

      <ChatContainer isOpen={isOpen}>
        <ChatHeader>
          <div className="header-info">
            <div className="chat-icon">
              <FaComments />
            </div>
            <div className="header-text">
              <h3>{eventName || 'Chat Técnico'}</h3>
              <div className="connection-status">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={toggleChat}>
              <FaTimes />
            </button>
          </div>
        </ChatHeader>

        <ChatBody>
          <ChatMessages>
            {messages.length === 0 ? (
              <SystemMessage>
                <div className="system-content">
                  No hay mensajes aún. ¡Inicia la conversación!
                </div>
              </SystemMessage>
            ) : (
              messages.map((message, index) => (
                <MessageBubble 
                  key={message.id || index} 
                  isOwn={message.senderType === 'technician'}
                  isUrgent={message.isUrgent}
                >
                  <div className="message-info">
                    <span className="sender-name" style={{ color: getSenderTypeColor(message.senderType) }}>
                      {message.senderName}
                    </span>
                    <span className="message-time">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.isUrgent && (
                      <span className="urgent-badge">
                        <FaExclamationTriangle />
                        Urgente
                      </span>
                    )}
                  </div>
                  <div className="message-content">
                    {message.message}
                  </div>
                </MessageBubble>
              ))
            )}
            <div ref={messagesEndRef} />
          </ChatMessages>

          <ChatInput>
            <div className="input-container">
              <textarea
                ref={inputRef}
                className="message-input"
                placeholder="Escribe tu mensaje..."
                value={newMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                rows={1}
                disabled={!isConnected}
              />
              <button
                className="send-button"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
              >
                <FaPaperPlane />
              </button>
            </div>
            <div className="input-options">
              <label className="urgency-toggle">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                />
                <FaExclamationTriangle />
                Urgente
              </label>
              <span className="character-count">
                {newMessage.length}/500
              </span>
            </div>
          </ChatInput>
        </ChatBody>
      </ChatContainer>
    </>
  );
};

export default LiveChat;
