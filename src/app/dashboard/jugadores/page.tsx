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

// JugadoresLoading component removed - not needed for maintenance page

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