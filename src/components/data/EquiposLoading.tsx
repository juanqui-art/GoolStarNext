'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function EquiposLoading() {
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
        <div className="w-full max-w-4xl mx-auto" ref={containerRef}>
            <h2 className="text-3xl font-heading text-center mb-6">
                Equipos Participantes
            </h2>
            
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 border border-neutral-200 dark:border-neutral-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div
                            key={index}
                            className="py-2 flex items-center space-x-3 skeleton-item"
                        >
                            <div className="w-2 h-2 rounded-full bg-goal-gold/40"></div>
                            <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                        </div>
                    ))}
                </div>
            </div>
            
            <p className="text-center text-neutral-500 dark:text-neutral-400 text-sm mt-4">
                Cargando equipos...
            </p>
        </div>
    );
}
