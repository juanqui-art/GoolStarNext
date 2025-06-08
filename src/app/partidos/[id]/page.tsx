// src/app/partidos/[id]/page.tsx - VERSIÓN MEJORADA SIN COMPONENTES FANTASMA 🎨
import { serverApi } from '@/lib/api/server';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
    Calendar,
    Clock,
    MapPin,
    Trophy,
    AlertCircle,
    RefreshCw
} from 'lucide-react';

// ✅ TIPOS DE LA API

interface PartidoDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

// ✅ METADATA DINÁMICA
export async function generateMetadata({ params }: PartidoDetailPageProps): Promise<Metadata> {
    try {
        const { id } = await params;
        const partido = await serverApi.partidos.getById(id);

        return {
            title: `${partido.equipo_1.nombre} vs ${partido.equipo_2.nombre} | GoolStar`,
            description: `Detalles del partido entre ${partido.equipo_1.nombre} y ${partido.equipo_2.nombre}`,
            openGraph: {
                title: `${partido.equipo_1.nombre} vs ${partido.equipo_2.nombre}`,
                description: `Partido del ${new Date(partido.fecha).toLocaleDateString()}`,
                type: 'article',
            },
        };
    } catch (_error) {
        return {
            title: 'Partido | GoolStar',
            description: 'Detalles del partido',
        };
    }
}

// 🔥 COMPONENTE DE ERROR INTEGRADO (sin importaciones externas)
function ErrorView({ error, retry }: { error: string; retry?: () => void }) {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>

                <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                    Error al cargar partido
                </h1>

                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    {error}
                </p>

                <div className="space-y-3">
                    {retry && (
                        <button
                            onClick={retry}
                            className="w-full bg-goal-orange hover:bg-goal-orange/90 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reintentar
                        </button>
                    )}

                    <Link
                        href="/partidos"
                        className="block w-full bg-goal-blue hover:bg-goal-blue/90 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
                    >
                        Ver todos los partidos
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default async function PartidoDetailPage({ params }: PartidoDetailPageProps) {
    try {
        const { id } = await params;
        const partido = await serverApi.partidos.getById(id);

        // Cálculos de estado del partido
        const fechaPartido = new Date(partido.fecha);
        const fechaHoy = new Date();
        const esHoy = fechaPartido.toDateString() === fechaHoy.toDateString();
        const esPasado = fechaPartido < fechaHoy && !esHoy;

        // Eventos del partido para el timeline
        const eventos = [
            ...partido.goles?.map(gol => ({
                tipo: 'gol' as const,
                minuto: gol.minuto,
                jugador: gol.jugador_nombre,
                equipo: gol.equipo_nombre,
                equipoId: gol.jugador // Este es el ID del jugador
            })) || [],
            ...partido.tarjetas?.map(tarjeta => ({
                tipo: 'tarjeta' as const,
                tipoTarjeta: tarjeta.tipo,
                minuto: tarjeta.minuto,
                jugador: tarjeta.jugador_nombre,
                equipo: 'Equipo', // Las tarjetas no tienen equipo_nombre en la API
                equipoId: tarjeta.jugador // Este es el ID del jugador
            })) || []
        ].sort((a, b) => (a.minuto || 0) - (b.minuto || 0));

        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
                {/* 🍞 BREADCRUMBS */}
                <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <nav aria-label="Migas de pan" className="flex items-center space-x-2 text-sm">
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

                {/* 📱💻 CONTAINER RESPONSIVO - El truco está aquí */}
                <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
                    <div className="space-y-4 sm:space-y-8">

                        {/* 🎨 HEADER PRINCIPAL - DEGRADADO MEJORADO */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-700">
                            <header className={`relative overflow-hidden ${
                                partido.completado
                                    ? 'bg-gradient-to-br from-emerald-500/90 via-emerald-600/95 to-teal-600/90'
                                    : esHoy
                                        ? 'bg-gradient-to-br from-goal-gold/90 via-amber-500/95 to-goal-orange/90'
                                        : esPasado
                                            ? 'bg-gradient-to-br from-slate-500/90 via-slate-600/95 to-slate-700/90'
                                            : 'bg-gradient-to-br from-goal-blue/80 via-indigo-500/85 to-goal-blue/90'
                            }`} role="banner" aria-label="Información principal del partido">

                                {/* 🌟 EFECTO GLASSMORPHISM */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10"></div>
                                <div className="absolute inset-0 backdrop-blur-[1px]"></div>

                                {/* ✨ EFECTOS DE LUZ */}
                                <div className="absolute top-0 left-1/4 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-white/15 rounded-full blur-2xl"></div>

                                <div className="relative text-center text-white p-6">
                                    {/* 🏷️ ESTADO DEL PARTIDO */}
                                    <div className="mb-4">
                                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border ${
                                            partido.completado
                                                ? 'bg-white/20 border-white/30 text-white'
                                                : esHoy
                                                    ? 'bg-neutral-900/80 border-neutral-900/50 text-goal-gold'
                                                    : 'bg-white/20 border-white/30 text-white'
                                        }`}>
                                            {partido.completado ? 'Finalizado' : esHoy ? 'HOY' : esPasado ? 'Pendiente' : 'Programado'}
                                        </span>
                                    </div>

                                    {/* ⚽ EQUIPOS Y RESULTADO */}
                                    <div className="grid grid-cols-3 items-center gap-2 sm:gap-4 mb-4">
                                        {/* Equipo 1 */}
                                        <div className="text-center">
                                            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-2">
                                                {partido.equipo_1.logo && (
                                                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                                                        <Image
                                                            src={partido.equipo_1.logo}
                                                            alt={`Logo ${partido.equipo_1.nombre}`}
                                                            width={32}
                                                            height={32}
                                                            className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                                                        />
                                                    </div>
                                                )}
                                                <h2 className="text-lg sm:text-xl font-bold text-center break-words">
                                                    {partido.equipo_1.nombre}
                                                </h2>
                                            </div>
                                            {partido.completado && (
                                                <div className="text-5xl font-bold drop-shadow-lg">
                                                    {partido.goles_equipo_1 || 0}
                                                </div>
                                            )}
                                        </div>

                                        {/* VS o resultado */}
                                        <div className="text-center">
                                            {partido.completado ? (
                                                <div className="text-2xl font-bold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                                                    VS
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="text-3xl font-bold">VS</div>
                                                    <div className="flex items-center justify-center gap-2 text-sm">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{new Date(partido.fecha).toLocaleTimeString('es-ES', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Equipo 2 */}
                                        <div className="text-center">
                                            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-2">
                                                {partido.equipo_2.logo && (
                                                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                                                        <Image
                                                            src={partido.equipo_2.logo}
                                                            alt={`Logo ${partido.equipo_2.nombre}`}
                                                            width={32}
                                                            height={32}
                                                            className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                                                        />
                                                    </div>
                                                )}
                                                <h2 className="text-lg sm:text-xl font-bold text-center break-words">
                                                    {partido.equipo_2.nombre}
                                                </h2>
                                            </div>
                                            {partido.completado && (
                                                <div className="text-5xl font-bold drop-shadow-lg">
                                                    {partido.goles_equipo_2 || 0}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 📅 INFORMACIÓN DE FECHA Y JORNADA */}
                                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm backdrop-blur-sm bg-white/10 rounded-lg p-3 border border-white/20">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{fechaPartido.toLocaleDateString('es-ES', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                        {partido.jornada && (
                                            <div className="flex items-center gap-2">
                                                <Trophy className="w-4 h-4" />
                                                <span>{partido.jornada.nombre}</span>
                                            </div>
                                        )}
                                        {partido.cancha && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                <span>{partido.cancha}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* 🏆 VICTORIA POR DEFAULT */}
                                    {partido.victoria_por_default && (
                                        <div className="mt-4">
                                            <span className="bg-amber-500/90 text-amber-900 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm border border-amber-300/50">
                                                Victoria por {partido.victoria_por_default}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </header>
                        </div>

                        {/* 📊 INFORMACIÓN ADICIONAL DEL PARTIDO */}
                        <section className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-6">
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
                                                <div className="font-medium text-neutral-800 dark:text-neutral-200">
                                                    {fechaPartido.toLocaleDateString('es-ES', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
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

                                        {partido.jornada && (
                                            <div className="flex items-center gap-3">
                                                <Trophy className="w-5 h-5 text-goal-gold" />
                                                <span className="text-neutral-800 dark:text-neutral-200">
                                                    {partido.jornada.nombre}
                                                </span>
                                            </div>
                                        )}

                                        {partido.cancha && (
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-5 h-5 text-goal-orange" />
                                                <span className="text-neutral-800 dark:text-neutral-200">
                                                    {partido.cancha}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Estadísticas del partido */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
                                        Estadísticas
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-neutral-600 dark:text-neutral-400">Estado:</span>
                                            <span className={`px-2 py-1 rounded text-sm font-medium ${
                                                partido.completado
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                            }`}>
                                                {partido.completado ? 'Finalizado' : 'Programado'}
                                            </span>
                                        </div>

                                        {partido.completado && (
                                            <>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-neutral-600 dark:text-neutral-400">Total de goles:</span>
                                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                        {(partido.goles_equipo_1 || 0) + (partido.goles_equipo_2 || 0)}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <span className="text-neutral-600 dark:text-neutral-400">Tarjetas:</span>
                                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                        {partido.tarjetas?.length || 0}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 🎮 MATCH CENTER CON TIMELINE */}
                        {eventos.length > 0 && (
                            <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-700">
                                <div className="bg-gradient-to-r from-goal-blue/5 via-goal-gold/5 to-goal-orange/5 dark:from-goal-blue/10 dark:via-goal-gold/10 dark:to-goal-orange/10 p-6 border-b border-neutral-200 dark:border-neutral-700">
                                    <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gradient-to-r from-goal-blue to-goal-orange rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                        Match Center
                                    </h2>
                                </div>

                                {/* Timeline de eventos */}
                                <div className="p-6 space-y-6">
                                    {eventos.map((evento, index) => (
                                        <div key={index} className="flex items-center gap-4 p-4 rounded-lg transition-all duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                                            {/* Minuto */}
                                            <div className="w-12 text-center">
                                                {evento.minuto !== undefined ? (
                                                    <div className="bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-800 text-xs font-bold px-2 py-1 rounded">
                                                        {evento.minuto}&apos;
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-neutral-400">-</div>
                                                )}
                                            </div>

                                            {/* Icono del evento */}
                                            <div className="flex flex-col items-center">
                                                <div className={`w-3 h-3 rounded-full border-2 ${
                                                    evento.tipo === 'gol'
                                                        ? 'bg-goal-gold border-goal-gold shadow-lg shadow-goal-gold/25'
                                                        : evento.tipoTarjeta === 'AMARILLA'
                                                            ? 'bg-yellow-500 border-yellow-500'
                                                            : 'bg-red-500 border-red-500'
                                                }`}></div>
                                            </div>

                                            {/* Contenido del evento */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {evento.tipo === 'gol' ? (
                                                        <Trophy className="w-4 h-4 text-goal-gold" />
                                                    ) : (
                                                        <AlertCircle className={`w-4 h-4 ${
                                                            evento.tipoTarjeta === 'AMARILLA' ? 'text-yellow-500' : 'text-red-500'
                                                        }`} />
                                                    )}
                                                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                                                        {evento.jugador}
                                                    </span>
                                                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                                        ({evento.equipo})
                                                    </span>
                                                </div>
                                                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    {evento.tipo === 'gol' ? 'Gol anotado' :
                                                        evento.tipoTarjeta === 'AMARILLA' ? 'Tarjeta amarilla' : 'Tarjeta roja'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 🧭 NAVEGACIÓN A OTROS PARTIDOS */}
                        <div className="bg-gradient-to-r from-goal-blue/5 to-goal-orange/5 dark:from-goal-blue/10 dark:to-goal-orange/10 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
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
                                    className="bg-white dark:bg-neutral-800 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-neutral-700 dark:text-neutral-300 px-6 py-3 rounded-lg transition-all duration-300 border border-neutral-200 dark:border-neutral-700 hover:border-emerald-500"
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