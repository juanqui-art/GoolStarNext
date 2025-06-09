// src/lib/auth/useAuth.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, type User } from '@/store/auth-store';
import { AUTH_CONFIG } from './config';

export interface UseAuthReturn {
  // Estado
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Acciones
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  
  // Utilidades
  requireAuth: () => void;
  redirectIfAuthenticated: () => void;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  
  const {
    user,
    isAuthenticated,
    isLoading,
    login: storeLogin,
    logout: storeLogout,
    refreshAccessToken,
    checkAuth,
  } = useAuthStore();

  // Verificar autenticación al cargar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(AUTH_CONFIG.TOKEN_CONFIG.ACCESS_TOKEN_KEY);
      if (token && !user) {
        checkAuth();
      }
    }
  }, [checkAuth, user]);

  // Función de login con redirección
  const login = async (credentials: { username: string; password: string }) => {
    await storeLogin(credentials);
    // Redirigir al dashboard después del login exitoso
    router.push(AUTH_CONFIG.REDIRECT_ROUTES.LOGIN_SUCCESS);
  };

  // Función de logout con redirección
  const logout = () => {
    storeLogout();
    // Redirigir al login después del logout
    router.push(AUTH_CONFIG.REDIRECT_ROUTES.LOGIN_REQUIRED);
  };

  // Requerir autenticación - redirige si no está autenticado
  const requireAuth = () => {
    if (!isAuthenticated && !isLoading) {
      router.push(AUTH_CONFIG.REDIRECT_ROUTES.LOGIN_REQUIRED);
    }
  };

  // Redirigir si ya está autenticado (útil para páginas de login)
  const redirectIfAuthenticated = () => {
    if (isAuthenticated) {
      router.push(AUTH_CONFIG.REDIRECT_ROUTES.ALREADY_AUTHENTICATED);
    }
  };

  return {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    
    // Acciones
    login,
    logout,
    refreshToken: refreshAccessToken,
    
    // Utilidades
    requireAuth,
    redirectIfAuthenticated,
  };
}

// Hook para páginas protegidas
export function useRequireAuth() {
  const auth = useAuth();
  
  useEffect(() => {
    auth.requireAuth();
  }, [auth]);
  
  return auth;
}

// Hook para páginas de autenticación (login, registro)
export function useRedirectIfAuthenticated() {
  const auth = useAuth();
  
  useEffect(() => {
    auth.redirectIfAuthenticated();
  }, [auth]);
  
  return auth;
}