// src/services/partidoService.ts (Cliente - para componentes interactivos)
import { apiClient } from '@/lib/api/client';
import type { components } from '@/types/api';

/**
 * Servicio para manejar las operaciones relacionadas con partidos
 * Esta versión está diseñada para usarse en el navegador (client components)
 */

// Tipos utilizados en el servicio
type Partido = components['schemas']['Partido'];
type PartidoDetalle = components['schemas']['PartidoDetalle'];
type PaginatedPartidoList = components['schemas']['PaginatedPartidoList'];
type PartidoRequest = components['schemas']['PartidoRequest'];

/**
 * Obtener todos los partidos con opciones de filtros
 */
export async function getPartidos(params?: {
    page?: number;
    page_size?: number;
    ordering?: string;
    search?: string;
    equipo_id?: number;
    jornada_id?: number;
    completado?: boolean;
}): Promise<PaginatedPartidoList> {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') {
        throw new Error('getPartidos solo debe usarse en el cliente. Para el servidor, usa partidosServerApi');
    }

    try {
        // Construir los parámetros de consulta
        const queryParams = new URLSearchParams();
        
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
        if (params?.ordering) queryParams.append('ordering', params.ordering);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.equipo_id) queryParams.append('equipo', params.equipo_id.toString());
        if (params?.jornada_id) queryParams.append('jornada', params.jornada_id.toString());
        if (params?.completado !== undefined) queryParams.append('completado', params.completado.toString());

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return await apiClient.get<PaginatedPartidoList>(`/partidos/${queryString}`);
    } catch (error) {
        console.error('[getPartidos] Error al obtener partidos:', error);
        throw error;
    }
}

/**
 * Obtener un partido por su ID
 */
export async function getPartidoById(id: string): Promise<PartidoDetalle> {
    return apiClient.get<PartidoDetalle>(`/partidos/${id}`);
}

/**
 * Obtener próximos partidos
 */
export async function getProximosPartidos(params?: {
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

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get<PaginatedPartidoList>(`/partidos/proximos${query}`);
}

/**
 * Obtener partidos por equipo
 */
export async function getPartidosByEquipo(equipoId: string): Promise<PaginatedPartidoList> {
    return apiClient.get<PaginatedPartidoList>(`/partidos/por_equipo/?equipo_id=${equipoId}`);
}

/**
 * Obtener partidos por jornada
 */
export async function getPartidosByJornada(jornadaId: string): Promise<PaginatedPartidoList> {
    return apiClient.get<PaginatedPartidoList>(`/partidos/por_jornada/?jornada_id=${jornadaId}`);
}

/**
 * Crear un nuevo partido (requiere autenticación)
 */
export async function createPartido(data: PartidoRequest): Promise<Partido> {
    try {
        return await apiClient.post<Partido>('/partidos/', data);
    } catch (error) {
        console.error('Error al crear partido:', error);
        throw error;
    }
}

/**
 * Actualizar un partido existente (requiere autenticación)
 */
export async function updatePartido(id: string, data: PartidoRequest): Promise<Partido> {
    try {
        return await apiClient.put<Partido>(`/partidos/${id}/`, data);
    } catch (error) {
        console.error(`Error al actualizar partido ${id}:`, error);
        throw error;
    }
}

/**
 * Actualizar parcialmente un partido (requiere autenticación)
 */
export async function patchPartido(id: string, data: Partial<PartidoRequest>): Promise<Partido> {
    try {
        return await apiClient.request<Partido>(`/partidos/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error(`Error al actualizar parcialmente partido ${id}:`, error);
        throw error;
    }
}

/**
 * Eliminar un partido (requiere autenticación)
 */
export async function deletePartido(id: string): Promise<void> {
    try {
        await apiClient.delete<void>(`/partidos/${id}/`);
    } catch (error) {
        console.error(`Error al eliminar partido ${id}:`, error);
        throw error;
    }
}

/**
 * Función utilitaria para determinar el estado de un partido
 */
export function getPartidoStatus(partido: Partido) {
    const fechaPartido = new Date(partido.fecha);
    const ahora = new Date();
    const esHoy = fechaPartido.toDateString() === ahora.toDateString();
    const esPasado = fechaPartido < ahora;

    if (partido.completado) {
        return {
            label: 'Finalizado',
            color: 'green',
            icon: '✓'
        };
    }

    if (esHoy) {
        return {
            label: 'HOY',
            color: 'orange',
            icon: '🔴'
        };
    }

    if (esPasado) {
        return {
            label: 'Pendiente',
            color: 'red',
            icon: '⏰'
        };
    }

    return {
        label: 'Programado',
        color: 'blue',
        icon: '📅'
    };
}

/**
 * Función utilitaria para formatear el resultado de un partido
 */
export function formatPartidoResult(partido: Partido) {
    if (!partido.completado) {
        return {
            display: 'vs',
            goles1: '-',
            goles2: '-'
        };
    }

    const penales = partido.penales_equipo_1 !== null || partido.penales_equipo_2 !== null
        ? ` (${partido.penales_equipo_1}-${partido.penales_equipo_2} pen.)`
        : '';

    return {
        display: `${partido.goles_equipo_1} - ${partido.goles_equipo_2}${penales}`,
        goles1: partido.goles_equipo_1?.toString() || '0',
        goles2: partido.goles_equipo_2?.toString() || '0',
        penales: penales
    };
}

/**
 * Función para agrupar partidos por fecha
 */
export function groupPartidosByDate(partidos: Partido[]) {
    return partidos.reduce((groups, partido) => {
        const fecha = new Date(partido.fecha).toDateString();
        if (!groups[fecha]) {
            groups[fecha] = [];
        }
        groups[fecha].push(partido);
        return groups;
    }, {} as Record<string, Partido[]>);
}

/**
 * Función para filtrar partidos en vivo o próximos
 */
export function getPartidosEnVivo(partidos: Partido[]) {
    const ahora = new Date();
    const enDosHoras = new Date(ahora.getTime() + 2 * 60 * 60 * 1000);

    return partidos.filter(partido => {
        const fechaPartido = new Date(partido.fecha);
        return !partido.completado && fechaPartido >= ahora && fechaPartido <= enDosHoras;
    });
}

// Crear un objeto de utilidades para ser importado en los componentes
export const partidoUtils = {
    getResultado: (partido: Partido) => {
        if (!partido.completado) return 'Pendiente';
        
        if (partido.victoria_por_default) {
            return 'Victoria por default';
        }
        
        return `${partido.goles_equipo_1 ?? 0} - ${partido.goles_equipo_2 ?? 0}`;
    },
    
    getEstado: (partido: Partido) => {
        if (partido.completado) return { texto: 'Finalizado', color: 'gray' };
        
        // Verificar si el partido es hoy
        const fechaPartido = new Date(partido.fecha);
        const hoy = new Date();
        
        if (fechaPartido.toDateString() === hoy.toDateString()) {
            // Verificar si está en curso (hora actual está dentro del rango del partido)
            const horaPartido = fechaPartido.getHours();
            const horaActual = hoy.getHours();
            
            // Asumiendo que un partido dura ~2 horas
            if (horaActual >= horaPartido && horaActual < horaPartido + 2) {
                return { texto: 'En curso', color: 'green' };
            }
            
            if (horaActual < horaPartido) {
                return { texto: 'Hoy', color: 'blue' };
            }
        }
        
        return fechaPartido > hoy 
            ? { texto: 'Próximo', color: 'blue' } 
            : { texto: 'Pendiente', color: 'yellow' };
    },
    
    tieneVictoriaPorDefault: (partido: Partido) => {
        return !!partido.victoria_por_default;
    },
    
    formatearFechaCorta: (fechaStr: string) => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};

// Crear un objeto para exportar como default
const partidoService = {
    getPartidos,
    getPartidoById,
    getProximosPartidos,
    getPartidosByEquipo,
    getPartidosByJornada,
    createPartido,
    updatePartido,
    patchPartido,
    deletePartido,
    getPartidoStatus,
    formatPartidoResult,
    groupPartidosByDate,
    getPartidosEnVivo,
    partidoUtils
};

// Exportar como default
export default partidoService;