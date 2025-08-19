import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const bgShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #153121, #1f3d29, #254a31, #1f3d29);
  background-size: 200% 200%;
  animation: ${bgShift} 18s ease infinite;
  padding: 1rem;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  width: 100%;
  max-width: 420px;
  padding: 0.5rem 1.25rem 0.75rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  margin: 0.25rem 0 0.25rem 0;
  font-size: 1.5rem;
`;

const Subtitle = styled.p`
  margin: 0 0 0.5rem 0;
  color: #64748b;
`;

const LogoWrap = styled.div`
  display: flex;
  justify-content: center;
  margin: 0;
  img { display:block; max-width: 165px; height: auto; }
`;

const Form = styled.form`
  display: grid;
  gap: 0.75rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
`;

const Button = styled.button`
  position: relative;
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  background: linear-gradient(135deg, #10b981, #0ea5a4);
  color: white;
  border: none;
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease, filter .18s ease;
  box-shadow: 0 6px 16px rgba(16,185,129,.25);

  &:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 10px 22px rgba(16,185,129,.32);
    filter: saturate(1.05);
  }

  &:active {
    transform: translateY(0) scale(0.99);
    box-shadow: 0 4px 12px rgba(16,185,129,.25);
  }
`;

const Error = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [remember, setRemember] = useState<boolean>(() => {
    try { return localStorage.getItem('cropcrm_remember') === '1'; } catch { return false; }
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try { localStorage.setItem('cropcrm_remember', remember ? '1' : '0'); } catch {}
    try { (window as any).__setRememberMe?.(remember); } catch {}
    const ok = await login({ email: email.trim().toLowerCase(), password: password.trim() });
    setLoading(false);
    if (ok) navigate('/', { replace: true });
    else setError('Credenciales inválidas. Verifica email y contraseña.');
  };

  return (
    <Page>
      <Card>
        <LogoWrap>
          {/* Coloca tu archivo en public/chakra-logo.png para usar este logo */}
          <img src="/chakra-logo.png" alt="Chakra" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </LogoWrap>
        <Title>Bienvenido a Chakra!</Title>
        <Subtitle>Sistema de Gestion de Cultivos</Subtitle>
        <Form onSubmit={submit} autoComplete="off">
          {error && <Error>{error}</Error>}
          <div>
            <label>Correo</label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder=""
              required
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false as any}
              name="login_email"
            />
          </div>
          <div>
            <label>Contraseña</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder=""
              required
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false as any}
              name="login_password"
            />
          </div>
          <label style={{ display:'flex', alignItems:'center', gap:8, fontSize: 14, color:'#334155' }}>
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ width:16, height:16 }} />
            Recuerdame
          </label>
          <Button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</Button>
          {/* texto demo removido para evitar confusión y autofill visual */}
        </Form>
      </Card>
    </Page>
  );
};

export default Login;


