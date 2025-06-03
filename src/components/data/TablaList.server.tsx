// src/components/data/TablaList.server.tsx - MEJORADO CON TIPOS CORRECTOS
'use server';
import Link from 'next/link';
import { Trophy, TrendingUp, TrendingDown, Minus, AlertCircle,  } from 'lucide-react';
import { serverApi } from '@/lib/api/server';
import type { components } from '@/types/api';

// Usar los tipos correctos de la API
// type TablaPosiciones = components['schemas']['TablaPosiciones'];
type EstadisticaEquipo = components['schemas']['EstadisticaEquipo'];

interface TablaListServerProps {
    torneoId?: number;
    grupo?: string;
    actualizar?: boolean;
    showTitle?: boolean;
}

// Función para obtener el primer torneo disponible si no se especifica uno
async function obtenerTorneoId(): Promise<number> {
    try {
        const torneosActivos = await serverApi.torneos.getActivos();
        if (Array.isArray(torneosActivos?.results) && torneosActivos.results.length > 0) {
            return torneosActivos.results[0].id;
        }

        // Si no hay torneos activos, buscar cualquier torneo
        const response = await fetch(`${process.env.API_URL}/torneos/`);
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data?.results) && data.results.length > 0) {
                return data.results[0].id;
            }
        }
    } catch (error) {
        console.error('Error obteniendo torneo ID:', error);
    }

    // Fallback al ID 1
    return 1;
}

// Tipo para la respuesta real de la API
interface TablaResponse {
    grupos?: Record<string, EstadisticaEquipo[]>;
    equipos?: EstadisticaEquipo[];
    torneo_id?: number;
    tiene_fase_grupos?: boolean;
    total_equipos?: number;
    grupo?: string;
}

// Tipo para la metadata de la tabla de posiciones
interface TablaPosicionesMetadata {
    tiene_fase_grupos?: boolean;
    total_equipos?: number;
    grupo?: string;
}

// Función principal para obtener datos de la tabla
async function obtenerTablaPosiciones(params: {
    torneoId?: number;
    grupo?: string;
    actualizar?: boolean;
}): Promise<{
    equipos: EstadisticaEquipo[];
    error?: string;
    torneoUsado: number;
    metadata?: TablaPosicionesMetadata;
}> {
    try {
        // Determinar el ID del torneo a usar
        const torneoId = params.torneoId || await obtenerTorneoId();

        console.log(`🏆 Obteniendo tabla de posiciones para torneo ID: ${torneoId}`);

        // Obtener tabla de posiciones usando el serverApi (que devuelve any)
        const response = await serverApi.torneos.getTablaPosiciones(torneoId, {
            grupo: params.grupo,
            actualizar: params.actualizar
        }) as TablaResponse;

        let equipos: EstadisticaEquipo[] = [];

        // Manejar diferentes estructuras de respuesta
        if (response.equipos && Array.isArray(response.equipos)) {
            // Estructura directa con array de equipos
            equipos = response.equipos;
        } else if (response.grupos) {
            // Estructura agrupada - combinar todos los grupos
            equipos = Object.values(response.grupos).flat();
        } else {
            console.warn('Estructura de respuesta inesperada:', response);
        }

        return {
            equipos,
            torneoUsado: torneoId,
            metadata: {
                tiene_fase_grupos: response.tiene_fase_grupos,
                total_equipos: response.total_equipos,
                grupo: params.grupo
            }
        };

    } catch (error) {
        console.error('Error al obtener tabla de posiciones:', error);

        const torneoId = params.torneoId || 1;
        return {
            equipos: [],
            error: error instanceof Error ? error.message : 'Error desconocido',
            torneoUsado: torneoId
        };
    }
}

// Componente para mostrar la tendencia (simplificado)
function TendenciaIcon({ posicion }: { posicion: number }) {
    if (posicion <= 3) {
        return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (posicion >= 8) {
        return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Minus className="w-4 h-4 text-neutral-400" />;
}

// Componente para el indicador de posición
function PosicionIndicator({ posicion }: { posicion: number }) {
    let bgColor = 'bg-neutral-100 dark:bg-neutral-700';
    let textColor = 'text-neutral-600 dark:text-neutral-400';
    // let icon = null;

    if (posicion === 1) {
        bgColor = 'bg-goal-gold/20';
        textColor = 'text-goal-gold';
        // icon = <Trophy className="w-3 h-3 text-goal-gold" />;
    } else if (posicion === 2) {
        bgColor = 'bg-neutral-300/20';
        textColor = 'text-neutral-400';
        // icon = <Medal className="w-3 h-3 text-neutral-500" />;
    } else if (posicion === 3) {
        bgColor = 'bg-orange-300/20';
        textColor = 'text-orange-600';
        // icon = <Target className="w-3 h-3 text-orange-500" />;
    } else if (posicion <= 5) {
        bgColor = 'bg-green-100 dark:bg-green-900/30';
        textColor = 'text-green-600 dark:text-green-400';
    }

    return (
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${bgColor}`}>
            <div className="relative">
                <span className={`text-sm font-semibold ${textColor}`}>{posicion}</span>
                {/*{icon && (*/}
                {/*    <span className="absolute -top-1.5 -right-1.5">*/}
                {/*        {icon}*/}
                {/*    </span>*/}
                {/*)}*/}
            </div>
        </div>
    );
}

// Componente individual de fila en la tabla
function EquipoTablaRow({
                            equipo,
                            posicion
                        }: {
    equipo: EstadisticaEquipo;
    posicion: number;
}) {
    return (
        <tr className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
            <td className="p-3 text-center">
                <div className="flex justify-center">
                    <PosicionIndicator posicion={posicion} />
                </div>
            </td>

            <td className="p-3">
                <Link
                    href={`/equipos/${equipo.equipo}`}
                    className="flex items-center gap-2 font-medium text-neutral-800 dark:text-neutral-200 hover:text-goal-blue dark:hover:text-goal-gold transition-colors"
                >
                    <div className="w-6 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center text-xs text-neutral-600 dark:text-neutral-400">
                        {equipo.equipo_nombre.charAt(0)}
                    </div>
                    {equipo.equipo_nombre}
                </Link>
            </td>

            <td className="p-3 text-center font-bold text-neutral-800 dark:text-neutral-200">
                {equipo.puntos}
            </td>

            <td className="p-3 text-center text-neutral-600 dark:text-neutral-400">
                {equipo.partidos_jugados}
            </td>

            <td className="p-3 text-center text-green-600 dark:text-green-400">
                {equipo.partidos_ganados}
            </td>

            <td className="p-3 text-center text-blue-600 dark:text-blue-400">
                {equipo.partidos_empatados}
            </td>

            <td className="p-3 text-center text-red-600 dark:text-red-400">
                {equipo.partidos_perdidos}
            </td>

            <td className="p-3 text-center text-neutral-600 dark:text-neutral-400">
                {equipo.goles_favor}
            </td>

            <td className="p-3 text-center text-neutral-600 dark:text-neutral-400">
                {equipo.goles_contra}
            </td>

            <td className="p-3 text-center">
                <span className={`font-medium ${
                    equipo.diferencia_goles > 0
                        ? 'text-green-600 dark:text-green-400'
                        : equipo.diferencia_goles < 0
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-neutral-600 dark:text-neutral-400'
                }`}>
                    {equipo.diferencia_goles > 0 ? '+' : ''}{equipo.diferencia_goles}
                </span>
            </td>

            <td className="p-3 text-center">
                <div className="flex justify-center">
                    <TendenciaIcon posicion={posicion} />
                </div>
            </td>
        </tr>
    );
}

// Componente para la tabla de un grupo
function GrupoTabla({
                        equipos,
                        grupo,
                        mostrarTituloGrupo
                    }: {
    equipos: EstadisticaEquipo[];
    grupo?: string;
    mostrarTituloGrupo: boolean;
}) {
    return (
        <div className="overflow-hidden bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
            {mostrarTituloGrupo && grupo && (
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                        Grupo {grupo.toUpperCase()}
                    </h3>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                        <th className="p-3 text-center whitespace-nowrap">
                            <span className="sr-only">Posición</span>
                            <span aria-hidden="true">#</span>
                        </th>
                        <th className="p-3 text-left whitespace-nowrap">Equipo</th>
                        <th className="p-3 text-center whitespace-nowrap">
                            <abbr title="Puntos">PTS</abbr>
                        </th>
                        <th className="p-3 text-center whitespace-nowrap">
                            <abbr title="Partidos Jugados">PJ</abbr>
                        </th>
                        <th className="p-3 text-center whitespace-nowrap">
                            <abbr title="Partidos Ganados">PG</abbr>
                        </th>
                        <th className="p-3 text-center whitespace-nowrap">
                            <abbr title="Partidos Empatados">PE</abbr>
                        </th>
                        <th className="p-3 text-center whitespace-nowrap">
                            <abbr title="Partidos Perdidos">PP</abbr>
                        </th>
                        <th className="p-3 text-center whitespace-nowrap">
                            <abbr title="Goles a Favor">GF</abbr>
                        </th>
                        <th className="p-3 text-center whitespace-nowrap">
                            <abbr title="Goles en Contra">GC</abbr>
                        </th>
                        <th className="p-3 text-center whitespace-nowrap">
                            <abbr title="Diferencia de Goles">DIF</abbr>
                        </th>
                        <th className="p-3 text-center whitespace-nowrap">
                            <span className="sr-only">Tendencia</span>
                            <span aria-hidden="true">Forma</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {equipos.length > 0 ? (
                        equipos.map((equipo, index) => (
                            <EquipoTablaRow
                                key={`${equipo.equipo}-${index}`}
                                equipo={equipo}
                                posicion={index + 1}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={11} className="p-8 text-center text-neutral-500 dark:text-neutral-400">
                                No hay equipos en este grupo
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Componente de mensaje de error
function ErrorMessage({ message }: { message: string }) {
    return (
        <div className="p-6 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg">
            <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <div>
                    <h3 className="text-red-800 dark:text-red-200 font-medium">
                        Error al cargar la tabla
                    </h3>
                    <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
}

// Componente de estado vacío
function EstadoVacio() {
    return (
        <div className="p-8 text-center bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                No hay datos disponibles
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400">
                La tabla de posiciones estará disponible una vez que se jueguen los partidos.
            </p>
        </div>
    );
}

// Función para agrupar equipos por grupo
function agruparEquiposPorGrupo(equipos: EstadisticaEquipo[]): Record<string, EstadisticaEquipo[]> {
    return equipos.reduce((grupos, equipo) => {
        const grupo = equipo.grupo || 'GENERAL';
        if (!grupos[grupo]) {
            grupos[grupo] = [];
        }
        grupos[grupo].push(equipo);
        return grupos;
    }, {} as Record<string, EstadisticaEquipo[]>);
}

// Componente principal
export default async function TablaListServer({
                                                  torneoId,
                                                  grupo,
                                                  actualizar = false,
                                                  showTitle = true
                                              }: TablaListServerProps) {
    console.log('🏆 Iniciando TablaListServer con params:', { torneoId, grupo, actualizar });

    const { equipos, error, torneoUsado, metadata } = await obtenerTablaPosiciones({
        torneoId,
        grupo,
        actualizar
    });

    // Manejar error
    if (error) {
        return (
            <div className="space-y-6">
                {showTitle && (
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                        Tabla de Posiciones
                    </h2>
                )}
                <ErrorMessage message={error} />
            </div>
        );
    }

    // Verificar si tenemos equipos
    if (!equipos || equipos.length === 0) {
        return (
            <div className="space-y-6">
                {showTitle && (
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                        Tabla de Posiciones
                    </h2>
                )}
                <EstadoVacio />
            </div>
        );
    }

    // Agrupar equipos si hay grupos
    const equiposPorGrupo = agruparEquiposPorGrupo(equipos);
    const gruposOrdenados = Object.keys(equiposPorGrupo).sort();
    const hayMultiplesGrupos = gruposOrdenados.length > 1;
    const grupoFiltrado = grupo?.toUpperCase();

    // Si se especificó un grupo, filtrar solo ese grupo
    if (grupoFiltrado && equiposPorGrupo[grupoFiltrado]) {
        return (
            <div className="space-y-6">
                {showTitle && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                            Tabla de Posiciones - Grupo {grupoFiltrado}
                        </h2>

                    </div>
                )}

                <GrupoTabla
                    equipos={equiposPorGrupo[grupoFiltrado]}
                    grupo={grupoFiltrado}
                    mostrarTituloGrupo={false}
                />

                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    <p>
                        <strong>Leyenda:</strong> PTS (Puntos), PJ (Partidos Jugados), PG (Partidos Ganados),
                        PE (Partidos Empatados), PP (Partidos Perdidos), GF (Goles a Favor),
                        GC (Goles en Contra), DIF (Diferencia de Goles)
                    </p>
                </div>
            </div>
        );
    }

    // Mostrar todos los grupos
    return (
        <div className="space-y-8">
            {showTitle && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                        Tabla de Posiciones
                    </h2>
                    {hayMultiplesGrupos && (
                        <div className="flex flex-wrap gap-2">
                            {gruposOrdenados.map(grupoKey => (
                                <Link
                                    key={grupoKey}
                                    href={`/tabla?grupo=${grupoKey.toLowerCase()}`}
                                    className="px-3 py-1.5 text-sm font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-goal-blue/10 dark:hover:bg-goal-blue/20 text-neutral-700 dark:text-neutral-300 hover:text-goal-blue dark:hover:text-goal-blue rounded-lg transition"
                                >
                                    Grupo {grupoKey}
                                </Link>
                            ))}
                            <Link
                                href="/tabla?actualizar=true"
                                className="px-3 py-1.5 text-sm font-medium bg-goal-orange/10 text-goal-orange hover:bg-goal-orange/20 rounded-lg transition"
                            >
                                Actualizar
                            </Link>
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-8">
                {gruposOrdenados.map(grupoKey => (
                    <GrupoTabla
                        key={grupoKey}
                        equipos={equiposPorGrupo[grupoKey]}
                        grupo={grupoKey !== 'GENERAL' ? grupoKey : undefined}
                        mostrarTituloGrupo={hayMultiplesGrupos}
                    />
                ))}
            </div>

            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                <p>
                    <strong>Leyenda:</strong> PTS (Puntos), PJ (Partidos Jugados), PG (Partidos Ganados),
                    PE (Partidos Empatados), PP (Partidos Perdidos), GF (Goles a Favor),
                    GC (Goles en Contra), DIF (Diferencia de Goles)
                </p>
                <p className="mt-2 text-xs">
                    Última actualización: {new Date().toLocaleString('es-ES')} - Torneo ID: {torneoUsado}
                    {metadata && ` - ${metadata.total_equipos} equipos`}
                </p>
            </div>
        </div>
    );
}