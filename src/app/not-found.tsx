// src/app/not-found.tsx - CORREGIDO sin event handlers
import Link from 'next/link';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center px-4">
            <div className="max-w-2xl mx-auto text-center">
                {/* Icono principal */}
                <div className="w-24 h-24 mx-auto mb-8 bg-goal-gold/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-12 h-12 text-goal-gold" />
                </div>

                {/* Título y mensaje */}
                <h1 className="text-6xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                    404
                </h1>

                <h2 className="text-2xl md:text-3xl font-semibold text-neutral-700 dark:text-neutral-200 mb-6">
                    Página no encontrada
                </h2>

                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
                    Lo sentimos, la página que buscas no existe o ha sido movida.
                </p>

                {/* Información de debugging - SIN JavaScript */}
                <div className="mb-8 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-left max-w-md mx-auto">
                    <h3 className="font-semibold text-sm text-neutral-700 dark:text-neutral-300 mb-2">
                        Información de debugging:
                    </h3>
                    <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                        <li>• Timestamp: {new Date().toISOString()}</li>
                        <li>• Entorno: {process.env.NODE_ENV}</li>
                        <li>• Vercel: {process.env.VERCEL ? 'Sí' : 'No'}</li>
                    </ul>
                </div>

                {/* Botones de navegación - SOLO LINKS, sin onClick */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center bg-goal-blue hover:bg-goal-blue/90 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Ir al inicio
                    </Link>

                    {/* Botón de volver atrás - ahora es un link simple */}
                    <Link
                        href="/"
                        className="inline-flex items-center bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium py-3 px-6 rounded-full transition-all duration-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Volver al inicio
                    </Link>
                </div>

                {/* Enlaces útiles */}
                <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700">
                    <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
                        Páginas principales:
                    </h3>

                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <Link href="/partidos" className="text-goal-blue hover:underline">
                            Partidos
                        </Link>
                        <Link href="/equipos" className="text-goal-blue hover:underline">
                            Equipos
                        </Link>
                        <Link href="/goleadores" className="text-goal-blue hover:underline">
                            Goleadores
                        </Link>
                        <Link href="/torneos" className="text-goal-blue hover:underline">
                            Torneos
                        </Link>
                        <Link href="/contacto" className="text-goal-blue hover:underline">
                            Contacto
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}