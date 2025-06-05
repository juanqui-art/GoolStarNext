// src/app/equipos/[id]/page.tsx - VERSIÓN CON TIPOS CORREGIDOS
import { serverApi } from '@/lib/api/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import type { components } from '@/types/api';

// ✅ TIPOS CORRECTOS - Importados de la API
type EquipoDetalle = components['schemas']['EquipoDetalle'];
type Jugador = components['schemas']['Jugador'];
// type Categoria = components['schemas']['Categoria'];

// Props corregidas para Next.js 15
interface EquipoDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Metadata dinámica corregida para SEO
export async function generateMetadata({ params }: EquipoDetailPageProps): Promise<Metadata> {
    try {
        // Await params antes de usar sus propiedades
        const { id } = await params;
        const equipo = await serverApi.equipos.getById(id);

        return {
            title: `${equipo.nombre} | Equipos GoolStar`,
            description: `Información completa del equipo ${equipo.nombre} - Categoría ${equipo.categoria?.nombre}`,
            openGraph: {
                title: `${equipo.nombre} | GoolStar`,
                description: `Equipo ${equipo.nombre} participante en torneos GoolStar`,
                images: equipo.logo ? [equipo.logo] : ['/images/default-team.jpg'],
            },
        };
    } catch (error) {
        console.error('Error generando metadata para equipo:', error);
        return {
            title: 'Equipo | GoolStar',
            description: 'Información del equipo',
        };
    }
}

// Componente de loading para jugadores con tipo específico
function JugadoresLoading() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-600 rounded mb-2"></div>
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-3/4"></div>
                </div>
            ))}
        </div>
    );
}

// ✅ COMPONENTE CON TIPOS CORRECTOS
function EquipoInfo({ equipo }: { equipo: EquipoDetalle }) {
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden">
            {/* Header del equipo */}
            <div className="bg-gradient-to-r from-goal-blue to-goal-gold p-6 text-white">
                <div className="flex items-center gap-6">
                    {equipo.logo ? (
                        <div className="relative w-20 h-20 bg-white rounded-full p-2">
                            <Image
                                src={equipo.logo}
                                alt={`Logo ${equipo.nombre}`}
                                fill
                                className="object-contain rounded-full"
                            />
                        </div>
                    ) : (
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold">
                                {equipo.nombre.substring(0, 2).toUpperCase()}
                            </span>
                        </div>
                    )}

                    <div>
                        <h1 className="text-3xl font-bold mb-2">{equipo.nombre}</h1>
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                {equipo.categoria?.nombre || 'Sin categoría'}
                            </span>
                            {equipo.grupo && (
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                    Grupo {equipo.grupo}
                                </span>
                            )}
                            <span className={`px-3 py-1 rounded-full text-sm ${
                                equipo.activo
                                    ? 'bg-green-500/20 text-green-100'
                                    : 'bg-red-500/20 text-red-100'
                            }`}>
                                {equipo.activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información detallada */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información básica */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
                            Información General
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">Estado:</span>
                                <span className="font-medium capitalize">{equipo.estado || 'Activo'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">Nivel:</span>
                                <span className="font-medium">
                                    {equipo.nivel ? `Nivel ${equipo.nivel}` : 'No especificado'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">Fecha registro:</span>
                                <span className="font-medium">
                                    {new Date(equipo.fecha_registro).toLocaleDateString('es-ES')}
                                </span>
                            </div>
                            {equipo.color_principal && (
                                <div className="flex justify-between items-center">
                                    <span className="text-neutral-600 dark:text-neutral-400">Color principal:</span>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-6 h-6 rounded-full border border-neutral-300"
                                            style={{ backgroundColor: equipo.color_principal }}
                                        ></div>
                                        <span className="font-medium">{equipo.color_principal}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
                            Estadísticas
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">Total jugadores:</span>
                                <span className="font-medium">{equipo.jugadores?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">Inasistencias:</span>
                                <span className="font-medium">{equipo.inasistencias || 0}</span>
                            </div>
                            {typeof equipo.clasificado_fase_grupos === 'boolean' && (
                                <div className="flex justify-between">
                                    <span className="text-neutral-600 dark:text-neutral-400">Clasificado:</span>
                                    <span className={`font-medium ${
                                        equipo.clasificado_fase_grupos ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {equipo.clasificado_fase_grupos ? 'Sí' : 'No'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ✅ COMPONENTE CON TIPOS CORRECTOS
function JugadoresList({ jugadores }: { jugadores: Jugador[] }) {
    if (!jugadores || jugadores.length === 0) {
        return (
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Sin jugadores registrados
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Este equipo aún no tiene jugadores registrados en el sistema.
                </p>
            </div>
        );
    }

    // Limitar a solo 12 jugadores
    const jugadoresLimitados = jugadores.slice(0, 12);
    const jugadoresTotal = jugadores.length;

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
                    Jugadores ({jugadoresTotal}) {jugadoresTotal > 12 && <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">(mostrando 12)</span>}
                </h2>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jugadoresLimitados.map((jugador) => (
                        <div
                            key={jugador.id}
                            className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {jugador.foto ? (
                                    <div className="relative w-12 h-12">
                                        <Image
                                            src={jugador.foto}
                                            alt={jugador.nombre_completo}
                                            fill
                                            className="object-cover rounded-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 bg-goal-gold/20 rounded-full flex items-center justify-center">
                                        <span className="text-goal-gold font-bold text-lg">
                                            {jugador.primer_nombre?.charAt(0) || '?'}
                                        </span>
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                                        {jugador.nombre_completo}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        {jugador.numero_dorsal && (
                                            <span className="bg-goal-blue text-white text-xs px-2 py-1 rounded">
                                                #{jugador.numero_dorsal}
                                            </span>
                                        )}
                                        {jugador.posicion && (
                                            <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                                                {jugador.posicion}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {jugador.suspendido && (
                                <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 rounded text-red-700 dark:text-red-300 text-sm">
                                    <span className="font-medium">Suspendido</span>
                                    {jugador.partidos_suspension_restantes && jugador.partidos_suspension_restantes > 0 && (
                                        <span className="ml-1">
                                            ({jugador.partidos_suspension_restantes} partidos)
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ✅ FUNCIÓN HELPER CON TIPOS CORRECTOS
async function obtenerEquipo(id: string): Promise<EquipoDetalle> {
    try {
        const equipo = await serverApi.equipos.getById(id);
        if (!equipo) {
            throw new Error('Equipo no encontrado');
        }
        return equipo;
    } catch (error) {
        console.error('Error al obtener equipo:', error);
        throw error;
    }
}

// ✅ COMPONENTE PRINCIPAL CON TIPOS CORRECTOS
export default async function EquipoDetailPage({ params }: EquipoDetailPageProps) {
    try {
        // Await params antes de usar sus propiedades
        const { id } = await params;
        const equipo = await obtenerEquipo(id);

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
                            <Link href="/equipos" className="text-goal-blue dark:text-goal-gold hover:underline">
                                Equipos
                            </Link>
                            <span className="text-neutral-400">/</span>
                            <span className="text-neutral-600 dark:text-neutral-400">{equipo.nombre}</span>
                        </nav>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="space-y-8">
                        {/* Información del equipo */}
                        <EquipoInfo equipo={equipo} />

                        {/* Lista de jugadores */}
                        <Suspense fallback={<JugadoresLoading />}>
                            <JugadoresList jugadores={equipo.jugadores || []} />
                        </Suspense>

                        {/* Acciones adicionales */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
                                Ver más información
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href={`/partidos?equipo=${equipo.id}`}
                                    className="bg-goal-blue hover:bg-goal-blue/90 text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Ver partidos del equipo
                                </Link>
                                <Link
                                    href={`/torneos/${equipo.torneo}`}
                                    className="bg-goal-gold hover:bg-goal-gold/90 text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Ver torneo
                                </Link>
                                <Link
                                    href="/tabla"
                                    className="border border-goal-blue text-goal-blue hover:bg-goal-blue/10 px-6 py-2 rounded-lg transition-colors"
                                >
                                    Tabla de posiciones
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error al cargar el equipo:', error);
        notFound();
    }
}