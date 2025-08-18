import styled from 'styled-components';

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

export const Button = styled.button<{ variant?: 'primary' | 'ghost' | 'danger' }>`
  position: relative;
  padding: 0.55rem 1rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 600;
  background: ${({ theme, variant }) => {
    if (variant === 'danger') return `linear-gradient(135deg, ${theme.colors.danger}, #dc2626)`;
    if (variant === 'ghost') return 'transparent';
    return `linear-gradient(135deg, ${theme.colors.primary}, #0ea5a4)`;
  }};
  color: ${({ variant }) => (variant === 'ghost' ? '#0f172a' : '#fff')};
  box-shadow: ${({ variant }) => (variant === 'ghost' ? 'none' : '0 6px 16px rgba(16,185,129,.22)')};
  transition: transform .18s ease, box-shadow .18s ease, filter .18s ease, opacity .18s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ variant }) => (variant === 'ghost' ? 'none' : '0 10px 22px rgba(16,185,129,.28)')};
    filter: ${({ variant }) => (variant === 'ghost' ? 'none' : 'saturate(1.05)')};
    opacity: 1;
  }

  &:active {
    transform: translateY(0) scale(0.99);
    box-shadow: ${({ variant }) => (variant === 'ghost' ? 'none' : '0 4px 12px rgba(16,185,129,.22)')};
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  h3 { font-size: 1rem; margin: 0; }
`;

export const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  &:focus { outline: none; box-shadow: 0 0 0 3px rgba(37,99,235,.25); border-color: #60a5fa; }
`;

export const Select = styled.select`
  width: 100%;
  height: 40px;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface};
  &:focus { outline: none; box-shadow: 0 0 0 3px rgba(37,99,235,.25); border-color: #60a5fa; }
`;

