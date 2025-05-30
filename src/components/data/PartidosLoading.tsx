// src/components/data/PartidosLoading.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PartidosLoading() {
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
                Cargando Partidos
            </h2>

            {/* Grid de skeleton cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700 skeleton-item"
                    >
                        {/* Header skeleton */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20"></div>
                            </div>
                            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                        </div>

                        {/* Equipos skeleton */}
                        <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between">
                                <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-32"></div>
                                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-6"></div>
                            </div>

                            <div className="w-full h-px bg-neutral-200 dark:bg-neutral-700"></div>

                            <div className="flex items-center justify-between">
                                <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-28"></div>
                                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-6"></div>
                            </div>
                        </div>

                        {/* Footer skeleton */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-12"></div>
                            </div>
                            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-20"></div>
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-center text-neutral-500 dark:text-neutral-400 text-sm mt-8">
                Cargando información de partidos...
            </p>
        </div>
    );
}