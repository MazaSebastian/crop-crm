import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import LiveChat from './components/LiveChat';
import Crops from './pages/Crops';
import DailyLog from './pages/DailyLog';
import Parameters from './pages/Parameters';
import Tasks from './pages/Tasks';
import Stock from './pages/Stock';
import Compras from './pages/Compras';
import Insumos from './pages/Insumos';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
import './App.css';

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  z-index: 1000;
  overflow-x: auto;
  white-space: nowrap;

  a { 
    color: white; 
    font-weight: 600; 
    text-decoration: none;
    padding: 0.5rem 0.75rem;
    border-radius: 0.25rem;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    padding: 0 0.5rem;
    
    a {
      font-size: 0.875rem;
      padding: 0.25rem 0.5rem;
    }
  }
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

  return (
    <div className="App">
      {!isLogin && (
        <TopNav>
          <Link to="/crops">Cultivos</Link>
          <Link to="/daily-log">Registro Diario</Link>
          <Link to="/parameters">Parámetros</Link>
          <Link to="/tasks">Tareas</Link>
          <Link to="/stock">Stock</Link>
          <Link to="/insumos">Insumos</Link>
          <Link to="/compras" title="Lista de compras">🛒 Compras</Link>
        </TopNav>
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/crops" replace />} />
        <Route path="/crops" element={<RequireAuth><Crops /></RequireAuth>} />
        <Route path="/daily-log" element={<RequireAuth><DailyLog /></RequireAuth>} />
        <Route path="/parameters" element={<RequireAuth><Parameters /></RequireAuth>} />
        <Route path="/tasks" element={<RequireAuth><Tasks /></RequireAuth>} />
        <Route path="/stock" element={<RequireAuth><Stock /></RequireAuth>} />
        <Route path="/insumos" element={<RequireAuth><Insumos /></RequireAuth>} />
        <Route path="/compras" element={<RequireAuth><Compras /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/crops" replace />} />
      </Routes>

      {!isLogin && <LiveChat />}
    </div>
  );
}

export default App;
