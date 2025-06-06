// src/components/torneos/TorneoActualServer.tsx
import { serverApi } from '@/lib/api/server';
import TorneoActual from './TorneoActual';
import type { components } from '@/types/api';

// Usar tipos ya definidos en la API
type TorneoDetalle = components['schemas']['TorneoDetalle'];

/**
 * Transforma los datos de la API al formato requerido por TorneoActual
 */
function transformarDatosTorneo(torneo: TorneoDetalle) {
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
        categoria: torneo.categoria.nombre,
        faseActual: fasesDescriptivas[torneo.fase_actual || 'grupos'] || 'Fase de grupos',
        equiposInscritos: torneo.total_equipos,
        activo: torneo.activo,

        // Datos de la categoría (ahora disponibles desde la API)
        costoInscripcion: torneo.categoria.costo_inscripcion ? `$${torneo.categoria.costo_inscripcion}` : "$100",
        modalidad: torneo.categoria.descripcion || "Sin mundialitos (jugadores que no hayan participado en campeonatos del amistad club o mundialito)",
        totalPremios: torneo.categoria.premio_primero ? `$${torneo.categoria.premio_primero}` : "$1,900",
        ubicacion: "CANCHA GOAL STAR - Pumayunga", // Este campo no está en la API aún
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

        // Obtener torneos con filtro activo desde endpoint principal
        const respuestaTorneos = await serverApi.torneos.getActivos({
            page_size: 1 // Solo necesitamos el primer torneo activo
        });

        console.log('📊 Respuesta de torneos activos:', respuestaTorneos);

        // Verificar si hay torneos activos
        if (!respuestaTorneos.results || respuestaTorneos.results.length === 0) {
            console.warn('⚠️ No se encontraron torneos activos, mostrando fallback');
            return <TorneoFallback />;
        }

        // Tomar el primer torneo activo (solo tenemos ID y datos básicos)
        const torneoBasico = respuestaTorneos.results[0];
        console.log('📋 Torneo básico encontrado:', {
            id: torneoBasico.id,
            nombre: torneoBasico.nombre,
            activo: torneoBasico.activo
        });

        // Obtener detalles completos del torneo (incluye categoría completa)
        const torneoDetalle = await serverApi.torneos.getById(torneoBasico.id);
        console.log('✅ Detalle del torneo obtenido:', {
            id: torneoDetalle.id,
            nombre: torneoDetalle.nombre,
            categoria: torneoDetalle.categoria.nombre,
            fase: torneoDetalle.fase_actual,
            equipos: torneoDetalle.total_equipos
        });

        // Transformar datos para el componente
        const propsTransformadas = transformarDatosTorneo(torneoDetalle);

        console.log('🔄 Datos transformados para TorneoActual:', propsTransformadas);

        return <TorneoActual {...propsTransformadas} />;

    } catch (error) {
        console.error('❌ Error al obtener datos del torneo activo:', error);

        // En caso de error, mostrar fallback
        return <TorneoFallback />;
    }
}