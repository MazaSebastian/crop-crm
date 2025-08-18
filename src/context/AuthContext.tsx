import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

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
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!supabase) {
        // Modo local (fallback demo)
        const saved = localStorage.getItem('cropcrm_user');
        if (saved && mounted) setUser(JSON.parse(saved));
        setIsLoading(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      const s = data?.session;
      if (s?.user && mounted) {
        const u: AuthUser = {
          id: s.user.id,
          email: s.user.email || '',
          name: (s.user.user_metadata?.name as string) || s.user.email || 'Usuario',
          role: 'owner'
        };
        setUser(u);
      }
      setIsLoading(false);
      // Suscribirse a cambios de sesión
      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        if (!mounted) return;
        if (session?.user) {
          const u: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: (session.user.user_metadata?.name as string) || session.user.email || 'Usuario',
            role: 'owner'
          };
          setUser(u);
        } else {
          setUser(null);
        }
      });
      return () => { sub?.subscription?.unsubscribe(); };
    })();
    return () => { mounted = false; };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    if (!supabase) {
      // Fallback demo (sin backend)
      const demo = [
        { id: '1', email: 'seba@chakra.com', name: 'Sebastian', role: 'owner' as Role },
        { id: '2', email: 'santi@chakra.com', name: 'Santiago', role: 'partner' as Role }
      ];
      const found = demo.find(u => u.email === credentials.email && credentials.password === 'chakra4794');
      if (found) {
        setUser(found);
        localStorage.setItem('cropcrm_user', JSON.stringify(found));
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    setIsLoading(false);
    return !error;
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
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


