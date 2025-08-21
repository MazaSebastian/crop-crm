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
import Expenses from './pages/Expenses';
import Stock from './pages/Stock';
import Crosti from './pages/Crosti';

const TopNav = styled.nav<{ scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.75rem;
  background: ${({ scrolled }) => scrolled
    ? 'linear-gradient(135deg, rgba(16,185,129,.92), rgba(5,150,105,.92))'
    : 'linear-gradient(135deg, rgba(16,185,129,.72), rgba(5,150,105,.72))'};
  color: white;
  z-index: 1000;
  box-shadow: ${({ scrolled }) => scrolled ? '0 10px 24px rgba(2,8,23,.18)' : '0 6px 16px rgba(2,8,23,.10)'};
  backdrop-filter: saturate(140%) blur(10px);
  border-bottom: 1px solid rgba(255,255,255,.10);
  transition: background .25s ease, box-shadow .25s ease, backdrop-filter .25s ease;
  overflow-x: auto;

  a { 
    color: white; 
    font-weight: 600; 
    text-decoration: none;
    padding: 0.4rem 0.85rem;
    border-radius: 10px;
    transition: transform .18s ease, background-color .18s ease, box-shadow .18s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.12);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(255,255,255,.12);
    }
  }
  @media (max-width: 640px) {
    gap: 0.25rem;
    a { padding: 0.35rem 0.6rem; font-size: 14px; white-space: nowrap; }
  }
`;

const LogoutBtn = styled.button`
  margin-left: auto;
  padding: 0.45rem 0.85rem;
  border-radius: 10px;
  border: 1px solid transparent;
  color: #fff;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(239,68,68,.22);
  transition: transform .18s ease, box-shadow .18s ease, filter .18s ease;
  &:hover { transform: translateY(-1px); box-shadow: 0 10px 22px rgba(239,68,68,.28); filter: saturate(1.05); }
  &:active { transform: translateY(0) scale(.99); box-shadow: 0 4px 12px rgba(239,68,68,.22); }
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
  const { logout, user } = useAuth();
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };
  return (
    <AppContainer>
      {!isLogin && (
        <TopNav scrolled={scrolled}>
          <Link to="/">🏠 Home</Link>
          <Link to="/crops">🌱 Cultivos</Link>
          <Link to="/daily-log">📝 Registro Diario</Link>
          <Link to="/parameters">📊 Parámetros</Link>
          <Link to="/tasks">✅ Tareas</Link>
          <Link to="/expenses">💰 Gastos</Link>
          <Link to="/crosti">🍽️ Crosti</Link>
          <Link to="/stock">📦 Stock</Link>
          <div style={{ marginLeft: 'auto', marginRight: 8, fontWeight: 600 }}>Bienvenido {user?.name}</div>
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
          <Route path="/expenses" element={<RequireAuth><Page><Expenses /></Page></RequireAuth>} />
          <Route path="/crosti" element={<RequireAuth><Page><Crosti /></Page></RequireAuth>} />
          <Route path="/stock" element={<RequireAuth><Page><Stock /></Page></RequireAuth>} />
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
