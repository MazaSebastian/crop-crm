import React from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import Home from './pages/Home';
import Crops from './pages/Crops';
import DailyLog from './pages/DailyLog';
import Parameters from './pages/Parameters';
import Tasks from './pages/Tasks';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
import CropSummary from './pages/CropSummary';

const TopNav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.75rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark} 100%);
  color: white;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  a { 
    color: white; 
    font-weight: 600; 
    text-decoration: none;
    padding: 0.4rem 0.8rem;
    border-radius: 8px;
    transition: background-color 0.2s;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

const LogoutBtn = styled.button`
  margin-left: auto;
  background: ${({ theme }) => theme.colors.danger};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.45rem 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover { background: #dc2626; }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`;

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };
  return (
    <AppContainer>
      {!isLogin && (
        <TopNav>
          <Link to="/">🏠 Home</Link>
          <Link to="/crops">🌱 Cultivos</Link>
          <Link to="/daily-log">📝 Registro Diario</Link>
          <Link to="/parameters">📊 Parámetros</Link>
          <Link to="/tasks">✅ Tareas</Link>
          <LogoutBtn onClick={handleLogout}>Cerrar sesión</LogoutBtn>
        </TopNav>
      )}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Page><Login /></Page>} />
          <Route path="/" element={<RequireAuth><Page><Home /></Page></RequireAuth>} />
          <Route path="/crops" element={<RequireAuth><Page><Crops /></Page></RequireAuth>} />
          <Route path="/crops/:id" element={<RequireAuth><Page><CropSummary /></Page></RequireAuth>} />
          <Route path="/daily-log" element={<RequireAuth><Page><DailyLog /></Page></RequireAuth>} />
          <Route path="/parameters" element={<RequireAuth><Page><Parameters /></Page></RequireAuth>} />
          <Route path="/tasks" element={<RequireAuth><Page><Tasks /></Page></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </AppContainer>
  );
}

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.22, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export default App;
