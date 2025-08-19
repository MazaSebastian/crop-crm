import React from 'react';
import styled, { keyframes } from 'styled-components';

// ============ Toasts ============
type ToastKind = 'success' | 'error' | 'info';
interface Toast { id: string; kind: ToastKind; message: string; }

const ToastWrap = styled.div`
  position: fixed; right: 12px; top: 12px; z-index: 9999;
  display: grid; gap: 8px;
`;

const ToastItem = styled.div<{ kind: ToastKind }>`
  padding: 10px 12px; border-radius: 10px; color: #0f172a; font-weight: 600;
  background: ${({ kind }) => kind === 'success' ? '#dcfce7' : kind === 'error' ? '#fee2e2' : '#e0f2fe'};
  border: 1px solid ${({ kind }) => kind === 'success' ? '#86efac' : kind === 'error' ? '#fecaca' : '#bae6fd'};
  box-shadow: 0 6px 18px rgba(2,8,23,.18);
`;

interface ToastCtx { push: (msg: string, kind?: ToastKind) => void; }
const ToastContext = React.createContext<ToastCtx | null>(null);

export const useToast = () => {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [list, setList] = React.useState<Toast[]>([]);
  const push = React.useCallback((message: string, kind: ToastKind = 'info') => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setList(prev => [...prev, { id, kind, message }]);
    setTimeout(() => setList(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <ToastWrap>
        {list.map(t => <ToastItem key={t.id} kind={t.kind}>{t.message}</ToastItem>)}
      </ToastWrap>
    </ToastContext.Provider>
  );
};

// ============ Skeleton ============
const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const Skeleton = styled.div`
  height: 16px; border-radius: 8px; background: #e5e7eb;
  background-image: linear-gradient(90deg, #e5e7eb 0px, #f3f4f6 40px, #e5e7eb 80px);
  background-size: 600px 100%; animation: ${shimmer} 1.2s infinite;
`;


