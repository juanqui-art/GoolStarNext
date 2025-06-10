// src/app/dashboard/jugadores/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardGuard from '@/components/dashboard/DashboardGuard';
import JugadoresManager from '@/components/dashboard/jugadores/JugadoresManager';
import { Users } from 'lucide-react';

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
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
                                    Gestión de Jugadores
                                </h1>
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Administra jugadores, equipos y plantillas del torneo
                            </p>
                        </div>
                    </div>

                    {/* Manager Component */}
                    <Suspense fallback={<JugadoresLoading />}>
                        <JugadoresManager />
                    </Suspense>
                </div>
            </DashboardLayout>
        </DashboardGuard>
    );
}