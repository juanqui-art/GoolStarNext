'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar el plugin ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TorneoActualProps {
  nombre?: string;
  fechaInicio?: string;
  costoInscripcion?: string;
  modalidad?: string;
  faseActual?: string;
}

export default function TorneoActual({
  nombre = "CATEGORÍA VARONES - PRIMER CAMPEONATO GOOL⭐️STAR",
  fechaInicio = "2025-03-15",
  costoInscripcion = "$100",
  modalidad = "Sin mundialitos (jugadores que no hayan participado en campeonatos del amistad club o mundialito)",
  faseActual = "Últimos partidos de la fase de grupos"
}: TorneoActualProps) {
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Timeline para animaciones secuenciales
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
    
    // Animación del título
    tl.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );
    
    // Animación de la información
    tl.fromTo(
      infoRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4" // Iniciar un poco antes de que termine la animación anterior
    );
    
    // Animación del estado actual
    tl.fromTo(
      statusRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.7)" },
      "-=0.2"
    );
    
    // Limpiar animaciones al desmontar
    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, []);
  
  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 relative overflow-hidden"
    >
      {/* Elementos decorativos sutiles */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-goal-blue/10 blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-goal-gold/10 blur-xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Estado actual del torneo - Destacado pero más neutro */}
        <div 
          ref={statusRef}
          className="mb-8 max-w-xl mx-auto"
        >
          <div className="bg-white dark:bg-neutral-800 border border-goal-gold/30 p-5 rounded-lg shadow-sm">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-1 rounded-full bg-goal-gold/10 text-goal-gold dark:text-goal-gold text-sm font-medium mb-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                EN CURSO
              </div>
              <h3 className="text-goal-blue dark:text-goal-gold font-bold text-xl mb-2">
                {faseActual}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">¡No te pierdas los últimos encuentros de esta fase!</p>
            </div>
          </div>
        </div>
        
        {/* Título del torneo */}
        <h2 
          ref={titleRef}
          className="text-3xl md:text-5xl font-bold text-center mb-8 text-neutral-800 dark:text-neutral-100"
        >
          <span className="text-goal-gold">{nombre}</span>
        </h2>
        
        {/* Información del torneo */}
        <div 
          ref={infoRef}
          className="max-w-3xl mx-auto bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-md mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="bg-goal-blue/10 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-goal-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-goal-blue">Modalidad</h3>
                <p className="text-neutral-700 dark:text-neutral-300 text-sm mt-1">{modalidad}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-goal-blue/10 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-goal-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-goal-blue">Fecha de inicio</h3>
                <p className="text-neutral-700 dark:text-neutral-300 text-sm mt-1">{new Date(fechaInicio).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-goal-orange/10 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-goal-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-goal-orange">Costo de inscripción</h3>
                <p className="text-neutral-700 dark:text-neutral-300 text-sm mt-1">{costoInscripcion}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-goal-orange/10 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-goal-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-goal-orange">Premios</h3>
                <p className="text-neutral-700 dark:text-neutral-300 text-sm mt-1">$1,900 en premios totales</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
          <Link 
            href="/tabla"
            className="bg-goal-blue hover:bg-goal-blue/90 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-sm inline-block text-center w-full sm:w-auto"
          >
            Ver tabla de posiciones
          </Link>
        </div>
      </div>
    </section>
  );
}
