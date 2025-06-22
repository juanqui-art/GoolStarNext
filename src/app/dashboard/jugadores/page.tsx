// src/app/dashboard/jugadores/page.tsx - TEMPORALMENTE DESHABILITADO
import { Metadata } from 'next';
// import { Suspense } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardGuard from '@/components/dashboard/DashboardGuard';
// import JugadoresManager from '@/components/dashboard/jugadores/JugadoresManager';
import { Users, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Gestión de Jugadores | Dashboard GoolStar',
    description: 'Administrar jugadores, equipos y plantillas del torneo',
    robots: 'noindex, nofollow'
};

// Loading component
function JugadoresLoading() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-64"></div>
                </div>
                <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-32"></div>
            </div>
            
            {/* Stats skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl p-4 animate-pulse">
                        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20 mb-2"></div>
                        <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-12"></div>
                    </div>
                ))}
            </div>
            
            {/* Table skeleton */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                <div className="p-6">
                    <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
                    <div className="space-y-3">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function JugadoresPage() {
    return (
        <DashboardGuard>
            <DashboardLayout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8 text-center border border-neutral-200 dark:border-neutral-700">
                        <div className="w-16 h-16 mx-auto mb-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                        </div>

                        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                            Sección en Mantenimiento
                        </h1>

                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            La gestión de jugadores está temporalmente deshabilitada debido a problemas 
                            técnicos en el backend. Estamos trabajando para solucionarlo pronto.
                        </p>

                        <div className="space-y-3">
                            <Link
                                href="/dashboard"
                                className="w-full bg-goal-blue hover:bg-goal-blue/90 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Volver al Dashboard
                            </Link>

                            <Link
                                href="/goleadores"
                                className="w-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Users className="w-4 h-4" />
                                Ver Goleadores
                            </Link>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </DashboardGuard>
    );
}