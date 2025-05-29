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

export default function TerminosPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animaciones para la entrada de elementos
    const heroTl = gsap.timeline();
    
    heroTl.fromTo(
      titleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );
    
    // Animación para las secciones de contenido
    if (sectionsRef.current) {
      const sections = sectionsRef.current.querySelectorAll('.content-section');
      
      gsap.fromTo(
        sections,
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionsRef.current,
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
    <div className="min-h-screen relative">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="relative py-20"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-goal-blue/10 blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-goal-gold/10 blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 
                ref={titleRef}
                className="text-4xl md:text-5xl font-bold mb-6 text-neutral-800 dark:text-neutral-100"
              >
                Términos y <span className="text-goal-blue dark:text-goal-gold">Condiciones</span>
              </h1>
            </div>
          </div>
        </section>

        {/* Contenido */}
        <section className="py-12 bg-white dark:bg-neutral-800">
          <div className="container mx-auto px-4">
            <div ref={sectionsRef} className="max-w-4xl mx-auto">
              <div className="prose prose-lg dark:prose-invert mx-auto">
                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">1. Introducción</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Bienvenido a Gool⭐Star. Estos Términos y Condiciones rigen el uso de nuestro sitio web y servicios relacionados. 
                    Al acceder o utilizar nuestra plataforma, usted acepta cumplir con estos términos y condiciones. 
                    Si no está de acuerdo con alguna parte de estos términos, le recomendamos que no utilice nuestros servicios.
                  </p>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">2. Uso del Servicio</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    Nuestros servicios están diseñados para proporcionar información sobre torneos de indoor fútbol, 
                    equipos participantes, resultados de partidos y estadísticas. El usuario se compromete a utilizar 
                    estos servicios de manera responsable y de acuerdo con las leyes aplicables.
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Nos reservamos el derecho de modificar, suspender o discontinuar, temporal o permanentemente, 
                    el servicio o cualquier parte del mismo, con o sin previo aviso. No seremos responsables ante usted 
                    o terceros por cualquier modificación, suspensión o interrupción del servicio.
                  </p>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">3. Cuentas de Usuario</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Para acceder a ciertas funciones de nuestro sitio, es posible que deba crear una cuenta de usuario. 
                    Usted es responsable de mantener la confidencialidad de su información de cuenta y contraseña, 
                    y de restringir el acceso a su computadora o dispositivo. Acepta asumir la responsabilidad de todas 
                    las actividades que ocurran bajo su cuenta o contraseña.
                  </p>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">4. Propiedad Intelectual</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Todo el contenido presente en nuestro sitio web, incluyendo pero no limitado a textos, gráficos, 
                    logotipos, iconos, imágenes, clips de audio, descargas digitales, y compilaciones de datos, 
                    es propiedad de Gool⭐Star o de sus proveedores de contenido y está protegido por las leyes 
                    internacionales de derechos de autor. La compilación de todo el contenido en este sitio es 
                    propiedad exclusiva de Gool⭐Star y está protegida por las leyes de propiedad intelectual.
                  </p>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">5. Limitación de Responsabilidad</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    En ningún caso Gool⭐Star, sus directores, empleados o agentes serán responsables por cualquier 
                    daño directo, indirecto, incidental, especial, punitivo o consecuente que surja de o en conexión 
                    con su uso de nuestro sitio web o servicios. Esto incluye, pero no se limita a, daños por pérdida 
                    de beneficios, datos, uso, buena voluntad, u otras pérdidas intangibles.
                  </p>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">6. Modificaciones de los Términos</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos Términos en 
                    cualquier momento. Si una revisión es material, intentaremos proporcionar un aviso con al menos 
                    30 días de anticipación antes de que los nuevos términos entren en vigor. Lo que constituye un 
                    cambio material será determinado a nuestra sola discreción.
                  </p>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">7. Ley Aplicable</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Estos términos y condiciones se regirán e interpretarán de acuerdo con las leyes de Ecuador, 
                    sin tener en cuenta sus disposiciones sobre conflictos de leyes. Cualquier disputa relacionada 
                    con estos términos será sometida a la jurisdicción exclusiva de los tribunales de Ecuador.
                  </p>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">8. Contacto</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Si tiene alguna pregunta sobre estos Términos y Condiciones, por favor contáctenos a través de 
                    nuestra página de <Link href="/contacto" className="text-goal-blue dark:text-goal-gold hover:underline">Contacto</Link>.
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
