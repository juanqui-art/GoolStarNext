// src/components/torneos/TorneosLayout.tsx - CLIENT COMPONENT PARA ANIMACIONES
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import {
    Trophy, Calendar, Users, Target,
    ArrowRight, Award,
    Zap, MapPin, Star
} from 'lucide-react';

// Registrar el plugin ScrollTrigger
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Interfaz para los datos del torneo (SSR)
interface TorneoData {
    nombre: string;
    equiposInscritos: number;
    categoria: string;
    fechaInicio: string;
    activo: boolean;
    fase?: string;
}

interface TorneosLayoutProps {
    children: React.ReactNode;
    torneoData: TorneoData;
}

export default function TorneosLayout({ children, torneoData }: TorneosLayoutProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const heroTitleRef = useRef<HTMLHeadingElement>(null);
    const heroTextRef = useRef<HTMLParagraphElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const faqsRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    useEffect(() => {

        // Animación de entrada para el hero
        const heroTl = gsap.timeline();

        heroTl.fromTo(
            heroTitleRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
        );

        heroTl.fromTo(
            heroTextRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
            "-=0.4"
        );

        // Animación para el timeline
        if (timelineRef.current) {
            const timelineItems = timelineRef.current.querySelectorAll('.timeline-item');
            gsap.fromTo(
                timelineItems,
                { x: -50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: timelineRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }

        // Animaciones para la sección FAQ
        if (faqsRef.current) {
            gsap.fromTo(
                faqsRef.current,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: faqsRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }

        // Animación para CTA
        if (ctaRef.current) {
            gsap.fromTo(
                ctaRef.current,
                { scale: 0.9, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.7,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: ctaRef.current,
                        start: "top 85%",
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

    // Datos derivados
    const fechaInicio = new Date(torneoData.fechaInicio).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Navbar con variant solid para evitar conflictos */}
            <Navbar variant="solid" />

            <main>
                {/* Hero Section Mejorado */}
                <section
                    ref={heroRef}
                    className="relative pt-28 pb-20 bg-gradient-to-br from-neutral-50 via-white to-goal-gold/5 dark:from-neutral-900 dark:via-neutral-800 dark:to-goal-gold/10 overflow-hidden"
                >
                    {/* Elementos decorativos */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-goal-blue/10 blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-goal-gold/10 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                        <div className="absolute top-1/2 left-1/2 w-20 h-20 rounded-full bg-goal-orange/15 blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            {/* Badge de estado dinámico */}
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                                torneoData.activo
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                    torneoData.activo ? 'bg-green-500 animate-pulse' : 'bg-blue-500'
                                }`}></div>
                                {torneoData.activo ? 'Torneo en Curso' : 'Próximo Torneo'}
                            </div>

                            <h1
                                ref={heroTitleRef}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-neutral-800 dark:text-neutral-100"
                            >
                                Nuestro <span className="text-goal-gold">Torneo</span>
                            </h1>

                            <p
                                ref={heroTextRef}
                                className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto"
                            >
                                {torneoData.activo
                                    ? `¡${torneoData.nombre} está en marcha! Únete a la emoción del fútbol indoor más competitivo de la región.`
                                    : `Prepárate para ${torneoData.nombre}. Las inscripciones comenzarán pronto.`
                                }
                            </p>

                            <div className="flex flex-wrap justify-center gap-4">
                                <Link
                                    href="#torneo-actual"
                                    className="bg-goal-blue hover:bg-goal-blue/90 text-white font-medium py-3 px-6 rounded-full transition-all shadow-sm hover:shadow-md transform hover:scale-105 flex items-center gap-2"
                                >
                                    <Trophy className="w-5 h-5" />
                                    Ver Detalles del Torneo
                                </Link>

                                <Link
                                    href="/tabla"
                                    className="bg-white dark:bg-neutral-800 border border-goal-gold text-neutral-800 dark:text-neutral-200 font-medium py-3 px-6 rounded-full transition-all shadow-sm hover:shadow-md hover:bg-goal-gold/5 flex items-center gap-2"
                                >
                                    <Target className="w-5 h-5" />
                                    Tabla de Posiciones
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contenido dinámico desde server components */}
                {children}

                {/* Timeline del Torneo */}
                <section
                    ref={timelineRef}
                    className="py-20 bg-neutral-50 dark:bg-neutral-900"
                >
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                                Cronología del <span className="text-goal-gold">Torneo</span>
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                                Sigue el desarrollo completo de nuestro campeonato
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <div className="relative">
                                {/* Línea del timeline */}
                                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-goal-blue via-goal-gold to-goal-orange"></div>

                                <div className="space-y-8">
                                    {/* Fase de Inscripción */}
                                    <div className="timeline-item flex items-start gap-6">
                                        <div className="flex-shrink-0 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center border-4 border-white dark:border-neutral-900 shadow-lg">
                                            <Users className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Inscripciones Cerradas</h3>
                                                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs">Completado</span>
                                            </div>
                                            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                                                {fechaInicio} - Se inscribieron {torneoData.equiposInscritos} equipos listos para competir.
                                            </p>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-500">
                                                ✓ Pago de inscripción • ✓ Documentación completa • ✓ Sorteo de grupos
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fase de Grupos */}
                                    <div className="timeline-item flex items-start gap-6">
                                        <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center border-4 border-white dark:border-neutral-900 shadow-lg ${
                                            torneoData.activo ? 'bg-goal-blue' : 'bg-goal-blue opacity-60'
                                        }`}>
                                            <Trophy className="w-8 h-8 text-white" />
                                        </div>
                                        <div className={`bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 flex-1 ${
                                            !torneoData.activo ? 'opacity-60' : ''
                                        }`}>
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Fase de Grupos</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    torneoData.activo
                                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 animate-pulse'
                                                        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                                                }`}>
                          {torneoData.activo ? 'En Curso' : 'Próximamente'}
                        </span>
                                            </div>
                                            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                                                Los equipos luchan por clasificar a octavos en emocionantes encuentros.
                                            </p>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-500">
                                                ⚽ Partidos de grupos • 🎯 Clasificación directa
                                            </div>
                                        </div>
                                    </div>

                                    {/* Eliminatorias */}
                                    <div className="timeline-item flex items-start gap-6">
                                        <div className="flex-shrink-0 w-16 h-16 bg-goal-gold rounded-full flex items-center justify-center border-4 border-white dark:border-neutral-900 shadow-lg opacity-60">
                                            <Award className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 flex-1 opacity-60">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Fase Eliminatoria</h3>
                                                <span className="bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 px-2 py-1 rounded-full text-xs">Próximamente</span>
                                            </div>
                                            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                                                Octavos, cuartos, semifinales y la gran final del campeonato.
                                            </p>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-500">
                                                🏆 Eliminación directa • 💰 Premios millonarios
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Acceso Rápido */}
                <section className="py-16 bg-white dark:bg-neutral-800">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                                Acceso <span className="text-goal-gold">Rápido</span>
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                                Todo lo que necesitas saber sobre el torneo en un solo lugar
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            <Link
                                href="/tabla"
                                className="group bg-gradient-to-br from-goal-blue/5 to-goal-blue/10 dark:from-goal-blue/10 dark:to-goal-blue/20 rounded-xl p-6 border border-goal-blue/20 hover:border-goal-blue/40 transition-all duration-300 hover:shadow-lg hover:shadow-goal-blue/10"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-goal-blue/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Trophy className="w-6 h-6 text-goal-blue" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Tabla de Posiciones</h3>
                                </div>
                                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                                    Consulta las posiciones actuales de todos los equipos por grupo.
                                </p>
                                <div className="flex items-center text-goal-blue text-sm font-medium group-hover:translate-x-1 transition-transform">
                                    Ver clasificación <ArrowRight className="w-4 h-4 ml-2" />
                                </div>
                            </Link>

                            <Link
                                href="/partidos"
                                className="group bg-gradient-to-br from-goal-gold/5 to-goal-gold/10 dark:from-goal-gold/10 dark:to-goal-gold/20 rounded-xl p-6 border border-goal-gold/20 hover:border-goal-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-goal-gold/10"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-goal-gold/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Calendar className="w-6 h-6 text-goal-gold" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Calendario de Partidos</h3>
                                </div>
                                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                                    Próximos partidos, resultados y estadísticas completas.
                                </p>
                                <div className="flex items-center text-goal-gold text-sm font-medium group-hover:translate-x-1 transition-transform">
                                    Ver partidos <ArrowRight className="w-4 h-4 ml-2" />
                                </div>
                            </Link>

                            <Link
                                href="/goleadores"
                                className="group bg-gradient-to-br from-goal-orange/5 to-goal-orange/10 dark:from-goal-orange/10 dark:to-goal-orange/20 rounded-xl p-6 border border-goal-orange/20 hover:border-goal-orange/40 transition-all duration-300 hover:shadow-lg hover:shadow-goal-orange/10"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-goal-orange/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Target className="w-6 h-6 text-goal-orange" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Máximos Goleadores</h3>
                                </div>
                                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                                    Ranking de los jugadores con más goles en el torneo.
                                </p>
                                <div className="flex items-center text-goal-orange text-sm font-medium group-hover:translate-x-1 transition-transform">
                                    Ver goleadores <ArrowRight className="w-4 h-4 ml-2" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* FAQs sobre torneos */}
                <section
                    id="faqs"
                    ref={faqsRef}
                    className="py-20 bg-neutral-50 dark:bg-neutral-900"
                >
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                            Preguntas <span className="text-goal-gold">Frecuentes</span>
                        </h2>

                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold mb-2 text-goal-blue dark:text-goal-gold flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    ¿Cuándo terminará este torneo?
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-300">
                                    El {torneoData.nombre} está programado para finalizar en <strong>Junio 2025</strong>.
                                    {torneoData.activo
                                        ? ' Actualmente estamos en la fase de grupos, luego seguirán las eliminatorias hasta la gran final.'
                                        : ' Las inscripciones comenzarán pronto y el torneo iniciará según el cronograma establecido.'
                                    }
                                </p>
                            </div>

                            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold mb-2 text-goal-blue dark:text-goal-gold flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    ¿Dónde se juegan los partidos?
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-300">
                                    Todos los partidos se disputan en nuestras instalaciones oficiales: <strong>CANCHA ️GOAL⭐️STAR </strong>
                                    ubicada en Pumayunga (junto antena Claro). Contamos con canchas de primera calidad para fútbol indoor.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold mb-2 text-goal-blue dark:text-goal-gold flex items-center gap-2">
                                    <Trophy className="w-5 h-5" />
                                    ¿Cuáles son los premios del torneo?
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-300">
                                    Tenemos un total de <strong>$1,900 en premios</strong> distribuidos entre los primeros lugares,
                                    más premios individuales como mejor jugador, goleador y mejor portero. Los detalles completos
                                    se anunciarán antes de la fase final.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold mb-2 text-goal-blue dark:text-goal-gold flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    ¿Cuándo será el próximo torneo?
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-300">
                                    Estamos planeando organizar torneos de forma <strong>trimestral</strong>. Una vez que termine
                                    este campeonato, anunciaremos las fechas de inscripción para el siguiente.
                                    ¡Síguenos para estar al tanto!
                                </p>
                            </div>
                        </div>

                        <div className="text-center mt-12">
                            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                                ¿Tienes más preguntas sobre nuestro torneo?
                            </p>
                            <Link
                                href="/contacto"
                                className="inline-flex items-center bg-goal-blue hover:bg-goal-blue/90 text-white font-medium py-2 px-6 rounded-full transition-all shadow-sm hover:shadow-md"
                            >
                                Contáctanos
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA Final */}
                <section
                    ref={ctaRef}
                    className="py-20 bg-gradient-to-br from-goal-blue/5 via-goal-gold/5 to-goal-orange/5 dark:from-goal-blue/10 dark:via-goal-gold/10 dark:to-goal-orange/10"
                >
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-xl border border-neutral-200/80 dark:border-neutral-700/80 relative">
                                {/* Elementos decorativos */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-goal-blue/5 dark:bg-goal-blue/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-goal-gold/5 dark:bg-goal-gold/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                                <div className="p-8 md:p-12 relative z-10">
                                    <div className="text-center">
                                        {/* Badge especial */}
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-goal-gold/10 text-goal-gold rounded-full text-sm font-medium mb-6">
                                            <Star className="w-4 h-4" />
                                            {torneoData.activo ? 'Torneo en Curso' : 'Próximo Torneo 2025'}
                                        </div>

                                        <h3 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-800 dark:text-neutral-100">
                                            {torneoData.activo
                                                ? <>¿Tu equipo quiere unirse a la <span className="text-goal-gold block mt-2">próxima edición?</span></>
                                                : <>¿Tu equipo quiere ser parte de la <span className="text-goal-gold block mt-2">próxima historia?</span></>
                                            }
                                        </h3>

                                        <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8 max-w-2xl mx-auto">
                                            {torneoData.activo
                                                ? 'Las inscripciones para nuestro segundo torneo se abrirán pronto. Sé el primero en asegurar tu lugar en la siguiente edición de Gool⭐️Star.'
                                                : 'Prepárate para formar parte de la historia del fútbol indoor. Las inscripciones comenzarán pronto para esta nueva aventura.'
                                            }
                                        </p>

                                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                            <Link
                                                href="/contacto"
                                                className="bg-goal-blue hover:bg-goal-blue/90 text-white font-medium py-4 px-8 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center gap-2"
                                            >
                                                <Users className="w-5 h-5" />
                                                {torneoData.activo ? 'Pre-Inscribir mi equipo' : 'Inscribir mi equipo'}
                                            </Link>

                                            <Link
                                                href="/equipos"
                                                className="bg-white dark:bg-neutral-700 border border-goal-gold hover:border-goal-gold/80 text-neutral-800 dark:text-neutral-200 font-medium py-4 px-8 rounded-full transition-all duration-300 hover:bg-goal-gold/5 flex items-center gap-2"
                                            >
                                                <Trophy className="w-5 h-5" />
                                                Ver equipos {torneoData.activo ? 'actuales' : 'participantes'}
                                            </Link>
                                        </div>

                                        {/* Incentivo adicional */}
                                        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                                            <div className="flex items-center justify-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span>Inscripción temprana con descuento</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-goal-gold rounded-full"></div>
                                                    <span>Premios incrementados</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-goal-blue rounded-full"></div>
                                                    <span>Nuevas categorías</span>
                                                </div>
                                            </div>
                                        </div>
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