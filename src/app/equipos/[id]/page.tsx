// src/app/equipos/[id]/page.tsx - VERSIÓN MEJORADA
import { serverApi } from '@/lib/api/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Trophy, Target, AlertTriangle, MapPin, Star } from 'lucide-react';
import type { components } from '@/types/api';

// ✅ TIPOS CORRECTOS - Importados de la API
type EquipoDetalle = components['schemas']['EquipoDetalle'];
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
        
        // Validar que el ID existe antes de usar
        if (!id || typeof id !== 'string') {
            return {
                title: 'Equipo | GoolStar',
                description: 'Información del equipo',
            };
        }
        
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
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-goal-blue" />
                                    <span className="text-neutral-600 dark:text-neutral-400">Estado:</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    equipo.activo 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                }`}>
                                    {equipo.activo ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                            
                            {equipo.categoria && (
                                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-goal-gold" />
                                        <span className="text-neutral-600 dark:text-neutral-400">Categoría:</span>
                                    </div>
                                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                                        {equipo.categoria.nombre}
                                    </span>
                                </div>
                            )}
                            
                            {equipo.grupo && (
                                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-goal-blue" />
                                        <span className="text-neutral-600 dark:text-neutral-400">Grupo:</span>
                                    </div>
                                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                                        Grupo {equipo.grupo}
                                    </span>
                                </div>
                            )}
                            
                            {equipo.color_principal && (
                                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Target className="w-4 h-4 text-goal-gold" />
                                        <span className="text-neutral-600 dark:text-neutral-400">Color principal:</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                            style={{ backgroundColor: equipo.color_principal }}
                                        ></div>
                                        <span className="font-medium text-neutral-800 dark:text-neutral-200">
                                            {equipo.color_principal}
                                        </span>
                                    </div>
                                </div>
                            )}
                            
                        </div>
                    </div>

                    {/* Estadísticas del Torneo */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                            <Star className="w-5 h-5 text-goal-gold" />
                            Rendimiento
                        </h2>
                        <div className="space-y-4">
                            {typeof equipo.clasificado_fase_grupos === 'boolean' && (
                                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-goal-gold" />
                                        <span className="text-neutral-600 dark:text-neutral-400">Clasificación:</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        equipo.clasificado_fase_grupos 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                    }`}>
                                        {equipo.clasificado_fase_grupos ? '✅ Clasificado' : '⏳ En competencia'}
                                    </span>
                                </div>
                            )}
                            
                            {/* Información adicional de rendimiento */}
                            <div className="p-4 bg-gradient-to-br from-goal-blue/5 to-goal-gold/5 rounded-lg border border-goal-blue/20">
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                                        Estado del Equipo
                                    </div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                        {equipo.activo ? 'Participando activamente en el torneo' : 'Inactivo en la competencia actual'}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Alerta si hay muchos suspendidos - TEMPORALMENTE DESHABILITADO */}
                            {/* {equipo.jugadores && equipo.jugadores.filter(j => j.suspendido).length > 2 && (
                                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span className="text-sm">
                                        Este equipo tiene varios jugadores suspendidos
                                    </span>
                                </div>
                            )} */}
                        </div>
                    </div>
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
                        {/*<Suspense fallback={<JugadoresLoading />}>*/}
                        {/*    <JugadoresList jugadores={equipo.jugadores || []} />*/}
                        {/*</Suspense>*/}

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
                                    href="/partidos"
                                    className="border border-goal-blue text-goal-blue hover:bg-goal-blue/10 px-6 py-2 rounded-lg transition-colors"
                                >
                                    Ver partidos
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