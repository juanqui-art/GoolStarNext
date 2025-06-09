'use server'

import { revalidateTag } from 'next/cache'

/**
 * Server Action para revalidar datos del dashboard después de limpieza
 */
export async function revalidateCleanupData() {
  console.log('🔄 Revalidando datos de limpieza...')
  
  // Revalidar todas las tags relacionadas con equipos y jugadores
  revalidateTag('equipos')
  revalidateTag('jugadores') 
  revalidateTag('dashboard')
  
  console.log('✅ Datos de limpieza revalidados')
}

/**
 * Server Action específica para revalidar un equipo después de actualizar jugadores
 */
export async function revalidateEquipoData(equipoId: number) {
  console.log(`🔄 Revalidando datos del equipo ${equipoId}...`)
  
  // Revalidar tags específicas del equipo
  revalidateTag('equipos')
  revalidateTag('jugadores')
  revalidateTag(`equipo-${equipoId}`)
  revalidateTag('dashboard')
  
  console.log(`✅ Datos del equipo ${equipoId} revalidados`)
}