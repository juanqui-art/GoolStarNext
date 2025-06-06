// src/components/goleadores/GoleadoresLayout.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/footer';
import Link from 'next/link';
import { Target, Trophy, Users, BarChart3 } from 'lucide-react';

// Registrar el plugin ScrollTrigger
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function GoleadoresLayout({ children }: { children: React.ReactNode }) {
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const goleadoresListRef = useRef<HTMLDivElement>(null);
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

        // Animación para la lista de goleadores
        if (goleadoresListRef.current) {
            gsap.fromTo(
                goleadoresListRef.current,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: goleadoresListRef.current,
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
                    className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 bg-gradient-to-br from-neutral-50 via-white to-goal-gold/5 dark:from-neutral-900 dark:via-neutral-800 dark:to-goal-gold/10"
                >
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Sophisticated Background Effects - Light/Dark Mode Optimized */}
                        {/* Primary Gold Orb - 20% Secondary Brand Usage */}
                        <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-goal-gold-100 dark:bg-goal-gold-200 blur-3xl opacity-30 dark:opacity-40"></div>
                        
                        {/* Large Orange Orb - Strategic Brand Placement */}
                        <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-goal-orange-100 dark:bg-goal-orange-200 blur-3xl opacity-25 dark:opacity-35"></div>
                        
                        {/* Accent Blue Dot - 8% Brand Strategic Use */}
                        <div className="absolute top-1/3 left-1/4 w-20 h-20 rounded-full bg-goal-blue-200 dark:bg-goal-blue-300 blur-xl opacity-35 dark:opacity-50"></div>
                        
                        {/* Additional Neutral Elements - 72% Base Usage */}
                        <div className="absolute top-1/2 right-1/3 w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-700 blur-2xl opacity-15 dark:opacity-20"></div>
                        <div className="absolute bottom-1/4 right-20 w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 blur-xl opacity-12 dark:opacity-15"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1
                                ref={titleRef}
                                className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 text-neutral-800 dark:text-neutral-100"
                            >
                                Máximos <span className="text-goal-gold">Goleadores</span>
                            </h1>

                            <p
                                ref={descriptionRef}
                                className="text-base md:text-lg lg:text-xl text-neutral-600 dark:text-neutral-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-2 sm:px-0"
                            >
                                Descubre quiénes son los artilleros del torneo. Consulta estadísticas de goles,
                                promedios por partido y el ranking de los máximos anotadores de Gool⭐️Star.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Filtros Rápidos */}
                <section className="py-5 sm:py-8 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="container mx-auto px-3 sm:px-4">
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 max-w-4xl mx-auto">
                            <Link
                                href="/goleadores"
                                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-goal-gold dark:hover:border-goal-gold text-neutral-700 dark:text-neutral-300 hover:text-goal-gold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2"
                            >
                                <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                                Todos los goleadores
                            </Link>

                            <Link
                                href="/goleadores?limite=10"
                                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-goal-orange dark:hover:border-goal-orange text-neutral-700 dark:text-neutral-300 hover:text-goal-orange px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2"
                            >
                                <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                                Top 10
                            </Link>

                            <Link
                                href="/goleadores?limite=5"
                                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-goal-blue dark:hover:border-goal-blue text-neutral-700 dark:text-neutral-300 hover:text-goal-blue px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2"
                            >
                                <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                                Top 5
                            </Link>

                            <Link
                                href="/equipos"
                                className="bg-goal-blue hover:bg-goal-blue/90 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2"
                            >
                                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                                Ver equipos
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Lista de Goleadores */}
                <section
                    ref={goleadoresListRef}
                    className="py-12 sm:py-16 bg-white dark:bg-neutral-800"
                >
                    <div className="container mx-auto px-3 sm:px-4">
                        <div className="relative">
                            {/* Sophisticated Side Decorations - Optimized for Light/Dark */}
                            <div className="hidden md:block absolute -left-6 top-1/3 w-12 h-12 rounded-full bg-goal-gold-100 dark:bg-goal-gold-200 opacity-40 dark:opacity-40"></div>
                            <div className="hidden md:block absolute -right-6 bottom-1/4 w-12 h-12 rounded-full bg-goal-orange-100 dark:bg-goal-orange-200 opacity-40 dark:opacity-40"></div>
                            
                            {/* Contenedor para el componente de server */}
                            <div className="backdrop-blur-sm bg-white/50 dark:bg-neutral-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-neutral-200/50 dark:border-neutral-700/50">
                                {children}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Información sobre goleadores */}
                <section className="py-12 sm:py-16 bg-neutral-50 dark:bg-neutral-900">
                    <div className="container mx-auto px-3 sm:px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-12 text-neutral-800 dark:text-neutral-100">
                                Sobre los <span className="text-goal-gold">Goleadores</span>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
                                {/* Criterios de ranking */}
                                <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 sm:p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-goal-gold/20 rounded-lg flex items-center justify-center">
                                            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-goal-gold" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                                            Ranking
                                        </h3>
                                    </div>
                                    <ul className="space-y-1.5 sm:space-y-2 text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm">
                                        <li>• Total de goles marcados</li>
                                        <li>• Promedio por partido</li>
                                        <li>• Goles en partidos decisivos</li>
                                        <li>• Eficiencia en el área</li>
                                    </ul>
                                </div>

                                {/* Tipos de goles */}
                                <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 sm:p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-goal-orange/20 rounded-lg flex items-center justify-center">
                                            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-goal-orange" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                                            Tipos de Gol
                                        </h3>
                                    </div>
                                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                                            <span className="text-neutral-600 dark:text-neutral-400">Gol normal</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                                            <span className="text-neutral-600 dark:text-neutral-400">Autogol</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                                            <span className="text-neutral-600 dark:text-neutral-400">Penal</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Estadísticas */}
                                <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 sm:p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-goal-blue/20 rounded-lg flex items-center justify-center">
                                            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-goal-blue" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                                            Estadísticas
                                        </h3>
                                    </div>
                                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                                        <div>• Goles por partido</div>
                                        <div>• Minutos jugados</div>
                                        <div>• Efectividad por disparo</div>
                                        <div>• Racha goleadora</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-12 sm:py-20 bg-white dark:bg-neutral-800">
                    <div className="container mx-auto px-3 sm:px-4">
                        <div className="max-w-3xl mx-auto bg-gradient-to-r from-goal-gold/5 to-goal-orange/5 dark:from-goal-gold/10 dark:to-goal-orange/10 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-neutral-200/80 dark:border-neutral-700/80">
                            <div className="p-6 sm:p-8 md:p-10 relative">
                                {/* Elementos decorativos de fondo */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-goal-gold/10 rounded-full blur-2xl -translate-y-8 translate-x-8"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-goal-orange/10 rounded-full blur-xl translate-y-6 -translate-x-6"></div>

                                <div className="text-center relative z-10">
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-neutral-800 dark:text-neutral-100">
                                        ¿Quieres ser goleador?
                                    </h3>

                                    <p className="text-neutral-600 dark:text-neutral-300 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
                                        Únete al próximo torneo y demuestra tus habilidades goleadoras.
                                        ¡Tal vez seas el próximo en aparecer en esta tabla!
                                    </p>

                                    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
                                        {/* Botón primario - Dorado */}
                                        <Link
                                            href="/contacto"
                                            className="group relative bg-goal-gold/60 hover:bg-goal-gold/90 text-white font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-4 focus:ring-goal-gold/30 text-sm sm:text-base w-full sm:w-auto"
                                        >
                                            <span className="relative z-10">Inscribir mi equipo</span>
                                            {/* Efecto de brillo */}
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></div>
                                        </Link>

                                        {/* Botón secundario - Azul */}
                                        <Link
                                            href="/partidos"
                                            className="group relative bg-goal-blue hover:bg-goal-blue/90 text-white font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-4 focus:ring-goal-blue/30 text-sm sm:text-base w-full sm:w-auto"
                                        >
                                            <span className="relative z-10">Ver partidos</span>
                                            {/* Efecto de brillo */}
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></div>
                                        </Link>

                                        {/* Botón terciario - Contorno */}
                                        <Link
                                            href="/tabla"
                                            className="group relative bg-white dark:bg-neutral-700 border-2 border-goal-orange hover:border-goal-orange/80 hover:bg-goal-orange/5 dark:hover:bg-goal-orange/10 text-neutral-800 dark:text-neutral-200 hover:text-goal-orange dark:hover:text-goal-orange font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-4 focus:ring-goal-orange/30 text-sm sm:text-base w-full sm:w-auto"
                                        >
                                            <span className="relative z-10">Tabla posiciones</span>
                                            {/* Efecto de brillo sutil */}
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-goal-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </Link>
                                    </div>

                                    {/* Texto adicional pequeño */}
                                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-4 sm:mt-6">
                                        ¿Tienes preguntas?
                                        <Link href="/contacto" className="ml-1 text-goal-blue hover:text-goal-blue/80 underline transition-colors">
                                            Contáctanos aquí
                                        </Link>
                                    </p>
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