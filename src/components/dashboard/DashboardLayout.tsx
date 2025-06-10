// src/components/dashboard/DashboardLayout.tsx
'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Clock, LogOut, User, Home, Users, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
    children: ReactNode;
}

// Componente de navegación por pestañas
function DashboardTabs() {
    const pathname = usePathname();
    
    const tabs = [
        {
            id: 'overview',
            name: 'Overview',
            href: '/dashboard',
            icon: Home,
            current: pathname === '/dashboard'
        },
        {
            id: 'jugadores',
            name: 'Jugadores',
            href: '/dashboard/jugadores',
            icon: Users,
            current: pathname.startsWith('/dashboard/jugadores')
        },
        {
            id: 'finanzas',
            name: 'Finanzas',
            href: '/dashboard/finanzas',
            icon: DollarSign,
            current: pathname.startsWith('/dashboard/finanzas')
        },
        {
            id: 'partidos',
            name: 'Partidos',
            href: '/dashboard/partidos',
            icon: Calendar,
            current: pathname.startsWith('/dashboard/partidos')
        },
        {
            id: 'reportes',
            name: 'Reportes',
            href: '/dashboard/reportes',
            icon: BarChart3,
            current: pathname.startsWith('/dashboard/reportes')
        }
    ];

    return (
        <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                    <Link
                        key={tab.id}
                        href={tab.href}
                        className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                            tab.current
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600'
                        }`}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.name}</span>
                    </Link>
                );
            })}
        </div>
    );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">

            {/* Header con navegación */}
            <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="flex items-center justify-between h-14 md:h-16">

                        {/* Navegación izquierda */}
                        <div className="flex items-center gap-2 md:gap-4">
                            <Link
                                href="/"
                                className="flex items-center gap-1 md:gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                                title="Volver al sitio principal"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-xs md:text-sm font-medium hidden sm:inline">Volver al sitio</span>
                                <span className="text-xs font-medium sm:hidden">Volver</span>
                            </Link>

                            <div className="h-4 md:h-6 w-px bg-neutral-200 dark:bg-neutral-700 hidden sm:block"></div>

                            <div className="flex items-center gap-1 md:gap-2">
                                <Shield className="w-4 h-4 md:w-5 md:h-5 text-red-600 dark:text-red-400" />
                                <span className="text-sm md:text-base font-semibold text-neutral-900 dark:text-white">
                                    <span className="hidden md:inline">Panel Organizador</span>
                                    <span className="md:hidden">Panel</span>
                                </span>
                            </div>
                        </div>

                        {/* Usuario y acciones */}
                        <div className="flex items-center gap-2 md:gap-4">
                            {/* Estado online - solo en desktop */}
                            <div className="hidden lg:flex items-center gap-2 text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span>En línea</span>
                            </div>

                            {/* Reloj - solo en tablet y desktop */}
                            <div className="hidden md:flex items-center gap-2 text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                                <Clock className="w-4 h-4" />
                                <span suppressHydrationWarning>
                                    {new Date().toLocaleTimeString('es-EC', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>

                            <div className="h-4 md:h-6 w-px bg-neutral-200 dark:bg-neutral-700 hidden md:block"></div>

                            {/* Información del usuario */}
                            {user && (
                                <div className="flex items-center gap-2 md:gap-3">
                                    {/* Nombre usuario - solo en desktop */}
                                    <div className="hidden lg:flex items-center gap-2 text-xs md:text-sm">
                                        <User className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                                        <span className="text-neutral-900 dark:text-white font-medium">
                                            {user.first_name || user.username}
                                        </span>
                                    </div>

                                    {/* Botón salir */}
                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Cerrar sesión"
                                    >
                                        <LogOut className="w-3 h-3 md:w-4 md:h-4" />
                                        <span className="hidden sm:inline">Salir</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Navegación por pestañas */}
            <nav className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <DashboardTabs />
                </div>
            </nav>

            {/* Contenido principal */}
            <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 md:py-8 min-h-[calc(100vh-200px)]">
                {children}
            </main>

            {/* Footer informativo */}
            <footer className="border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 mt-8 md:mt-16">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 md:py-6">
                    {/* Layout responsive del footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
                        <div className="flex items-center gap-2 md:gap-4">
                            <span>📋 Panel Organizador</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">GoolStar Admin</span>
                            <span className="sm:hidden text-neutral-400">Administración</span>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                            <span>API: ✅</span>
                            <span className="hidden md:inline">•</span>
                            <span className="hidden md:inline">Última actualización: hace unos segundos</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}