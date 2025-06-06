'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/footer';
import Link from 'next/link';
import { Trophy, Target, Medal, BarChart3 } from 'lucide-react';

// Registrar el plugin ScrollTrigger
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TablaLayout({ children }: { children: React.ReactNode }) {
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const tablaListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

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

        // Animación para la tabla
        if (tablaListRef.current) {
            gsap.fromTo(
                tablaListRef.current,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: tablaListRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }

        // Limpieza al desmontar
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Navbar con variant solid para evitar conflictos */}
            <Navbar variant="solid" />

            <main>
                {/* Hero Section */}
                <section
                    ref={heroRef}
                    className="relative pt-28 pb-16 bg-gradient-to-br from-neutral-50 via-white to-goal-gold/5 dark:from-neutral-900 dark:via-neutral-800 dark:to-goal-gold/10"
                >
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Sophisticated Background Effects - Light/Dark Mode Optimized */}
                        {/* Primary Gold Orb - 20% Secondary Brand Usage */}
                        <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-goal-gold-100 dark:bg-goal-gold-200 blur-3xl opacity-30 dark:opacity-40"></div>
                        
                        {/* Large Blue Orb - Strategic Brand Placement */}
                        <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-goal-blue-100 dark:bg-goal-blue-200 blur-3xl opacity-25 dark:opacity-35"></div>
                        
                        {/* Accent Orange Dot - 8% Brand Strategic Use */}
                        <div className="absolute top-1/3 left-1/4 w-20 h-20 rounded-full bg-goal-orange-200 dark:bg-goal-orange-300 blur-xl opacity-35 dark:opacity-50"></div>
                        
                        {/* Additional Neutral Elements - 72% Base Usage */}
                        <div className="absolute top-1/2 right-1/3 w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-700 blur-2xl opacity-15 dark:opacity-20"></div>
                        <div className="absolute bottom-1/4 right-20 w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 blur-xl opacity-12 dark:opacity-15"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1
                                ref={titleRef}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-neutral-800 dark:text-neutral-100"
                            >
                                Tabla de <span className="text-goal-gold">Posiciones</span>
                            </h1>

                            <p
                                ref={descriptionRef}
                                className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto"
                            >
                                Sigue la clasificación actualizada del torneo. Consulta puntos, partidos jugados,
                                diferencia de goles y la lucha por los primeros puestos en Gool⭐️Star.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Filtros Rápidos */}
                <section className="py-8 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                            <Link
                                href="/tabla"
                                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-goal-gold dark:hover:border-goal-gold text-neutral-700 dark:text-neutral-300 hover:text-goal-gold px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium flex items-center gap-2"
                            >
                                <Trophy className="w-4 h-4" />
                                General
                            </Link>

                            <Link
                                href="/tabla?grupo=a"
                                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-goal-blue dark:hover:border-goal-blue text-neutral-700 dark:text-neutral-300 hover:text-goal-blue px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium flex items-center gap-2"
                            >
                                <Target className="w-4 h-4" />
                                Grupo A
                            </Link>

                            <Link
                                href="/tabla?grupo=b"
                                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-goal-blue dark:hover:border-goal-blue text-neutral-700 dark:text-neutral-300 hover:text-goal-blue px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium flex items-center gap-2"
                            >
                                <Target className="w-4 h-4" />
                                Grupo B
                            </Link>

                            {/*<Link*/}
                            {/*    href="/tabla?grupo=c"*/}
                            {/*    className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-goal-blue dark:hover:border-goal-blue text-neutral-700 dark:text-neutral-300 hover:text-goal-blue px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium flex items-center gap-2"*/}
                            {/*>*/}
                            {/*    <Target className="w-4 h-4" />*/}
                            {/*    Grupo C*/}
                            {/*</Link>*/}

                            <Link
                                href="/tabla?actualizar=true"
                                className="bg-goal-orange hover:bg-goal-orange/90 text-white px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium flex items-center gap-2"
                            >
                                <BarChart3 className="w-4 h-4" />
                                Actualizar
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Tabla de Posiciones */}
                <section
                    ref={tablaListRef}
                    className="py-16 bg-white dark:bg-neutral-800"
                >
                    <div className="container mx-auto px-4">
                        <div className="relative">
                            {/* Sophisticated Side Decorations - Optimized for Light/Dark */}
                            <div className="hidden md:block absolute -left-6 top-1/3 w-12 h-12 rounded-full bg-goal-gold-100 dark:bg-goal-gold-200 opacity-40 dark:opacity-40"></div>
                            <div className="hidden md:block absolute -right-6 bottom-1/4 w-12 h-12 rounded-full bg-goal-blue-100 dark:bg-goal-blue-200 opacity-40 dark:opacity-40"></div>
                            
                            {/* Contenedor para el componente de server */}
                            <div className="backdrop-blur-sm bg-white/50 dark:bg-neutral-800/50 rounded-2xl p-6 md:p-8 shadow-xl border border-neutral-200/50 dark:border-neutral-700/50">
                                {children}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Información sobre clasificación */}
                <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-neutral-800 dark:text-neutral-100">
                                Sistema de <span className="text-goal-gold">Clasificación</span>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Criterios de puntuación */}
                                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-goal-gold/20 rounded-lg flex items-center justify-center">
                                            <Trophy className="w-5 h-5 text-goal-gold" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                                            Puntuación
                                        </h3>
                                    </div>
                                    <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
                                        <li className="flex justify-between">
                                            <span>Victoria:</span>
                                            <span className="font-medium text-green-600">3 puntos</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Empate:</span>
                                            <span className="font-medium text-yellow-600">1 punto</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Derrota:</span>
                                            <span className="font-medium text-red-600">0 puntos</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Criterios de desempate */}
                                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-goal-blue/20 rounded-lg flex items-center justify-center">
                                            <Target className="w-5 h-5 text-goal-blue" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                                            Desempate
                                        </h3>
                                    </div>
                                    <ol className="space-y-2 text-neutral-600 dark:text-neutral-400 list-decimal list-inside">
                                        <li className="text-sm">Puntos totales</li>
                                        <li className="text-sm">Diferencia de goles</li>
                                        <li className="text-sm">Goles a favor</li>
                                        <li className="text-sm">Partidos ganados</li>
                                        <li className="text-sm">Enfrentamiento directo</li>
                                    </ol>
                                </div>

                                {/* Clasificación */}
                                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-goal-orange/20 rounded-lg flex items-center justify-center">
                                            <Medal className="w-5 h-5 text-goal-orange" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                                            Clasificación
                                        </h3>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="text-neutral-600 dark:text-neutral-400">Clasifican a octavos</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            <span className="text-neutral-600 dark:text-neutral-400">Repechaje</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <span className="text-neutral-600 dark:text-neutral-400">Eliminados</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-20 bg-white dark:bg-neutral-800">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto bg-gradient-to-r from-goal-blue/5 to-goal-gold/5 dark:from-goal-blue/10 dark:to-goal-gold/10 rounded-2xl overflow-hidden shadow-lg border border-neutral-200/80 dark:border-neutral-700/80">
                            <div className="p-8 md:p-10 relative">
                                <div className="text-center relative z-10">
                                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-800 dark:text-neutral-100">
                                        ¿Quieres ver los partidos?
                                    </h3>

                                    <p className="text-neutral-600 dark:text-neutral-300 mb-8 max-w-xl mx-auto">
                                        Consulta el calendario completo de partidos, resultados recientes
                                        y conoce a los equipos que luchan por el primer lugar.
                                    </p>

                                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                        <Link
                                            href="/partidos"
                                            className="bg-goal-blue hover:bg-goal-blue/90 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                                        >
                                            Ver partidos
                                        </Link>

                                        <Link
                                            href="/equipos"
                                            className="bg-white dark:bg-neutral-700 border border-goal-gold hover:border-goal-gold/80 text-neutral-800 dark:text-neutral-200 font-medium py-3 px-8 rounded-full transition-all duration-300 hover:bg-goal-gold/5"
                                        >
                                            Ver equipos
                                        </Link>

                                        <Link
                                            href="/goleadores"
                                            className="bg-goal-gold hover:bg-goal-gold/90 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                                        >
                                            Goleadores
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