import { apiClient } from '@/lib/api/client';
import type { components } from '@/types/api';

/**
 * Servicio para manejar las operaciones relacionadas con torneos
 */

// Obtener todos los torneos
export async function getTorneos(params?: { page?: number; ordering?: string; search?: string }): Promise<components['schemas']['PaginatedTorneoList']> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  
  if (params?.ordering) {
    queryParams.append('ordering', params.ordering);
  }
  
  if (params?.search) {
    queryParams.append('search', params.search);
  }
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return apiClient.get<components['schemas']['PaginatedTorneoList']>(`/torneos${query}`);
}

// Obtener torneos activos
export async function getTorneosActivos(params?: { page?: number; page_size?: number; ordering?: string; search?: string }): Promise<components['schemas']['PaginatedTorneoList']> {
  const queryParams = new URLSearchParams();
  console.log('queryParams', queryParams);
  
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  
  if (params?.page_size) {
    queryParams.append('page_size', params.page_size.toString());
  }
  
  if (params?.ordering) {
    queryParams.append('ordering', params.ordering);
  }
  
  if (params?.search) {
    queryParams.append('search', params.search);
  }
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return apiClient.get<components['schemas']['PaginatedTorneoList']>(`torneos/activos${query}`);
}

// Obtener un torneo por ID
export async function getTorneoById(id: string): Promise<components['schemas']['TorneoDetalle']> {
  return apiClient.get<components['schemas']['TorneoDetalle']>(`torneos/${id}`);
}

// Interfaz para las estadísticas del torneo
export interface TorneoEstadisticas {
  equipos: components['schemas']['EstadisticaEquipo'][];
  // Otros campos que pueda tener la respuesta
}

// Obtener estadísticas de un torneo
export async function getTorneoEstadisticas(id: string): Promise<TorneoEstadisticas> {
  return apiClient.get<TorneoEstadisticas>(`torneos/${id}/estadisticas`);
}

// Interfaz para jugadores destacados
export interface JugadorDestacado {
  id: number;
  nombre: string;
  apellido: string;
  numero: number;
  equipo_nombre: string;
  foto?: string;
  goles?: number;
  asistencias?: number;
  tarjetas_amarillas?: number;
  tarjetas_rojas?: number;
}

// Obtener jugadores destacados de un torneo
export async function getTorneoJugadoresDestacados(id: string): Promise<JugadorDestacado[]> {
  return apiClient.get<JugadorDestacado[]>(`torneos/${id}/jugadores_destacados`);
}

// Interfaz para tabla de posiciones
export interface TablaPosicion {
  equipos: components['schemas']['EstadisticaEquipo'][];
  categoria?: {
    id: number;
    nombre: string;
  };
}

// Obtener tabla de posiciones de un torneo
export async function getTorneoTablaPosiciones(id: string, params?: { grupo?: string; actualizar?: boolean }): Promise<TablaPosicion> {
  const queryParams = new URLSearchParams();
  
  if (params?.grupo) {
    queryParams.append('grupo', params.grupo);
  }
  
  if (params?.actualizar) {
    queryParams.append('actualizar', 'true');
  }
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return apiClient.get<TablaPosicion>(`torneos/${id}/tabla_posiciones${query}`);
}

/**
 * Prepara los datos del torneo para enviar al API
 * Asegura que las fechas estén en el formato correcto (YYYY-MM-DD)
 */
function formatTorneoData(data: Partial<components['schemas']['TorneoRequest']>): components['schemas']['TorneoRequest'] {
  const formattedData = { ...data } as components['schemas']['TorneoRequest'];
  
  // Asegurarse de que las fechas estén en formato YYYY-MM-DD
  const isDateObject = (value: any): value is Date => {
    return value && typeof value === 'object' && 'toISOString' in value;
  };
  
  if (formattedData.fecha_inicio && isDateObject(formattedData.fecha_inicio)) {
    formattedData.fecha_inicio = formattedData.fecha_inicio.toISOString().split('T')[0];
  }
  
  if (formattedData.fecha_fin && isDateObject(formattedData.fecha_fin)) {
    formattedData.fecha_fin = formattedData.fecha_fin.toISOString().split('T')[0];
  }
  
  return formattedData;
}

/**
 * Crear un nuevo torneo (requiere autenticación)
 * @param data Datos del torneo a crear
 * @returns El torneo creado
 */
export async function createTorneo(data: components['schemas']['TorneoRequest']): Promise<components['schemas']['Torneo']> {
  try {
    // Formatear datos antes de enviar
    const formattedData = formatTorneoData(data);
    
    return await apiClient.post<components['schemas']['Torneo']>('torneos/', formattedData);
  } catch (error) {
    console.error('Error al crear torneo:', error);
    throw error;
  }
}

/**
 * Actualizar un torneo existente (requiere autenticación)
 * @param id ID del torneo a actualizar
 * @param data Datos actualizados del torneo
 * @returns El torneo actualizado
 */
export async function updateTorneo(id: string, data: components['schemas']['TorneoRequest']): Promise<components['schemas']['Torneo']> {
  try {
    // Formatear datos antes de enviar
    const formattedData = formatTorneoData(data);
    
    return await apiClient.put<components['schemas']['Torneo']>(`torneos/${id}/`, formattedData);
  } catch (error) {
    console.error(`Error al actualizar torneo ${id}:`, error);
    throw error;
  }
}

/**
 * Actualizar parcialmente un torneo (requiere autenticación)
 * @param id ID del torneo a actualizar parcialmente
 * @param data Campos a actualizar del torneo
 * @returns El torneo actualizado
 */
export async function patchTorneo(id: string, data: Partial<components['schemas']['TorneoRequest']>): Promise<components['schemas']['Torneo']> {
  try {
    // Formatear datos antes de enviar
    const formattedData = formatTorneoData(data);
    
    // Necesitamos agregar un método patch al cliente API
    return await apiClient.request<components['schemas']['Torneo']>(`torneos/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(formattedData),
    });
  } catch (error) {
    console.error(`Error al actualizar parcialmente torneo ${id}:`, error);
    throw error;
  }
}

/**
 * Eliminar un torneo (requiere autenticación)
 * @param id ID del torneo a eliminar
 */
export async function deleteTorneo(id: string): Promise<void> {
  try {
    await apiClient.delete<void>(`torneos/${id}/`);
  } catch (error) {
    console.error(`Error al eliminar torneo ${id}:`, error);
    throw error;
  }
}
