// src/app/partidos/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, Trophy, AlertTriangle, AlertCircle } from 'lucide-react';

interface PartidoDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Datos de ejemplo para el partido
const PARTIDO_EJEMPLO = {
    id: 1,
    equipo_1: { id: 1, nombre: "Liverpool" },
    equipo_2: { id: 2, nombre: "Talleres M.A" },
    fecha: "2025-01-15T18:30:00Z",
    completado: true,
    goles_equipo_1: 3,
    goles_equipo_2: 2,
    jornada: { id: 1, nombre: "Jornada 1", numero: 1 },
    cancha: "Cancha Principal",
    acta_firmada: true,
    observaciones: "Partido muy reñido con buen nivel técnico",
    goles: [
        {
            id: 1,
            jugador_nombre: "Carlos Rodríguez",
            minuto: 15,
            autogol: false
        },
        {
            id: 2,
            jugador_nombre: "Miguel Santos",
            minuto: 28,
            autogol: false
        },
        {
            id: 3,
            jugador_nombre: "Diego Pérez",
            minuto: 45,
            autogol: false
        }
    ],
    tarjetas: [
        {
            id: 1,
            jugador_nombre: "Juan López",
            tipo: "AMARILLA",
            minuto: 35,
            motivo: "Juego brusco"
        },
        {
            id: 2,
            jugador_nombre: "Pedro García",
            tipo: "ROJA",
            minuto: 67,
            motivo: "Doble amarilla"
        }
    ]
};

// Metadata estática
export async function generateMetadata({ params }: PartidoDetailPageProps): Promise<Metadata> {
    try {
        const { id } = await params;

        return {
            title: `Partido ${id} | GoolStar`,
            description: `Detalles del partido de fútbol indoor - GoolStar`,
            openGraph: {
                title: `Partido | GoolStar`,
                description: `Partido de fútbol indoor en GoolStar`,
                images: ['/images/partido-og.jpg'],
            },
        };
    } catch {
        return {
            title: 'Partido | GoolStar',
            description: 'Detalles del partido',
        };
    }
}

// Componente para mostrar goles
function GolesPartido({ goles }: { goles: any[] }) {
    if (!goles || goles.length === 0) {
        return (
            <div className="text-center py-6 text-neutral-500 dark:text-neutral-400">
                <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No hay goles registrados</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {goles.map((gol) => (
                <div key={gol.id} className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                    <div className="w-8 h-8 bg-goal-gold/20 rounded-full flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-goal-gold" />
                    </div>
                    <div className="flex-1">
                        <div className="font-medium text-neutral-800 dark:text-neutral-200">
                            {gol.jugador_nombre}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {gol.minuto ? `Minuto ${gol.minuto}` : 'Sin minuto registrado'}
                            {gol.autogol && (
                                <span className="ml-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded text-xs">
                  Autogol
                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Componente para mostrar tarjetas
function TarjetasPartido({ tarjetas }: { tarjetas: any[] }) {
    if (!tarjetas || tarjetas.length === 0) {
        return (
            <div className="text-center py-6 text-neutral-500 dark:text-neutral-400">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No hay tarjetas registradas</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tarjetas.map((tarjeta) => (
                <div key={tarjeta.id} className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tarjeta.tipo === 'AMARILLA'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30'
                            : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                        <div className={`w-3 h-4 rounded-sm ${
                            tarjeta.tipo === 'AMARILLA' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                    </div>
                    <div className="flex-1">
                        <div className="font-medium text-neutral-800 dark:text-neutral-200">
                            {tarjeta.jugador_nombre}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            Tarjeta {tarjeta.tipo.toLowerCase()}
                            {tarjeta.minuto && ` - Minuto ${tarjeta.minuto}`}
                            {tarjeta.motivo && ` - ${tarjeta.motivo}`}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Componente principal de información del partido
function PartidoInfo({ partido }: { partido: any }) {
    const fechaPartido = new Date(partido.fecha);
    const esHoy = fechaPartido.toDateString() === new Date().toDateString();
    const esPasado = fechaPartido < new Date();

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden">
            {/* Header del partido */}
            <div className={`p-6 text-white ${
                partido.completado
                    ? 'bg-gradient-to-r from-green-600 to-green-700'
                    : esPasado
                        ? 'bg-gradient-to-r from-red-600 to-red-700'
                        : 'bg-gradient-to-r from-goal-blue to-goal-orange'
            }`}>
                <div className="text-center">
                    {/* Estado del partido */}
                    <div className="mb-4">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                partido.completado
                    ? 'bg-white/20'
                    : esHoy
                        ? 'bg-goal-gold text-goal-black'
                        : 'bg-white/20'
            }`}>
              {partido.completado ? 'Finalizado' : esHoy ? 'HOY' : esPasado ? 'Pendiente' : 'Programado'}
            </span>
                    </div>

                    {/* Equipos y resultado */}
                    <div className="grid grid-cols-3 items-center gap-4 mb-4">
                        {/* Equipo 1 */}
                        <div className="text-center">
                            <h2 className="text-xl font-bold mb-2">{partido.equipo_1.nombre}</h2>
                            {partido.completado && (
                                <div className="text-4xl font-bold">{partido.goles_equipo_1}</div>
                            )}
                        </div>

                        {/* VS o resultado */}
                        <div className="text-center">
                            {partido.completado ? (
                                <div className="text-2xl font-bold">-</div>
                            ) : (
                                <div className="text-lg font-medium">VS</div>
                            )}
                        </div>

                        {/* Equipo 2 */}
                        <div className="text-center">
                            <h2 className="text-xl font-bold mb-2">{partido.equipo_2.nombre}</h2>
                            {partido.completado && (
                                <div className="text-4xl font-bold">{partido.goles_equipo_2}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Información del partido */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Información básica */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
                            Información del Partido
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-goal-blue" />
                                <div>
                                    <div className="font-medium">
                                        {fechaPartido.toLocaleDateString('es-ES', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                        {fechaPartido.toLocaleTimeString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>

                            {partido.cancha && (
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-goal-orange" />
                                    <div>
                                        <div className="font-medium">Cancha</div>
                                        <div className="text-sm text-neutral-600 dark:text-neutral-400">{partido.cancha}</div>
                                    </div>
                                </div>
                            )}

                            {partido.jornada && (
                                <div className="flex items-center gap-3">
                                    <Trophy className="w-5 h-5 text-goal-gold" />
                                    <div>
                                        <div className="font-medium">{partido.jornada.nombre}</div>
                                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                            Jornada {partido.jornada.numero}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
                            Estado del Partido
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">Acta firmada:</span>
                                <span className={`font-medium ${
                                    partido.acta_firmada ? 'text-green-600' : 'text-red-600'
                                }`}>
                  {partido.acta_firmada ? 'Sí' : 'No'}
                </span>
                            </div>

                            {partido.observaciones && (
                                <div>
                                    <span className="text-neutral-600 dark:text-neutral-400">Observaciones:</span>
                                    <p className="text-sm mt-1">{partido.observaciones}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Función para obtener datos del partido
async function obtenerPartido(id: string) {
    try {
        // Intentar cargar desde la API
        const { serverApi } = await import('@/lib/api/server');

        if (serverApi?.partidos?.getById) {
            const partido = await serverApi.partidos.getById(id);
            if (partido) {
                return { partido, esEjemplo: false };
            }
        }
    } catch (error) {
        console.warn('No se pudo cargar el partido desde la API, usando datos de ejemplo:', error);
    }

    // Fallback a datos de ejemplo
    return {
        partido: { ...PARTIDO_EJEMPLO, id: parseInt(id) || 1 },
        esEjemplo: true
    };
}

export default async function PartidoDetailPage({ params }: PartidoDetailPageProps) {
    try {
        const { id } = await params;
        const { partido, esEjemplo } = await obtenerPartido(id);

        if (!partido) {
            notFound();
        }

        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
                {/* Breadcrumbs */}
                <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex items-center space-x-2 text-sm">
                            <Link href="/" className="text-goal-blue dark:text-goal-gold hover:underline">
                                Inicio
                            </Link>
                            <span className="text-neutral-400">/</span>
                            <Link href="/partidos" className="text-goal-blue dark:text-goal-gold hover:underline">
                                Partidos
                            </Link>
                            <span className="text-neutral-400">/</span>
                            <span className="text-neutral-600 dark:text-neutral-400">
                {partido.equipo_1.nombre} vs {partido.equipo_2.nombre}
              </span>
                        </nav>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="space-y-8">
                        {/* Aviso de datos de ejemplo */}
                        {esEjemplo && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-blue-800 dark:text-blue-200 font-medium text-sm">
                                            Datos de ejemplo
                                        </h3>
                                        <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                                            Esta es información de ejemplo. La conexión con la API está en desarrollo.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Información principal del partido */}
                        <PartidoInfo partido={partido} />

                        {/* Grid de detalles */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Goles */}
                            <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-lg">
                                <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-goal-gold/10 to-goal-gold/5">
                                    <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-goal-gold" />
                                        Goles ({partido.goles?.length || 0})
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <GolesPartido goles={partido.goles || []} />
                                </div>
                            </div>

                            {/* Tarjetas */}
                            <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-lg">
                                <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-yellow-500/10 to-red-500/10">
                                    <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                        Tarjetas ({partido.tarjetas?.length || 0})
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <TarjetasPartido tarjetas={partido.tarjetas || []} />
                                </div>
                            </div>
                        </div>

                        {/* Enlaces relacionados */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg">
                            <h2 className="text-xl font-semibold mb-6 text-neutral-800 dark:text-neutral-200">
                                Información relacionada
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Link
                                    href={`/equipos/${partido.equipo_1.id}`}
                                    className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg hover:bg-goal-blue/10 dark:hover:bg-goal-blue/20 transition-colors"
                                >
                                    <Users className="w-5 h-5 text-goal-blue" />
                                    <div>
                                        <div className="font-medium text-sm">Ver equipo</div>
                                        <div className="text-xs text-neutral-600 dark:text-neutral-400">{partido.equipo_1.nombre}</div>
                                    </div>
                                </Link>

                                <Link
                                    href={`/equipos/${partido.equipo_2.id}`}
                                    className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg hover:bg-goal-blue/10 dark:hover:bg-goal-blue/20 transition-colors"
                                >
                                    <Users className="w-5 h-5 text-goal-blue" />
                                    <div>
                                        <div className="font-medium text-sm">Ver equipo</div>
                                        <div className="text-xs text-neutral-600 dark:text-neutral-400">{partido.equipo_2.nombre}</div>
                                    </div>
                                </Link>

                                {partido.jornada && (
                                    <Link
                                        href={`/partidos?jornada=${partido.jornada.id}`}
                                        className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg hover:bg-goal-gold/10 dark:hover:bg-goal-gold/20 transition-colors"
                                    >
                                        <Calendar className="w-5 h-5 text-goal-gold" />
                                        <div>
                                            <div className="font-medium text-sm">Ver jornada</div>
                                            <div className="text-xs text-neutral-600 dark:text-neutral-400">{partido.jornada.nombre}</div>
                                        </div>
                                    </Link>
                                )}

                                <Link
                                    href="/tabla"
                                    className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg hover:bg-goal-orange/10 dark:hover:bg-goal-orange/20 transition-colors"
                                >
                                    <Trophy className="w-5 h-5 text-goal-orange" />
                                    <div>
                                        <div className="font-medium text-sm">Tabla posiciones</div>
                                        <div className="text-xs text-neutral-600 dark:text-neutral-400">Ver clasificación</div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Navegación a otros partidos */}
                        <div className="bg-gradient-to-r from-goal-blue/5 to-goal-orange/5 dark:from-goal-blue/10 dark:to-goal-orange/10 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200 text-center">
                                Explorar más partidos
                            </h3>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link
                                    href="/partidos?estado=programado"
                                    className="bg-white dark:bg-neutral-800 hover:bg-goal-blue/10 dark:hover:bg-goal-blue/20 text-neutral-700 dark:text-neutral-300 px-6 py-3 rounded-lg transition-all duration-300 border border-neutral-200 dark:border-neutral-700 hover:border-goal-blue"
                                >
                                    Próximos partidos
                                </Link>
                                <Link
                                    href="/partidos?estado=completado"
                                    className="bg-white dark:bg-neutral-800 hover:bg-green-500/10 dark:hover:bg-green-500/20 text-neutral-700 dark:text-neutral-300 px-6 py-3 rounded-lg transition-all duration-300 border border-neutral-200 dark:border-neutral-700 hover:border-green-500"
                                >
                                    Resultados recientes
                                </Link>
                                <Link
                                    href="/partidos"
                                    className="bg-goal-orange hover:bg-goal-orange/90 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    Todos los partidos
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error al cargar el partido:', error);
        notFound();
    }
}