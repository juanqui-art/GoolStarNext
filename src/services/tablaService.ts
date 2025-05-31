// src/services/tablaService.ts
import { apiClient } from '@/lib/api/client';
import type { components } from '@/types/api';

/**
 * Servicio para manejar las operaciones relacionadas con tabla de posiciones
 * Esta versión está diseñada para usarse en el navegador (client components)
 */

// Tipos utilizados en el servicio
type TablaPosiciones = components['schemas']['TablaPosiciones'];
type PaginatedTorneoList = components['schemas']['PaginatedTorneoList'];
type TorneoDetalle = components['schemas']['TorneoDetalle'];

/**
 * Obtener tabla de posiciones de un torneo
 */
export async function getTablaPosiciones(
    torneoId: string,
    params?: {
        grupo?: string;
        actualizar?: boolean;
    }
): Promise<TablaPosiciones> {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') {
        throw new Error('getTablaPosiciones solo debe usarse en el cliente. Para el servidor, usa serverApi.torneos.getTablaPosiciones');
    }

    const queryParams = new URLSearchParams();

    if (params?.grupo) queryParams.append('grupo', params.grupo);
    if (params?.actualizar) queryParams.append('actualizar', 'true');

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

    return apiClient.get<TablaPosiciones>(`/torneos/${torneoId}/tabla_posiciones${query}`);
}

/**
 * Obtener torneos activos
 */
export async function getTorneosActivos(params?: {
    page?: number;
    ordering?: string;
    search?: string;
}): Promise<PaginatedTorneoList> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.search) queryParams.append('search', params.search);

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

    return apiClient.get<PaginatedTorneoList>(`/torneos/activos${query}`);
}

/**
 * Obtener un torneo por ID
 */
export async function getTorneoById(id: string): Promise<TorneoDetalle> {
    return apiClient.get<TorneoDetalle>(`/torneos/${id}`);
}

/**
 * Obtener estadísticas de un torneo
 */
export async function getTorneoEstadisticas(torneoId: string): Promise<any> {
    return apiClient.get<any>(`/torneos/${torneoId}/estadisticas/`);
}

/**
 * Obtener jugadores destacados de un torneo
 */
export async function getJugadoresDestacados(
    torneoId: string,
    params?: { limite?: number }
): Promise<any> {
    const queryParams = new URLSearchParams();

    if (params?.limite) queryParams.append('limite', params.limite.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

    return apiClient.get<any>(`/torneos/${torneoId}/jugadores_destacados${query}`);
}

/**
 * Función utilitaria para determinar la zona de clasificación
 */
export function getZonaClasificacion(posicion: number) {
    if (posicion <= 8) {
        return {
            zona: 'clasificacion',
            color: 'green',
            descripcion: 'Clasifican a octavos de final'
        };
    } else if (posicion <= 12) {
        return {
            zona: 'repechaje',
            color: 'yellow',
            descripcion: 'Zona de repechaje'
        };
    } else {
        return {
            zona: 'eliminacion',
            color: 'red',
            descripcion: 'Eliminados'
        };
    }
}

/**
 * Función utilitaria para formatear estadísticas de un equipo
 */
export function formatearEstadisticasEquipo(equipo: any) {
    const efectividad = equipo.partidos_jugados > 0
        ? ((equipo.partidos_ganados / equipo.partidos_jugados) * 100).toFixed(1)
        : '0.0';

    const promedioGoles = equipo.partidos_jugados > 0
        ? (equipo.goles_favor / equipo.partidos_jugados).toFixed(1)
        : '0.0';

    return {
        ...equipo,
        efectividad: `${efectividad}%`,
        promedio_goles: promedioGoles,
        forma: equipo.partidos_ganados >= equipo.partidos_perdidos ? 'buena' : 'mala'
    };
}