import React, { createContext, useContext, useEffect, useState } from 'react';

type Role = 'owner' | 'partner' | 'viewer';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: AuthUser[] = [
  { id: '1', email: 'admin@crop.com', name: 'Admin Cultivo', role: 'owner' },
  { id: '2', email: 'socio@crop.com', name: 'Socio Cultivo', role: 'partner' },
  { id: '3', email: 'socio2@crop.com', name: 'Socio 2', role: 'partner' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem('cropcrm_user');
    if (saved) setUser(JSON.parse(saved));
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const found = mockUsers.find(u => u.email === credentials.email);
    if (found && credentials.password === '123456') {
      setUser(found);
      localStorage.setItem('cropcrm_user', JSON.stringify(found));
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cropcrm_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};


