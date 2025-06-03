// src/types/server-api.ts
// Tipos adicionales para el server API que complementan los tipos de la API

import type { components } from './api';

// Re-exportar tipos principales de la API
export type Equipo = components['schemas']['Equipo'];
export type EquipoDetalle = components['schemas']['EquipoDetalle'];
export type PaginatedEquipoList = components['schemas']['PaginatedEquipoList'];
export type TablaPosiciones = components['schemas']['TablaPosiciones'];
export type EstadisticaEquipo = components['schemas']['EstadisticaEquipo'];
export type PaginatedTorneoList = components['schemas']['PaginatedTorneoList'];
export type Torneo = components['schemas']['Torneo'];
export type TorneoDetalle = components['schemas']['TorneoDetalle'];
export type Partido = components['schemas']['Partido'];
export type PartidoDetalle = components['schemas']['PartidoDetalle'];
export type PaginatedPartidoList = components['schemas']['PaginatedPartidoList'];
export type Jugador = components['schemas']['Jugador'];
export type PaginatedJugadorList = components['schemas']['PaginatedJugadorList'];
export type Gol = components['schemas']['Gol'];

// Tipos específicos para estadísticas de torneo
export interface TorneoEstadisticas {
    total_equipos: number;
    total_partidos: number;
    partidos_jugados: number;
    partidos_pendientes: number;
    total_goles: number;
    promedio_goles_por_partido: number;
    total_tarjetas_amarillas: number;
    total_tarjetas_rojas: number;
    equipo_mas_goleador?: string;
    jugador_mas_goleador?: string;
}

// Tipos específicos para jugadores destacados
export interface JugadorDestacado {
    id: number;
    jugador_nombre: string;
    equipo_nombre: string;
    total_goles?: number;
    goles?: number;
    partidos_jugados?: number;
    promedio_goles?: number;
    foto?: string | null;
    tarjetas_amarillas?: number;
    tarjetas_rojas?: number;
}

export interface JugadoresDestacados {
    goleadores: JugadorDestacado[];
    tarjetas_amarillas: JugadorDestacado[];
    tarjetas_rojas: JugadorDestacado[];
}

// Tipos para estadísticas específicas
export interface EquiposStats {
    total: number;
    activos: number;
    por_categoria: Record<string, number>;
}

export interface PartidosStats {
    total: number;
    completados: number;
    pendientes: number;
    proximos_7_dias: number;
}

export interface GolesStats {
    total_goles: number;
    promedio_por_partido: number;
    equipo_mas_goleador: string;
    jugador_max_goleador: string;
}

// Tipos para parámetros de consulta comunes
export interface PaginationParams {
    page?: number;
    page_size?: number;
}

export interface SearchParams {
    search?: string;
    ordering?: string;
}

export interface EquiposQueryParams extends PaginationParams, SearchParams {
    categoria?: number;
    all_pages?: boolean;
}

export interface PartidosQueryParams extends PaginationParams, SearchParams {
    equipo_id?: number;
    jornada_id?: number;
    completado?: boolean;
    all_pages?: boolean;
}

export interface TorneosQueryParams extends PaginationParams, SearchParams {
    all_pages?: boolean;
}

export interface TablaPosicionesParams {
    grupo?: string;
    actualizar?: boolean;
}

export interface ProximosPartidosParams {
    dias?: number;
    torneo_id?: number;
    equipo_id?: number;
    limit?: number;
}

export interface JugadoresDestacadosParams {
    limite?: number;
}

export interface GoleadoresParams {
    limite?: number;
    equipo_id?: number;
    search?: string;
}

// Tipos de respuesta para endpoints específicos
export interface GoleadoresResponse {
    goleadores: Array<{
        id: number;
        jugador_nombre: string;
        equipo_nombre: string;
        total_goles: number;
        partidos_jugados: number;
        promedio_goles: number;
        foto?: string | null;
    }>;
}

// Tipos para configuración de la API
export interface ServerApiOptions {
    revalidate?: number;
}

export interface FetchOptions extends RequestInit {
    revalidate?: number;
}

// Constantes de revalidación con tipos
export const REVALIDATION_TIMES = {
    NEVER: false,
    STATIC: 3600,      // 1 hora
    DYNAMIC: 300,      // 5 minutos
    REALTIME: 60,      // 1 minuto
    PARTIDOS: 60,      // 1 minuto
    PARTIDO_DETAIL: 30 // 30 segundos
} as const;

export type RevalidationType = typeof REVALIDATION_TIMES[keyof typeof REVALIDATION_TIMES];

// Tipos para errores de la API
export interface ApiError {
    message: string;
    status: number;
    detail?: string;
}

// Tipos para respuestas de endpoints especializados
export interface TablaPosicionesAgrupada {
    grupos: Record<string, EstadisticaEquipo[]>;
    torneo_id: number;
    tiene_fase_grupos: boolean;
    total_equipos: number;
    equipos_clasifican_por_grupo?: number;
}

// Tipo para el objeto completo del server API
export interface ServerApiInterface {
    equipos: {
        getAll: (params?: EquiposQueryParams) => Promise<PaginatedEquipoList>;
        getById: (id: string | number) => Promise<EquipoDetalle>;
        getByCategoria: (categoriaId: number) => Promise<PaginatedEquipoList>;
        getByTorneo: (torneoId: number) => Promise<PaginatedEquipoList>;
        getStats: () => Promise<EquiposStats>;
    };
    partidos: {
        getAll: (params?: PartidosQueryParams) => Promise<PaginatedPartidoList>;
        getById: (id: string | number) => Promise<PartidoDetalle>;
        getProximos: (params?: ProximosPartidosParams) => Promise<PaginatedPartidoList>;
        getByEquipo: (equipoId: number) => Promise<PaginatedPartidoList>;
        getByJornada: (jornadaId: number) => Promise<PaginatedPartidoList>;
        getStats: () => Promise<PartidosStats>;
    };
    torneos: {
        getAll: (params?: TorneosQueryParams) => Promise<PaginatedTorneoList>;
        getActivos: (params?: TorneosQueryParams) => Promise<PaginatedTorneoList>;
        getById: (id: string | number) => Promise<TorneoDetalle>;
        getTablaPosiciones: (torneoId: string | number, params?: TablaPosicionesParams) => Promise<TablaPosiciones>;
        getEstadisticas: (torneoId: string | number) => Promise<TorneoEstadisticas>;
        getJugadoresDestacados: (torneoId: string | number, params?: JugadoresDestacadosParams) => Promise<JugadoresDestacados>;
    };
    goleadores: {
        getAll: (torneoId?: string | number, params?: GoleadoresParams) => Promise<GoleadoresResponse>;
        getStats: (torneoId?: string | number) => Promise<GolesStats>;
    };
}