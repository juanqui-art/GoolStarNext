// src/utils/partidoHelpers.ts (NUEVO ARCHIVO - solo utilidades)
import type { components } from '@/types/api';

type Partido = components['schemas']['Partido'];

// ✅ MANTENER - Utilidades para procesar datos de partidos
export const partidoUtils = {
    /**
     * Obtiene el resultado formateado de un partido
     */
    getResultado(partido: Partido): string {
        if (!partido.completado) {
            return 'Por jugar';
        }
        return `${partido.goles_equipo_1} - ${partido.goles_equipo_2}`;
    },

    /**
     * Determina el estado actual del partido
     */
    getEstado(partido: Partido): { texto: string; color: 'green' | 'blue' | 'yellow' | 'red' | 'gray' } {
        if (partido.completado) return { texto: 'Completado', color: 'green' };

        const fechaPartido = new Date(partido.fecha);
        const ahora = new Date();

        return fechaPartido < ahora 
            ? { texto: 'Pendiente', color: 'yellow' } 
            : { texto: 'Programado', color: 'blue' };
    },

    /**
     * Verifica si el partido tiene victoria por default
     */
    tieneVictoriaPorDefault(partido: Partido): boolean {
        return !!partido.victoria_por_default;
    },

    /**
     * Formatea la fecha del partido
     */
    formatearFecha(fecha: string): string {
        return new Date(fecha).toLocaleDateString('es-ES', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Determina el ganador del partido
     */
    getGanador(partido: Partido): 'equipo_1' | 'equipo_2' | 'empate' | null {
        if (!partido.completado) return null;
        
        // Ensure goals are defined, default to 0 if undefined
        const golesEquipo1 = partido.goles_equipo_1 ?? 0;
        const golesEquipo2 = partido.goles_equipo_2 ?? 0;

        if (golesEquipo1 > golesEquipo2) return 'equipo_1';
        if (golesEquipo2 > golesEquipo1) return 'equipo_2';
        return 'empate';
    },

    /**
     * Verifica si el partido es hoy
     */
    esHoy(fecha: string): boolean {
        const fechaPartido = new Date(fecha);
        const hoy = new Date();
        return fechaPartido.toDateString() === hoy.toDateString();
    },

    /**
     * Formatea la fecha del partido en formato corto
     */
    formatearFechaCorta(fecha: string): string {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Determina el resultado detallado de un partido (victoria_local, victoria_visitante, empate)
     */
    getResultadoDetallado(partido: Partido): 'victoria_local' | 'victoria_visitante' | 'empate' | null {
        if (!partido.completado) return null;
        
        const golesEquipo1 = partido.goles_equipo_1 ?? 0;
        const golesEquipo2 = partido.goles_equipo_2 ?? 0;
        
        if (golesEquipo1 > golesEquipo2) return 'victoria_local';
        if (golesEquipo2 > golesEquipo1) return 'victoria_visitante';
        return 'empate';
    }
};

// ❌ ELIMINAR - Ya no necesitas funciones de API client-side
// export async function getPartidos(...) { ... }
// export async function getPartidoById(...) { ... }