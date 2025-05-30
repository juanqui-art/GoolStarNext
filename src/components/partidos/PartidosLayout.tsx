// src/components/partidos/PartidosLayout.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/footer';
import Link from 'next/link';

// Registrar el plugin ScrollTrigger
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function PartidosLayout({ children }: { children: React.ReactNode }) {
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const partidosListRef = useRef<HTMLDivElement>(null);
    const navbarContainerRef = useRef<HTMLDivElement>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        // Control del fondo del navbar al hacer scroll
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);

        // Animación de entrada para el hero
        const heroTl = gsap.timeline();

        heroTl.fromTo(
            titleRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
        );

        heroTl.fromTo(
            descriptionRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
            "-=0.4"
        );

        // Animación para la lista de partidos
        if (partidosListRef.current) {
            gsap.fromTo(
                partidosListRef.current,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: partidosListRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }

        // Limpieza al desmontar
        return () => {
            window.removeEventListener('scroll', handleScroll);
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Contenedor del navbar con transición */}
            <div
                ref={navbarContainerRef}
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 
          ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm dark:bg-neutral-900/95' : 'bg-transparent'}`}
            >
                <Navbar />
            </div>

            <main>
                {/* Hero Section */}
                <section
                    ref={heroRef}
                    className="relative pt-28 pb-16 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800"
                >
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-goal-orange/10 blur-3xl"></div>
                        <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-goal-blue/10 blur-3xl"></div>
                        <div className="absolute top-1/3 left-1/4 w-20 h-20 rounded-full bg-goal-gold/20 blur-xl"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1
                                ref={titleRef}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-neutral-800 dark:text-neutral-100"
                            >
                                <span className="text-goal-orange">Partidos</span> y Resultados
                            </h1>

                            <p
                                ref={descriptionRef}
                                className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto"
                            >
                                Sigue todos los encuentros del torneo, consulta resultados, horarios
                                y mantente al día con el calendario de partidos de Gool⭐️Star.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Filtros Rápidos */}
                <section className="py-8 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                            <Link
                                href="/partidos"
                                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-goal-orange dark:hover:border-goal-orange text-neutral-700 dark:text-neutral-300 hover:text-goal-orange px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium"
                            >
                                Todos los partidos
                            </Link>

                            <Link
                                href="/partidos?estado=programado"
                                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-goal-blue dark:hover:border-goal-blue text-neutral-700 dark:text-neutral-300 hover:text-goal-blue px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium"
                            >
                                Próximos partidos
                            </Link>

                            <Link
                                href="/partidos?estado=completado"
                                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-green-500 dark:hover:border-green-500 text-neutral-700 dark:text-neutral-300 hover:text-green-600 px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium"
                            >
                                Resultados
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Lista de Partidos */}
                <section
                    ref={partidosListRef}
                    className="py-16 bg-white dark:bg-neutral-800"
                >
                    <div className="container mx-auto px-4">
                        <div className="relative">
                            {/* Contenedor para el componente de server */}
                            <div className="backdrop-blur-sm bg-white/50 dark:bg-neutral-800/50 rounded-2xl p-6 md:p-8 shadow-xl border border-neutral-200/50 dark:border-neutral-700/50">
                                {children}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-lg border border-neutral-200/80 dark:border-neutral-700/80">
                            <div className="p-8 md:p-10 relative">
                                <div className="text-center relative z-10">
                                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-800 dark:text-neutral-100">
                                        ¿No encuentras un partido específico?
                                    </h3>

                                    <p className="text-neutral-600 dark:text-neutral-300 mb-8 max-w-xl mx-auto">
                                        Explora la tabla de posiciones para ver el rendimiento de los equipos
                                        o consulta la página de equipos para más información.
                                    </p>

                                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                        <Link
                                            href="/tabla"
                                            className="bg-goal-orange hover:bg-goal-orange/90 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                                        >
                                            Ver tabla de posiciones
                                        </Link>

                                        <Link
                                            href="/equipos"
                                            className="bg-white dark:bg-neutral-700 border border-goal-blue hover:border-goal-blue/80 text-neutral-800 dark:text-neutral-200 font-medium py-3 px-8 rounded-full transition-all duration-300 hover:bg-goal-blue/5"
                                        >
                                            Ver equipos
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}