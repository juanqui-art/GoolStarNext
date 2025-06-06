// src/components/equipos/EquiposLayout.tsx - CLIENT COMPONENT FOR ANIMATIONS
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/footer';
import Link from 'next/link';

// Registrar el plugin ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function EquiposLayout({ children }: { children: React.ReactNode }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const equiposListRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
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
    
    // Animación para la lista de equipos
    if (equiposListRef.current) {
      gsap.fromTo(
        equiposListRef.current,
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: equiposListRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }
    
    // Animación para la sección CTA
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.7, 
          ease: "power2.out",
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
          {/* Sophisticated Background Effects - Light/Dark Mode Optimized */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Primary Blue Orb - 20% Secondary Brand Usage */}
            <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-goal-blue-100 dark:bg-goal-blue-200 blur-3xl opacity-30 dark:opacity-40"></div>
            
            {/* Large Gold Orb - Strategic Brand Placement */}
            <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-goal-gold-100 dark:bg-goal-gold-200 blur-3xl opacity-25 dark:opacity-35"></div>
            
            {/* Accent Gold Dot - 8% Brand Strategic Use */}
            <div className="absolute top-1/3 left-1/4 w-20 h-20 rounded-full bg-goal-gold-200 dark:bg-goal-gold-300 blur-xl opacity-35 dark:opacity-50"></div>
            
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
                Equipos <span className="text-goal-blue dark:text-goal-gold">Participantes</span>
              </h1>
              
              <p 
                ref={descriptionRef}
                className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto"
              >
                Conoce a los equipos que forman parte de nuestros torneos. Cada uno trae su estilo único, 
                pasión y espíritu competitivo a las canchas de Gool⭐️Star.
              </p>
            </div>
          </div>
        </section>

        {/* Equipos List Section */}
        <section
          ref={equiposListRef}
          className="py-16 bg-white dark:bg-neutral-800"
        >
          <div className="container mx-auto px-4">
            <div className="relative">
              {/* Sophisticated Side Decorations - Optimized for Light/Dark */}
              <div className="hidden md:block absolute -left-6 top-1/3 w-12 h-12 rounded-full bg-goal-gold-100 dark:bg-goal-gold-200 opacity-40 dark:opacity-40"></div>
              <div className="hidden md:block absolute -right-6 bottom-1/4 w-12 h-12 rounded-full bg-goal-blue-100 dark:bg-goal-blue-200 opacity-40 dark:opacity-40"></div>
              
              {/* Título decorativo */}
              <div className="flex items-center justify-center mb-10">
                <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-goal-gold/50 mr-4"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-center text-neutral-800 dark:text-neutral-100">
                  Nuestros Equipos
                </h2>
                <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-goal-gold/50 ml-4"></div>
              </div>
              
              {/* Contenedor para el componente de server */}
              <div className="backdrop-blur-sm bg-white/50 dark:bg-neutral-800/50 rounded-2xl p-6 md:p-8 shadow-xl border border-neutral-200/50 dark:border-neutral-700/50">
                {children}
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action: Unirse al torneo */}
        <section 
          ref={ctaRef}
          className="py-20 bg-neutral-50 dark:bg-neutral-900"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-lg border border-neutral-200/80 dark:border-neutral-700/80">
              <div className="p-8 md:p-10 relative">
                {/* Sophisticated CTA Decorations - Light/Dark Optimized */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-goal-blue-50 dark:bg-goal-blue-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-40 dark:opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-goal-gold-50 dark:bg-goal-gold-100 rounded-full translate-y-1/2 -translate-x-1/2 opacity-40 dark:opacity-60"></div>
                
                <div className="text-center relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-800 dark:text-neutral-100">
                    ¿Tu equipo quiere participar?
                  </h3>
                  
                  <p className="text-neutral-600 dark:text-neutral-300 mb-8 max-w-xl mx-auto">
                    Únete a la comunidad de Gool⭐️Star y sé parte de nuestro próximo torneo. 
                    Inscribe a tu equipo y vive la emoción del fútbol indoor.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link 
                      href="/contacto" 
                      className="bg-goal-blue hover:bg-goal-blue/90 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      Inscribir mi equipo
                    </Link>
                    
                    <Link 
                      href="/torneos" 
                      className="bg-white dark:bg-neutral-700 border border-goal-gold hover:border-goal-gold/80 text-neutral-800 dark:text-neutral-200 font-medium py-3 px-8 rounded-full transition-all duration-300 hover:bg-goal-gold/5"
                    >
                      Ver torneos actuales
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
