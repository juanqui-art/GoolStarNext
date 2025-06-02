// src/components/data/TorneoEquiposLoading.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function TorneoEquiposLoading() {
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
        <section className="py-16 bg-neutral-950" ref={containerRef}>
            <div className="container mx-auto px-4">
                {/* Título skeleton */}
                <div className="text-center mb-12">
                    <div className="h-10 bg-neutral-800 rounded w-80 mx-auto mb-4 skeleton-item animate-pulse"></div>

                    {/* Stats skeleton */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-neutral-800 px-4 py-2 rounded-full">
                                <div className="h-4 bg-neutral-700 rounded w-20 skeleton-item animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grupos skeleton */}
                <div className="space-y-12">
                    {Array.from({ length: 2 }).map((_, groupIndex) => (
                        <div key={groupIndex}>
                            {/* Título del grupo skeleton */}
                            <div className="flex items-center justify-center mb-8">
                                <div className="h-px bg-neutral-700 flex-1"></div>
                                <div className="h-6 bg-neutral-700 rounded w-24 mx-6 skeleton-item animate-pulse"></div>
                                <div className="h-px bg-neutral-700 flex-1"></div>
                            </div>

                            {/* Grid de equipos skeleton */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 skeleton-item"
                                    >
                                        {/* Logo/imagen skeleton */}
                                        <div className="aspect-square w-full bg-neutral-800 animate-pulse relative">
                                            <div className="absolute top-2 right-2 w-6 h-6 bg-neutral-700 rounded-full animate-pulse"></div>
                                        </div>

                                        {/* Información del equipo skeleton */}
                                        <div className="p-4 space-y-2">
                                            <div className="h-5 bg-neutral-800 rounded w-3/4 animate-pulse"></div>
                                            <div className="h-4 bg-neutral-800 rounded w-1/2 animate-pulse"></div>
                                            <div className="h-3 bg-neutral-800 rounded w-2/3 animate-pulse"></div>

                                            {/* Nivel skeleton */}
                                            <div className="flex items-center gap-1 mt-2">
                                                <div className="h-3 bg-neutral-800 rounded w-8 animate-pulse"></div>
                                                <div className="flex gap-0.5">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <div key={i} className="w-1.5 h-1.5 bg-neutral-700 rounded-full animate-pulse"></div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer skeleton */}
                <div className="mt-12 text-center">
                    <div className="h-12 bg-neutral-800 rounded-full w-48 mx-auto mb-4 skeleton-item animate-pulse"></div>
                    <div className="h-4 bg-neutral-800 rounded w-40 mx-auto skeleton-item animate-pulse"></div>
                </div>
            </div>
        </section>
    );
}