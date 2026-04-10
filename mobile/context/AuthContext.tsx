import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import {
  getUserById,
  MOCK_CREDENTIALS,
  UserRole,
  UserSpecialty,
} from '@/data/mock';

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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  // TODO: persist session with AsyncStorage
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const credential = MOCK_CREDENTIALS.find(
      (c) => c.email === email.trim().toLowerCase() && c.password === password
    );

    if (!credential) {
      return { success: false, error: 'E-mail ou senha incorretos.' };
    }

    const mockUser = getUserById(credential.userId);
    if (!mockUser) {
      return { success: false, error: 'Usuário não encontrado.' };
    }

    setUser({
      id: mockUser.id,
      name: mockUser.name,
      role: mockUser.role,
      specialty: mockUser.specialty,
      email: mockUser.email,
    });

    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
