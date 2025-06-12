// src/lib/api/client.ts
import {toast} from 'sonner';
import { API_CONFIG } from '@/lib/config/api';

interface FetchOptions extends RequestInit {
    token?: string;
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string = API_CONFIG.BASE_URL) {
        this.baseURL = baseURL;
    }

    private async getAuthToken(): Promise<string | null> {
        if (typeof window !== 'undefined') {
            // Primero intentar obtener del Zustand store
            try {
                const { useAuthStore } = await import('@/store/auth-store');
                const token = useAuthStore.getState().accessToken;
                if (token) return token;
            } catch (error) {
                console.warn('No se pudo acceder al auth store:', error);
            }
            
            // Fallback al localStorage
            return localStorage.getItem('accessToken');
        }
        return null;
    }

    async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
        const {token, headers = {}, ...fetchOptions} = options;

        // ✅ MEJORA: Validar y renovar token automáticamente antes del request
        let authToken = token;
        
        if (!authToken) {
            try {
                const { useAuthStore } = await import('@/store/auth-store');
                const authStore = useAuthStore.getState();
                
                // Usar el nuevo método inteligente que valida y renueva si es necesario
                const isValidOrRenewed = await authStore.validateAndRefreshIfNeeded();
                
                if (isValidOrRenewed) {
                    authToken = useAuthStore.getState().accessToken || undefined;
                } else {
                    // No se pudo validar ni renovar, el usuario será redirigido automáticamente
                    console.warn('No se pudo obtener token válido para el request');
                }
            } catch (error) {
                console.warn('Error obteniendo token validado:', error);
                // Fallback al método anterior
                authToken = (await this.getAuthToken()) || undefined;
            }
        }

        const config: RequestInit = {
            ...fetchOptions,
            headers: {
                'Content-Type': 'application/json',
                ...(authToken && {Authorization: `Bearer ${authToken}`}),
                ...headers,
            },
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);

            if (!response.ok) {
                if (response.status === 401) {
                    // Intentar renovar token usando el auth store
                    try {
                        const { useAuthStore } = await import('@/store/auth-store');
                        const authStore = useAuthStore.getState();
                        
                        // ✅ MEJORA: Usar método inteligente de validación
                        const renewed = await authStore.validateAndRefreshIfNeeded();
                        
                        if (renewed) {
                            // Obtener el nuevo token y reintentar
                            const newToken = useAuthStore.getState().accessToken;
                            if (newToken) {
                                return this.request(endpoint, {...options, token: newToken});
                            }
                        }
                    } catch (error) {
                        console.error('Error en refresh automático:', error);
                    }

                    // Si no se pudo renovar, redirigir a login
                    if (typeof window !== 'undefined') {
                        // Limpiar el auth store también
                        try {
                            const { useAuthStore } = await import('@/store/auth-store');
                            useAuthStore.getState().logout();
                        } catch (error) {
                            console.warn('No se pudo hacer logout del store:', error);
                        }
                        window.location.href = '/login';
                    }
                }

                const error = await response.json();
                throw new Error(error.detail || 'Error en la operación');
            }

            return response.json();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            if (typeof window !== 'undefined') {
                toast.error(message);
            }
            throw error;
        }
    }

    // Métodos convenientes
    get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
        return this.request<T>(endpoint, {...options, method: 'GET'});
    }

    post<T>(endpoint: string, data?: Record<string, unknown>, options?: FetchOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    put<T>(endpoint: string, data?: Record<string, unknown>, options?: FetchOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
        return this.request<T>(endpoint, {...options, method: 'DELETE'});
    }
}

export const apiClient = new ApiClient();

// Funciones específicas para Server Components
export async function fetchTorneos() {
    const res = await fetch(`${API_CONFIG.BASE_URL}/torneos/`, {
        next: {revalidate: 60}, // Revalidar cada minuto
    });

    if (!res.ok) {
        throw new Error('Failed to fetch torneos');
    }

    return res.json();
}

export async function fetchTorneo(id: string) {
    const res = await fetch(`${API_CONFIG.BASE_URL}/torneos/${id}/`, {
        next: {revalidate: 60},
    });

    if (!res.ok) {
        throw new Error('Failed to fetch torneo');
    }

    return res.json();
}

// Funciones para partidos en Server Components
export async function fetchPartidos(params?: {
    page?: number;
    ordering?: string;
    search?: string;
    page_size?: number;
}) {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const res = await fetch(`${API_CONFIG.BASE_URL}/partidos${query}`, {
        next: {revalidate: 30}, // Revalidar cada 30 segundos
    });

    if (!res.ok) {
        throw new Error('Failed to fetch partidos');
    }

    return res.json();
}

export async function fetchPartidosProximos(params?: {
    dias?: number;
    torneo_id?: number;
    equipo_id?: number;
}) {
    const queryParams = new URLSearchParams();

    if (params?.dias) queryParams.append('dias', params.dias.toString());
    if (params?.torneo_id) queryParams.append('torneo_id', params.torneo_id.toString());
    if (params?.equipo_id) queryParams.append('equipo_id', params.equipo_id.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const res = await fetch(`${API_CONFIG.BASE_URL}/partidos/proximos${query}`, {
        next: {revalidate: 60}, // Revalidar cada minuto
    });

    if (!res.ok) {
        throw new Error('Failed to fetch próximos partidos');
    }

    return res.json();
}

export async function fetchPartidoById(id: string) {
    const res = await fetch(`${API_CONFIG.BASE_URL}/partidos/${id}/`, {
        next: {revalidate: 30},
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch partido with ID ${id}`);
    }

    return res.json();
}