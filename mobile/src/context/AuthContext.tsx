import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { getMe, login, register, type User } from '@/api/auth';
import { ApiError } from '@/api/client';
import * as tokenStorage from '@/storage/token';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const savedToken = await tokenStorage.getToken();

        if (!savedToken) {
          return;
        }

        const currentUser = await getMe(savedToken);
        setToken(savedToken);
        setUser(currentUser);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          await tokenStorage.deleteToken().catch(() => {});
        } else {
          // Server not reachable: keep the token so the next app start can log in again.
          // The user sees the login screen for now (intended for the MVP).
          console.warn('Failed to restore session', error);
        }
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    const newToken = await login(email, password);
    const currentUser = await getMe(newToken);

    await tokenStorage.setToken(newToken);
    setToken(newToken);
    setUser(currentUser);
  };

  const signUp = async (name: string, email: string, password: string) => {
    await register(name, email, password);
    await signIn(email, password);
  };

  const signOut = async () => {
    try {
      await tokenStorage.deleteToken();
    } catch (error) {
      console.warn('Failed to delete token', error);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
