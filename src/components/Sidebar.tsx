import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaCalendarAlt, 
  FaMusic, 
  FaUsers, 
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaClock,
  FaClipboardCheck,
  FaClipboardList,
  FaChartLine,
  FaPlay,
  FaDesktop,
  FaVideo,
  FaChevronLeft,
  FaChevronRight,
  FaHandshake,
  FaTools,
  FaWrench,
  FaSeedling
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const SidebarContainer = styled.div<{ isCollapsed: boolean }>`
  width: ${props => props.isCollapsed ? '80px' : '280px'};
  height: 100vh;
  background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
  color: white;
  position: fixed;
  left: 0;
  top: 0;
  overflow: visible;
  z-index: 1000;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  
  /* Hover effect para expandir automáticamente solo cuando está colapsado */
  &:hover {
    width: ${props => props.isCollapsed ? '280px' : '280px'};
    
    .nav-text,
    .user-details,
    h2 {
      opacity: ${props => props.isCollapsed ? '1' : '1'} !important;
      transform: ${props => props.isCollapsed ? 'translateX(0)' : 'translateX(0)'} !important;
    }
    
    .section-title {
      opacity: ${props => props.isCollapsed ? '1' : '1'} !important;
    }
    
    .toggle-button {
      transform: ${props => props.isCollapsed ? 'rotate(0deg)' : 'rotate(0deg)'} !important;
    }
  }
  
  /* Asegurar que el contenido no se desborde */
  @media (max-width: 768px) {
    width: ${props => props.isCollapsed ? '60px' : '280px'};
    
    &:hover {
      width: ${props => props.isCollapsed ? '280px' : '280px'};
    }
  }
  
  /* Scrollbar personalizada */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;

const SidebarHeader = styled.div<{ isCollapsed: boolean }>`
  padding: ${props => props.isCollapsed ? '1rem 0.5rem' : '1rem 0.5rem 1.5rem'};
  border-bottom: 1px solid #475569;
  position: relative;
  
     .logo {
     display: flex;
     align-items: center;
     justify-content: center;
     margin-bottom: 1rem;
     width: 100%;
     padding: 0;
    
         .logo-icon {
       font-size: 1.5rem;
       color: #3b82f6;
       width: 100%;
       height: 105px;
       transition: transform 0.3s ease;
       display: flex;
       align-items: center;
       justify-content: center;
     }
    
    h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      opacity: ${props => props.isCollapsed ? '0' : '1'};
      transform: ${props => props.isCollapsed ? 'translateX(-20px)' : 'translateX(0)'};
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;
    }
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: rgba(59, 130, 246, 0.1);
    border-radius: 0.5rem;
    border: 1px solid rgba(59, 130, 246, 0.2);
    backdrop-filter: blur(10px);
    
         .user-avatar {
       width: 40px;
       height: 40px;
       border-radius: 50%;
       background: #3b82f6;
       display: flex;
       align-items: center;
       justify-content: center;
       font-size: 0.875rem;
       font-weight: 600;
       min-width: 40px;
       box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
       position: relative;
       overflow: hidden;
       border: 2px solid rgba(255, 255, 255, 0.2);
       
       img {
         width: 100%;
         height: 100%;
         object-fit: cover;
         border-radius: 50%;
       }
       
       .avatar-fallback {
         position: absolute;
         top: 0;
         left: 0;
         width: 100%;
         height: 100%;
         display: flex;
         align-items: center;
         justify-content: center;
         background: #3b82f6;
         color: white;
         font-size: 0.875rem;
         font-weight: 600;
         border-radius: 50%;
       }
     }
    
    .user-details {
      flex: 1;
      opacity: ${props => props.isCollapsed ? '0' : '1'};
      transform: ${props => props.isCollapsed ? 'translateX(-20px)' : 'translateX(0)'};
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      
      .user-name {
        font-weight: 600;
        font-size: 0.875rem;
        color: white;
        margin-bottom: 0.25rem;
        white-space: nowrap;
      }
      
      .user-role {
        font-size: 0.75rem;
        color: #94a3b8;
        text-transform: capitalize;
        white-space: nowrap;
      }
    }
  }
  
  .toggle-button {
    position: absolute;
    top: 1rem;
    right: ${props => props.isCollapsed ? '0.5rem' : '1.5rem'};
    background: rgba(59, 130, 246, 0.2);
    border: none;
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transform: ${props => props.isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)'};
    
    &:hover {
      background: rgba(59, 130, 246, 0.4);
      transform: ${props => props.isCollapsed ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1.1)'};
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
`;

const NavMenu = styled.nav`
  padding: 1.5rem 0;
  overflow-y: auto;
  height: calc(100vh - 220px);
  max-height: calc(100vh - 220px);
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const NavSection = styled.div<{ isCollapsed: boolean }>`
  margin-bottom: 2rem;
  
  .section-title {
    padding: 0 ${props => props.isCollapsed ? '0.5rem' : '1.5rem'} 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: ${props => props.isCollapsed ? '0' : '1'};
    transform: ${props => props.isCollapsed ? 'translateX(-20px)' : 'translateX(0)'};
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
  }
`;

const NavItem = styled(NavLink)<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: ${props => props.isCollapsed ? '0.75rem 0.5rem' : '0.75rem 1.5rem'};
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  border-radius: 0.5rem;
  margin: 0 0.5rem;
  
  &:hover {
    background: rgba(59, 130, 246, 0.15);
    color: white;
    transform: translateX(4px);
    
    .nav-icon {
      transform: scale(1.1);
    }
  }
  
  &.active {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
    border-right: 3px solid #3b82f6;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #3b82f6;
      border-radius: 0 2px 2px 0;
    }
    
    .nav-icon {
      transform: scale(1.1);
    }
  }
  
  .nav-icon {
    font-size: 1.125rem;
    width: 20px;
    text-align: center;
    min-width: 20px;
    transition: transform 0.3s ease;
  }
  
  .nav-text {
    font-weight: 500;
    font-size: 0.875rem;
    opacity: ${props => props.isCollapsed ? '0' : '1'};
    transform: ${props => props.isCollapsed ? 'translateX(-20px)' : 'translateX(0)'};
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
  }
`;

const LogoutButton = styled.button<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: calc(100% - 1rem);
  padding: ${props => props.isCollapsed ? '0.75rem 0.5rem' : '0.75rem 1.5rem'};
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 0.5rem;
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  border-radius: 0.5rem;
  position: relative;
  
  &:hover {
    background: rgba(239, 68, 68, 0.15);
    color: #dc2626;
    transform: translateX(4px);
    
    .nav-icon {
      transform: scale(1.1);
    }
  }
  
  .nav-icon {
    font-size: 1.125rem;
    width: 20px;
    text-align: center;
    min-width: 20px;
    transition: transform 0.3s ease;
  }
  
  .nav-text {
    font-weight: 500;
    font-size: 0.875rem;
    opacity: ${props => props.isCollapsed ? '0' : '1'};
    transform: ${props => props.isCollapsed ? 'translateX(-20px)' : 'translateX(0)'};
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
  }
  
  /* Asegurar que el botón siempre sea visible */
  &:hover .nav-text {
    opacity: 1 !important;
    transform: translateX(0) !important;
  }
  
  /* Hacer el icono más prominente cuando está colapsado */
  ${props => props.isCollapsed && `
    .nav-icon {
      font-size: 1.25rem;
      color: #dc2626;
    }
  `}
`;

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false); // Inicialmente expandido

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onToggle?.(newState);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'Administrador',
      dj: 'DJ Primero',
      technician: 'Técnico'
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <SidebarContainer isCollapsed={isCollapsed}>
      <SidebarHeader isCollapsed={isCollapsed}>
        <div className="logo">
          <div className="logo-icon">
                         <img src="/LOGO JANOS.png" alt="Janos" style={{ width: '100%', height: '105px', objectFit: 'contain' }} />
          </div>
        </div>
        
        {user && (
          <div className="user-info">
                         <div className="user-avatar">
               <img 
                 src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                 alt={user.name}
                                   onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
               />
               <div className="avatar-fallback" style={{ display: 'none' }}>
                 {getInitials(user.name)}
               </div>
             </div>
            <div className="user-details">
              <div className="user-name">{user.name}</div>
              <div className="user-role">{getRoleLabel(user.role)}</div>
            </div>
          </div>
        )}
        
        <button 
          className="toggle-button" 
          onClick={toggleSidebar}
          title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </SidebarHeader>

      <NavMenu>
        <NavSection isCollapsed={isCollapsed}>
          <div className="section-title">Principal</div>
          <NavItem to="/dashboard" isCollapsed={isCollapsed} className={location.pathname === '/dashboard' ? 'active' : ''}>
            <FaHome className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </NavItem>
          <NavItem to="/events" isCollapsed={isCollapsed} className={location.pathname.startsWith('/events') ? 'active' : ''}>
            <FaCalendarAlt className="nav-icon" />
            <span className="nav-text">Eventos</span>
          </NavItem>
          <NavItem to="/coordination" isCollapsed={isCollapsed} className={location.pathname.startsWith('/coordination') ? 'active' : ''}>
            <FaHandshake className="nav-icon" />
            <span className="nav-text">Coordinación DJ</span>
          </NavItem>
          <NavItem to="/timeclock" isCollapsed={isCollapsed} className={location.pathname.startsWith('/timeclock') ? 'active' : ''}>
            <FaClock className="nav-icon" />
            <span className="nav-text">Fichajes</span>
          </NavItem>
        </NavSection>

        <NavSection isCollapsed={isCollapsed}>
          <div className="section-title">Técnica</div>
          <NavItem to="/technical-dashboard" isCollapsed={isCollapsed} className={location.pathname.startsWith('/technical-dashboard') ? 'active' : ''}>
            <FaChartBar className="nav-icon" />
            <span className="nav-text">Dashboard Técnico</span>
          </NavItem>
          <NavItem to="/equipment" isCollapsed={isCollapsed} className={location.pathname.startsWith('/equipment') ? 'active' : ''}>
            <FaTools className="nav-icon" />
            <span className="nav-text">Equipamiento</span>
          </NavItem>
          <NavItem to="/maintenance" isCollapsed={isCollapsed} className={location.pathname.startsWith('/maintenance') ? 'active' : ''}>
            <FaWrench className="nav-icon" />
            <span className="nav-text">Mantenimiento</span>
          </NavItem>
          <NavItem to="/techcheck" isCollapsed={isCollapsed} className={location.pathname.startsWith('/techcheck') ? 'active' : ''}>
            <FaClipboardCheck className="nav-icon" />
            <span className="nav-text">Check In Técnico</span>
          </NavItem>
          <NavItem to="/orders" isCollapsed={isCollapsed} className={location.pathname.startsWith('/orders') ? 'active' : ''}>
            <FaClipboardList className="nav-icon" />
            <span className="nav-text">Pedidos</span>
          </NavItem>
        </NavSection>

        <NavSection isCollapsed={isCollapsed}>
          <div className="section-title">Devoluciones</div>
          <NavItem to="/returns" isCollapsed={isCollapsed} className={location.pathname.startsWith('/returns') ? 'active' : ''}>
            <FaChartLine className="nav-icon" />
            <span className="nav-text">Mis Devoluciones</span>
          </NavItem>
        </NavSection>

        <NavSection isCollapsed={isCollapsed}>
          <div className="section-title">CROSTI</div>
          <NavItem to="/crops" isCollapsed={isCollapsed} className={location.pathname.startsWith('/crops') ? 'active' : ''}>
            <FaSeedling className="nav-icon" />
            <span className="nav-text">Cultivos</span>
          </NavItem>
          <NavItem to="/stock" isCollapsed={isCollapsed} className={location.pathname.startsWith('/stock') ? 'active' : ''}>
            <FaClipboardList className="nav-icon" />
            <span className="nav-text">Control de Stock</span>
          </NavItem>
          <NavItem to="/supplies" isCollapsed={isCollapsed} className={location.pathname.startsWith('/supplies') ? 'active' : ''}>
            <FaChartLine className="nav-icon" />
            <span className="nav-text">Insumos</span>
          </NavItem>
          <NavItem to="/daily-log" isCollapsed={isCollapsed} className={location.pathname.startsWith('/daily-log') ? 'active' : ''}>
            <FaClipboardCheck className="nav-icon" />
            <span className="nav-text">Registro Diario</span>
          </NavItem>
          <NavItem to="/parameters" isCollapsed={isCollapsed} className={location.pathname.startsWith('/parameters') ? 'active' : ''}>
            <FaThermometerHalf className="nav-icon" />
            <span className="nav-text">Parámetros</span>
          </NavItem>
          <NavItem to="/tasks" isCollapsed={isCollapsed} className={location.pathname.startsWith('/tasks') ? 'active' : ''}>
            <FaTasks className="nav-icon" />
            <span className="nav-text">Tareas</span>
          </NavItem>
        </NavSection>

        <NavSection isCollapsed={isCollapsed}>
          <div className="section-title">Contenido</div>
          <NavItem to="/shows" isCollapsed={isCollapsed} className={location.pathname.startsWith('/shows') ? 'active' : ''}>
            <FaPlay className="nav-icon" />
            <span className="nav-text">Shows</span>
          </NavItem>
          <NavItem to="/software" isCollapsed={isCollapsed} className={location.pathname.startsWith('/software') ? 'active' : ''}>
            <FaDesktop className="nav-icon" />
            <span className="nav-text">Software</span>
          </NavItem>
          <NavItem to="/visuals" isCollapsed={isCollapsed} className={location.pathname.startsWith('/visuals') ? 'active' : ''}>
            <FaVideo className="nav-icon" />
            <span className="nav-text">Visuales</span>
          </NavItem>
          <NavItem to="/music" isCollapsed={isCollapsed} className={location.pathname.startsWith('/music') ? 'active' : ''}>
            <FaMusic className="nav-icon" />
            <span className="nav-text">Música</span>
          </NavItem>
        </NavSection>

        {user?.role === 'admin' && (
          <NavSection isCollapsed={isCollapsed}>
            <div className="section-title">Administración</div>
            <NavItem to="/users" isCollapsed={isCollapsed} className={location.pathname.startsWith('/users') ? 'active' : ''}>
              <FaUsers className="nav-icon" />
              <span className="nav-text">Usuarios</span>
            </NavItem>
            <NavItem to="/reports" isCollapsed={isCollapsed} className={location.pathname.startsWith('/reports') ? 'active' : ''}>
              <FaChartBar className="nav-icon" />
              <span className="nav-text">Reportes</span>
            </NavItem>
            <NavItem to="/settings" isCollapsed={isCollapsed} className={location.pathname.startsWith('/settings') ? 'active' : ''}>
              <FaCog className="nav-icon" />
              <span className="nav-text">Configuración</span>
            </NavItem>
          </NavSection>
        )}
      </NavMenu>

             <LogoutButton 
         isCollapsed={isCollapsed} 
         onClick={handleLogout}
         title={isCollapsed ? "Cerrar Sesión" : ""}
       >
         <FaSignOutAlt className="nav-icon" />
         <span className="nav-text">Cerrar Sesión</span>
       </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;
