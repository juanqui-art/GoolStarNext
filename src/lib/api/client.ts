// src/lib/api/client.ts
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
interface FetchOptions extends RequestInit {
    token?: string;
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async getAuthToken(): Promise<string | null> {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('accessToken');
        }
        return null;
    }

    async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
        const { token, headers = {}, ...fetchOptions } = options;

        const authToken = token || await this.getAuthToken();

        const config: RequestInit = {
            ...fetchOptions,
            headers: {
                'Content-Type': 'application/json',
                ...(authToken && { Authorization: `Bearer ${authToken}` }),
                ...headers,
            },
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);

            if (!response.ok) {
                if (response.status === 401) {
                    // Intentar renovar token
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        const refreshResponse = await fetch(`${this.baseURL}/auth/token/refresh/`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ refresh: refreshToken }),
                        });

                        if (refreshResponse.ok) {
                            const data = await refreshResponse.json();
                            localStorage.setItem('accessToken', data.access);
                            // Reintentar la petición original
                            return this.request(endpoint, { ...options, token: data.access });
                        }
                    }

                    // Redirigir a login si no se puede renovar
                    if (typeof window !== 'undefined') {
                        window.location.href = '/sign-in';
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
        return this.request<T>(endpoint, { ...options, method: 'GET' });
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
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

export const apiClient = new ApiClient(API_URL);

// Funciones específicas para Server Components
export async function fetchTorneos() {
    const res = await fetch(`${API_URL}/torneos/`, {
        next: { revalidate: 60 }, // Revalidar cada minuto
    });

    if (!res.ok) {
        throw new Error('Failed to fetch torneos');
    }

    return res.json();
}

export async function fetchTorneo(id: string) {
    const res = await fetch(`${API_URL}/torneos/${id}/`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch torneo');
    }

    return res.json();
}