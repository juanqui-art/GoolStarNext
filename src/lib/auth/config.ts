// src/lib/auth/config.ts

export const AUTH_CONFIG = {
  // Endpoints del backend
  API_BASE_URL: 'https://goolstar-backend.fly.dev/api',
  
  // Endpoints de autenticación
  ENDPOINTS: {
    LOGIN: '/auth/token/',
    REFRESH: '/auth/token/refresh/',
    REGISTER: '/auth/registro/',
    LOGOUT: '/auth/logout/',
  },

  // Rutas protegidas que requieren autenticación
  PROTECTED_ROUTES: [
    '/dashboard',
    '/admin',
  ],

  // Rutas de autenticación donde los usuarios autenticados serán redirigidos
  AUTH_ROUTES: [
    '/login',
    '/sign-in',
    '/register',
  ],

  // Configuración de tokens
  TOKEN_CONFIG: {
    ACCESS_TOKEN_KEY: 'accessToken',
    REFRESH_TOKEN_KEY: 'refreshToken',
    // Tiempo antes de expiración para renovar automáticamente (en minutos)
    REFRESH_THRESHOLD: 5,
  },

  // Rutas de redirección
  REDIRECT_ROUTES: {
    // Donde redirigir después del login exitoso
    LOGIN_SUCCESS: '/dashboard',
    // Donde redirigir si no está autenticado
    LOGIN_REQUIRED: '/login',
    // Donde redirigir si ya está autenticado y trata de acceder a auth routes
    ALREADY_AUTHENTICATED: '/dashboard',
  },
} as const;

export type AuthConfig = typeof AUTH_CONFIG;