/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import { User } from '@/types';
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  fetchUserAttributes,
  confirmSignUp,
  fetchAuthSession,
} from 'aws-amplify/auth';

/**
 * Authentication context type definition
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  confirmSignup: (username: string, code: string) => Promise<void>;
}

/**
 * Authentication context
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

// JWT payload decode helper (no external dependency)
function decodeJwtPayload(token: string) {
  try {
    const payloadPart = token.split('.')[1];
    const payloadJson = atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const resolveIsAdmin = async (): Promise<boolean> => {
    try {
      const session = await fetchAuthSession();
      const accessToken = session.tokens?.accessToken?.toString();
      if (!accessToken) return false;

      const payload = decodeJwtPayload(accessToken);
      const groups: string[] = payload?.['cognito:groups'] || [];
      return groups.includes('Admin');
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();

        // 1. ÖNCE: Admin olup olmadığını öğreniyoruz
        const admin = await resolveIsAdmin();
        setIsAdmin(admin);

        // 2. SONRA: Öğrendiğimiz bu bilgiyi kullanarak kullanıcıyı set ediyoruz
        setUser({
          id: currentUser.userId,
          email: attributes.email || '',
          name: attributes.name || currentUser.username,
          role: admin ? 'admin' : 'user', // Artık admin değişkeni yukarıda tanımlı olduğu için hata vermez!
          createdAt: new Date().toISOString(),
        });
      } catch {
        setUser(null);
        setIsAdmin(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { isSignedIn } = await signIn({ username: email, password });

      if (isSignedIn) {
        const currentUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();

        // 1. ÖNCE admin olup olmadığını çözüyoruz
        const admin = await resolveIsAdmin();
        setIsAdmin(admin);

        // 2. SONRA bu bilgiyi kullanarak kullanıcıyı set ediyoruz
        setUser({
          id: currentUser.userId,
          email: attributes.email || email,
          name: attributes.name || currentUser.username,
          role: admin ? 'admin' : 'user', // Artık admin tanımlı olduğu için hata vermez!
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });

      alert(
        'Signup successful! Please check your email for the verification code and confirm it via AWS console.'
      );
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSignup = async (username: string, code: string) => {
    await confirmSignUp({
      username,
      confirmationCode: code,
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin,
    login,
    logout,
    signup,
    confirmSignup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
