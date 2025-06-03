// src/components/data/TorneosLoading.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface TorneosLoadingProps {
    vista?: 'lista' | 'tarjetas';
}

export default function TorneosLoading({ vista = 'tarjetas' }: TorneosLoadingProps) {
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

    if (vista === 'lista') {
        return (
            <div className="w-full max-w-7xl mx-auto" ref={containerRef}>
                <h2 className="text-3xl font-heading text-center mb-8">
                    Cargando Torneos
                </h2>

                {/* Vista de lista skeleton */}
                <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm border border-neutral-200 dark:border-neutral-700 skeleton-item"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 min-w-0 mr-4">
                                            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3 mb-2"></div>
                                            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                                            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20"></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <div key={i}>
                                                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-16 mb-1"></div>
                                                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto" ref={containerRef}>
            <h2 className="text-3xl font-heading text-center mb-8">
                Cargando Torneos
            </h2>

            {/* Vista de tarjetas skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm border border-neutral-200 dark:border-neutral-700 skeleton-item"
                    >
                        {/* Imagen skeleton */}
                        <div className="h-48 bg-neutral-200 dark:bg-neutral-700 relative">
                            <div className="absolute top-3 left-3">
                                <div className="w-20 h-6 bg-neutral-300 dark:bg-neutral-600 rounded-full"></div>
                            </div>
                            <div className="absolute top-3 right-3">
                                <div className="w-16 h-5 bg-neutral-300 dark:bg-neutral-600 rounded-full"></div>
                            </div>
                        </div>

                        {/* Contenido skeleton */}
                        <div className="p-6">
                            {/* Título y descripción */}
                            <div className="mb-4">
                                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-1"></div>
                                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3"></div>
                            </div>

                            {/* Estado skeleton */}
                            <div className="mb-4 flex items-center gap-2">
                                <div className="w-3 h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20"></div>
                                <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                            </div>

                            {/* Grid de información */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                                        <div>
                                            <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-12 mb-1"></div>
                                            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Barra de progreso skeleton */}
                            <div className="mb-4">
                                <div className="flex justify-between mb-1">
                                    <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                                    <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-8"></div>
                                </div>
                                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                                    <div className="bg-neutral-300 dark:bg-neutral-600 h-2 rounded-full w-1/3"></div>
                                </div>
                            </div>

                            {/* Footer skeleton */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
                                    <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-20"></div>
                                </div>
                                <div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer skeleton */}
            <div className="flex justify-between items-center mt-12 p-6 bg-neutral-50 dark:bg-neutral-800 rounded-xl skeleton-item">
                <div className="flex items-center gap-4">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-32"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-40"></div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-28"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                </div>
            </div>

            {/* Estadísticas skeleton */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 text-center skeleton-item"
                    >
                        <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-8 mx-auto mb-1"></div>
                        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16 mx-auto"></div>
                    </div>
                ))}
            </div>

            <p className="text-center text-neutral-500 dark:text-neutral-400 text-sm mt-8">
                Cargando información de torneos...
            </p>
        </div>
    );
}