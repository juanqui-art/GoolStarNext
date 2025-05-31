// src/app/tabla/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, AlertTriangle, Trophy, BarChart3 } from 'lucide-react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function TablaError({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log del error para debugging
        console.error('Error en página de tabla:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>

                <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                    Error al cargar tabla
                </h1>

                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Ha ocurrido un problema al cargar la tabla de posiciones.
                    Por favor, inténtalo de nuevo.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={reset}
                        className="w-full bg-goal-orange hover:bg-goal-orange/90 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reintentar
                    </button>

                    <Link
                        href="/partidos"
                        className="block w-full bg-goal-blue hover:bg-goal-blue/90 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
                    >
                        <BarChart3 className="w-4 h-4 inline mr-2" />
                        Ver partidos
                    </Link>

                    <Link
                        href="/equipos"
                        className="block w-full bg-goal-gold hover:bg-goal-gold/90 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
                    >
                        <Trophy className="w-4 h-4 inline mr-2" />
                        Ver equipos
                    </Link>

                    <Link
                        href="/"
                        className="block w-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium py-3 px-6 rounded-lg transition-all duration-300"
                    >
                        Volver al inicio
                    </Link>
                </div>

                {error.digest && (
                    <p className="mt-4 text-xs text-neutral-400">
                        ID del error: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}