// src/components/dashboard/DashboardLayout.tsx
'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Clock, LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">

            {/* Header con navegación */}
            <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Navegación izquierda */}
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-sm font-medium">Volver al sitio</span>
                            </Link>

                            <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-700"></div>

                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <span className="font-semibold text-neutral-900 dark:text-white">
                                    Panel Organizador
                                </span>
                            </div>
                        </div>

                        {/* Usuario y acciones */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span>En línea</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                <Clock className="w-4 h-4" />
                                <span suppressHydrationWarning>
                                    {new Date().toLocaleTimeString('es-EC', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>

                            <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-700"></div>

                            {/* Información del usuario */}
                            {user && (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                                        <span className="text-neutral-900 dark:text-white font-medium">
                                            {user.first_name || user.username}
                                        </span>
                                    </div>

                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Salir</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Footer informativo */}
            <footer className="border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
                        <div className="flex items-center gap-4">
                            <span>🔥 Modo Crisis - Dashboard de Emergencia</span>
                            <span>•</span>
                            <span>Solo para organizadores</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <span>API: ✅ Conectado</span>
                            <span>•</span>
                            <span>Última actualización: hace unos segundos</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}