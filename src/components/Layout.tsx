import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
`;

const MainContent = styled.main<{ sidebarCollapsed: boolean }>`
  flex: 1;
  margin-left: ${props => props.sidebarCollapsed ? '80px' : '280px'};
  background: #f8fafc;
  min-height: 100vh;
  transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    margin-left: ${props => props.sidebarCollapsed ? '60px' : '280px'};
  }
`;

const ContentWrapper = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #64748b;
    font-size: 1rem;
  }
`;

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, description }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Inicialmente expandido para evitar cortes

  return (
    <LayoutContainer>
      <Sidebar onToggle={setSidebarCollapsed} />
      <MainContent sidebarCollapsed={sidebarCollapsed}>
        <ContentWrapper>
          {title && (
            <PageHeader>
              <h1>{title}</h1>
              {description && <p>{description}</p>}
            </PageHeader>
          )}
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
