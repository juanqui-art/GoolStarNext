// src/components/data/GoleadoresList.server.tsx
import Link from 'next/link';
import { Trophy, Target, Users, AlertCircle, Medal, TrendingUp } from 'lucide-react';
import * as Sentry from '@sentry/nextjs';

interface GoleadoresListServerProps {
    torneo_id?: number;
    equipo_id?: number;
    limit?: number;
    showTitle?: boolean;
    searchQuery?: string;
}

// Datos de ejemplo para fallback
const GOLEADORES_EJEMPLO = [
    {
        id: 1,
        jugador_nombre: "Carlos Rodríguez",
        equipo_nombre: "Liverpool",
        total_goles: 12,
        partidos_jugados: 7,
        promedio_goles: 1.71,
        foto: null
    },
    {
        id: 2,
        jugador_nombre: "Miguel Santos",
        equipo_nombre: "Talleres M.A",
        total_goles: 10,
        partidos_jugados: 7,
        promedio_goles: 1.43,
        foto: null
    },
    {
        id: 3,
        jugador_nombre: "Diego Pérez",
        equipo_nombre: "Real Madrid",
        total_goles: 9,
        partidos_jugados: 6,
        promedio_goles: 1.5,
        foto: null
    },
    {
        id: 4,
        jugador_nombre: "Juan López",
        equipo_nombre: "Barcelona",
        total_goles: 8,
        partidos_jugados: 7,
        promedio_goles: 1.14,
        foto: null
    },
    {
        id: 5,
        jugador_nombre: "Pedro García",
        equipo_nombre: "Manchester",
        total_goles: 7,
        partidos_jugados: 6,
        promedio_goles: 1.17,
        foto: null
    },
    {
        id: 6,
        jugador_nombre: "Luis Martínez",
        equipo_nombre: "Chelsea",
        total_goles: 6,
        partidos_jugados: 7,
        promedio_goles: 0.86,
        foto: null
    },
    {
        id: 7,
        jugador_nombre: "Roberto Silva",
        equipo_nombre: "Arsenal",
        total_goles: 5,
        partidos_jugados: 5,
        promedio_goles: 1.0,
        foto: null
    },
    {
        id: 8,
        jugador_nombre: "Fernando Torres",
        equipo_nombre: "Juventus",
        total_goles: 5,
        partidos_jugados: 6,
        promedio_goles: 0.83,
        foto: null
    }
];

// Función para obtener datos (con fallback a datos de ejemplo)
async function obtenerGoleadores(params: any) {
    try {
        // Agregar breadcrumb para seguimiento en Sentry
        Sentry.addBreadcrumb({
            category: 'goleadores',
            message: `Obteniendo goleadores para torneo ID: ${params.torneo_id || 'no especificado'}`,
            level: 'info',
            data: { torneoId: params.torneo_id, timestamp: new Date().toISOString() }
        });

        // Intentar importar el API dinámicamente
        const { serverApi } = await import('@/lib/api/server');

        let torneoIdUsado = params.torneo_id;
        
        // Si no se proporcionó un ID de torneo, intentamos obtener el primero de la lista de torneos
        if (!torneoIdUsado) {
            try {
                console.log('🔍 Buscando torneos disponibles para goleadores...');
                Sentry.addBreadcrumb({
                    category: 'data',
                    message: 'Buscando torneos disponibles para goleadores',
                    level: 'info'
                });
                
                // Hacemos fetch directamente a la API de torneos principal
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://goolstar-backend.fly.dev/api'}/torneos/`);
                
                if (!response.ok) {
                    const errorMsg = `Error al obtener torneos: ${response.status}`;
                    Sentry.captureMessage(errorMsg, 'error');
                    throw new Error(errorMsg);
                }
                
                const data = await response.json();
                
                if (data?.results && data.results.length > 0) {
                    torneoIdUsado = data.results[0].id;
                    console.log(`✅ Torneo encontrado para goleadores: "${data.results[0].nombre}" con ID: ${torneoIdUsado}`);
                    Sentry.addBreadcrumb({
                        category: 'data',
                        message: `Torneo encontrado para goleadores: ${data.results[0].nombre} (ID: ${torneoIdUsado})`,
                        level: 'info',
                        data: {
                            torneoId: torneoIdUsado,
                            torneoNombre: data.results[0].nombre
                        }
                    });
                } else {
                    console.log('⚠️ No se encontraron torneos en los resultados');
                    Sentry.addBreadcrumb({
                        category: 'data',
                        message: 'No se encontraron torneos en los resultados para goleadores',
                        level: 'warning'
                    });
                }
            } catch (error) {
                console.error('❌ Error al obtener torneos para goleadores:', error);
                Sentry.captureException(error, {
                    tags: { component: 'GoleadoresList', operation: 'obtenerTorneos' },
                    level: 'error'
                });
                // Fallback a ID 1 en caso de error
                torneoIdUsado = 1;
                console.log('⚠️ Usando ID de torneo por defecto (1) para goleadores debido a error');
                Sentry.addBreadcrumb({
                    category: 'fallback',
                    message: 'Usando ID de torneo por defecto (1) para goleadores debido a error',
                    level: 'warning'
                });
            }
        }
        
        // Si aún no tenemos un ID, usar 1 como último recurso
        if (!torneoIdUsado) {
            torneoIdUsado = 1;
            console.log('⚠️ No se encontraron torneos, usando ID por defecto: 1');
            Sentry.addBreadcrumb({
                category: 'fallback',
                message: 'No se encontraron torneos para goleadores, usando ID por defecto: 1',
                level: 'warning'
            });
        }
        
        console.log(`🏆 Usando torneoId para goleadores: ${torneoIdUsado}`);
        Sentry.setTag('torneoId', String(torneoIdUsado));

        // Obtener jugadores destacados con el ID obtenido
        if (typeof serverApi?.goleadores?.getAll === 'function') {
            try {
                const queryParams: any = {
                    limite: params.limit || 50
                };
                
                if (params.equipo_id) {
                    queryParams.equipo_id = params.equipo_id;
                }
                
                if (params.searchQuery) {
                    queryParams.search = params.searchQuery;
                }
                
                console.log('📊 Obteniendo goleadores con parámetros:', queryParams);
                Sentry.addBreadcrumb({
                    category: 'data',
                    message: 'Obteniendo goleadores de la API',
                    level: 'info',
                    data: queryParams
                });
                
                const data = await serverApi.goleadores.getAll(torneoIdUsado, queryParams);

                if (data?.goleadores && Array.isArray(data.goleadores)) {
                    console.log(`✅ Se encontraron ${data.goleadores.length} goleadores`);
                    Sentry.addBreadcrumb({
                        category: 'data',
                        message: `Se encontraron ${data.goleadores.length} goleadores`,
                        level: 'info'
                    });
                    
                    let goleadores = data.goleadores.map((goleador: any, index: number) => ({
                        id: goleador.id || index + 1,
                        jugador_nombre: goleador.jugador_nombre || goleador.nombre || 'Jugador',
                        equipo_nombre: goleador.equipo_nombre || goleador.equipo || 'Equipo',
                        total_goles: goleador.total_goles || goleador.goles || 0,
                        partidos_jugados: goleador.partidos_jugados || 1,
                        promedio_goles: goleador.promedio_goles ||
                            ((goleador.total_goles || goleador.goles || 0) / (goleador.partidos_jugados || 1)),
                        foto: goleador.foto || null,
                        posicion: index + 1
                    }));

                    // Aplicar filtros adicionales si es necesario (aunque ya deberían venir filtrados de la API)
                    if (params.limit && goleadores.length > params.limit) {
                        goleadores = goleadores.slice(0, params.limit);
                    }

                    return {
                        goleadores,
                        esEjemplo: false,
                        total: goleadores.length,
                        metadatos: {
                            torneo_id: torneoIdUsado,
                            actualizado: new Date().toISOString()
                        }
                    };
                } else {
                    console.warn('⚠️ La API devolvió datos con formato incorrecto para goleadores');
                    Sentry.captureMessage('La API devolvió datos con formato incorrecto para goleadores', 'warning');
                }
            } catch (error) {
                console.error('❌ Error al obtener goleadores:', error);
                Sentry.captureException(error, {
                    tags: { 
                        component: 'GoleadoresList', 
                        operation: 'getGoleadores',
                        torneoId: String(torneoIdUsado)
                    }
                });
            }
        } else {
            const error = new Error('La función getAll no está disponible en serverApi.goleadores');
            console.error('❌', error.message);
            Sentry.captureException(error, {
                tags: { component: 'GoleadoresList', operation: 'checkApiAvailable' }
            });
        }
    } catch (error) {
        console.error('❌ Error general en obtenerGoleadores:', error);
        Sentry.captureException(error, {
            tags: { component: 'GoleadoresList', operation: 'general' }
        });
    }

    // Si llegamos aquí, usar datos de ejemplo como fallback
    return getFallbackData(params);
}

// Función auxiliar para obtener datos de ejemplo como fallback
function getFallbackData(params: any) {
    console.warn('⚠️ Usando datos de ejemplo como fallback para goleadores');
    
    // Reportar a Sentry el uso de fallback como evento
    Sentry.captureMessage('Usando datos de ejemplo como fallback para goleadores', 'warning');
    
    let goleadoresEjemplo = [...GOLEADORES_EJEMPLO];

    // Aplicar filtros a los datos de ejemplo
    if (params.equipo_id) {
        goleadoresEjemplo = goleadoresEjemplo.filter(g => g.equipo_nombre.includes('Liverpool')); // Ejemplo
    }

    if (params.searchQuery) {
        const query = params.searchQuery.toLowerCase();
        goleadoresEjemplo = goleadoresEjemplo.filter(g =>
            g.jugador_nombre.toLowerCase().includes(query) ||
            g.equipo_nombre.toLowerCase().includes(query)
        );
    }

    if (params.limit) {
        goleadoresEjemplo = goleadoresEjemplo.slice(0, params.limit);
    }

    return {
        goleadores: goleadoresEjemplo.map((g, index) => ({ ...g, posicion: index + 1 })),
        esEjemplo: true,
        total: goleadoresEjemplo.length
    };
}

// Componente para mostrar la posición
function PosicionBadge({ posicion }: { posicion: number }) {
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
    } else if (posicion <= 5) {
        bgColor = 'bg-green-100 dark:bg-green-900/30';
        textColor = 'text-green-600 dark:text-green-400';
    }

    return (
        <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center ${textColor} font-bold`}>
            {icon || posicion}
        </div>
    );
}

// Componente individual de goleador
function GoleadorCard({ goleador, showRanking = true }: { goleador: any; showRanking?: boolean }) {
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md hover:border-goal-gold/50 transition-all duration-300">
            <div className="flex items-center gap-4">
                {/* Posición y foto */}
                <div className="flex items-center gap-3">
                    {showRanking && <PosicionBadge posicion={goleador.posicion} />}

                    {goleador.foto ? (
                        <div className="w-12 h-12 relative">
                            <img
                                src={goleador.foto}
                                alt={goleador.jugador_nombre}
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                    ) : (
                        <div className="w-12 h-12 bg-goal-blue/20 rounded-full flex items-center justify-center">
                            <span className="text-goal-blue font-bold text-lg">
                                {goleador.jugador_nombre.charAt(0)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Información del jugador */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 text-lg">
                        {goleador.jugador_nombre}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                        {goleador.equipo_nombre}
                    </p>
                </div>

                {/* Estadísticas */}
                <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-4 h-4 text-goal-gold" />
                        <span className="font-bold text-2xl text-goal-gold">
                            {goleador.total_goles}
                        </span>
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {goleador.promedio_goles.toFixed(2)} por partido
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {goleador.partidos_jugados} partidos
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente de tabla para desktop
function GoleadoresTable({ goleadores }: { goleadores: any[] }) {
    return (
        <div className="hidden lg:block bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                    <tr>
                        <th className="px-4 py-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                            Pos
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                            Jugador
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                            Equipo
                        </th>
                        <th className="px-4 py-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                            Goles
                        </th>
                        <th className="px-4 py-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                            Partidos
                        </th>
                        <th className="px-4 py-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                            Promedio
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {goleadores.map((goleador) => (
                        <tr key={goleador.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                            <td className="px-4 py-4 text-center">
                                <PosicionBadge posicion={goleador.posicion} />
                            </td>

                            <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                    {goleador.foto ? (
                                        <img
                                            src={goleador.foto}
                                            alt={goleador.jugador_nombre}
                                            className="w-10 h-10 object-cover rounded-full"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-goal-blue/20 rounded-full flex items-center justify-center">
                                                <span className="text-goal-blue font-bold">
                                                    {goleador.jugador_nombre.charAt(0)}
                                                </span>
                                        </div>
                                    )}
                                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                                            {goleador.jugador_nombre}
                                        </span>
                                </div>
                            </td>

                            <td className="px-4 py-4">
                                <Link
                                    href={`/equipos?search=${goleador.equipo_nombre}`}
                                    className="text-goal-blue dark:text-goal-gold hover:underline"
                                >
                                    {goleador.equipo_nombre}
                                </Link>
                            </td>

                            <td className="px-4 py-4 text-center">
                                    <span className="font-bold text-2xl text-goal-gold">
                                        {goleador.total_goles}
                                    </span>
                            </td>

                            <td className="px-4 py-4 text-center text-neutral-600 dark:text-neutral-400">
                                {goleador.partidos_jugados}
                            </td>

                            <td className="px-4 py-4 text-center">
                                <div className="flex items-center justify-center gap-1">
                                        <span className="font-medium text-neutral-800 dark:text-neutral-200">
                                            {goleador.promedio_goles.toFixed(2)}
                                        </span>
                                    {goleador.promedio_goles >= 1.5 && (
                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
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
                        La conexión con la API está en desarrollo. Esta es una tabla de goleadores de ejemplo para demostrar la funcionalidad.
                    </p>
                </div>
            </div>
        </div>
    );
}

// Componente principal
export default async function GoleadoresListServer({
                                                       torneo_id,
                                                       equipo_id,
                                                       limit,
                                                       showTitle = true,
                                                       searchQuery
                                                   }: GoleadoresListServerProps) {

    const { goleadores, esEjemplo, total, metadatos } = await obtenerGoleadores({
        torneo_id,
        equipo_id,
        limit,
        searchQuery
    });

    // Estado vacío
    if (goleadores.length === 0) {
        return (
            <div className="w-full max-w-6xl mx-auto">
                {showTitle && (
                    <h2 className="text-3xl font-heading text-center mb-6">
                        Máximos Goleadores
                    </h2>
                )}

                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        No hay goleadores registrados
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                        {searchQuery
                            ? `No se encontraron goleadores que coincidan con "${searchQuery}"`
                            : equipo_id
                                ? 'Este equipo aún no tiene goleadores registrados.'
                                : 'Aún no hay goles registrados en el torneo.'
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
        <div className="w-full max-w-6xl mx-auto">
            {showTitle && (
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-heading mb-2">
                        Máximos Goleadores
                        {searchQuery && (
                            <span className="text-goal-gold"> - "{searchQuery}"</span>
                        )}
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Ranking de los máximos anotadores del torneo
                    </p>
                </div>
            )}

            {/* Aviso si son datos de ejemplo */}
            {esEjemplo && <AvisoEjemplo />}

            {/* Tabla para desktop */}
            <GoleadoresTable goleadores={goleadores} />

            {/* Vista móvil con cards */}
            <div className="lg:hidden space-y-4">
                {goleadores.map((goleador) => (
                    <GoleadorCard key={goleador.id} goleador={goleador} />
                ))}
            </div>

            {/* Información adicional */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        <span>
                            {goleadores.length} goleador{goleadores.length !== 1 ? 'es' : ''}
                            {limit && total > goleadores.length && ` de ${total} total`}
                            {esEjemplo && ' (datos de ejemplo)'}
                        </span>
                    </div>

                    {metadatos?.torneo_id && (
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            <span>Torneo actual</span>
                        </div>
                    )}
                </div>

                {limit && total > goleadores.length && (
                    <Link
                        href="/goleadores"
                        className="text-goal-blue dark:text-goal-gold hover:underline mt-2 sm:mt-0"
                    >
                        Ver todos los goleadores →
                    </Link>
                )}
            </div>

            {/* Podio de los 3 primeros */}
            {goleadores.length >= 3 && !limit && (
                <div className="mt-8 bg-gradient-to-r from-goal-gold/5 to-goal-orange/5 dark:from-goal-gold/10 dark:to-goal-orange/10 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-center mb-6 text-neutral-800 dark:text-neutral-100">
                        🏆 Podio de Goleadores
                    </h3>

                    <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                        {/* Segundo lugar */}
                        <div className="text-center order-1">
                            <div className="bg-neutral-300/20 rounded-lg p-4 h-24 flex flex-col justify-end mb-2">
                                <div className="text-2xl mb-1">🥈</div>
                                <div className="text-sm font-medium">{goleadores[1]?.jugador_nombre}</div>
                            </div>
                            <div className="font-bold text-xl text-neutral-600">
                                {goleadores[1]?.total_goles} goles
                            </div>
                        </div>

                        {/* Primer lugar */}
                        <div className="text-center order-2">
                            <div className="bg-goal-gold/20 rounded-lg p-4 h-32 flex flex-col justify-end mb-2">
                                <div className="text-3xl mb-1">🏆</div>
                                <div className="text-sm font-medium">{goleadores[0]?.jugador_nombre}</div>
                            </div>
                            <div className="font-bold text-2xl text-goal-gold">
                                {goleadores[0]?.total_goles} goles
                            </div>
                        </div>

                        {/* Tercer lugar */}
                        <div className="text-center order-3">
                            <div className="bg-orange-300/20 rounded-lg p-4 h-20 flex flex-col justify-end mb-2">
                                <div className="text-xl mb-1">🥉</div>
                                <div className="text-sm font-medium">{goleadores[2]?.jugador_nombre}</div>
                            </div>
                            <div className="font-bold text-lg text-orange-600">
                                {goleadores[2]?.total_goles} goles
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Enlaces relacionados */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
                <Link
                    href="/tabla"
                    className="flex items-center gap-2 text-goal-blue dark:text-goal-gold hover:underline"
                >
                    <Trophy className="w-4 h-4" />
                    Tabla de posiciones
                </Link>
                <Link
                    href="/partidos"
                    className="flex items-center gap-2 text-goal-orange hover:underline"
                >
                    <Target className="w-4 h-4" />
                    Ver partidos
                </Link>
                <Link
                    href="/equipos"
                    className="flex items-center gap-2 text-goal-blue dark:text-goal-gold hover:underline"
                >
                    <Users className="w-4 h-4" />
                    Ver equipos
                </Link>
            </div>
        </div>
    );
}