// src/lib/api/server.ts - Actualizado con partidos
import type { components } from '@/types/api';

// Tipos para equipos
type Equipo = components['schemas']['Equipo'];
type EquipoDetalle = components['schemas']['EquipoDetalle'];
type PaginatedEquipoList = components['schemas']['PaginatedEquipoList'];

// Tipos para partidos
type Partido = components['schemas']['Partido'];
type PartidoDetalle = components['schemas']['PartidoDetalle'];
type PaginatedPartidoList = components['schemas']['PaginatedPartidoList'];

// Configuración base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://goolstar-backend.fly.dev/api';

// Opciones de revalidación para diferentes tipos de data
const REVALIDATION = {
    STATIC: 3600,      // 1 hora para datos que cambian poco
    DYNAMIC: 300,      // 5 minutos para datos que cambian moderadamente
    REALTIME: 60,      // 1 minuto para datos en tiempo real
    PARTIDOS: 60,      // 1 minuto para partidos (pueden cambiar resultados)
    PARTIDO_DETAIL: 30 // 30 segundos para detalle de partido
} as const;

/**
 * Función auxiliar para hacer peticiones al servidor
 */
async function serverFetch<T>(
    endpoint: string,
    options: RequestInit & { revalidate?: number } = {}
): Promise<T> {
    const { revalidate = REVALIDATION.DYNAMIC, ...fetchOptions } = options;

    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...fetchOptions.headers,
            },
            next: { revalidate },
            ...fetchOptions,
        });

        if (!response.ok) {
            // Manejo mejorado de errores HTTP
            const errorText = await response.text();
            let errorMessage = `Error ${response.status}: ${response.statusText}`;

            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.detail || errorData.message || errorMessage;
            } catch {
                // Si no es JSON, usar el texto directamente si es útil
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

/* ============================================
   FUNCIONES PARA EQUIPOS
============================================ */

/**
 * Obtener equipos en el servidor con soporte mejorado para paginación
 */
export async function getServerEquipos(params?: {
    page?: number;
    ordering?: string;
    search?: string;
    categoria?: number;
    page_size?: number;
    all_pages?: boolean;
}): Promise<PaginatedEquipoList> {

    const fetchPage = async (page: number = 1): Promise<PaginatedEquipoList> => {
        const queryParams = new URLSearchParams();

        queryParams.append('page', page.toString());
        if (params?.ordering) queryParams.append('ordering', params.ordering);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.categoria) queryParams.append('categoria', params.categoria.toString());
        if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

        return serverFetch<PaginatedEquipoList>(
            `/equipos/?${queryParams.toString()}`,
            { revalidate: REVALIDATION.DYNAMIC }
        );
    };

    // Si no se solicita todas las páginas, devolver solo la primera
    if (!params?.all_pages) {
        return fetchPage(params?.page || 1);
    }

    // Si se solicitan todas las páginas, hacer fetch secuencial con límite de seguridad
    let currentPage = 1;
    let allResults: Equipo[] = [];
    let hasMore = true;
    let totalCount = 0;

    while (hasMore && currentPage <= 10) { // Límite de seguridad de 10 páginas
        try {
            const response = await fetchPage(currentPage);
            allResults = [...allResults, ...response.results];
            totalCount = response.count;

            // Verificar si hay más páginas
            hasMore = !!response.next;
            currentPage++;
        } catch (error) {
            console.error(`Error al obtener página ${currentPage}:`, error);
            break;
        }
    }

    // Devolver un objeto con la misma estructura pero con todos los resultados
    return {
        count: totalCount,
        next: null,
        previous: null,
        results: allResults
    };
}

/**
 * Obtener un equipo por ID en el servidor
 */
export async function getServerEquipoById(id: string | number): Promise<EquipoDetalle> {
    return serverFetch<EquipoDetalle>(
        `/equipos/${id}/`,
        { revalidate: REVALIDATION.DYNAMIC }
    );
}

/**
 * Obtener equipos por categoría
 */
export async function getServerEquiposByCategoria(categoriaId: number): Promise<PaginatedEquipoList> {
    return serverFetch<PaginatedEquipoList>(
        `/equipos/por_categoria/?categoria_id=${categoriaId}`,
        { revalidate: REVALIDATION.DYNAMIC }
    );
}

/**
 * Obtener estadísticas básicas de equipos
 */
export async function getServerEquiposStats(): Promise<{
    total: number;
    activos: number;
    por_categoria: Record<string, number>;
}> {
    try {
        const response = await getServerEquipos({ all_pages: true });

        const total = response.results.length;
        const activos = response.results.filter(equipo => equipo.activo).length;

        // Agrupar por categoría
        const por_categoria = response.results.reduce((acc, equipo) => {
            const categoria = equipo.categoria_nombre || 'Sin categoría';
            acc[categoria] = (acc[categoria] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            total,
            activos,
            por_categoria
        };
    } catch (error) {
        console.error('Error al obtener estadísticas de equipos:', error);
        return {
            total: 0,
            activos: 0,
            por_categoria: {}
        };
    }
}

/* ============================================
   FUNCIONES PARA PARTIDOS
============================================ */

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
}): Promise<PaginatedPartidoList> {

    const fetchPage = async (page: number = 1): Promise<PaginatedPartidoList> => {
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
            : REVALIDATION.PARTIDOS;

        return serverFetch<PaginatedPartidoList>(
            `/partidos/?${queryParams.toString()}`,
            { revalidate }
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
    return serverFetch<PartidoDetalle>(
        `/partidos/${id}/`,
        { revalidate: REVALIDATION.PARTIDO_DETAIL }
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
}): Promise<PaginatedPartidoList> {
    const queryParams = new URLSearchParams();

    if (params?.dias) queryParams.append('dias', params.dias.toString());
    if (params?.torneo_id) queryParams.append('torneo_id', params.torneo_id.toString());
    if (params?.equipo_id) queryParams.append('equipo_id', params.equipo_id.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return serverFetch<PaginatedPartidoList>(
        `/partidos/proximos/?${queryParams.toString()}`,
        { revalidate: REVALIDATION.REALTIME }
    );
}

/**
 * Obtener partidos por equipo
 */
export async function getServerPartidosByEquipo(equipoId: number): Promise<PaginatedPartidoList> {
    return serverFetch<PaginatedPartidoList>(
        `/partidos/por_equipo/?equipo_id=${equipoId}`,
        { revalidate: REVALIDATION.PARTIDOS }
    );
}

/**
 * Obtener partidos por jornada
 */
export async function getServerPartidosByJornada(jornadaId: number): Promise<PaginatedPartidoList> {
    return serverFetch<PaginatedPartidoList>(
        `/partidos/por_jornada/?jornada_id=${jornadaId}`,
        { revalidate: REVALIDATION.PARTIDOS }
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
            getServerPartidos({ all_pages: true }),
            getServerProximosPartidos({ dias: 7 })
        ]);

        const total = allPartidos.results.length;
        const completados = allPartidos.results.filter(p => p.completado).length;
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

// Exportar todas las funciones en un objeto para facilitar el uso
export const serverApi = {
    equipos: {
        getAll: getServerEquipos,
        getById: getServerEquipoById,
        getByCategoria: getServerEquiposByCategoria,
        getStats: getServerEquiposStats
    },
    partidos: {
        getAll: getServerPartidos,
        getById: getServerPartidoById,
        getProximos: getServerProximosPartidos,
        getByEquipo: getServerPartidosByEquipo,
        getByJornada: getServerPartidosByJornada,
        getStats: getServerPartidosStats
    }
};