// src/components/data/TablaLoading.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function TablaLoading() {
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
        <div className="w-full max-w-7xl mx-auto" ref={containerRef}>
            <h2 className="text-3xl font-heading text-center mb-8">
                Cargando Tabla de Posiciones
            </h2>

            {/* Tabla skeleton para desktop */}
            <div className="hidden lg:block bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {/* Header skeleton */}
                        <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                        <tr>
                            {Array.from({ length: 10 }).map((_, i) => (
                                <th key={i} className="px-4 py-4">
                                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-8 mx-auto skeleton-item"></div>
                                </th>
                            ))}
                        </tr>
                        </thead>

                        {/* Body skeleton */}
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                        {Array.from({ length: 12 }).map((_, index) => (
                            <tr key={index} className="skeleton-item">
                                {/* Posición */}
                                <td className="px-4 py-4 text-center">
                                    <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg mx-auto"></div>
                                </td>

                                {/* Equipo */}
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                                        <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-32"></div>
                                    </div>
                                </td>

                                {/* Resto de columnas */}
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <td key={i} className="px-4 py-4 text-center">
                                        <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-8 mx-auto"></div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Vista móvil skeleton */}
            <div className="lg:hidden bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 divide-y divide-neutral-200 dark:divide-neutral-700">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="p-4 skeleton-item">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                                    <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-8"></div>
                                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-6"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="text-center">
                                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-8 mx-auto mb-1"></div>
                                    <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-12 mx-auto"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer skeleton */}
            <div className="flex justify-between items-center mt-8 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg skeleton-item">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-48"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
            </div>

            {/* Leyenda skeleton */}
            <div className="mt-6 p-4 bg-gradient-to-r from-goal-blue/5 to-goal-gold/5 dark:from-goal-blue/10 dark:to-goal-gold/10 rounded-lg skeleton-item">
                <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-32 mx-auto mb-3"></div>
                <div className="flex justify-center gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                        </div>
                    ))}
                </div>
            </div>

            <p className="text-center text-neutral-500 dark:text-neutral-400 text-sm mt-8">
                Cargando clasificación del torneo...
            </p>
        </div>
    );
}