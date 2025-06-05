// src/components/data/GoleadoresList.server.tsx
import Link from 'next/link';
import { Trophy, Target, Users, Medal, TrendingUp } from 'lucide-react';
import { serverApi } from '@/lib/api/server';
import type { components } from '@/types/api';
import Image from 'next/image';
import type { JugadorDestacado } from '@/types/server-api';

// Usar los tipos generados automáticamente de la API
// type Jugador = components['schemas']['Jugador'];
type PaginatedTorneoList = components['schemas']['PaginatedTorneoList'];

// Interfaz para las props del componente
interface GoleadoresListServerProps {
    torneo_id?: number;
    equipo_id?: number;
    limit?: number;
    showTitle?: boolean;
    searchQuery?: string;
}

// Tipo extendido para estadísticas de goleadores
interface GoleadorEstadistica {
    id: number;
    jugador_nombre: string;
    equipo_nombre: string;
    total_goles: number;
    promedio_goles: number;
    posicion: number;
    foto?: string | null;
}

interface GoleadoresResult {
    goleadores: GoleadorEstadistica[];
    total: number;
    metadatos?: {
        torneo_id: number;
        actualizado: string;
    };
}

// Función para normalizar datos de goleador desde la respuesta de la API
function normalizarGoleadorDesdeApi(goleadorApi: Record<string, unknown>, index: number): GoleadorEstadistica {
    console.log('🔍 Datos del goleador desde API:', goleadorApi);

    // Helper function para acceder a propiedades de objetos anidados de forma segura
    const getNestedProperty = (obj: unknown, property: string): unknown => {
        if (obj && typeof obj === 'object') {
            return (obj as Record<string, unknown>)[property];
        }
        return undefined;
    };

    // Intentar diferentes posibles nombres de campos para el jugador
    const posiblesNombresJugador = [
        goleadorApi.jugador_nombre,
        goleadorApi.nombre_completo,
        goleadorApi.nombre,
        goleadorApi.jugador,
        goleadorApi.player_name,
        // Si hay un objeto jugador anidado
        getNestedProperty(goleadorApi.jugador, 'nombre_completo'),
        getNestedProperty(goleadorApi.jugador, 'nombre'),
    ];

    const jugadorNombre = posiblesNombresJugador.find(nombre =>
        typeof nombre === 'string' && nombre.trim().length > 0
    ) as string || `Jugador ${index + 1}`;

    // Intentar diferentes posibles nombres de campos para el equipo
    const posiblesNombresEquipo = [
        goleadorApi.equipo_nombre,
        goleadorApi.equipo,
        goleadorApi.team_name,
        // Si hay un objeto equipo anidado
        getNestedProperty(goleadorApi.equipo, 'nombre'),
    ];

    const equipoNombre = posiblesNombresEquipo.find(nombre =>
        typeof nombre === 'string' && nombre.trim().length > 0
    ) as string || 'Equipo';

    // Intentar diferentes posibles nombres de campos para los goles
    const posiblesGoles = [
        goleadorApi.total_goles,
        goleadorApi.goles,
        goleadorApi.goals,
        goleadorApi.total_goals,
    ];

    const totalGoles = posiblesGoles.find(goles =>
        typeof goles === 'number' && goles >= 0
    ) as number || 0;

    const promedioGoles = typeof goleadorApi.promedio_goles === 'number'
        ? goleadorApi.promedio_goles
        : totalGoles; // Si no hay promedio, usar el total como fallback

    const id = typeof goleadorApi.id === 'number' ? goleadorApi.id : index + 1;
    const foto = typeof goleadorApi.foto === 'string' ? goleadorApi.foto : null;

    console.log('✅ Goleador normalizado:', {
        id,
        jugador_nombre: jugadorNombre,
        equipo_nombre: equipoNombre,
        total_goles: totalGoles,
        promedio_goles: promedioGoles
    });

    return {
        id,
        jugador_nombre: jugadorNombre,
        equipo_nombre: equipoNombre,
        total_goles: totalGoles,
        promedio_goles: promedioGoles,
        foto,
        posicion: index + 1
    };
}

// Función principal para obtener datos de goleadores
async function obtenerGoleadores(params: {
    torneo_id?: number;
    equipo_id?: number;
    limit?: number;
    searchQuery?: string;
}): Promise<GoleadoresResult> {
    try {
        let torneoIdUsado = params.torneo_id;

        // Si no se proporcionó un ID de torneo, obtener el primero disponible
        if (!torneoIdUsado) {
            try {
                console.log('🔍 Buscando torneos activos...');
                const torneosData: PaginatedTorneoList = await serverApi.torneos.getActivos({ page: 1 });
                if (torneosData?.results && torneosData.results.length > 0) {
                    torneoIdUsado = torneosData.results[0].id;
                    console.log(`✅ Torneo encontrado: ID ${torneoIdUsado}`);
                }
            } catch (error) {
                console.warn('⚠️ Error al obtener torneos activos:', error);
                torneoIdUsado = 1;
            }
        }

        // Si aún no tenemos un ID, usar 1 como último recurso
        if (!torneoIdUsado) {
            torneoIdUsado = 1;
            console.log('⚠️ Usando ID de torneo por defecto: 1');
        }

        console.log(`🏆 Obteniendo goleadores para torneo ID: ${torneoIdUsado}`);

        // Intentar obtener jugadores destacados del torneo
        try {
            const data = await serverApi.torneos.getJugadoresDestacados(torneoIdUsado, {
                limite: params.limit || 50
            });

            console.log('📊 Respuesta completa de la API:', data);

            // Verificar si la respuesta tiene goleadores
            let goleadoresData: Record<string, unknown>[] = [];

            if (data && typeof data === 'object') {
                // Intentar diferentes estructuras posibles de la respuesta
                if ('goleadores' in data && Array.isArray(data.goleadores)) {
                    // Usar tipo correcto para JugadorDestacado[]
                    const jugadores = data.goleadores as JugadorDestacado[];
                    goleadoresData = jugadores as unknown as Record<string, unknown>[];
                    console.log('✅ Encontrados goleadores en data.goleadores');
                } else if (Array.isArray(data)) {
                    goleadoresData = data as Record<string, unknown>[];
                    console.log('✅ La respuesta es directamente un array');
                } else if ('results' in data && Array.isArray(data.results)) {
                    goleadoresData = (data as { results: Record<string, unknown>[] }).results;
                    console.log('✅ Encontrados goleadores en data.results');
                } else {
                    console.log('🔍 Estructura de datos no reconocida, intentando buscar arrays en las propiedades...');
                    // Buscar cualquier propiedad que sea un array
                    Object.entries(data).forEach(([key, value]) => {
                        if (Array.isArray(value) && value.length > 0) {
                            console.log(`📋 Encontrado array en: ${key}`, value);
                            if (goleadoresData.length === 0) { // Solo tomar el primero que encontremos
                                goleadoresData = value as Record<string, unknown>[];
                            }
                        }
                    });
                }
            }

            console.log(`📈 Total de goleadores encontrados: ${goleadoresData.length}`);

            if (goleadoresData.length > 0) {
                // Mostrar el primer elemento para debug
                console.log('🔍 Primer goleador (estructura):', goleadoresData[0]);

                let goleadores = goleadoresData.map((goleador: Record<string, unknown>, index: number): GoleadorEstadistica =>
                    normalizarGoleadorDesdeApi(goleador, index)
                );

                // Filtrar goleadores sin goles
                goleadores = goleadores.filter(g => g.total_goles > 0);

                // Ordenar por goles (descendente)
                goleadores.sort((a, b) => b.total_goles - a.total_goles);

                // Recalcular posiciones después del ordenamiento
                goleadores = goleadores.map((g, index) => ({ ...g, posicion: index + 1 }));

                // Aplicar filtros si es necesario
                if (params.searchQuery) {
                    const query = params.searchQuery.toLowerCase();
                    goleadores = goleadores.filter(g =>
                        g.jugador_nombre.toLowerCase().includes(query) ||
                        g.equipo_nombre.toLowerCase().includes(query)
                    );
                }

                if (params.limit && goleadores.length > params.limit) {
                    goleadores = goleadores.slice(0, params.limit);
                }

                console.log(`✅ Goleadores procesados exitosamente: ${goleadores.length}`);

                return {
                    goleadores,
                    total: goleadores.length,
                    metadatos: {
                        torneo_id: torneoIdUsado,
                        actualizado: new Date().toISOString()
                    }
                };
            } else {
                console.warn('⚠️ No se encontraron goleadores en la respuesta de la API');
            }
        } catch (error) {
            console.error('❌ Error al obtener goleadores de la API:', error);
        }
    } catch (error) {
        console.error('❌ Error general en obtenerGoleadores:', error);
    }

    // Retornar estructura vacía si no hay datos
    return {
        goleadores: [],
        total: 0
    };
}

// Componente para mostrar la posición
function PosicionBadge({ posicion }: { posicion: number }) {
    let bgColor = 'bg-neutral-100 dark:bg-neutral-700';
    let textColor = 'text-neutral-600 dark:text-neutral-400';
    let icon: React.ReactNode = null;

    if (posicion === 1) {
        bgColor = 'bg-goal-gold/20';
        textColor = 'text-goal-gold';
        icon = <Trophy className="w-4 h-4" />;
    } else if (posicion === 2) {
        bgColor = 'bg-neutral-300/20';
        textColor = 'text-gray-300';
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

// Componente individual de goleador para vista móvil
function GoleadorCard({ goleador, showRanking = true }: {
    goleador: GoleadorEstadistica;
    showRanking?: boolean;
}) {
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 sm:p-4 shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md hover:border-goal-gold/50 transition-all duration-300">
            <div className="flex items-center gap-3">
                {/* Posición y foto */}
                <div className="flex items-center gap-2">
                    {showRanking && <PosicionBadge posicion={goleador.posicion} />}

                    {goleador.foto ? (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 relative">
                            <Image
                                src={goleador.foto}
                                alt={goleador.jugador_nombre}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                    ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-goal-blue/20 rounded-full flex items-center justify-center">
                            <span className="text-goal-blue font-bold text-base sm:text-lg">
                                {goleador.jugador_nombre.charAt(0)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Información del jugador */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 text-base sm:text-lg truncate">
                        {goleador.jugador_nombre}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm truncate">
                        {goleador.equipo_nombre}
                    </p>
                </div>

                {/* Estadísticas */}
                <div className="text-right flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-goal-gold" />
                    <span className="font-bold text-xl sm:text-2xl text-goal-gold">
                        {goleador.total_goles}
                    </span>
                    <span className="hidden sm:inline text-xs text-neutral-500 dark:text-neutral-400 ml-1">
                        ({goleador.promedio_goles.toFixed(1)})
                    </span>
                </div>
            </div>
        </div>
    );
}

// Componente de tabla para desktop (SIN columna de Partidos)
function GoleadoresTable({ goleadores }: { goleadores: GoleadorEstadistica[] }) {
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
                                        <Image
                                            src={goleador.foto}
                                            alt={goleador.jugador_nombre}
                                            width={40}
                                            height={40}
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
                                    href={`/equipos?search=${encodeURIComponent(goleador.equipo_nombre)}`}
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

// Componente del podio de los 3 primeros
function PodioGoleadores({ goleadores }: { goleadores: GoleadorEstadistica[] }) {
    if (goleadores.length < 3) return null;

    return (
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

    const { goleadores, total, metadatos } = await obtenerGoleadores({
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
                    <h2 className="text-2xl sm:text-3xl font-heading text-center mb-4 sm:mb-6">
                        Máximos Goleadores
                    </h2>
                )}

                <div className="text-center py-8 sm:py-12">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                        <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-400" />
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
                        className="inline-flex items-center bg-goal-blue hover:bg-goal-blue/90 text-white px-5 sm:px-6 py-2 rounded-lg transition-colors"
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
                <div className="text-center mb-5 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-heading mb-1.5 sm:mb-2">
                        Máximos Goleadores
                        {searchQuery && (
                            <span className="text-goal-gold"> - &#34;{searchQuery}&#34;</span>
                        )}
                    </h2>
                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
                        Ranking de los máximos anotadores del torneo
                    </p>
                </div>
            )}

            {/* Tabla para desktop (sin columna Partidos) */}
            <div className="hidden lg:block">
                <GoleadoresTable goleadores={goleadores} />
            </div>

            {/* Vista móvil con cards */}
            <div className="lg:hidden space-y-2.5 sm:space-y-3">
                {goleadores.map((goleador) => (
                    <GoleadorCard key={goleador.id} goleador={goleador} />
                ))}
            </div>

            {/* Información adicional */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-5 sm:mt-8 p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-xs sm:text-sm">
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2.5 sm:gap-4 text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>
                            {goleadores.length} goleador{goleadores.length !== 1 ? 'es' : ''}
                            {limit && total > goleadores.length && ` de ${total} total`}
                        </span>
                    </div>

                    {metadatos?.torneo_id && (
                        <div className="flex items-center gap-1 sm:gap-2">
                            <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Torneo actual</span>
                        </div>
                    )}
                </div>

                {limit && total > goleadores.length && (
                    <Link
                        href="/goleadores"
                        className="text-goal-blue dark:text-goal-gold hover:underline text-xs sm:text-sm mt-2 sm:mt-0"
                    >
                        Ver todos los goleadores →
                    </Link>
                )}
            </div>

            {/* Podio de los 3 primeros */}
            {!limit && <PodioGoleadores goleadores={goleadores} />}

            {/* Enlaces relacionados */}
            <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-2.5 sm:gap-4 text-xs sm:text-sm">
                <Link
                    href="/tabla"
                    className="flex items-center gap-1 sm:gap-2 text-goal-blue dark:text-goal-gold hover:underline"
                >
                    <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                    Tabla de posiciones
                </Link>
                <Link
                    href="/partidos"
                    className="flex items-center gap-1 sm:gap-2 text-goal-orange hover:underline"
                >
                    <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                    Ver partidos
                </Link>
                <Link
                    href="/equipos"
                    className="flex items-center gap-1 sm:gap-2 text-goal-blue dark:text-goal-gold hover:underline"
                >
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    Ver equipos
                </Link>
            </div>
        </div>
    );
}