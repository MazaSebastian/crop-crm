import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaTachometerAlt, 
  FaTools, 
  FaWrench, 
  FaComments, 
  FaClipboardList,
  FaChartBar,
  FaCog,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const NavigationContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const NavContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  
  .logo-icon {
    font-size: 2rem;
  }
`;

const NavMenu = styled.nav<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: 0;
    width: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    flex-direction: column;
    padding: 2rem;
    transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-100%)'};
    opacity: ${props => props.isOpen ? '1' : '0'};
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const NavItem = styled.a<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
  
  background: ${props => props.isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
  
  .nav-icon {
    font-size: 1.1rem;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 1rem;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const StatusIndicator = styled.div<{ isConnected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.isConnected ? '#10b981' : '#ef4444'};
    animation: ${props => props.isConnected ? 'pulse 2s infinite' : 'none'};
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

interface TechnicalNavigationProps {
  currentSection: string;
  isConnected: boolean;
  onSectionChange: (section: string) => void;
}

const TechnicalNavigation: React.FC<TechnicalNavigationProps> = ({
  currentSection,
  isConnected,
  onSectionChange
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { id: 'equipment', label: 'Equipamiento', icon: FaTools },
    { id: 'maintenance', label: 'Mantenimiento', icon: FaWrench },
    { id: 'reports', label: 'Reportes', icon: FaClipboardList },
    { id: 'analytics', label: 'Analíticas', icon: FaChartBar },
    { id: 'settings', label: 'Configuración', icon: FaCog }
  ];

  const handleNavClick = (sectionId: string) => {
    onSectionChange(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <NavigationContainer>
      <NavContent>
        <Logo>
          <div className="logo-icon">🔧</div>
          <span>Sistema Técnico - Janos</span>
        </Logo>

        <NavMenu isOpen={isMobileMenuOpen}>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavItem
                key={item.id}
                isActive={currentSection === item.id}
                onClick={() => handleNavClick(item.id)}
              >
                <IconComponent className="nav-icon" />
                <span>{item.label}</span>
              </NavItem>
            );
          })}
        </NavMenu>

        <StatusIndicator isConnected={isConnected}>
          <div className="status-dot"></div>
          {isConnected ? 'Conectado' : 'Desconectado'}
        </StatusIndicator>

        <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
      </NavContent>
    </NavigationContainer>
  );
};

export default TechnicalNavigation;
