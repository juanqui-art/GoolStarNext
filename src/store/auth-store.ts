// src/store/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_CONFIG, buildApiUrl } from '@/lib/config/api';
import { 
  isTokenValid, 
  shouldRefreshToken, 
  getTokenExpirationTime 
} from '@/lib/auth/jwt-validator';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  is_active?: boolean;
}

interface AuthState {
  // Estado
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Acciones
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  refreshAccessToken: () => Promise<boolean>;
  checkAuth: () => Promise<void>;
  
  // Nuevas acciones con validación JWT
  isTokenValidAndNotExpired: () => boolean;
  getTokenTimeRemaining: () => number;
  shouldRefreshTokenSoon: () => boolean;
  validateAndRefreshIfNeeded: () => Promise<boolean>;
}

// API_URL removido - ahora usando configuración centralizada

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Accion de login
      login: async (credentials) => {
        set({ isLoading: true });

        try {
          const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            let errorMessage = 'Error en el login';
            try {
              const errorData = await response.json();
              errorMessage = errorData.detail || errorMessage;
            } catch {
              // Si no es JSON, usar el status text
              errorMessage = `Error ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
          }

          // Verificar que la respuesta sea JSON válido
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('El servidor no respondió con JSON válido');
          }

          const data = await response.json();
          
          // Crear objeto usuario con la información del token
          const user: User = {
            id: data.user_id || 0,
            username: credentials.username,
            email: data.email || '',
            first_name: '',
            last_name: '',
            is_staff: data.is_staff || false,
          };
          
          // Guardar tokens y usuario
          set({
            accessToken: data.access,
            refreshToken: data.refresh,
            user: user,
            isAuthenticated: true,
            isLoading: false,
          });

        } catch (error) {
          console.error('Error en login:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // Accion de logout
      logout: () => {
        // Limpiar localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      // Establecer tokens
      setTokens: (accessToken, refreshToken) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        }

        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      // Establecer usuario
      setUser: (user) => {
        set({ user });
      },

      // Renovar token de acceso
      refreshAccessToken: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          get().logout();
          return false;
        }

        try {
          const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (!response.ok) {
            get().logout();
            return false;
          }

          // Verificar que la respuesta sea JSON válido
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            console.error('Token refresh: El servidor no respondió con JSON válido');
            get().logout();
            return false;
          }

          const data = await response.json();
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', data.access);
          }

          set({ accessToken: data.access });
          return true;

        } catch (error) {
          console.error('Error renovando token:', error);
          get().logout();
          return false;
        }
      },

      // Verificar autenticacion
      checkAuth: async () => {
        const { accessToken, refreshToken } = get();

        if (!accessToken || !refreshToken) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        // Ahora validamos el token JWT antes de considerar autenticado
        const isValid = get().isTokenValidAndNotExpired();
        if (isValid) {
          set({ isAuthenticated: true });
        } else {
          // Token inválido o expirado, hacer logout
          get().logout();
        }
      },

      // ✅ Nuevas acciones con validación JWT
      
      /**
       * Verifica si el access token actual es válido y no ha expirado
       */
      isTokenValidAndNotExpired: () => {
        const { accessToken } = get();
        return isTokenValid(accessToken);
      },

      /**
       * Obtiene el tiempo restante del access token en segundos
       */
      getTokenTimeRemaining: () => {
        const { accessToken } = get();
        return getTokenExpirationTime(accessToken);
      },

      /**
       * Verifica si el token necesita renovación pronto (5 minutos por defecto)
       */
      shouldRefreshTokenSoon: () => {
        const { accessToken } = get();
        return shouldRefreshToken(accessToken, 5);
      },

      /**
       * Valida el token actual y lo renueva automáticamente si es necesario
       * @returns true si el token es válido (original o renovado), false si falló
       */
      validateAndRefreshIfNeeded: async () => {
        const { accessToken, refreshToken } = get();
        
        // Si no hay tokens, no está autenticado
        if (!accessToken || !refreshToken) {
          get().logout();
          return false;
        }
        
        // Si el token es válido y no necesita renovación, todo ok
        if (isTokenValid(accessToken) && !shouldRefreshToken(accessToken, 5)) {
          return true;
        }
        
        // Si llegamos aquí, el token está expirado o próximo a expirar
        console.log('🔄 Token expirado o próximo a expirar, renovando...');
        
        try {
          const renewed = await get().refreshAccessToken();
          if (renewed) {
            console.log('✅ Token renovado exitosamente');
            return true;
          } else {
            console.log('❌ Error renovando token, cerrando sesión');
            get().logout();
            return false;
          }
        } catch (error) {
          console.error('❌ Error en validateAndRefreshIfNeeded:', error);
          get().logout();
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      // Solo persistir algunos campos
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);