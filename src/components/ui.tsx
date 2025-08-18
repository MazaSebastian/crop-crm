import styled from 'styled-components';

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

export const Button = styled.button<{ variant?: 'primary' | 'ghost' | 'danger' }>`
  padding: 0.5rem 0.9rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 600;
  background: ${({ theme, variant }) =>
    variant === 'danger' ? theme.colors.danger : variant === 'ghost' ? 'transparent' : theme.colors.primary};
  color: ${({ variant }) => (variant === 'ghost' ? '#0f172a' : '#fff')};
  &:hover {
    opacity: 0.95;
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

