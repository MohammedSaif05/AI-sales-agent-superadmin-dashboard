'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { tokenStorage } from '../api/client/tokenStorage';
import { authApi } from '../api/services/authApi';
import { AuthUser, SystemRole } from '../api/types/auth.types';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null;
    const storedToken = tokenStorage.getAccessToken();
    const storedUser = tokenStorage.getUser();
    return storedToken && storedUser ? storedUser : null;
  });
  const [isLoading] = useState(false);
  const router = useRouter();

  const login = useCallback(
    async (phone: string, password: string): Promise<void> => {
      const response = await authApi.login({
        phone,
        password,
        deviceInfo: 'Super Admin Dashboard (Web)',
      });

      const { user: authUser, tokens } = response.data;

      // Client UX check for role
      if (authUser.systemRole !== SystemRole.SUPER_ADMIN) {
        tokenStorage.clear();
        setUser(null);
        throw new Error('Access denied: Account requires SUPER_ADMIN privileges.');
      }

      tokenStorage.setAuth(tokens, authUser);
      setUser(authUser);
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network failures on logout and ensure local state is purged
    } finally {
      tokenStorage.clear();
      setUser(null);
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
