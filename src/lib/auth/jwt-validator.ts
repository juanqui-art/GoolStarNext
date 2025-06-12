/**
 * Utilidades para validación de JWT tokens
 * 
 * Proporciona funciones para validar tokens JWT client-side,
 * detectar expiración y obtener información del payload.
 */

import { jwtDecode, type JwtPayload } from 'jwt-decode';

/**
 * Interface para el payload de los JWT tokens de Django
 */
export interface DjangoJwtPayload extends JwtPayload {
  user_id: number;
  username?: string;
  email?: string;
  is_staff?: boolean;
  token_type?: 'access' | 'refresh';
}

/**
 * Valida si un token JWT es válido y no ha expirado
 * @param token - Token JWT a validar
 * @returns true si el token es válido, false en caso contrario
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  
  try {
    const decoded = jwtDecode<DjangoJwtPayload>(token);
    
    // Verificar que tenga fecha de expiración
    if (!decoded.exp) return false;
    
    // Verificar que no haya expirado (con margen de 30 segundos)
    const now = Math.floor(Date.now() / 1000);
    const isNotExpired = decoded.exp > (now + 30);
    
    return isNotExpired;
  } catch (error) {
    console.warn('Error validando token JWT:', error);
    return false;
  }
}

/**
 * Obtiene el tiempo restante hasta la expiración del token en segundos
 * @param token - Token JWT
 * @returns Segundos hasta expiración, 0 si ya expiró, -1 si hay error
 */
export function getTokenExpirationTime(token: string | null): number {
  if (!token) return -1;
  
  try {
    const decoded = jwtDecode<DjangoJwtPayload>(token);
    
    if (!decoded.exp) return -1;
    
    const now = Math.floor(Date.now() / 1000);
    const timeRemaining = decoded.exp - now;
    
    return Math.max(0, timeRemaining);
  } catch (error) {
    console.warn('Error obteniendo tiempo de expiración:', error);
    return -1;
  }
}

/**
 * Verifica si un token necesita ser renovado pronto
 * @param token - Token JWT
 * @param thresholdMinutes - Minutos antes de expiración para considerar renovación (default: 5)
 * @returns true si el token necesita renovación pronto
 */
export function shouldRefreshToken(token: string | null, thresholdMinutes: number = 5): boolean {
  const timeRemaining = getTokenExpirationTime(token);
  
  if (timeRemaining <= 0) return true; // Ya expiró
  
  const thresholdSeconds = thresholdMinutes * 60;
  return timeRemaining <= thresholdSeconds;
}

/**
 * Decodifica un token JWT y retorna su payload
 * @param token - Token JWT
 * @returns Payload del token o null si hay error
 */
export function decodeToken(token: string | null): DjangoJwtPayload | null {
  if (!token) return null;
  
  try {
    return jwtDecode<DjangoJwtPayload>(token);
  } catch (error) {
    console.warn('Error decodificando token:', error);
    return null;
  }
}

/**
 * Obtiene información del usuario desde un token JWT
 * @param token - Token JWT
 * @returns Información del usuario o null
 */
export function getUserFromToken(token: string | null): {
  id: number;
  username?: string;
  email?: string;
  is_staff?: boolean;
} | null {
  const payload = decodeToken(token);
  
  if (!payload) return null;
  
  return {
    id: payload.user_id,
    username: payload.username,
    email: payload.email,
    is_staff: payload.is_staff || false,
  };
}

/**
 * Formatea el tiempo restante de un token en formato legible
 * @param token - Token JWT
 * @returns String con tiempo formateado (ej: "5m 30s", "expirado")
 */
export function formatTokenTimeRemaining(token: string | null): string {
  const timeRemaining = getTokenExpirationTime(token);
  
  if (timeRemaining <= 0) return 'expirado';
  if (timeRemaining < 0) return 'inválido';
  
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}