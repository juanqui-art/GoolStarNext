// src/components/data/PartidosList.server.tsx
import Link from 'next/link';
import { CalendarDays, Clock, MapPin, Trophy, AlertCircle } from 'lucide-react';
import { components } from '@/types/api';

type Partido = components['schemas']['Partido'];

interface PartidosListServerProps {
    equipo_id?: number;
    jornada_id?: number;
    completado?: boolean;
    limit?: number;
    showTitle?: boolean;
    searchQuery?: string;
    ordenamiento?: 'fecha' | '-fecha' | 'jornada';
}

// Componente para mostrar el resultado del partido
function ResultadoPartido({ partido }: { partido: Partido }) {
    if (!partido.completado) {
        return (
            <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-goal-orange" />
                <span className="text-neutral-600 dark:text-neutral-400">
          {new Date(partido.fecha).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
          })}
        </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-700 px-3 py-1 rounded-full">
                <span className="font-bold text-lg">{partido.goles_equipo_1}</span>
                <span className="text-neutral-400">-</span>
                <span className="font-bold text-lg">{partido.goles_equipo_2}</span>
            </div>

            {/* Indicador de victoria por default */}
            {partido.victoria_por_default && (
                <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded text-xs">
                    W.O.
                </div>
            )}
        </div>
    );
}

// Componente individual de partido
function PartidoCard({ partido }: { partido: Partido }) {
    const fechaPartido = new Date(partido.fecha);
    const esHoy = fechaPartido.toDateString() === new Date().toDateString();
    const esPasado = fechaPartido < new Date();

    return (
        <Link
            href={`/partidos/${partido.id}`}
            className="block bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md hover:border-goal-gold/50 transition-all duration-300"
        >
            <div className="space-y-4">
                {/* Header con fecha y jornada */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <CalendarDays className="w-4 h-4" />
                        <span>
              {fechaPartido.toLocaleDateString('es-ES', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
              })}
            </span>
                        {esHoy && (
                            <span className="bg-goal-orange text-white px-2 py-1 rounded-full text-xs font-medium">
                HOY
              </span>
                        )}
                    </div>

                    {partido.jornada_nombre && (
                        <span className="text-sm bg-goal-blue/10 text-goal-blue px-2 py-1 rounded-full">
              {partido.jornada_nombre}
            </span>
                    )}
                </div>

                {/* Equipos enfrentados */}
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                {partido.equipo_1_nombre}
              </span>
                            {partido.completado && (
                                <span className="font-bold text-xl">
                  {partido.goles_equipo_1}
                </span>
                            )}
                        </div>

                        <div className="w-full h-px bg-neutral-200 dark:bg-neutral-700 my-2"></div>

                        <div className="flex items-center justify-between">
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                {partido.equipo_2_nombre}
              </span>
                            {partido.completado && (
                                <span className="font-bold text-xl">
                  {partido.goles_equipo_2}
                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Estado y resultado */}
                <div className="flex items-center justify-between">
                    <ResultadoPartido partido={partido} />

                    <div className="flex items-center gap-2">
                        {/* Cancha */}
                        {partido.cancha && (
                            <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                                <MapPin className="w-3 h-3" />
                                <span>{partido.cancha}</span>
                            </div>
                        )}

                        {/* Estado del partido */}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            partido.completado
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                : esPasado
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        }`}>
              {partido.completado ? 'Finalizado' : esPasado ? 'Pendiente' : 'Programado'}
            </span>
                    </div>
                </div>
            </div>
        </Link>
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
                        La conexión con la API está en desarrollo. Estos son partidos de ejemplo para demostrar la funcionalidad.
                    </p>
                </div>
            </div>
        </div>
    );
}

// Define interfaces for the function parameters and return type
interface ObtenerPartidosParams {
    equipo_id?: number;
    jornada_id?: number;
    completado?: boolean;
    ordenamiento?: 'fecha' | '-fecha' | 'jornada';
    searchQuery?: string;
    limit?: number;
}

interface ObtenerPartidosResult {
    partidos: Partido[];
    esEjemplo: boolean;
    total: number;
    error?: string;
}

// Función para obtener datos (con fallback a mensaje de error)
async function obtenerPartidos(params: ObtenerPartidosParams): Promise<ObtenerPartidosResult> {
    try {
        // Intentar importar el API dinámicamente
        const { serverApi } = await import('@/lib/api/server');

        if (serverApi?.partidos?.getAll) {
            const data = await serverApi.partidos.getAll({
                equipo_id: params.equipo_id,
                jornada_id: params.jornada_id,
                completado: params.completado,
                ordering: params.ordenamiento,
                search: params.searchQuery,
                all_pages: !params.limit,
                page_size: params.limit || 20
            });

            if (data?.results) {
                return {
                    partidos: params.limit ? data.results.slice(0, params.limit) : data.results,
                    esEjemplo: false,
                    total: data.count || data.results.length
                };
            }
        }
    } catch (error) {
        console.warn('No se pudo conectar con la API de partidos:', error);
    }

    // Fallback a un array vacío en caso de error
    return {
        partidos: [],
        esEjemplo: false,
        total: 0,
        error: 'No se pudieron cargar los partidos. Por favor, intenta de nuevo más tarde.'
    };
}

// Componente principal
export default async function PartidosListServer({
                                                     equipo_id,
                                                     jornada_id,
                                                     completado,
                                                     limit,
                                                     showTitle = true,
                                                     searchQuery,
                                                     ordenamiento = '-fecha'
                                                 }: PartidosListServerProps) {

    const { partidos, esEjemplo, total, error } = await obtenerPartidos({
        equipo_id,
        jornada_id,
        completado,
        limit,
        searchQuery,
        ordenamiento
    });

    // Estado vacío
    if (partidos.length === 0) {
        return (
            <div className="w-full max-w-6xl mx-auto">
                {showTitle && (
                    <h2 className="text-3xl font-heading text-center mb-6">
                        Partidos
                    </h2>
                )}

                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        No hay partidos
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                        {searchQuery
                            ? `No se encontraron partidos que coincidan con "${searchQuery}"`
                            : completado === true
                                ? 'No hay partidos finalizados aún.'
                                : completado === false
                                    ? 'No hay partidos programados.'
                                    : 'No hay partidos registrados actualmente.'
                        }
                        {error && (
                            <p className="text-red-500 dark:text-red-400 mt-2">
                                {error}
                            </p>
                        )}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto">
            {showTitle && (
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-heading mb-2">
                        Partidos
                    </h2>
                    {completado === true && (
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Resultados de partidos finalizados
                        </p>
                    )}
                    {completado === false && (
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Próximos partidos programados
                        </p>
                    )}
                </div>
            )}

            {/* Aviso si son datos de ejemplo */}
            {esEjemplo && <AvisoEjemplo />}

            {/* Grid de partidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {partidos.map((partido) => (
                    <PartidoCard key={partido.id} partido={partido} />
                ))}
            </div>

            {/* Información adicional */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 text-sm text-neutral-500 dark:text-neutral-400">
                <p>
                    {partidos.length} partido{partidos.length !== 1 ? 's' : ''}
                    {limit && total > partidos.length && ` de ${total} total`}
                    {equipo_id ? ' del equipo' : jornada_id ? ' de la jornada' : ''}
                    {esEjemplo && ' (datos de ejemplo)'}
                </p>

                {limit && total > partidos.length && (
                    <Link
                        href="/partidos"
                        className="text-goal-blue dark:text-goal-gold hover:underline mt-2 sm:mt-0"
                    >
                        Ver todos los partidos →
                    </Link>
                )}
            </div>
        </div>
    );
}