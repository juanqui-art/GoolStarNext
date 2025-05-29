'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/Navbar';
import TorneoActual from '@/components/torneos/TorneoActual';
import Link from 'next/link';

// Registrar el plugin ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Torneos() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroTextRef = useRef<HTMLParagraphElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);

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
    
    // Limpieza al desmontar
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Contenido de la página */}
      <div className="relative">
        <Navbar />
        
        <main>
          {/* Hero Section de Torneos */}
          <section 
            ref={heroRef}
            className="relative pt-24 pb-20  overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-goal-blue/10 blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-goal-gold/10 blur-3xl"></div>
            </div>
            
            <div className="container mx-auto px-4 relative z-10 mt-32">
              <div className="max-w-4xl mx-auto text-center">
                <h1 
                  ref={heroTitleRef}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-neutral-800 dark:text-neutral-100"
                >
                  Nuestros <span className="text-goal-gold">Torneos</span>
                </h1>
                
                <p 
                  ref={heroTextRef}
                  className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8"
                >
                  Descubre todos los torneos que Gool⭐️Star ofrece. Participa en competencias emocionantes,
                  forja nuevas amistades y demuestra tu talento en el campo.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Link 
                    href="#torneo-actual" 
                    className="bg-goal-blue hover:bg-goal-blue/90 text-white font-medium py-3 px-6 rounded-full transition-all shadow-sm hover:shadow-md"
                  >
                    Ver Torneo Actual
                  </Link>
                  
                  <Link 
                    href="#faqs" 
                    className="bg-white dark:bg-neutral-800 border border-goal-gold text-neutral-800 dark:text-neutral-200 font-medium py-3 px-6 rounded-full transition-all shadow-sm hover:shadow-md hover:bg-goal-gold/5"
                  >
                    Preguntas Frecuentes
                  </Link>
                </div>
              </div>
            </div>
          </section>
          
          {/* Torneo Actual */}
          <section id="torneo-actual">
            <TorneoActual />
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
                  <h3 className="text-xl font-bold mb-2 text-goal-blue dark:text-goal-gold">¿Cómo puedo inscribir a mi equipo?</h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    Para inscribir a tu equipo, debes completar el formulario de inscripción disponible en nuestra sección de contacto
                    y realizar el pago correspondiente. Nuestro equipo se pondrá en contacto contigo para confirmar tu participación.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <h3 className="text-xl font-bold mb-2 text-goal-blue dark:text-goal-gold">¿Cuál es el formato de los torneos?</h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    Nuestros torneos generalmente siguen un formato de fase de grupos seguido de eliminación directa.
                    Cada torneo puede tener variaciones específicas que se detallan en su página correspondiente.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <h3 className="text-xl font-bold mb-2 text-goal-blue dark:text-goal-gold">¿Qué premios se otorgan a los ganadores?</h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    Los premios varían según el torneo, pero generalmente incluyen premios en efectivo, trofeos y reconocimientos
                    individuales como mejor jugador, goleador y mejor portero. Los detalles específicos de los premios se anuncian
                    antes del inicio de cada torneo.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <h3 className="text-xl font-bold mb-2 text-goal-blue dark:text-goal-gold">¿Con qué frecuencia se organizan los torneos?</h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    Organizamos torneos de forma trimestral, con competencias especiales en temporadas de verano e invierno.
                    También planeamos torneos relámpago ocasionales durante fines de semana.
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-12">
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  ¿Tienes más preguntas sobre nuestros torneos?
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
        </main>
        
        <Footer />
      </div>
    </div>
  );
}