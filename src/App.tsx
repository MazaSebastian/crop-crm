import React from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Home from './pages/Home';
import Crops from './pages/Crops';
import DailyLog from './pages/DailyLog';
import Parameters from './pages/Parameters';
import Tasks from './pages/Tasks';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';

const TopNav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  a { 
    color: white; 
    font-weight: 600; 
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

const LogoutBtn = styled.button`
  margin-left: auto;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
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

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/crops" element={<RequireAuth><Crops /></RequireAuth>} />
        <Route path="/daily-log" element={<RequireAuth><DailyLog /></RequireAuth>} />
        <Route path="/parameters" element={<RequireAuth><Parameters /></RequireAuth>} />
        <Route path="/tasks" element={<RequireAuth><Tasks /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
