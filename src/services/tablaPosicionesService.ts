// src/services/tablaPosicionesService.ts
import { apiClient } from '@/lib/api/client';
import type { components } from '@/types/api';

/**
 * Servicio para manejar las operaciones relacionadas con tabla de posiciones
 */

// Tipos utilizados en el servicio
type TablaPosiciones = components['schemas']['TablaPosiciones'];
type EstadisticaEquipo = components['schemas']['EstadisticaEquipo'];

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
    if (typeof window === 'undefined') {
        throw new Error('getTablaPosiciones solo debe usarse en el cliente');
    }

    const queryParams = new URLSearchParams();

    if (params?.grupo) queryParams.append('grupo', params.grupo);
    if (params?.actualizar) queryParams.append('actualizar', 'true');

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get<TablaPosiciones>(`torneos/${torneoId}/tabla_posiciones${query}`);
}

/**
 * Obtener tabla de posiciones para todos los grupos
 */
export async function getTablaPorGrupos(torneoId: string): Promise<{ [grupo: string]: EstadisticaEquipo[] }> {
    const grupos = ['A', 'B', 'C', 'D'];
    const tablasPorGrupo: { [grupo: string]: EstadisticaEquipo[] } = {};

    for (const grupo of grupos) {
        try {
            const tabla = await getTablaPosiciones(torneoId, { grupo });
            if (tabla.equipos && tabla.equipos.length > 0) {
                tablasPorGrupo[grupo] = tabla.equipos;
            }
        } catch (error) {
            console.warn(`No se pudo cargar la tabla del grupo ${grupo}:`, error);
        }
    }

    return tablasPorGrupo;
}

/**
 * Obtener estadísticas generales del torneo
 */
export async function getEstadisticasTorneo(torneoId: string): Promise<any> {
    return apiClient.get<any>(`torneos/${torneoId}/estadisticas`);
}

/**
 * Utilidades para formateo y cálculos de tabla
 */
export const tablaUtils = {
    /**
     * Ordenar equipos por posición en la tabla
     */
    ordenarPorPosicion: (equipos: EstadisticaEquipo[]): EstadisticaEquipo[] => {
        return [...equipos].sort((a, b) => {
            // 1. Por puntos (descendente)
            if (a.puntos !== b.puntos) {
                return b.puntos - a.puntos;
            }

            // 2. Por diferencia de goles (descendente)
            if (a.diferencia_goles !== b.diferencia_goles) {
                return b.diferencia_goles - a.diferencia_goles;
            }

            // 3. Por goles a favor (descendente)
            if (a.goles_favor !== b.goles_favor) {
                return b.goles_favor - a.goles_favor;
            }

            // 4. Por goles en contra (ascendente)
            if (a.goles_contra !== b.goles_contra) {
                return a.goles_contra - b.goles_contra;
            }

            // 5. Por nombre (alfabético)
            return a.equipo_nombre.localeCompare(b.equipo_nombre);
        });
    },

    /**
     * Calcular porcentaje de efectividad
     */
    calcularEfectividad: (equipo: EstadisticaEquipo): number => {
        if (equipo.partidos_jugados === 0) return 0;
        return Math.round((equipo.puntos / (equipo.partidos_jugados * 3)) * 100);
    },

    /**
     * Obtener color de posición según clasificación
     */
    getColorPosicion: (posicion: number, totalEquipos: number): string => {
        if (posicion <= 2) {
            return 'text-green-600 bg-green-50 dark:bg-green-900/20'; // Clasificación directa
        }
        if (posicion <= Math.ceil(totalEquipos * 0.5)) {
            return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'; // Zona de clasificación
        }
        if (posicion > totalEquipos - 2) {
            return 'text-red-600 bg-red-50 dark:bg-red-900/20'; // Zona de descenso
        }
        return 'text-neutral-600 bg-neutral-50 dark:bg-neutral-700'; // Zona media
    },

    /**
     * Obtener descripción de zona de clasificación
     */
    getDescripcionZona: (posicion: number, totalEquipos: number): string => {
        if (posicion === 1) return 'Líder';
        if (posicion === 2) return 'Sublíder';
        if (posicion <= Math.ceil(totalEquipos * 0.5)) return 'Zona de clasificación';
        if (posicion > totalEquipos - 2) return 'Zona de eliminación';
        return 'Zona media';
    },

    /**
     * Formatear racha de resultados (últimos 5 partidos)
     */
    formatearRacha: (partidos: any[]): { resultado: 'G' | 'E' | 'P'; color: string }[] => {
        // Esta función sería más completa con datos de partidos recientes
        // Por ahora retornamos un ejemplo
        return [];
    },

    /**
     * Calcular promedio de goles por partido
     */
    promedioGolesFavor: (equipo: EstadisticaEquipo): string => {
        if (equipo.partidos_jugados === 0) return '0.0';
        return (equipo.goles_favor / equipo.partidos_jugados).toFixed(1);
    },

    /**
     * Calcular promedio de goles en contra por partido
     */
    promedioGolesContra: (equipo: EstadisticaEquipo): string => {
        if (equipo.partidos_jugados === 0) return '0.0';
        return (equipo.goles_contra / equipo.partidos_jugados).toFixed(1);
    },

    /**
     * Determinar tendencia del equipo
     */
    getTendencia: (equipo: EstadisticaEquipo): {
        tipo: 'excelente' | 'buena' | 'regular' | 'mala';
        descripcion: string;
    } => {
        const efectividad = tablaUtils.calcularEfectividad(equipo);

        if (efectividad >= 80) {
            return { tipo: 'excelente', descripcion: 'Rendimiento excelente' };
        }
        if (efectividad >= 60) {
            return { tipo: 'buena', descripcion: 'Buen rendimiento' };
        }
        if (efectividad >= 40) {
            return { tipo: 'regular', descripcion: 'Rendimiento regular' };
        }
        return { tipo: 'mala', descripcion: 'Necesita mejorar' };
    },

    /**
     * Comparar dos equipos
     */
    compararEquipos: (equipo1: EstadisticaEquipo, equipo2: EstadisticaEquipo): {
        mejor_ataque: string;
        mejor_defensa: string;
        mas_efectivo: string;
    } => {
        return {
            mejor_ataque: equipo1.goles_favor > equipo2.goles_favor ? equipo1.equipo_nombre : equipo2.equipo_nombre,
            mejor_defensa: equipo1.goles_contra < equipo2.goles_contra ? equipo1.equipo_nombre : equipo2.equipo_nombre,
            mas_efectivo: tablaUtils.calcularEfectividad(equipo1) > tablaUtils.calcularEfectividad(equipo2)
                ? equipo1.equipo_nombre : equipo2.equipo_nombre
        };
    }
};