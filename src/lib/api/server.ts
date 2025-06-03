// src/lib/api/server.ts - CÓDIGO MEJORADO CON TIPOS CORRECTOS
// import type { components } from '@/types/api';
import type {
    TorneoEstadisticas,
    // JugadorDestacado,
    JugadoresDestacados,
    EquiposQueryParams,
    PartidosQueryParams,
    TorneosQueryParams,
    TablaPosicionesParams,
    ProximosPartidosParams,
    JugadoresDestacadosParams,
    GoleadoresParams,
    GoleadoresResponse,
    EquiposStats,
    PartidosStats,
    GolesStats,
    ServerApiInterface,
    Equipo,
    EquipoDetalle,
    PaginatedEquipoList,
    TablaPosiciones,
    // EstadisticaEquipo,
    PaginatedTorneoList,
    // Torneo,
    TorneoDetalle,
    Partido,
    PartidoDetalle,
    PaginatedPartidoList, TablaPosicionesAgrupada,
    // Jugador,
    // PaginatedJugadorList,
    // Gol
} from '@/types/server-api';

// Configuración base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://goolstar-backend.fly.dev/api';

// Opciones de revalidación corregidas
const REVALIDATION = {
    NEVER: false as const,
    STATIC: 3600 as const,      // 1 hora para datos estáticos
    DYNAMIC: 300 as const,      // 5 minutos para datos dinámicos
    REALTIME: 60 as const,      // 1 minuto para datos en tiempo real
    PARTIDOS: 60 as const,      // 1 minuto para partidos
    PARTIDO_DETAIL: 30 as const // 30 segundos para detalles de partido
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

    console.log('🌐 Haciendo petición a:', url);
    console.log('⚙️ Opciones:', { revalidate, ...fetchOptions });

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...fetchOptions.headers,
            },
            next: { revalidate },
            ...fetchOptions,
        });

        console.log('📡 Respuesta recibida:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            url: response.url
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error en respuesta:', errorText);

            let errorMessage = `Error ${response.status}: ${response.statusText}`;

            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.detail || errorData.message || errorMessage;
                console.error('📋 Datos de error parseados:', errorData);
            } catch {
                if (errorText && errorText.length < 200) {
                    errorMessage = errorText;
                }
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('✅ Datos recibidos exitosamente, tipo:', typeof data, 'keys:', Object.keys(data || {}));
        return data;
    } catch (error) {
        console.error('💥 Error en serverFetch:', error);
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            throw error;
        }
        throw new Error('Error de conexión con el servidor');
    }
}

/* ============================================
   FUNCIONES PARA EQUIPOS
============================================ */

/**
 * Obtener equipos con soporte para paginación y filtros
 */
export async function getServerEquipos(params?: EquiposQueryParams): Promise<PaginatedEquipoList> {

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

    if (!params?.all_pages) {
        return fetchPage(params?.page || 1);
    }

    // Obtener todas las páginas con límite de seguridad
    let currentPage = 1;
    let allResults: Equipo[] = [];
    let hasMore = true;
    let totalCount = 0;

    while (hasMore && currentPage <= 10) {
        try {
            const response = await fetchPage(currentPage);
            allResults = [...allResults, ...response.results];
            totalCount = response.count;

            hasMore = !!response.next;
            currentPage++;
        } catch (error) {
            console.error(`Error al obtener página ${currentPage}:`, error);
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
 * Obtener un equipo por ID
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
 * Obtener equipos por torneo
 */
export async function getServerEquiposByTorneo(torneoId: number): Promise<PaginatedEquipoList> {
    return serverFetch<PaginatedEquipoList>(
        `/equipos/?torneo=${torneoId}`,
        { revalidate: REVALIDATION.DYNAMIC }
    );
}

/**
 * Obtener estadísticas básicas de equipos
 */
export async function getServerEquiposStats(): Promise<EquiposStats> {
    try {
        const response = await getServerEquipos({ all_pages: true });

        const total = response.results.length;
        const activos = response.results.filter(equipo => equipo.activo).length;

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
 * Obtener todos los partidos con filtros
 */
export async function getServerPartidos(params?: PartidosQueryParams): Promise<PaginatedPartidoList> {

    const fetchPage = async (page: number = 1): Promise<PaginatedPartidoList> => {
        const queryParams = new URLSearchParams();

        queryParams.append('page', page.toString());
        if (params?.ordering) queryParams.append('ordering', params.ordering);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.equipo_id) queryParams.append('equipo_id', params.equipo_id.toString());
        if (params?.jornada_id) queryParams.append('jornada_id', params.jornada_id.toString());
        if (params?.completado !== undefined) queryParams.append('completado', params.completado.toString());
        if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

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

    let currentPage = 1;
    let allResults: Partido[] = [];
    let hasMore = true;
    let totalCount = 0;

    while (hasMore && currentPage <= 15) {
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
export async function getServerProximosPartidos(params?: ProximosPartidosParams): Promise<PaginatedPartidoList> {
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
export async function getServerPartidosStats(): Promise<PartidosStats> {
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

/* ============================================
   FUNCIONES PARA TORNEOS
============================================ */

/**
 * Obtener todos los torneos
 */
export async function getServerTorneos(params?: TorneosQueryParams): Promise<PaginatedTorneoList> {
    console.log('🏆 Obteniendo lista de torneos');

    try {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.ordering) queryParams.append('ordering', params.ordering);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

        const endpoint = `/torneos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        console.log(`🔍 Consultando endpoint: ${endpoint}`);

        const torneos = await serverFetch<PaginatedTorneoList>(
            endpoint,
            { revalidate: REVALIDATION.STATIC }
        );

        console.log(`✅ ${torneos.results.length} torneos obtenidos`);
        return torneos;
    } catch (error) {
        console.error('❌ Error al obtener torneos:', error);

        return {
            count: 0,
            next: null,
            previous: null,
            results: []
        };
    }
}

/**
 * Obtener torneos activos
 */
export async function getServerTorneosActivos(params?: TorneosQueryParams): Promise<PaginatedTorneoList> {
    console.log('🏆 Obteniendo torneos activos con params:', params);

    const queryParams = new URLSearchParams();

    // ✅ AGREGAR: Filtro para solo torneos activos
    queryParams.append('activo', 'true');

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

    // ✅ CAMBIAR: De /torneos/activos/ a /torneos
    return serverFetch<PaginatedTorneoList>(
        `/torneos${query}`,  // ← Solo cambiar esta línea
        { revalidate: REVALIDATION.REALTIME }
    );
}


/**
 * Obtener un torneo por ID
 */
export async function getServerTorneoById(id: string | number): Promise<TorneoDetalle> {
    console.log('🏆 Obteniendo torneo por ID:', id);

    try {
        const torneo = await serverFetch<TorneoDetalle>(
            `/torneos/${id}/`,
            { revalidate: REVALIDATION.DYNAMIC }
        );

        if (!torneo) {
            console.error(`❌ Torneo con ID ${id} no encontrado`);
            throw new Error(`Torneo con ID ${id} no encontrado`);
        }

        console.log(`✅ Torneo encontrado:`, { id: torneo.id, nombre: torneo.nombre });
        return torneo;
    } catch (error) {
        console.error(`❌ Error al obtener torneo con ID ${id}:`, error);
        throw error;
    }
}

/**
 * Obtener tabla de posiciones - Maneja tanto formato simple como agrupado
 */
export async function getServerTablaPosiciones(
    torneoId: string | number,
    params?: TablaPosicionesParams
): Promise<TablaPosiciones | TablaPosicionesAgrupada> {
    console.log('🏆 Obteniendo tabla de posiciones para torneo:', torneoId, 'con params:', params);

    const queryParams = new URLSearchParams();

    if (params?.grupo) queryParams.append('grupo', params.grupo);
    if (params?.actualizar) queryParams.append('actualizar', 'true');

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

    try {
        // La respuesta puede ser TablaPosiciones o TablaPosicionesAgrupada
        const response = await serverFetch<TablaPosiciones | TablaPosicionesAgrupada>(
            `/torneos/${torneoId}/tabla_posiciones${query}`,
            { revalidate: params?.actualizar ? 1 : REVALIDATION.DYNAMIC }
        );

        // Verificar el tipo de respuesta
        if ('grupos' in response && response.grupos !== undefined) {
            // Es una TablaPosicionesAgrupada
            console.log('✅ Tabla de posiciones agrupada recibida', {
                grupos: Object.keys(response.grupos).length,
                total_equipos: 'total_equipos' in response ? response.total_equipos : 'desconocido',
                torneo_id: 'torneo_id' in response ? response.torneo_id : 'desconocido'
            });
            
            // Asegurarse de que el tipo sea correcto para TypeScript
            return response as TablaPosicionesAgrupada;
        } else if ('equipos' in response) {
            // Es una TablaPosiciones simple
            console.log('✅ Tabla de posiciones simple recibida', {
                equipos: response.equipos.length,
                grupo: response.grupo || 'sin grupo'
            });
            
            // Asegurarse de que el tipo sea correcto para TypeScript
            return response as TablaPosiciones;
        }

        // Si llegamos aquí, la respuesta no coincide con ningún tipo esperado
        console.warn('⚠️ Formato de respuesta inesperado, devolviendo estructura vacía');
        return {
            equipos: [],
            grupo: params?.grupo
        };
    } catch (error) {
        console.error('❌ Error obteniendo tabla de posiciones:', error);
        throw error;
    }
}

/**
 * Obtener estadísticas generales de un torneo
 */
export async function getServerTorneoEstadisticas(torneoId: string | number): Promise<TorneoEstadisticas> {
    console.log('📈 Obteniendo estadísticas del torneo:', torneoId);
    return serverFetch<TorneoEstadisticas>(
        `/torneos/${torneoId}/estadisticas/`,
        { revalidate: REVALIDATION.DYNAMIC }
    );
}

/**
 * Obtener jugadores destacados de un torneo
 */
export async function getServerJugadoresDestacados(
    torneoId: string | number,
    params?: JugadoresDestacadosParams
): Promise<JugadoresDestacados> {
    console.log('⭐ Obteniendo jugadores destacados del torneo:', torneoId);

    const queryParams = new URLSearchParams();

    if (params?.limite) queryParams.append('limite', params.limite.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

    return serverFetch<JugadoresDestacados>(
        `/torneos/${torneoId}/jugadores_destacados/${query}`,
        { revalidate: REVALIDATION.DYNAMIC }
    );
}

/* ============================================
   FUNCIONES PARA GOLEADORES/JUGADORES
============================================ */

/**
 * Obtener goleadores del torneo usando el endpoint correcto
 */
export async function getServerGoleadores(
    torneoId?: string | number,
    params?: GoleadoresParams
): Promise<GoleadoresResponse> {
    console.log('⚽ Obteniendo goleadores del torneo:', torneoId);

    // Si no hay torneo especificado, intentar obtener uno disponible
    if (!torneoId) {
        try {
            console.log('🔍 Buscando torneo disponible para goleadores...');

            const torneosResponse = await getServerTorneos({ page_size: 1 });

            if (torneosResponse.results.length > 0) {
                torneoId = torneosResponse.results[0].id;
                console.log(`✅ Torneo encontrado para goleadores: "${torneosResponse.results[0].nombre}" con ID: ${torneoId}`);
            } else {
                console.warn('⚠️ No se encontraron torneos disponibles');
                throw new Error('No hay torneos disponibles');
            }
        } catch (error) {
            console.error('❌ Error al obtener torneos para goleadores:', error);
            torneoId = 1; // Fallback
            console.log('⚠️ Usando ID de torneo por defecto (1) para goleadores');
        }
    }

    if (!torneoId) {
        torneoId = 1;
        console.log('⚠️ No se pudo determinar un ID de torneo, usando ID por defecto (1)');
    }

    console.log(`🏆 Consultando goleadores para torneoId: ${torneoId}`);

    const queryParams = new URLSearchParams();

    if (params?.limite) queryParams.append('limite', params.limite.toString());
    if (params?.equipo_id) queryParams.append('equipo_id', params.equipo_id.toString());
    if (params?.search) queryParams.append('search', params.search);

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

    try {
        const result = await serverFetch<JugadoresDestacados>(
            `/torneos/${torneoId}/jugadores_destacados${query}`,
            { revalidate: REVALIDATION.DYNAMIC }
        );

        console.log(`✅ Datos de goleadores recibidos correctamente para torneo ${torneoId}`);

        // Transformar los datos para que coincidan con el formato esperado
        const goleadores = result.goleadores || [];

        return {
            goleadores: goleadores.map((goleador, index) => ({
                id: goleador.id || index + 1,
                jugador_nombre: goleador.jugador_nombre || 'Jugador',
                equipo_nombre: goleador.equipo_nombre || 'Equipo',
                total_goles: goleador.total_goles || goleador.goles || 0,
                partidos_jugados: goleador.partidos_jugados || 1,
                promedio_goles: goleador.promedio_goles ||
                    ((goleador.total_goles || goleador.goles || 0) / (goleador.partidos_jugados || 1)),
                foto: goleador.foto || null
            }))
        };
    } catch (error) {
        console.error(`❌ Error obteniendo goleadores para torneo ${torneoId}:`, error);
        throw error;
    }
}

/**
 * Obtener estadísticas de goles por equipo
 */
export async function getServerGolesStats(torneoId?: string | number): Promise<GolesStats> {
    try {
        const goleadoresData = await getServerGoleadores(torneoId, { limite: 100 });

        if (goleadoresData.goleadores && Array.isArray(goleadoresData.goleadores)) {
            const totalGoles = goleadoresData.goleadores.reduce((sum, g) => sum + g.total_goles, 0);

            const equiposGoles: { [key: string]: number } = {};
            let maxGoleadorNombre = '';
            let maxGoles = 0;

            goleadoresData.goleadores.forEach((goleador) => {
                const equipo = goleador.equipo_nombre;
                const goles = goleador.total_goles;

                equiposGoles[equipo] = (equiposGoles[equipo] || 0) + goles;

                if (goles > maxGoles) {
                    maxGoles = goles;
                    maxGoleadorNombre = goleador.jugador_nombre;
                }
            });

            const equipoMasGoleador = Object.entries(equiposGoles)
                .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Desconocido';

            return {
                total_goles: totalGoles,
                promedio_por_partido: totalGoles / Math.max(goleadoresData.goleadores.length, 1),
                equipo_mas_goleador: equipoMasGoleador,
                jugador_max_goleador: maxGoleadorNombre
            };
        }

        return {
            total_goles: 0,
            promedio_por_partido: 0,
            equipo_mas_goleador: 'Sin datos',
            jugador_max_goleador: 'Sin datos'
        };
    } catch (error) {
        console.error('Error al obtener estadísticas de goles:', error);
        return {
            total_goles: 0,
            promedio_por_partido: 0,
            equipo_mas_goleador: 'Error',
            jugador_max_goleador: 'Error'
        };
    }
}



// Exportar todas las funciones organizadas
export const serverApi: ServerApiInterface = {
    equipos: {
        getAll: getServerEquipos,
        getById: getServerEquipoById,
        getByCategoria: getServerEquiposByCategoria,
        getByTorneo: getServerEquiposByTorneo,
        getStats: getServerEquiposStats
    },
    partidos: {
        getAll: getServerPartidos,
        getById: getServerPartidoById,
        getProximos: getServerProximosPartidos,
        getByEquipo: getServerPartidosByEquipo,
        getByJornada: getServerPartidosByJornada,
        getStats: getServerPartidosStats
    },
    torneos: {
        getAll: getServerTorneos,
        getActivos: getServerTorneosActivos,
        getById: getServerTorneoById,
        getTablaPosiciones: getServerTablaPosiciones,
        getEstadisticas: getServerTorneoEstadisticas,
        getJugadoresDestacados: getServerJugadoresDestacados
    },
    goleadores: {
        getAll: getServerGoleadores,
        getStats: getServerGolesStats
    }
};
