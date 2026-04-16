import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  clearAccessToken,
  setAccessToken,
  setOnUnauthorized,
} from '@/services/api/client';
import { ApiError } from '@/services/api/errors';
import { loginApi, logoutApi, refreshTokenApi } from '@/services/auth/authService';
import {
  clearAll,
  getToken,
  getUser,
  saveToken,
  saveUser,
} from '@/services/auth/authStorage';
import type { UserRole, UserSpecialty } from '@/types/api';

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  specialty: UserSpecialty | null;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const performLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Best-effort: ignore logout API errors
    }
    clearAccessToken();
    await clearAll();
    setUser(null);
  };

  // Restore session on app start
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      try {
        const token = await getToken();
        const savedUser = await getUser();

        if (!token || !savedUser) {
          return;
        }

        setAccessToken(token);

        // Validate token with a refresh
        try {
          const refreshResult = await refreshTokenApi();
          setAccessToken(refreshResult.token);
          await saveToken(refreshResult.token);
        } catch {
          // Token expired or invalid -- force re-login
          clearAccessToken();
          await clearAll();
          return;
        }

        if (!cancelled) {
          setUser({
            id: savedUser.id,
            name: savedUser.name,
            role: capitalizeFirst(savedUser.role) as UserRole,
            specialty: (savedUser.specialty ? capitalizeFirst(savedUser.specialty) as UserSpecialty : null),
            email: '',
          });
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    restore();

    return () => {
      cancelled = true;
    };
  }, []);

  // Wire up the 401 callback so the HTTP client can trigger logout
  useEffect(() => {
    setOnUnauthorized(() => {
      clearAccessToken();
      clearAll();
      setUser(null);
    });
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await loginApi(email.trim().toLowerCase(), password);

      // Store token
      setAccessToken(response.token);
      await saveToken(response.token);

      // Store user
      await saveUser(response.user);

      setUser({
        id: response.user.id,
        name: response.user.name,
        role: capitalizeFirst(response.user.role) as UserRole,
        specialty: (response.user.specialty ? capitalizeFirst(response.user.specialty) as UserSpecialty : null),
        email: email.trim().toLowerCase(),
      });

      return { success: true };
    } catch (err) {
      if (err instanceof ApiError) {
        return { success: false, error: err.errors[0] };
      }
      return { success: false, error: 'Erro de conexão. Tente novamente.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout: performLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
