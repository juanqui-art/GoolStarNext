// API configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

/**
 * Cliente API básico para realizar solicitudes al backend
 */
export async function fetchApi<T>(
  endpoint: string, 
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;
  
  const headers = new Headers(options.headers);
  
  // Si hay un token, lo agregamos a las cabeceras
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Si estamos enviando datos JSON, establecemos el Content-Type adecuado
  if (
    options.body &&
    typeof options.body === 'object' &&
    !(options.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }
  
  const url = `${API_URL}/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      body: options.body && typeof options.body === 'object' && !(options.body instanceof FormData)
        ? JSON.stringify(options.body)
        : options.body,
    });
    
    // Si la respuesta no es exitosa, lanzamos un error
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error en la solicitud' }));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    // Para respuestas vacías (204 No Content)
    if (response.status === 204) {
      return {} as T;
    }
    
    // Intentamos parsear la respuesta como JSON
    return await response.json();
  } catch (error) {
    console.error('Error en la solicitud API:', error);
    throw error;
  }
}
