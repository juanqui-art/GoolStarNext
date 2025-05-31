// src/components/data/TablaList.server.tsx - CÓDIGO COMPLETO
import Link from 'next/link';
import { Trophy, TrendingUp, TrendingDown, Minus, AlertCircle, Target, Medal } from 'lucide-react';
import type { components } from '@/types/api';

// Usar los tipos ya definidos en la API
type TablaPosiciones = components['schemas']['TablaPosiciones'];
type EstadisticaEquipo = components['schemas']['EstadisticaEquipo'];

interface TablaListServerProps {
    torneoId?: number;
    categoria?: string;
    grupo?: string;
    actualizar?: boolean;
    showTitle?: boolean;
}

// Datos de ejemplo para la tabla de posiciones
const TABLA_EJEMPLO = [
    {
        posicion: 1,
        equipo: {
            id: 1,
            nombre: "Liverpool",
            logo: null
        },
        puntos: 21,
        partidos_jugados: 7,
        partidos_ganados: 7,
        partidos_empatados: 0,
        partidos_perdidos: 0,
        goles_favor: 45,
        goles_contra: 28,
        diferencia_goles: 17,
        tendencia: "up",
        grupo: "A"
    },
    {
        posicion: 2,
        equipo: {
            id: 2,
            nombre: "Talleres M.A",
            logo: null
        },
        puntos: 18,
        partidos_jugados: 7,
        partidos_ganados: 6,
        partidos_empatados: 0,
        partidos_perdidos: 1,
        goles_favor: 38,
        goles_contra: 22,
        diferencia_goles: 16,
        tendencia: "up",
        grupo: "A"
    },
    {
        posicion: 3,
        equipo: {
            id: 3,
            nombre: "Real Madrid",
            logo: null
        },
        puntos: 15,
        partidos_jugados: 7,
        partidos_ganados: 5,
        partidos_empatados: 0,
        partidos_perdidos: 2,
        goles_favor: 32,
        goles_contra: 18,
        diferencia_goles: 14,
        tendencia: "stable",
        grupo: "A"
    },
    {
        posicion: 4,
        equipo: {
            id: 4,
            nombre: "Barcelona",
            logo: null
        },
        puntos: 12,
        partidos_jugados: 7,
        partidos_ganados: 4,
        partidos_empatados: 0,
        partidos_perdidos: 3,
        goles_favor: 28,
        goles_contra: 25,
        diferencia_goles: 3,
        tendencia: "down",
        grupo: "B"
    },
    {
        posicion: 5,
        equipo: {
            id: 5,
            nombre: "Manchester",
            logo: null
        },
        puntos: 9,
        partidos_jugados: 7,
        partidos_ganados: 3,
        partidos_empatados: 0,
        partidos_perdidos: 4,
        goles_favor: 22,
        goles_contra: 28,
        diferencia_goles: -6,
        tendencia: "down",
        grupo: "B"
    },
    {
        posicion: 6,
        equipo: {
            id: 6,
            nombre: "Chelsea",
            logo: null
        },
        puntos: 6,
        partidos_jugados: 7,
        partidos_ganados: 2,
        partidos_empatados: 0,
        partidos_perdidos: 5,
        goles_favor: 18,
        goles_contra: 35,
        diferencia_goles: -17,
        tendencia: "down",
        grupo: "B"
    },
    {
        posicion: 7,
        equipo: {
            id: 7,
            nombre: "Arsenal",
            logo: null
        },
        puntos: 12,
        partidos_jugados: 6,
        partidos_ganados: 4,
        partidos_empatados: 0,
        partidos_perdidos: 2,
        goles_favor: 24,
        goles_contra: 16,
        diferencia_goles: 8,
        tendencia: "up",
        grupo: "C"
    },
    {
        posicion: 8,
        equipo: {
            id: 8,
            nombre: "Juventus",
            logo: null
        },
        puntos: 9,
        partidos_jugados: 6,
        partidos_ganados: 3,
        partidos_empatados: 0,
        partidos_perdidos: 3,
        goles_favor: 19,
        goles_contra: 18,
        diferencia_goles: 1,
        tendencia: "stable",
        grupo: "C"
    },
    {
        posicion: 9,
        equipo: {
            id: 9,
            nombre: "Inter Milan",
            logo: null
        },
        puntos: 6,
        partidos_jugados: 6,
        partidos_ganados: 2,
        partidos_empatados: 0,
        partidos_perdidos: 4,
        goles_favor: 15,
        goles_contra: 22,
        diferencia_goles: -7,
        tendencia: "down",
        grupo: "C"
    },
    {
        posicion: 10,
        equipo: {
            id: 10,
            nombre: "AC Milan",
            logo: null
        },
        puntos: 3,
        partidos_jugados: 6,
        partidos_ganados: 1,
        partidos_empatados: 0,
        partidos_perdidos: 5,
        goles_favor: 12,
        goles_contra: 28,
        diferencia_goles: -16,
        tendencia: "down",
        grupo: "D"
    }
];

// Función para obtener datos de la tabla
async function obtenerTablaPosiciones(params: any) {
    try {
        // Intentar importar el API dinámicamente
        const { serverApi } = await import('@/lib/api/server');

        // Primero intentar obtener torneos activos para usar el primero
        if (serverApi?.torneos?.getActivos && !params.torneoId) {
            const torneosActivos = await serverApi.torneos.getActivos();
            if (torneosActivos?.results?.length > 0) {
                params.torneoId = torneosActivos.results[0].id;
            }
        }

        // Obtener tabla de posiciones si hay torneo
        if (serverApi?.torneos?.getTablaPosiciones && params.torneoId) {
            const data: TablaPosiciones = await serverApi.torneos.getTablaPosiciones(params.torneoId, {
                grupo: params.grupo,
                actualizar: params.actualizar
            });

            if (data?.equipos) {
                return {
                    tabla: data.equipos.map((equipo: EstadisticaEquipo, index: number) => ({
                        posicion: index + 1,
                        equipo: {
                            id: equipo.equipo,
                            nombre: equipo.equipo_nombre,
                            logo: null
                        },
                        puntos: equipo.puntos,
                        partidos_jugados: equipo.partidos_jugados,
                        partidos_ganados: equipo.partidos_ganados,
                        partidos_empatados: equipo.partidos_empatados,
                        partidos_perdidos: equipo.partidos_perdidos,
                        goles_favor: equipo.goles_favor,
                        goles_contra: equipo.goles_contra,
                        diferencia_goles: equipo.diferencia_goles,
                        tendencia: index < 3 ? "up" : index > 6 ? "down" : "stable",
                        grupo: data.grupo || "General"
                    })),
                    esEjemplo: false,
                    grupo: data.grupo
                };
            }
        }
    } catch (error) {
        console.warn('No se pudo conectar con la API de tabla, usando datos de ejemplo:', error);
    }

    // Fallback a datos de ejemplo
    let tablaEjemplo = [...TABLA_EJEMPLO];

    // Aplicar filtros a los datos de ejemplo
    if (params.grupo) {
        tablaEjemplo = tablaEjemplo.filter(e => e.grupo === params.grupo.toUpperCase());
        // Reajustar posiciones después del filtro
        tablaEjemplo = tablaEjemplo.map((equipo, index) => ({
            ...equipo,
            posicion: index + 1
        }));
    }

    return {
        tabla: tablaEjemplo,
        esEjemplo: true,
        grupo: params.grupo?.toUpperCase() || null
    };
}

// Componente para mostrar la tendencia
function TendenciaIcon({ tendencia }: { tendencia: string }) {
    switch (tendencia) {
        case 'up':
            return <TrendingUp className="w-4 h-4 text-green-500" />;
        case 'down':
            return <TrendingDown className="w-4 h-4 text-red-500" />;
        default:
            return <Minus className="w-4 h-4 text-neutral-400" />;
    }
}

// Componente para el indicador de posición
function PosicionIndicator({ posicion }: { posicion: number }) {
    let bgColor = 'bg-neutral-100 dark:bg-neutral-700';
    let textColor = 'text-neutral-600 dark:text-neutral-400';
    let icon = null;

    if (posicion === 1) {
        bgColor = 'bg-goal-gold/20';
        textColor = 'text-goal-gold';
        icon = <Trophy className="w-4 h-4" />;
    } else if (posicion === 2) {
        bgColor = 'bg-neutral-300/20';
        textColor = 'text-neutral-600';
        icon = <Medal className="w-4 h-4" />;
    } else if (posicion === 3) {
        bgColor = 'bg-orange-300/20';
        textColor = 'text-orange-600';
        icon = <Medal className="w-4 h-4" />;
    } else if (posicion <= 8) {
        bgColor = 'bg-green-100 dark:bg-green-900/30';
        textColor = 'text-green-600 dark:text-green-400';
    } else if (posicion <= 12) {
        bgColor = 'bg-yellow-100 dark:bg-yellow-900/30';
        textColor = 'text-yellow-600 dark:text-yellow-400';
    } else {
        bgColor = 'bg-red-100 dark:bg-red-900/30';
        textColor = 'text-red-600 dark:text-red-400';
    }

    return (
        <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center ${textColor} font-bold text-sm`}>
            {icon || posicion}
        </div>
    );
}

// Componente individual de equipo en la tabla
function EquipoTablaRow({ equipo, posicion }: { equipo: any; posicion: number }) {
    return (
        <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
            {/* Posición */}
            <td className="px-4 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                    <PosicionIndicator posicion={posicion} />
                    <TendenciaIcon tendencia={equipo.tendencia} />
                </div>
            </td>

            {/* Equipo */}
            <td className="px-4 py-4">
                <Link
                    href={`/equipos/${equipo.equipo.id}`}
                    className="flex items-center gap-3 hover:text-goal-blue dark:hover:text-goal-gold transition-colors"
                >
                    {equipo.equipo.logo ? (
                        <img
                            src={equipo.equipo.logo}
                            alt={`Logo ${equipo.equipo.nombre}`}
                            className="w-8 h-8 object-contain rounded"
                        />
                    ) : (
                        <div className="w-8 h-8 bg-goal-gold/20 rounded flex items-center justify-center">
                            <span className="text-goal-gold font-bold text-xs">
                                {equipo.equipo.nombre.substring(0, 2).toUpperCase()}
                            </span>
                        </div>
                    )}
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                        {equipo.equipo.nombre}
                    </span>
                </Link>
            </td>

            {/* Puntos */}
            <td className="px-4 py-4 text-center">
                <span className="font-bold text-lg text-goal-blue dark:text-goal-gold">
                    {equipo.puntos}
                </span>
            </td>

            {/* Partidos Jugados */}
            <td className="px-4 py-4 text-center text-neutral-600 dark:text-neutral-400">
                {equipo.partidos_jugados}
            </td>

            {/* Ganados */}
            <td className="px-4 py-4 text-center text-green-600 dark:text-green-400 font-medium">
                {equipo.partidos_ganados}
            </td>

            {/* Empatados */}
            <td className="px-4 py-4 text-center text-yellow-600 dark:text-yellow-400 font-medium">
                {equipo.partidos_empatados}
            </td>

            {/* Perdidos */}
            <td className="px-4 py-4 text-center text-red-600 dark:text-red-400 font-medium">
                {equipo.partidos_perdidos}
            </td>

            {/* Goles Favor */}
            <td className="px-4 py-4 text-center text-neutral-600 dark:text-neutral-400">
                {equipo.goles_favor}
            </td>

            {/* Goles Contra */}
            <td className="px-4 py-4 text-center text-neutral-600 dark:text-neutral-400">
                {equipo.goles_contra}
            </td>

            {/* Diferencia */}
            <td className="px-4 py-4 text-center">
                <span className={`font-bold ${
                    equipo.diferencia_goles > 0
                        ? 'text-green-600 dark:text-green-400'
                        : equipo.diferencia_goles < 0
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-neutral-600 dark:text-neutral-400'
                }`}>
                    {equipo.diferencia_goles > 0 ? '+' : ''}{equipo.diferencia_goles}
                </span>
            </td>
        </tr>
    );
}

// Componente de aviso para datos de ejemplo
function AvisoEjemplo() {
    return (
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                    <h3 className="text-blue-800 dark:text-blue-200 font-medium text-sm">
                        Mostrando datos de ejemplo
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                        La conexión con la API está en desarrollo. Esta es una tabla de posiciones de ejemplo para demostrar la funcionalidad.
                    </p>
                </div>
            </div>
        </div>
    );
}

// Componente principal
export default async function TablaListServer({
                                                  torneoId,
                                                  categoria,
                                                  grupo,
                                                  actualizar = false,
                                                  showTitle = true
                                              }: TablaListServerProps) {

    const { tabla, esEjemplo, grupo: grupoActual } = await obtenerTablaPosiciones({
        torneoId,
        categoria,
        grupo,
        actualizar
    });

    // Estado vacío
    if (tabla.length === 0) {
        return (
            <div className="w-full max-w-6xl mx-auto">
                {showTitle && (
                    <h2 className="text-3xl font-heading text-center mb-6">
                        Tabla de Posiciones
                    </h2>
                )}

                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        No hay datos de clasificación
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                        {grupo
                            ? `No hay equipos clasificados en el Grupo ${grupo} actualmente.`
                            : 'La tabla de posiciones aún no está disponible.'
                        }
                    </p>
                    <Link
                        href="/partidos"
                        className="inline-flex items-center bg-goal-blue hover:bg-goal-blue/90 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        <Target className="w-4 h-4 mr-2" />
                        Ver partidos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto">
            {showTitle && (
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-heading mb-2">
                        Tabla de Posiciones
                        {grupoActual && (
                            <span className="text-goal-gold"> - Grupo {grupoActual}</span>
                        )}
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Clasificación actualizada del torneo
                    </p>
                </div>
            )}

            {/* Aviso si son datos de ejemplo */}
            {esEjemplo && <AvisoEjemplo />}

            {/* Tabla responsive */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                {/* Tabla para desktop */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                        <tr>
                            <th className="px-4 py-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                                Pos
                            </th>
                            <th className="px-4 py-4 text-left text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                                Equipo
                            </th>
                            <th className="px-4 py-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                                Pts
                            </th>
                            <th className="px-4 py-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                                PJ
                            </th>
                            <th className="px-4 py-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                                G
                            </th>
                            <th className="px-4 py-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                                E
                            </th>
                            <th className="px-4 py-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                                P
                            </th>
                            <th className="px-4 py-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                                GF
                            </th>
                            <th className="px-4 py-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                                GC
                            </th>
                            <th className="px-4 py-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                                DG
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                        {tabla.map((equipo) => (
                            <EquipoTablaRow
                                key={equipo.equipo.id}
                                equipo={equipo}
                                posicion={equipo.posicion}
                            />
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Vista móvil */}
                <div className="lg:hidden divide-y divide-neutral-200 dark:divide-neutral-700">
                    {tabla.map((equipo) => (
                        <div key={equipo.equipo.id} className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <PosicionIndicator posicion={equipo.posicion} />
                                    <Link
                                        href={`/equipos/${equipo.equipo.id}`}
                                        className="flex items-center gap-2 hover:text-goal-blue dark:hover:text-goal-gold transition-colors"
                                    >
                                        {equipo.equipo.logo ? (
                                            <img
                                                src={equipo.equipo.logo}
                                                alt={`Logo ${equipo.equipo.nombre}`}
                                                className="w-6 h-6 object-contain rounded"
                                            />
                                        ) : (
                                            <div className="w-6 h-6 bg-goal-gold/20 rounded flex items-center justify-center">
                                                <span className="text-goal-gold font-bold text-xs">
                                                    {equipo.equipo.nombre.substring(0, 2).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <span className="font-medium text-neutral-800 dark:text-neutral-200">
                                            {equipo.equipo.nombre}
                                        </span>
                                    </Link>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-xl text-goal-blue dark:text-goal-gold">
                                        {equipo.puntos}
                                    </span>
                                    <span className="text-sm text-neutral-500 dark:text-neutral-400">pts</span>
                                    <TendenciaIcon tendencia={equipo.tendencia} />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="text-center">
                                    <div className="text-neutral-500 dark:text-neutral-400">PJ</div>
                                    <div className="font-medium">{equipo.partidos_jugados}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-neutral-500 dark:text-neutral-400">G-E-P</div>
                                    <div className="font-medium">
                                        <span className="text-green-600">{equipo.partidos_ganados}</span>-
                                        <span className="text-yellow-600">{equipo.partidos_empatados}</span>-
                                        <span className="text-red-600">{equipo.partidos_perdidos}</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-neutral-500 dark:text-neutral-400">DG</div>
                                    <div className={`font-bold ${
                                        equipo.diferencia_goles > 0
                                            ? 'text-green-600 dark:text-green-400'
                                            : equipo.diferencia_goles < 0
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-neutral-600 dark:text-neutral-400'
                                    }`}>
                                        {equipo.diferencia_goles > 0 ? '+' : ''}{equipo.diferencia_goles}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Información adicional */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        <span>
                            {tabla.length} equipos clasificados
                            {esEjemplo && ' (datos de ejemplo)'}
                        </span>
                    </div>

                    {grupoActual && (
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            <span>Grupo {grupoActual}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <Link
                        href="/tabla?actualizar=true"
                        className="text-goal-blue dark:text-goal-gold hover:underline text-sm"
                    >
                        Actualizar tabla →
                    </Link>
                </div>
            </div>

            {/* Leyenda de clasificación */}
            <div className="mt-6 p-4 bg-gradient-to-r from-goal-blue/5 to-goal-gold/5 dark:from-goal-blue/10 dark:to-goal-gold/10 rounded-lg">
                <h4 className="font-semibold mb-3 text-neutral-800 dark:text-neutral-200 text-center">
                    Zona de Clasificación
                </h4>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-neutral-600 dark:text-neutral-400">1°-8° Clasifican a octavos</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-neutral-600 dark:text-neutral-400">9°-12° Zona de repechaje</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-neutral-600 dark:text-neutral-400">13°+ Eliminados</span>
                    </div>
                </div>
            </div>
        </div>
    );
}