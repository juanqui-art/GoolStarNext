// API configuration
export const API_URL = 'https://goolstar.vercel.app';

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
    const {token, ...fetchOptions} = options;

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

    const response = await fetch(url, {
        ...fetchOptions,
        headers,
        body: options.body && typeof options.body === 'object' && !(options.body instanceof FormData)
            ? JSON.stringify(options.body)
            : options.body,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({message: 'Error en la solicitud'}));
        console.error('Error en la solicitud API:', errorData);
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    if (response.status === 204) {
        return {} as T;
    }

    return await response.json();
}
