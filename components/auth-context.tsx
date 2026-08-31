'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';

type AuthContextValue = {
  ready: boolean;
  authed: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('unipath_token');
    setAuthed(Boolean(token));
    setReady(true);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await api.login(email, password);
    sessionStorage.setItem('unipath_token', result.access_token);
    setAuthed(true);
  };

  const logout = () => {
    sessionStorage.removeItem('unipath_token');
    setAuthed(false);
  };

  return <AuthContext.Provider value={{ ready, authed, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context) return context;
  return { ready: false, authed: false, login: async () => {}, logout: () => {} };
};
