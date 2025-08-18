import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1f3d29 0%, #254a31 100%);
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
  img { display:block; max-width: 220px; height: auto; }
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
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: #10b981;
  color: white;
  border: none;
  cursor: pointer;
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
    const ok = await login({ email, password });
    setLoading(false);
    if (ok) navigate('/', { replace: true });
    else setError('Credenciales inválidas. (Tip: 123456)');
  };

  return (
    <Page>
      <Card>
        <LogoWrap>
          {/* Coloca tu archivo en public/chakra-logo.png para usar este logo */}
          <img src="/chakra-logo.png" alt="Chakra" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </LogoWrap>
        <Title>Bienvenido al Chakrodromo!</Title>
        <Subtitle>Ingresa con tus credenciales</Subtitle>
        <Form onSubmit={submit}>
          {error && <Error>{error}</Error>}
          <div>
            <label>Correo</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seba@chakra.com / santi@chakra.com" required />
          </div>
          <div>
            <label>Contraseña</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="chakra4794" required />
          </div>
          <Button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</Button>
          <div style={{ fontSize: 12, color: '#64748b' }}>Demo: seba@chakra.com / santi@chakra.com — pass: chakra4794</div>
        </Form>
      </Card>
    </Page>
  );
};

export default Login;


