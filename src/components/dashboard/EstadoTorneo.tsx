// src/components/dashboard/EstadoTorneo.tsx
'use client';

import { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle,
    Loader2,
    BarChart3
} from 'lucide-react';
import type { components } from '@/types/api';

// Tipos de la API
type Torneo = components['schemas']['TorneoDetalle'];
type Partido = components['schemas']['Partido'];

interface EstadoTorneoData {
    torneo: Torneo | null;
    partidos_totales: number;
    partidos_jugados: number;
    partidos_pendientes: number;
    proximos_partidos: Partido[];
    progreso_porcentaje: number;
}

export default function EstadoTorneo() {
    const [estado, setEstado] = useState<EstadoTorneoData>({
        torneo: null,
        partidos_totales: 0,
        partidos_jugados: 0,
        partidos_pendientes: 0,
        proximos_partidos: [],
        progreso_porcentaje: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        cargarEstadoTorneo();
    }, []);

    const cargarEstadoTorneo = async () => {
        try {
            setLoading(true);
            setError(null);

            let torneoActivo = null;
            
            // Intentar obtener torneos activos primero
            try {
                const responseTorneos = await fetch('/api/torneos/activos/');
                if (responseTorneos.ok) {
                    const torneos = await responseTorneos.json();
                    torneoActivo = torneos[0]; // Primer torneo activo
                }
            } catch (error) {
                console.warn('Error al cargar torneos activos, intentando endpoint alternativo:', error);
            }

            // Si no se encontró torneo activo, intentar con todos los torneos
            if (!torneoActivo) {
                try {
                    const responseTorneos = await fetch('/api/torneos/');
                    if (responseTorneos.ok) {
                        const data = await responseTorneos.json();
                        const torneos = data.results || data;
                        // Buscar el primer torneo disponible
                        torneoActivo = torneos[0];
                    }
                } catch (error) {
                    console.warn('Error al cargar todos los torneos:', error);
                }
            }

            if (!torneoActivo) {
                console.info('No se encontraron torneos disponibles');
                setEstado({
                    torneo: null,
                    partidos_totales: 0,
                    partidos_jugados: 0,
                    partidos_pendientes: 0,
                    proximos_partidos: [],
                    progreso_porcentaje: 0
                });
                return;
            }

            // Obtener estadísticas del torneo
            let estadisticas: any = {};
            try {
                const responseEstadisticas = await fetch(`/api/torneos/${torneoActivo.id}/estadisticas/`);
                if (responseEstadisticas.ok) {
                    estadisticas = await responseEstadisticas.json();
                } else {
                    console.warn('Error al cargar estadísticas del torneo:', responseEstadisticas.status);
                }
            } catch (error) {
                console.warn('Error al cargar estadísticas:', error);
            }

            // Obtener partidos próximos
            let proximosPartidos: any[] = [];
            try {
                const responsePartidos = await fetch('/api/partidos/proximos/?dias=7');
                if (responsePartidos.ok) {
                    proximosPartidos = await responsePartidos.json();
                } else {
                    console.warn('Error al cargar partidos próximos:', responsePartidos.status);
                }
            } catch (error) {
                console.warn('Error al cargar partidos próximos:', error);
            }

            // Calcular estadísticas
            const partidos_jugados = estadisticas.partidos_jugados || 0;
            const partidos_totales = estadisticas.total_partidos || 0;
            const partidos_pendientes = partidos_totales - partidos_jugados;
            const progreso_porcentaje = partidos_totales > 0 ? Math.round((partidos_jugados / partidos_totales) * 100) : 0;

            setEstado({
                torneo: torneoActivo,
                partidos_totales,
                partidos_jugados,
                partidos_pendientes,
                proximos_partidos: proximosPartidos.slice(0, 3), // Solo próximos 3
                progreso_porcentaje
            });

        } catch (err) {
            console.error('Error cargando estado del torneo:', err);
            setError(err instanceof Error ? err.message : 'Error al cargar datos del torneo');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
                <span className="ml-2 text-neutral-600 dark:text-neutral-400">
                    Cargando estado...
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-6">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                    Error al cargar
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">{error}</p>
                <button
                    onClick={cargarEstadoTorneo}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const { torneo, partidos_jugados, partidos_pendientes, proximos_partidos, progreso_porcentaje } = estado;

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-EC', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
    };

    const formatearHora = (fecha: string) => {
        return new Date(fecha).toLocaleTimeString('es-EC', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">

            {/* Información del torneo */}
            {torneo && (
                <div className="text-center">
                    <h3 className="font-semibold text-neutral-900 dark:text-white text-sm mb-1">
                        {torneo.nombre}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {torneo.categoria.nombre} • {torneo.total_equipos} equipos
                    </p>
                </div>
            )}

            {/* Progreso de la fase de grupos */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        Fase de Grupos
                    </span>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {progreso_porcentaje}%
                    </span>
                </div>

                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progreso_porcentaje}%` }}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                        <div className="text-lg font-bold text-green-700 dark:text-green-300">
                            {partidos_jugados}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">
                            Jugados
                        </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                        <div className="text-lg font-bold text-amber-700 dark:text-amber-300">
                            {partidos_pendientes}
                        </div>
                        <div className="text-xs text-amber-600 dark:text-amber-400">
                            Pendientes
                        </div>
                    </div>
                </div>
            </div>

            {/* Próximos partidos */}
            <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Próximos Partidos
                </h4>

                {proximos_partidos.length > 0 ? (
                    <div className="space-y-2">
                        {proximos_partidos.map((partido) => (
                            <div
                                key={partido.id}
                                className="bg-neutral-50 dark:bg-neutral-700/50 rounded-lg p-3 border border-neutral-200 dark:border-neutral-600"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-xs font-medium text-neutral-900 dark:text-white">
                                        {partido.equipo_1_nombre} vs {partido.equipo_2_nombre}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{formatearFecha(partido.fecha)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{formatearHora(partido.fecha)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <Calendar className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            No hay partidos próximos programados
                        </p>
                    </div>
                )}
            </div>

            {/* Estado de alerta */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                {partidos_pendientes <= 5 ? (
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs">
                            Quedan pocos partidos - Preparar eliminatorias
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs">
                            Fase de grupos en desarrollo normal
                        </span>
                    </div>
                )}
            </div>

            {/* Botón de acción */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                <button
                    onClick={() => window.open('/tabla', '_blank')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <BarChart3 className="w-4 h-4" />
                    Ver Tabla Completa
                </button>
            </div>
        </div>
    );
}