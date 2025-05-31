// src/components/data/TablaList.server.tsx - CÓDIGO COMPLETO ACTUALIZADO
import Link from 'next/link';
import { Trophy, TrendingUp, TrendingDown, Minus, AlertCircle, Target, Medal } from 'lucide-react';
import type { components } from '@/types/api';
import * as Sentry from '@sentry/nextjs';

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

// Datos de ejemplo para la tabla de posiciones (agrupados)
const TABLA_EJEMPLO = [
    {
        posicion: 1,
        equipo: { id: 1, nombre: "Liverpool", logo: null },
        puntos: 21, partidos_jugados: 7, partidos_ganados: 7, partidos_empatados: 0, partidos_perdidos: 0,
        goles_favor: 45, goles_contra: 28, diferencia_goles: 17,
        tendencia: "up", grupo: "A"
    },
    {
        posicion: 2,
        equipo: { id: 2, nombre: "Talleres M.A", logo: null },
        puntos: 18, partidos_jugados: 7, partidos_ganados: 6, partidos_empatados: 0, partidos_perdidos: 1,
        goles_favor: 38, goles_contra: 22, diferencia_goles: 16,
        tendencia: "up", grupo: "A"
    },
    {
        posicion: 1,
        equipo: { id: 3, nombre: "Real Madrid", logo: null },
        puntos: 15, partidos_jugados: 7, partidos_ganados: 5, partidos_empatados: 0, partidos_perdidos: 2,
        goles_favor: 32, goles_contra: 18, diferencia_goles: 14,
        tendencia: "stable", grupo: "B"
    },
    {
        posicion: 2,
        equipo: { id: 4, nombre: "Barcelona", logo: null },
        puntos: 12, partidos_jugados: 7, partidos_ganados: 4, partidos_empatados: 0, partidos_perdidos: 3,
        goles_favor: 28, goles_contra: 25, diferencia_goles: 3,
        tendencia: "down", grupo: "B"
    }
];

// Función para obtener datos (con fallback a datos de ejemplo)
async function obtenerTablaPosiciones(params: any) {
    try {
        // Agregar breadcrumb para seguimiento en Sentry
        Sentry.addBreadcrumb({
            category: 'tabla_posiciones',
            message: `Obteniendo tabla de posiciones para torneo ID: ${params.torneoId || 'no especificado'}`,
            level: 'info',
            data: { torneoId: params.torneoId, timestamp: new Date().toISOString() }
        });

        // Intentar importar el API dinámicamente
        const { serverApi } = await import('@/lib/api/server');

        let torneoIdUsado = params.torneoId;
        
        // Si no se proporcionó un ID de torneo, intentamos obtener el primero de la lista de torneos
        if (!torneoIdUsado) {
            try {
                console.log('🔍 Buscando torneos disponibles...');
                Sentry.addBreadcrumb({
                    category: 'data',
                    message: 'Buscando torneos disponibles',
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
                    console.log(`✅ Torneo encontrado: "${data.results[0].nombre}" con ID: ${torneoIdUsado}`);
                    Sentry.addBreadcrumb({
                        category: 'data',
                        message: `Torneo encontrado: ${data.results[0].nombre} (ID: ${torneoIdUsado})`,
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
                        message: 'No se encontraron torneos en los resultados',
                        level: 'warning'
                    });
                }
            } catch (error) {
                // Capturar el error al obtener torneos
                Sentry.captureException(error, {
                    tags: { component: 'TablaList', operation: 'getTorneos' }
                });
                
                console.error('❌ Error al obtener torneos:', error);
                
                // Fallback a ID 1 en caso de error
                torneoIdUsado = 1;
                console.log('⚠️ Usando ID de torneo por defecto (1) debido a error');
                Sentry.addBreadcrumb({
                    category: 'fallback',
                    message: 'Usando ID de torneo por defecto (1) debido a error',
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
                message: 'No se encontraron torneos, usando ID por defecto: 1',
                level: 'warning'
            });
        }
        
        console.log(`🏆 Usando torneoId: ${torneoIdUsado}`);
        Sentry.setTag('torneoId', String(torneoIdUsado));

        // Obtener tabla de posiciones con el ID obtenido
        if (typeof serverApi?.torneos?.getTablaPosiciones === 'function') {
            try {
                const data = await serverApi.torneos.getTablaPosiciones(torneoIdUsado, {
                    grupo: params.grupo,
                    actualizar: params.actualizar
                });

                // Verificar si tenemos datos válidos
                if (data && data.grupos) {
                    console.log('✅ Datos recibidos de la API con estructura válida');
                    Sentry.addBreadcrumb({
                        category: 'data',
                        message: 'Datos de tabla de posiciones recibidos correctamente',
                        level: 'info',
                        data: {
                            grupos: Object.keys(data.grupos),
                            totalEquipos: data.total_equipos
                        }
                    });
                    
                    const tablasPorGrupo: { [key: string]: any[] } = {};
                    
                    // Procesar los datos según la estructura que devuelve la API
                    Object.entries(data.grupos).forEach(([grupo, equipos]) => {
                        if (!Array.isArray(equipos)) {
                            console.error('❌ Datos inválidos para el grupo', grupo, equipos);
                            return;
                        }
                        
                        console.log(`📊 Procesando grupo ${grupo} con ${(equipos as any[]).length} equipos`);
                        
                        tablasPorGrupo[grupo] = equipos.map((equipo: any, index: number) => ({
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
                            tarjetas_amarillas: equipo.tarjetas_amarillas,
                            tarjetas_rojas: equipo.tarjetas_rojas,
                            tendencia: index < 3 ? "up" : index > 6 ? "down" : "stable",
                            grupo: grupo.toUpperCase()
                        }));
                    });

                    // Si se especificó un grupo, filtrar solo ese grupo
                    if (params.grupo) {
                        const grupoFiltrado = params.grupo.toUpperCase();
                        return {
                            tablasPorGrupo: {
                                [grupoFiltrado]: tablasPorGrupo[grupoFiltrado] || []
                            },
                            esEjemplo: false,
                            grupo: grupoFiltrado,
                            metadatos: {
                                torneo_id: data.torneo_id,
                                tiene_fase_grupos: data.tiene_fase_grupos,
                                total_equipos: data.total_equipos,
                                equipos_clasifican_por_grupo: data.equipos_clasifican_por_grupo
                            }
                        };
                    }

                    // Devolver todos los grupos
                    return {
                        tablasPorGrupo,
                        esEjemplo: false,
                        metadatos: {
                            torneo_id: data.torneo_id,
                            tiene_fase_grupos: data.tiene_fase_grupos,
                            total_equipos: data.total_equipos,
                            equipos_clasifican_por_grupo: data.equipos_clasifican_por_grupo
                        }
                    };
                } else {
                    console.warn('⚠️ La API devolvió datos con formato incorrecto');
                    Sentry.captureMessage('La API devolvió datos con formato incorrecto para tabla de posiciones', 'warning');
                }
            } catch (error) {
                // Capturar la excepción para Sentry
                Sentry.captureException(error, {
                    tags: { 
                        component: 'TablaList', 
                        operation: 'getTablaPosiciones',
                        torneoId: String(torneoIdUsado)
                    }
                });
                
                console.error('❌ Error al obtener tabla de posiciones:', error);
                
                // Notificar en Sentry que estamos usando datos de ejemplo
                Sentry.captureMessage('Usando datos de ejemplo para tabla de posiciones debido a un error', {
                    level: 'warning' as SeverityLevel,
                    tags: { 
                        component: 'TablaList', 
                        issue: 'fallback_to_example_data'
                    },
                    extra: { torneoId: torneoIdUsado }
                });
                
                // Devolver datos de ejemplo como fallback
                return getFallbackData(params);
            }
        } else {
            const error = new Error('La función getTablaPosiciones no está disponible en serverApi.torneos');
            console.error('❌', error.message);
            Sentry.captureException(error, {
                tags: { component: 'TablaList', operation: 'checkApiAvailable' }
            });
        }
    } catch (error) {
        // Capturar la excepción para Sentry
        Sentry.captureException(error, {
            tags: { component: 'TablaList', operation: 'general' }
        });
        
        console.error('❌ Error general en obtenerTablaPosiciones:', error);
        
        // Notificar en Sentry que estamos usando datos de ejemplo
        Sentry.captureMessage('Usando datos de ejemplo para tabla de posiciones debido a un error', {
            level: 'warning' as SeverityLevel,
            tags: { 
                component: 'TablaList', 
                issue: 'fallback_to_example_data'
            }
        });
        
        // Devolver datos de ejemplo como fallback
        return getFallbackData(params);
    }

    // Si llegamos aquí, usar datos de ejemplo como fallback
    return getFallbackData(params);
}

// Función auxiliar para obtener datos de ejemplo como fallback
function getFallbackData(params: any) {
    console.warn('⚠️ Usando datos de ejemplo como fallback');
    
    // Reportar a Sentry el uso de fallback como evento
    Sentry.captureMessage('Usando datos de ejemplo como fallback para tabla de posiciones', 'warning');
    
    const tablaEjemplo = [...TABLA_EJEMPLO];
    const tablasPorGrupo: { [key: string]: any[] } = {};

    // Agrupar datos de ejemplo
    tablaEjemplo.forEach(equipo => {
        const grupo = equipo.grupo;
        if (!tablasPorGrupo[grupo]) {
            tablasPorGrupo[grupo] = [];
        }
        tablasPorGrupo[grupo].push(equipo);
    });

    // Aplicar filtro de grupo si se especificó
    if (params.grupo) {
        const grupoFiltrado = params.grupo.toUpperCase();
        return {
            tablasPorGrupo: {
                [grupoFiltrado]: tablasPorGrupo[grupoFiltrado] || []
            },
            esEjemplo: true,
            grupo: grupoFiltrado
        };
    }

    return {
        tablasPorGrupo,
        esEjemplo: true
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

    // Destacar posiciones especiales
    if (posicion === 1) {
        bgColor = 'bg-amber-100 dark:bg-amber-900';
        textColor = 'text-amber-800 dark:text-amber-200';
        icon = <Trophy className="w-3 h-3 text-amber-500" />;
    } else if (posicion === 2) {
        bgColor = 'bg-zinc-100 dark:bg-zinc-800';
        textColor = 'text-zinc-700 dark:text-zinc-300';
        icon = <Medal className="w-3 h-3 text-zinc-500" />;
    } else if (posicion === 3) {
        bgColor = 'bg-amber-50 dark:bg-amber-950';
        textColor = 'text-amber-700 dark:text-amber-300';
        icon = <Target className="w-3 h-3 text-amber-400" />;
    }

    return (
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${bgColor}`}>
            <div className="relative">
                <span className={`text-sm font-semibold ${textColor}`}>{posicion}</span>
                {icon && (
                    <span className="absolute -top-1.5 -right-1.5">
                        {icon}
                    </span>
                )}
            </div>
        </div>
    );
}

// Componente individual de equipo en la tabla
function EquipoTablaRow({ equipo, posicion }: { equipo: any; posicion: number }) {
    return (
        <tr className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
            <td className="p-3 text-center">
                <div className="flex justify-center">
                    <PosicionIndicator posicion={posicion} />
                </div>
            </td>
            <td className="p-3">
                <Link
                    href={`/equipos/${equipo.equipo.id}`}
                    className="flex items-center gap-2 font-medium text-neutral-800 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                    {equipo.equipo.logo ? (
                        <img
                            src={equipo.equipo.logo}
                            alt={equipo.equipo.nombre}
                            className="w-6 h-6 object-contain"
                        />
                    ) : (
                        <div className="w-6 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center text-xs text-neutral-600 dark:text-neutral-400">
                            {equipo.equipo.nombre.charAt(0)}
                        </div>
                    )}
                    {equipo.equipo.nombre}
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
                <span className={`font-medium ${equipo.diferencia_goles > 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : equipo.diferencia_goles < 0 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-neutral-600 dark:text-neutral-400'}`}>
                    {equipo.diferencia_goles > 0 ? '+' : ''}{equipo.diferencia_goles}
                </span>
            </td>
            <td className="p-3 text-center">
                <div className="flex justify-center">
                    <TendenciaIcon tendencia={equipo.tendencia} />
                </div>
            </td>
        </tr>
    );
}

// Componente para cada grupo individual
function GrupoTabla({
    grupo,
    equipos,
    mostrarTituloGrupo
}: {
    grupo: string;
    equipos: any[];
    mostrarTituloGrupo: boolean;
}) {
    return (
        <div className="overflow-hidden bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
            {mostrarTituloGrupo && (
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                        Grupo {grupo}
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
                                    key={`${equipo.equipo.id}-${index}`} 
                                    equipo={equipo} 
                                    posicion={equipo.posicion || index + 1} 
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

// Componente de aviso para datos de ejemplo
function AvisoEjemplo() {
    return (
        <div className="p-4 mb-6 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
            <div className="flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5">
                <AlertCircle size={20} />
            </div>
            <div>
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Datos de ejemplo
                </h3>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                    Esta información es solo ilustrativa y no representa datos reales actualizados.
                </p>
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
    console.log('Iniciando TablaListServer con params:', { torneoId, categoria, grupo, actualizar });
    
    try {
        // Obtener datos de la tabla
        const tablaData = await obtenerTablaPosiciones({
            torneoId,
            categoria,
            grupo,
            actualizar
        });

        console.log('Datos obtenidos:', tablaData);

        const gruposOrdenados = Object.keys(tablaData.tablasPorGrupo || {}).sort();
        const tablaFiltrada = !!grupo;
        const mostrarTituloGrupo = gruposOrdenados.length > 1 || !tablaFiltrada;
        const esEjemplo = tablaData.esEjemplo || false;

        return (
            <div className="space-y-8">
                {showTitle && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                            Tabla de Posiciones
                            {grupo && <span className="ml-2 text-primary-600 dark:text-primary-400">Grupo {grupo.toUpperCase()}</span>}
                        </h2>
                        {!tablaFiltrada && gruposOrdenados.length > 1 && (
                            <div className="flex flex-wrap gap-2">
                                {gruposOrdenados.map(grupoKey => (
                                    <Link
                                        key={grupoKey}
                                        href={`/tabla?grupo=${grupoKey}`}
                                        className="px-3 py-1.5 text-sm font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-primary-100 dark:hover:bg-primary-900 text-neutral-700 dark:text-neutral-300 hover:text-primary-700 dark:hover:text-primary-300 rounded-lg transition"
                                    >
                                        Grupo {grupoKey}
                                    </Link>
                                ))}
                                <Link
                                    href="/tabla"
                                    className="px-3 py-1.5 text-sm font-medium bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg transition"
                                >
                                    Todos
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {esEjemplo && <AvisoEjemplo />}

                <div className="space-y-8">
                    {gruposOrdenados.length > 0 ? (
                        gruposOrdenados.map(grupoKey => (
                            <GrupoTabla
                                key={grupoKey}
                                grupo={grupoKey}
                                equipos={tablaData.tablasPorGrupo[grupoKey] || []}
                                mostrarTituloGrupo={mostrarTituloGrupo}
                            />
                        ))
                    ) : (
                        <div className="p-8 text-center text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                            No hay datos disponibles para mostrar
                        </div>
                    )}
                </div>

                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    <p>
                        <strong>Leyenda:</strong> PTS (Puntos), PJ (Partidos Jugados), PG (Partidos Ganados),
                        PE (Partidos Empatados), PP (Partidos Perdidos), GF (Goles a Favor),
                        GC (Goles en Contra), DIF (Diferencia de Goles)
                    </p>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error en TablaListServer:', error);
        return (
            <div className="p-8 text-center bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg">
                <h3 className="text-lg font-bold text-red-700 dark:text-red-300 mb-2">
                    Error al cargar la tabla
                </h3>
                <p className="text-red-600 dark:text-red-400">
                    No se pudieron cargar los datos. Por favor, inténtalo más tarde.
                </p>
            </div>
        );
    }
}