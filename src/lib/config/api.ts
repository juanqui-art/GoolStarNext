/**
 * Configuración centralizada de API
 * 
 * Este archivo es el único lugar donde se define la URL base de la API
 * para evitar inconsistencias y facilitar el mantenimiento.
 */

// URL base del backend Django
export const API_CONFIG = {
  // URL base - único lugar donde se define
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://goolstar-backend.fly.dev/api',
  
  // Endpoints específicos
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/token/',
      REFRESH: '/auth/token/refresh/',
      LOGOUT: '/auth/logout/',
      REGISTER: '/auth/registro/',
    },
    TORNEOS: '/torneos/',
    EQUIPOS: '/equipos/',
    JUGADORES: '/jugadores/',
    PARTIDOS: '/partidos/',
    CATEGORIAS: '/categorias/',
  },
  
  // Configuración de timeouts
  TIMEOUTS: {
    DEFAULT: 10000,    // 10 segundos
    AUTH: 15000,       // 15 segundos para auth
    UPLOAD: 30000,     // 30 segundos para uploads
  },
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  }
} as const;

/**
 * Construye URL completa para un endpoint
 * @param endpoint - Endpoint relativo (ej: '/auth/login/' o 'torneos/')
 * @returns URL completa
 */
export function buildApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_CONFIG.BASE_URL}/${cleanEndpoint}`;
}