// src/components/torneos/TorneoActualServer.tsx
import { serverApi } from '@/lib/api/server';
import TorneoActual from './TorneoActual';
import type { components } from '@/types/api';

// Usar tipos ya definidos en la API
type Torneo = components['schemas']['Torneo'];

/**
 * Transforma los datos de la API al formato requerido por TorneoActual
 */
function transformarDatosTorneo(torneo: Torneo) {
    // Mapeo de fase_actual a texto descriptivo
    const fasesDescriptivas: Record<string, string> = {
        'inscripcion': 'Inscripciones abiertas',
        'grupos': 'Últimos partidos de la fase de grupos',
        'octavos': 'Octavos de final en curso',
        'cuartos': 'Cuartos de final en curso',
        'semifinales': 'Semifinales en juego',
        'final': 'Gran final del torneo',
        'finalizado': 'Torneo finalizado'
    };

    return {
        nombre: torneo.nombre,
        fechaInicio: torneo.fecha_inicio,
        categoria: torneo.categoria_nombre,
        faseActual: fasesDescriptivas[torneo.fase_actual || 'grupos'] || 'Fase de grupos',
        equiposInscritos: torneo.total_equipos,
        activo: torneo.activo,

        // Datos con valores por defecto (no disponibles en API actual)
        costoInscripcion: "$100",
        modalidad: "Sin mundialitos (jugadores que no hayan participado en campeonatos del amistad club o mundialito)",
        totalPremios: "$1,900",
        ubicacion: "CANCHA GOAL STAR - Pumayunga",
    };
}

/**
 * Componente de fallback cuando no hay torneos activos
 */
function TorneoFallback() {
    const defaultProps = {
        nombre: "PRÓXIMO CAMPEONATO GOOL⭐️STAR",
        fechaInicio: "2025-06-01",
        costoInscripcion: "$100",
        modalidad: "Sin mundialitos (jugadores que no hayan participado en campeonatos del amistad club o mundialito)",
        faseActual: "Inscripciones próximamente",
        equiposInscritos: 0,
        categoria: "Varones",
        activo: false,
        totalPremios: "$1,900",
        ubicacion: "CANCHA GOAL STAR - Pumayunga",
    };

    return <TorneoActual {...defaultProps} />;
}

/**
 * Server Component que obtiene datos del torneo activo y los pasa a TorneoActual
 */
export default async function TorneoActualServer() {
    try {
        console.log('🏆 Obteniendo datos del torneo activo...');

        // Obtener torneos activos desde la API
        const torneosActivos = await serverApi.torneos.getActivos({
            page_size: 1 // Solo necesitamos el primer torneo activo
        });

        console.log('📊 Respuesta completa de torneos activos:', torneosActivos);
        console.log('📊 Tipo de respuesta:', typeof torneosActivos);
        console.log('📊 Keys de la respuesta:', Object.keys(torneosActivos));

        // El endpoint /api/torneos/activos/ devuelve un array directo, no un objeto paginado
        let torneos: Torneo[] = [];

        if (Array.isArray(torneosActivos)) {
            // Si es un array directo (formato esperado según documentación)
            torneos = torneosActivos;
            console.log('📋 Formato array directo detectado, torneos encontrados:', torneos.length);
        } else if (torneosActivos.results && Array.isArray(torneosActivos.results)) {
            // Si tiene formato paginado como fallback
            torneos = torneosActivos.results;
            console.log('📋 Formato paginado detectado, torneos encontrados:', torneos.length);
        } else {
            console.warn('⚠️ Formato de respuesta no reconocido:', torneosActivos);
        }

        console.log('📊 Torneos procesados:', {
            count: torneos.length,
            torneos: torneos.map(t => ({ id: t.id, nombre: t.nombre, activo: t.activo }))
        });

        // Verificar si hay torneos activos
        if (!torneos || torneos.length === 0) {
            console.warn('⚠️ No se encontraron torneos activos, mostrando fallback');
            return <TorneoFallback />;
        }

        // Tomar el primer torneo activo
        const torneoActivo = torneos[0];
        console.log('✅ Torneo activo encontrado:', {
            id: torneoActivo.id,
            nombre: torneoActivo.nombre,
            fase: torneoActivo.fase_actual,
            equipos: torneoActivo.total_equipos,
            activo: torneoActivo.activo
        });

        // Transformar datos para el componente
        const propsTransformadas = transformarDatosTorneo(torneoActivo);

        console.log('🔄 Datos transformados para TorneoActual:', propsTransformadas);

        return <TorneoActual {...propsTransformadas} />;

    } catch (error) {
        console.error('❌ Error al obtener datos del torneo activo:', error);

        // En caso de error, mostrar fallback
        return <TorneoFallback />;
    }
}