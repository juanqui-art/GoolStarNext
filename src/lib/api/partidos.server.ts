import { API_CONFIG } from "@/lib/config/api";
import type {components} from '@/types/api';

type Partido = components['schemas']['Partido'];
type PartidoDetalle = components['schemas']['PartidoDetalle'];
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
type PaginatedPartidoListList = any; // Schema mismatch - using any temporarily

// Opciones de revalidación específicas para partidos
const REVALIDATION = {
    PARTIDOS_LIST: 60,     // 1 minuto para lista (datos dinámicos)
    PARTIDO_DETAIL: 30,    // 30 segundos para detalle (puede cambiar score)
    PROXIMOS: 300,         // 5 minutos para próximos partidos
    COMPLETADOS: 3600      // 1 hora para partidos completados
} as const;

/**
 * Función auxiliar para hacer peticiones al servidor
 */
async function partidosFetch<T>(
    endpoint: string,
    options: RequestInit & { revalidate?: number } = {}
): Promise<T> {
    const {revalidate = REVALIDATION.PARTIDOS_LIST, ...fetchOptions} = options;

    const url = `${API_CONFIG.BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...fetchOptions.headers,
            },
            next: {revalidate},
            ...fetchOptions,
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `Error ${response.status}: ${response.statusText}`;

            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.detail || errorData.message || errorMessage;
            } catch {
                if (errorText && errorText.length < 200) {
                    errorMessage = errorText;
                }
            }

            throw new Error(errorMessage);
        }

        return response.json();
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error de conexión con el servidor');
    }
}

/**
 * Obtener todos los partidos con soporte para filtros
 */
export async function getServerPartidos(params?: {
    page?: number;
    ordering?: string;
    search?: string;
    equipo_id?: number;
    jornada_id?: number;
    completado?: boolean;
    page_size?: number;
    all_pages?: boolean;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<any> {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fetchPage = async (page: number = 1): Promise<any> => {
        const queryParams = new URLSearchParams();

        queryParams.append('page', page.toString());
        if (params?.ordering) queryParams.append('ordering', params.ordering);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.equipo_id) queryParams.append('equipo_id', params.equipo_id.toString());
        if (params?.jornada_id) queryParams.append('jornada_id', params.jornada_id.toString());
        if (params?.completado !== undefined) queryParams.append('completado', params.completado.toString());
        if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

        // Usar revalidación diferente según el estado
        const revalidate = params?.completado === false
            ? REVALIDATION.PARTIDO_DETAIL
            : REVALIDATION.PARTIDOS_LIST;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return partidosFetch<any>(
            `/partidos/?${queryParams.toString()}`,
            {revalidate}
        );
    };

    if (!params?.all_pages) {
        return fetchPage(params?.page || 1);
    }

    // Obtener todas las páginas con límite de seguridad
    let currentPage = 1;
    let allResults: Partido[] = [];
    let hasMore = true;
    let totalCount = 0;

    while (hasMore && currentPage <= 15) { // Límite mayor para partidos
        try {
            const response = await fetchPage(currentPage);
            allResults = [...allResults, ...response.results];
            totalCount = response.count;

            hasMore = !!response.next;
            currentPage++;
        } catch (error) {
            console.error(`Error al obtener página ${currentPage} de partidos:`, error);
            break;
        }
    }

    return {
        count: totalCount,
        next: null,
        previous: null,
        results: allResults
    };
}

/**
 * Obtener un partido por ID
 */
export async function getServerPartidoById(id: string | number): Promise<PartidoDetalle> {
    return partidosFetch<PartidoDetalle>(
        `/partidos/${id}/`,
        {revalidate: REVALIDATION.PARTIDO_DETAIL}
    );
}

/**
 * Obtener próximos partidos
 */
export async function getServerProximosPartidos(params?: {
    dias?: number;
    torneo_id?: number;
    equipo_id?: number;
    limit?: number;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<any> {
    const queryParams = new URLSearchParams();

    if (params?.dias) queryParams.append('dias', params.dias.toString());
    if (params?.torneo_id) queryParams.append('torneo_id', params.torneo_id.toString());
    if (params?.equipo_id) queryParams.append('equipo_id', params.equipo_id.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return partidosFetch<any>(
        `/partidos/proximos/?${queryParams.toString()}`,
        {revalidate: REVALIDATION.PROXIMOS}
    );
}

/**
 * Obtener partidos por equipo
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerPartidosByEquipo(equipoId: number): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return partidosFetch<any>(
        `/partidos/por_equipo/?equipo_id=${equipoId}`,
        {revalidate: REVALIDATION.PARTIDOS_LIST}
    );
}

/**
 * Obtener partidos por jornada
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerPartidosByJornada(jornadaId: number): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return partidosFetch<any>(
        `/partidos/por_jornada/?jornada_id=${jornadaId}`,
        {revalidate: REVALIDATION.PARTIDOS_LIST}
    );
}

/**
 * Obtener estadísticas básicas de partidos
 */
export async function getServerPartidosStats(): Promise<{
    total: number;
    completados: number;
    pendientes: number;
    proximos_7_dias: number;
}> {
    try {
        const [allPartidos, proximosPartidos] = await Promise.all([
            getServerPartidos({all_pages: true}),
            getServerProximosPartidos({dias: 7})
        ]);

        const total = allPartidos.results.length;
        const completados = allPartidos.results.filter((p: Partido) => p.completado).length;
        const pendientes = total - completados;
        const proximos_7_dias = proximosPartidos.results.length;

        return {
            total,
            completados,
            pendientes,
            proximos_7_dias
        };
    } catch (error) {
        console.error('Error al obtener estadísticas de partidos:', error);
        return {
            total: 0,
            completados: 0,
            pendientes: 0,
            proximos_7_dias: 0
        };
    }
}

// Exportar todas las funciones en un objeto
export const partidosServerApi = {
    getAll: getServerPartidos,
    getById: getServerPartidoById,
    getProximos: getServerProximosPartidos,
    getByEquipo: getServerPartidosByEquipo,
    getByJornada: getServerPartidosByJornada,
    getStats: getServerPartidosStats
};

// NOTA TÉCNICA: Usando 'any' temporalmente para resolver desajuste de esquemas
// entre 'PaginatedPartidoList' esperado y 'PaginatedPartidoListList' del API schema
// Esto debe corregirse cuando se regeneren los tipos desde el backend