import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
// import LiveChat from './components/LiveChat'; // Disabling LiveChat for CRM cleanup
import Dashboard from './pages/Dashboard';
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
  height: 64px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0 2rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  color: #1a202c;
  z-index: 1000;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  .logo {
    font-weight: 800;
    font-size: 1.25rem;
    color: #2f855a;
    margin-right: 1rem;
    text-decoration: none;
  }

  a:not(.logo) { 
    color: #4a5568; 
    font-weight: 600; 
    text-decoration: none;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    font-size: 0.95rem;
    
    &:hover, &.active {
      background-color: #f0fff4;
      color: #2f855a;
    }
  }
  
  @media (max-width: 768px) {
    padding: 0 1rem;
    overflow-x: auto;
    gap: 0.75rem;
    
    .logo { display: none; }
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
          <Link to="/" className="logo">🌱 CropCRM</Link>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Dashboard</Link>
          <Link to="/crops" className={location.pathname.startsWith('/crops') ? 'active' : ''}>Cultivos</Link>
          <Link to="/daily-log">Diario</Link>
          <Link to="/parameters">Parámetros</Link>
          <Link to="/tasks">Tareas</Link>
          <Link to="/stock">Stock</Link>
          <Link to="/insumos">Insumos</Link>
          <Link to="/compras">Compras</Link>
        </TopNav>
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Changed root from redirect to Dashboard */}
        <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/crops" element={<RequireAuth><Crops /></RequireAuth>} />
        <Route path="/daily-log" element={<RequireAuth><DailyLog /></RequireAuth>} />
        <Route path="/parameters" element={<RequireAuth><Parameters /></RequireAuth>} />
        <Route path="/tasks" element={<RequireAuth><Tasks /></RequireAuth>} />
        <Route path="/stock" element={<RequireAuth><Stock /></RequireAuth>} />
        <Route path="/insumos" element={<RequireAuth><Insumos /></RequireAuth>} />
        <Route path="/compras" element={<RequireAuth><Compras /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* LiveChat disabled for cleanup */}
      {/* {!isLogin && <LiveChat />} */}
    </div>
  );
}

export default App;
