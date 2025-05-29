import { apiClient } from '@/lib/api/client';
import type { components } from '@/types/api';

/**
 * Servicio para manejar las operaciones relacionadas con equipos
 * Esta versión está diseñada para usarse en el navegador
 */

// Tipos utilizados en el servicio
type Equipo = components['schemas']['Equipo'];
type PaginatedEquipoList = components['schemas']['PaginatedEquipoList'];
type EquipoRequest = components['schemas']['EquipoRequest'];

/**
 * Obtener todos los equipos con opciones de paginación, ordenamiento y búsqueda
 * Versión para el cliente (navegador)
 */
export async function getEquipos(params?: { 
  page?: number; 
  ordering?: string; 
  search?: string;
  categoria?: number;
}): Promise<PaginatedEquipoList> {
  // Si estamos en el servidor, lanzar un error para evitar usarlo incorrectamente
  if (typeof window === 'undefined') {
    throw new Error('getEquipos solo debe usarse en el cliente. Para el servidor, usa getServerEquipos de @/lib/api/server');
  }

  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.ordering) queryParams.append('ordering', params.ordering);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.categoria) queryParams.append('categoria', params.categoria.toString());
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return apiClient.get<PaginatedEquipoList>(`/equipos${query}`);
}

/**
 * Obtener un equipo por su ID
 */
export async function getEquipoById(id: string): Promise<Equipo> {
  return apiClient.get<Equipo>(`/equipos/${id}`);
}

/**
 * Obtener equipos por torneo
 */
export async function getEquiposByTorneo(torneoId: string): Promise<PaginatedEquipoList> {
  return apiClient.get<PaginatedEquipoList>(`/torneos/${torneoId}/equipos`);
}

/**
 * Crear un nuevo equipo (requiere autenticación)
 */
export async function createEquipo(data: EquipoRequest): Promise<Equipo> {
  try {
    return await apiClient.post<Equipo>('/equipos/', data);
  } catch (error) {
    console.error('Error al crear equipo:', error);
    throw error;
  }
}

/**
 * Actualizar un equipo existente (requiere autenticación)
 */
export async function updateEquipo(id: string, data: EquipoRequest): Promise<Equipo> {
  try {
    return await apiClient.put<Equipo>(`/equipos/${id}/`, data);
  } catch (error) {
    console.error(`Error al actualizar equipo ${id}:`, error);
    throw error;
  }
}

/**
 * Actualizar parcialmente un equipo (requiere autenticación)
 */
export async function patchEquipo(id: string, data: Partial<EquipoRequest>): Promise<Equipo> {
  try {
    return await apiClient.request<Equipo>(`/equipos/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error(`Error al actualizar parcialmente equipo ${id}:`, error);
    throw error;
  }
}

/**
 * Eliminar un equipo (requiere autenticación)
 */
export async function deleteEquipo(id: string): Promise<void> {
  try {
    await apiClient.delete<void>(`/equipos/${id}/`);
  } catch (error) {
    console.error(`Error al eliminar equipo ${id}:`, error);
    throw error;
  }
}
