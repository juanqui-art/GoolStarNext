/**
 * Hook para usar las funcionalidades de validación JWT
 * 
 * Proporciona un interface reactivo para monitorear el estado
 * de los tokens JWT y manejar renovaciones automáticas.
 */

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { formatTokenTimeRemaining } from './jwt-validator';

interface TokenStatus {
  isValid: boolean;
  timeRemaining: number;
  timeRemainingFormatted: string;
  needsRefresh: boolean;
  isExpired: boolean;
}

/**
 * Hook que proporciona información en tiempo real sobre el estado del token
 */
export function useTokenStatus(): TokenStatus {
  const { 
    accessToken, 
    isTokenValidAndNotExpired, 
    getTokenTimeRemaining, 
    shouldRefreshTokenSoon 
  } = useAuthStore();
  
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>({
    isValid: false,
    timeRemaining: 0,
    timeRemainingFormatted: 'No disponible',
    needsRefresh: false,
    isExpired: true
  });

  useEffect(() => {
    const updateTokenStatus = () => {
      if (!accessToken) {
        setTokenStatus({
          isValid: false,
          timeRemaining: 0,
          timeRemainingFormatted: 'No disponible',
          needsRefresh: false,
          isExpired: true
        });
        return;
      }

      const isValid = isTokenValidAndNotExpired();
      const timeRemaining = getTokenTimeRemaining();
      const needsRefresh = shouldRefreshTokenSoon();
      const isExpired = timeRemaining <= 0;
      const timeRemainingFormatted = formatTokenTimeRemaining(accessToken);

      setTokenStatus({
        isValid,
        timeRemaining,
        timeRemainingFormatted,
        needsRefresh,
        isExpired
      });
    };

    // Actualizar inmediatamente
    updateTokenStatus();

    // Actualizar cada 30 segundos
    const interval = setInterval(updateTokenStatus, 30000);

    return () => clearInterval(interval);
  }, [accessToken, isTokenValidAndNotExpired, getTokenTimeRemaining, shouldRefreshTokenSoon]);

  return tokenStatus;
}

/**
 * Hook que maneja renovación automática de tokens en el background
 */
export function useAutoTokenRefresh() {
  const { validateAndRefreshIfNeeded, accessToken } = useAuthStore();
  
  useEffect(() => {
    if (!accessToken) return;

    const checkAndRefresh = async () => {
      try {
        await validateAndRefreshIfNeeded();
      } catch (error) {
        console.error('Error en auto-refresh de token:', error);
      }
    };

    // Verificar inmediatamente
    checkAndRefresh();

    // Verificar cada 4 minutos (240000ms)
    const interval = setInterval(checkAndRefresh, 240000);

    return () => clearInterval(interval);
  }, [accessToken, validateAndRefreshIfNeeded]);
}

/**
 * Hook combinado que proporciona estado del token y auto-refresh
 */
export function useTokenManager() {
  const tokenStatus = useTokenStatus();
  useAutoTokenRefresh();
  
  return tokenStatus;
}