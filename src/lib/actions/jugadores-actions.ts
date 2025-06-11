// src/lib/actions/jugadores-actions.ts - SERVER ACTIONS PARA GESTIÓN DE JUGADORES
'use server';

import { dashboardApi } from '@/lib/api/dashboard-client';
import { revalidatePath } from 'next/cache';
import type { components } from '@/types/api';

// Tipos de la API
type Jugador = components['schemas']['Jugador'];
type Equipo = components['schemas']['Equipo'];

export interface JugadoresStats {
  total: number;
  activos: number;
  suspendidos: number;
  sinEquipo: number;
}

export interface JugadoresData {
  jugadores: Jugador[];
  equipos: Equipo[];
  stats: JugadoresStats;
}

/**
 * 🔒 CARGAR TODOS LOS JUGADORES Y EQUIPOS
 * 
 * Server Action que obtiene todos los datos necesarios para el manager
 */
export async function cargarJugadoresYEquipos(): Promise<JugadoresData> {
  console.log('🔒 Server Action: Cargando jugadores y equipos...');

  try {
    // Cargar datos en paralelo usando el cliente seguro del dashboard
    const [jugadoresData, equiposData] = await Promise.all([
      dashboardApi.jugadores.getAll(),
      dashboardApi.equipos.getAll(),
    ]);

    // Convertir a tipos específicos
    const jugadores = jugadoresData as Jugador[];
    const equipos = equiposData as Equipo[];

    console.log(`✅ Cargados ${jugadores.length} jugadores y ${equipos.length} equipos`);

    // Calcular estadísticas
    const stats: JugadoresStats = {
      total: jugadores.length,
      activos: jugadores.filter((j) => j.activo_segunda_fase !== false).length,
      suspendidos: jugadores.filter((j) => j.suspendido === true).length,
      sinEquipo: jugadores.filter((j) => !j.equipo).length,
    };

    return {
      jugadores,
      equipos,
      stats,
    };

  } catch (error) {
    console.error('❌ Error cargando datos de jugadores:', error);
    throw new Error('Error al cargar jugadores y equipos');
  }
}

/**
 * 🔒 CREAR JUGADOR
 */
export async function crearJugador(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  console.log('🔒 Server Action: Creando jugador...');

  try {
    const jugadorData = {
      primer_nombre: formData.get('primer_nombre'),
      primer_apellido: formData.get('primer_apellido'),
      numero_dorsal: formData.get('numero_dorsal') ? Number(formData.get('numero_dorsal')) : null,
      equipo: formData.get('equipo') ? Number(formData.get('equipo')) : null,
      posicion: formData.get('posicion'),
      // Agregar otros campos según sea necesario
    };

    await dashboardApi.jugadores.create(jugadorData);
    
    // Revalidar la página para mostrar los cambios
    revalidatePath('/dashboard/jugadores');
    
    console.log('✅ Jugador creado exitosamente');
    return { success: true };

  } catch (error) {
    console.error('❌ Error creando jugador:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error al crear jugador';
    return { error: errorMessage };
  }
}

/**
 * 🔒 ACTUALIZAR JUGADOR
 */
export async function actualizarJugador(
  id: string, 
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  console.log('🔒 Server Action: Actualizando jugador:', id);

  try {
    const jugadorData = {
      primer_nombre: formData.get('primer_nombre'),
      primer_apellido: formData.get('primer_apellido'),
      numero_dorsal: formData.get('numero_dorsal') ? Number(formData.get('numero_dorsal')) : null,
      equipo: formData.get('equipo') ? Number(formData.get('equipo')) : null,
      posicion: formData.get('posicion'),
      // Agregar otros campos según sea necesario
    };

    await dashboardApi.jugadores.update(id, jugadorData);
    
    // Revalidar la página para mostrar los cambios
    revalidatePath('/dashboard/jugadores');
    
    console.log('✅ Jugador actualizado exitosamente');
    return { success: true };

  } catch (error) {
    console.error('❌ Error actualizando jugador:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error al actualizar jugador';
    return { error: errorMessage };
  }
}

/**
 * 🔒 ELIMINAR JUGADOR
 */
export async function eliminarJugador(id: string): Promise<{ error?: string; success?: boolean }> {
  console.log('🔒 Server Action: Eliminando jugador:', id);

  try {
    await dashboardApi.jugadores.delete(id);
    
    // Revalidar la página para mostrar los cambios
    revalidatePath('/dashboard/jugadores');
    
    console.log('✅ Jugador eliminado exitosamente');
    return { success: true };

  } catch (error) {
    console.error('❌ Error eliminando jugador:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error al eliminar jugador';
    return { error: errorMessage };
  }
}