// src/app/dashboard/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardGuard from '@/components/dashboard/DashboardGuard';
import EquiposProblematicosServer from '@/components/data/EquiposProblematicos.server';
import EstadoTorneo from '@/components/dashboard/EstadoTorneo';
import { AlertTriangle, BarChart3, Users } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Dashboard Organizador | GoolStar',
    description: 'Panel de control para gestión del torneo - Solo organizadores',
    robots: 'noindex, nofollow' // No indexar en buscadores
};

// Loading components
function DashboardLoading() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl p-6 animate-pulse">
                    <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded mb-4 w-1/3"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

interface DashboardPageProps {
    searchParams: {
        refresh?: string;
    };
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
    return (
        <DashboardGuard>
            <DashboardLayout>
            {/* Header del Dashboard */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            Dashboard de Emergencia
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Control rápido para la transición a eliminatorias
                        </p>
                    </div>
                </div>

                {/* Alerta principal */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                                ⚠️ Preparación para Eliminatorias
                            </h3>
                            <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                                Algunos equipos tienen más de 12 jugadores. Necesitan ajustar su plantilla antes de la segunda fase.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid principal del dashboard */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Panel principal - Equipos problemáticos */}
                <div className="xl:col-span-2">
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
                        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                    Equipos que Necesitan Limpieza
                                </h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <Suspense fallback={<DashboardLoading />}>
                                <EquiposProblematicosServer key={searchParams.refresh} />
                            </Suspense>
                        </div>
                    </div>
                </div>

                {/* Panel lateral - Estado del torneo */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
                        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                    Estado del Torneo
                                </h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <Suspense fallback={<DashboardLoading />}>
                                <EstadoTorneo />
                            </Suspense>
                        </div>
                    </div>

                    {/* Panel de acciones rápidas */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
                        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                            <h3 className="font-semibold text-neutral-900 dark:text-white">
                                Acciones Rápidas
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <button className="w-full text-left p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                                📊 Ver tabla completa
                            </button>
                            <button className="w-full text-left p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                                ⚽ Partidos pendientes
                            </button>
                            <button className="w-full text-left p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
                                💰 Estado financiero
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            </DashboardLayout>
        </DashboardGuard>
    );
}