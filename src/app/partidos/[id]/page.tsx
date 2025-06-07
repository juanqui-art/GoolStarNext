// src/app/partidos/[id]/page.tsx - REFACTORIZADO
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, Trophy, AlertCircle, RefreshCw } from 'lucide-react';
import { serverApi } from '@/lib/api/server';
import type { components } from '@/types/api';

// Tipos correctos de la API
type PartidoDetalle = components['schemas']['PartidoDetalle'];
type Gol = components['schemas']['Gol'];
type Tarjeta = components['schemas']['Tarjeta'];

interface PartidoDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Metadata dinámica usando datos reales
export async function generateMetadata({ params }: PartidoDetailPageProps): Promise<Metadata> {
    try {
        const { id } = await params;
        const partido = await serverApi.partidos.getById(id);

        return {
            title: `${partido.equipo_1.nombre} vs ${partido.equipo_2.nombre} | GoolStar`,
            description: `Detalles del partido entre ${partido.equipo_1.nombre} y ${partido.equipo_2.nombre} - ${partido.completado ? 'Finalizado' : 'Programado'}`,
            openGraph: {
                title: `${partido.equipo_1.nombre} vs ${partido.equipo_2.nombre} | GoolStar`,
                description: `Partido de fútbol indoor en GoolStar${partido.completado ? ` - Resultado: ${partido.goles_equipo_1}-${partido.goles_equipo_2}` : ''}`,
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
function GolesPartido({ goles }: { goles: Gol[] }) {
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
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {gol.equipo_nombre}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Componente para mostrar tarjetas
function TarjetasPartido({ tarjetas }: { tarjetas: Tarjeta[] }) {
    if (!tarjetas || tarjetas.length === 0) {
        return (
            <div className="text-center py-6 text-neutral-500 dark:text-neutral-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
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
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {new Date(tarjeta.fecha).toLocaleDateString('es-ES')}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Componente principal de información del partido
function PartidoInfo({ partido }: { partido: PartidoDetalle }) {
    const fechaPartido = new Date(partido.fecha);
    const esHoy = fechaPartido.toDateString() === new Date().toDateString();
    const esPasado = fechaPartido < new Date();

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden">
            {/* Header del partido */}
            <header className={`p-6 text-white ${
                partido.completado
                    ? 'bg-gradient-to-r from-green-600 to-green-700'
                    : esPasado
                        ? 'bg-gradient-to-r from-red-600 to-red-700'
                        : 'bg-gradient-to-r from-goal-blue to-goal-orange'
            }`} role="banner" aria-label="Información principal del partido">
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
                    <div className="grid grid-cols-3 items-center gap-2 sm:gap-4 mb-4">
                        {/* Equipo 1 */}
                        <div className="text-center">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-2">
                                {partido.equipo_1.logo && (
                                    <Image
                                        src={partido.equipo_1.logo}
                                        alt={`Logo ${partido.equipo_1.nombre}`}
                                        width={32}
                                        height={32}
                                        className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                                    />
                                )}
                                <h2 className="text-sm sm:text-xl font-bold text-center break-words">{partido.equipo_1.nombre}</h2>
                            </div>
                            {partido.completado && (
                                <div className="text-2xl sm:text-4xl font-bold">{partido.goles_equipo_1 || 0}</div>
                            )}
                        </div>

                        {/* VS o resultado */}
                        <div className="text-center">
                            {partido.completado ? (
                                <div className="text-xl sm:text-2xl font-bold">-</div>
                            ) : (
                                <div className="text-sm sm:text-lg font-medium">VS</div>
                            )}
                        </div>

                        {/* Equipo 2 */}
                        <div className="text-center">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-2">
                                <h2 className="text-sm sm:text-xl font-bold text-center break-words order-2 sm:order-1">{partido.equipo_2.nombre}</h2>
                                {partido.equipo_2.logo && (
                                    <Image
                                        src={partido.equipo_2.logo}
                                        alt={`Logo ${partido.equipo_2.nombre}`}
                                        width={32}
                                        height={32}
                                        className="w-6 h-6 sm:w-8 sm:h-8 object-contain order-1 sm:order-2"
                                    />
                                )}
                            </div>
                            {partido.completado && (
                                <div className="text-2xl sm:text-4xl font-bold">{partido.goles_equipo_2 || 0}</div>
                            )}
                        </div>
                    </div>

                    {/* Resultado por penales si existe */}
                    {partido.penales_equipo_1 !== null && partido.penales_equipo_2 !== null && (
                        <div className="mt-2 text-sm opacity-90">
                            Penales: {partido.penales_equipo_1} - {partido.penales_equipo_2}
                        </div>
                    )}

                    {/* Victoria por default */}
                    {partido.victoria_por_default && (
                        <div className="mt-2">
                            <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                                Victoria por {partido.victoria_por_default}
                            </span>
                        </div>
                    )}
                </div>
            </header>

            {/* Información del partido */}
            <section className="p-6" aria-label="Detalles del partido">
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

                            {partido.es_eliminatorio && (
                                <div className="flex items-center gap-3">
                                    <Trophy className="w-5 h-5 text-red-500" />
                                    <div>
                                        <div className="font-medium text-red-600 dark:text-red-400">
                                            Partido Eliminatorio
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Estado del partido */}
                    {/*<div>*/}
                    {/*    <h3 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200">*/}
                    {/*        Estado del Partido*/}
                    {/*    </h3>*/}
                    {/*    <div className="space-y-3">*/}
                    {/*        <div className="flex justify-between">*/}
                    {/*            <span className="text-neutral-600 dark:text-neutral-400">Acta firmada:</span>*/}
                    {/*            <span className={`font-medium ${*/}
                    {/*                partido.acta_firmada ? 'text-green-600' : 'text-red-600'*/}
                    {/*            }`}>*/}
                    {/*                {partido.acta_firmada ? 'Sí' : 'No'}*/}
                    {/*            </span>*/}
                    {/*        </div>*/}

                    {/*        {partido.acta_firmada_equipo_1 !== undefined && (*/}
                    {/*            <div className="flex justify-between">*/}
                    {/*                <span className="text-neutral-600 dark:text-neutral-400">Acta {partido.equipo_1.nombre}:</span>*/}
                    {/*                <span className={`font-medium ${*/}
                    {/*                    partido.acta_firmada_equipo_1 ? 'text-green-600' : 'text-red-600'*/}
                    {/*                }`}>*/}
                    {/*                    {partido.acta_firmada_equipo_1 ? 'Firmada' : 'Pendiente'}*/}
                    {/*                </span>*/}
                    {/*            </div>*/}
                    {/*        )}*/}

                    {/*        {partido.acta_firmada_equipo_2 !== undefined && (*/}
                    {/*            <div className="flex justify-between">*/}
                    {/*                <span className="text-neutral-600 dark:text-neutral-400">Acta {partido.equipo_2.nombre}:</span>*/}
                    {/*                <span className={`font-medium ${*/}
                    {/*                    partido.acta_firmada_equipo_2 ? 'text-green-600' : 'text-red-600'*/}
                    {/*                }`}>*/}
                    {/*                    {partido.acta_firmada_equipo_2 ? 'Firmada' : 'Pendiente'}*/}
                    {/*                </span>*/}
                    {/*            </div>*/}
                    {/*        )}*/}

                    {/*        /!* Inasistencias *!/*/}
                    {/*        {(partido.inasistencia_equipo_1 || partido.inasistencia_equipo_2) && (*/}
                    {/*            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">*/}
                    {/*                <div className="text-yellow-800 dark:text-yellow-200 font-medium text-sm">*/}
                    {/*                    Inasistencias registradas*/}
                    {/*                </div>*/}
                    {/*                {partido.inasistencia_equipo_1 && (*/}
                    {/*                    <div className="text-yellow-700 dark:text-yellow-300 text-sm">*/}
                    {/*                        • {partido.equipo_1.nombre}*/}
                    {/*                    </div>*/}
                    {/*                )}*/}
                    {/*                {partido.inasistencia_equipo_2 && (*/}
                    {/*                    <div className="text-yellow-700 dark:text-yellow-300 text-sm">*/}
                    {/*                        • {partido.equipo_2.nombre}*/}
                    {/*                    </div>*/}
                    {/*                )}*/}
                    {/*            </div>*/}
                    {/*        )}*/}

                    {/*        {partido.observaciones && (*/}
                    {/*            <div>*/}
                    {/*                <span className="text-neutral-600 dark:text-neutral-400">Observaciones:</span>*/}
                    {/*                <p className="text-sm mt-1 p-3 bg-neutral-50 dark:bg-neutral-700 rounded">*/}
                    {/*                    {partido.observaciones}*/}
                    {/*                </p>*/}
                    {/*            </div>*/}
                    {/*        )}*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </section>
        </div>
    );
}

function ErrorView({ error, retry }: { error: string; retry?: () => void }) {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 shadow-lg max-w-md mx-4">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                        Error al cargar el partido
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                        {error}
                    </p>
                    <div className="space-y-3">
                        {retry && (
                            <button
                                onClick={retry}
                                className="w-full bg-goal-blue hover:bg-goal-blue/90 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reintentar
                            </button>
                        )}
                        <Link
                            href="/partidos"
                            className="block w-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-lg transition-colors text-center"
                        >
                            Volver a partidos
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default async function PartidoDetailPage({ params }: PartidoDetailPageProps) {
    try {
        const { id } = await params;
        
        if (!id || isNaN(Number(id))) {
            notFound();
        }

        const partido = await serverApi.partidos.getById(id);

        if (!partido) {
            notFound();
        }

        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
                {/* Breadcrumbs */}
                <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="container mx-auto px-4 py-4">
                        <nav aria-label="Navegación de migas de pan" className="flex items-center space-x-2 text-sm">
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

                <div className="container mx-auto px-4 py-4 sm:py-8">
                    <div className="space-y-4 sm:space-y-8">
                        {/* Información principal del partido */}
                        <PartidoInfo partido={partido} />

                        {/* Grid de detalles */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                            {/* Goles */}
                            <section className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-lg" aria-label="Sección de goles">
                                <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-goal-gold/10 to-goal-gold/5">
                                    <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-goal-gold" aria-hidden="true" />
                                        Goles ({partido.goles?.length || 0})
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <GolesPartido goles={partido.goles || []} />
                                </div>
                            </section>

                            {/* Tarjetas */}
                            <section className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-lg" aria-label="Sección de tarjetas">
                                <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-yellow-500/10 to-red-500/10">
                                    <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-yellow-600" aria-hidden="true" />
                                        Tarjetas ({partido.tarjetas?.length || 0})
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <TarjetasPartido tarjetas={partido.tarjetas || []} />
                                </div>
                            </section>
                        </div>

                        {/* Enlaces relacionados */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg">
                            <h2 className="text-xl font-semibold mb-6 text-neutral-800 dark:text-neutral-200">
                                Información relacionada
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
                            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
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
        
        const errorMessage = error instanceof Error 
            ? error.message 
            : 'No se pudo cargar la información del partido';
            
        return <ErrorView error={errorMessage} />;
    }
}