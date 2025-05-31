// src/components/data/GoleadoresLoading.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function GoleadoresLoading() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const elements = containerRef.current.querySelectorAll('.skeleton-item');

        // Crear una animación de pulso para los elementos skeleton
        const tl = gsap.timeline({ repeat: -1, yoyo: true });

        tl.to(elements, {
            opacity: 0.5,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power1.inOut'
        });

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto" ref={containerRef}>
            <h2 className="text-3xl font-heading text-center mb-8">
                Cargando Goleadores
            </h2>

            {/* Tabla skeleton para desktop */}
            <div className="hidden lg:block bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {/* Header skeleton */}
                        <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                        <tr>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <th key={i} className="px-4 py-4">
                                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16 mx-auto skeleton-item"></div>
                                </th>
                            ))}
                        </tr>
                        </thead>

                        {/* Body skeleton */}
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <tr key={index} className="skeleton-item">
                                {/* Posición */}
                                <td className="px-4 py-4 text-center">
                                    <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg mx-auto"></div>
                                </td>

                                {/* Jugador */}
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                                        <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-32"></div>
                                    </div>
                                </td>

                                {/* Equipo */}
                                <td className="px-4 py-4">
                                    <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                                </td>

                                {/* Goles */}
                                <td className="px-4 py-4 text-center">
                                    <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-8 mx-auto"></div>
                                </td>

                                {/* Partidos */}
                                <td className="px-4 py-4 text-center">
                                    <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-6 mx-auto"></div>
                                </td>

                                {/* Promedio */}
                                <td className="px-4 py-4 text-center">
                                    <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-12 mx-auto"></div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Vista móvil skeleton */}
            <div className="lg:hidden space-y-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-sm border border-neutral-200 dark:border-neutral-700 skeleton-item"
                    >
                        <div className="flex items-center gap-4">
                            {/* Posición y foto */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
                                <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                            </div>

                            {/* Información del jugador */}
                            <div className="flex-1 min-w-0">
                                <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-32 mb-2"></div>
                                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                            </div>

                            {/* Estadísticas */}
                            <div className="text-right">
                                <div className="flex items-center gap-2 mb-1 justify-end">
                                    <div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                                    <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-8"></div>
                                </div>
                                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-20 mb-1 ml-auto"></div>
                                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-16 ml-auto"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer skeleton */}
            <div className="flex justify-between items-center mt-8 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg skeleton-item">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-48"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-32"></div>
            </div>

            {/* Podio skeleton */}
            <div className="mt-8 bg-gradient-to-r from-goal-gold/5 to-goal-orange/5 dark:from-goal-gold/10 dark:to-goal-orange/10 rounded-xl p-6 skeleton-item">
                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-48 mx-auto mb-6"></div>

                <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                    {/* Podio positions */}
                    {[80, 120, 64].map((height, index) => (
                        <div key={index} className="text-center">
                            <div className={`bg-neutral-200 dark:bg-neutral-700 rounded-lg p-4 mb-2`} style={{ height: `${height}px` }}>
                                <div className="h-8 bg-neutral-300 dark:bg-neutral-600 rounded w-8 mx-auto mb-2"></div>
                                <div className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded w-20 mx-auto"></div>
                            </div>
                            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-16 mx-auto"></div>
                        </div>
                    ))}
                </div>
            </div>

            <p className="text-center text-neutral-500 dark:text-neutral-400 text-sm mt-8">
                Cargando tabla de goleadores...
            </p>
        </div>
    );
}