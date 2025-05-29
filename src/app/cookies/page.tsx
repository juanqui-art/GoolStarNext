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

export default function CookiesPage() {
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
                Política de <span className="text-goal-blue dark:text-goal-gold">Cookies</span>
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
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">1. ¿Qué son las Cookies?</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (computadora, tablet o teléfono móvil) 
                    cuando visita un sitio web. Estos archivos permiten que el sitio web recuerde sus acciones y preferencias durante 
                    un período de tiempo, para que no tenga que volver a ingresarlas cada vez que visite el sitio o navegue de una 
                    página a otra.
                  </p>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">2. Tipos de Cookies que Utilizamos</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-3">
                    En Gool⭐Star, utilizamos los siguientes tipos de cookies:
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-3">
                    <strong className="text-neutral-800 dark:text-neutral-200">Cookies Necesarias:</strong> Estas cookies son esenciales para que pueda navegar por nuestro sitio web 
                    y utilizar sus funciones. Sin estas cookies, los servicios que ha solicitado no se pueden proporcionar.
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-3">
                    <strong className="text-neutral-800 dark:text-neutral-200">Cookies de Preferencias:</strong> Estas cookies permiten que nuestro sitio web recuerde información 
                    que cambia la forma en que se comporta o se ve el sitio, como su idioma preferido o la región en la que se encuentra.
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-3">
                    <strong className="text-neutral-800 dark:text-neutral-200">Cookies Estadísticas:</strong> Estas cookies nos ayudan a entender cómo los visitantes interactúan 
                    con el sitio web al recopilar y reportar información de forma anónima.
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    <strong className="text-neutral-800 dark:text-neutral-200">Cookies de Marketing:</strong> Estas cookies se utilizan para rastrear a los visitantes en los sitios web. 
                    La intención es mostrar anuncios que sean relevantes y atractivos para el usuario individual.
                  </p>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">3. Propósito de las Cookies</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    Utilizamos cookies para varios propósitos, entre ellos:
                  </p>
                  <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400 mb-6">
                    <li className="mb-2">Garantizar que nuestro sitio web funcione correctamente</li>
                    <li className="mb-2">Guardar sus preferencias para mejorar su experiencia de navegación</li>
                    <li className="mb-2">Analizar cómo se utiliza nuestro sitio web para mejorar su rendimiento</li>
                    <li>Personalizar nuestros servicios según sus preferencias</li>
                  </ul>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">4. Control de Cookies</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    Usted tiene el derecho de decidir si acepta o rechaza las cookies. La mayoría de los navegadores web 
                    están configurados para aceptar cookies automáticamente, pero puede modificar la configuración de su 
                    navegador para rechazar cookies si lo prefiere. Sin embargo, si elige rechazar las cookies, es posible 
                    que no pueda utilizar todas las funcionalidades de nuestro sitio web.
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Puede configurar su navegador para que le notifique cuando reciba una cookie, lo que le da la 
                    oportunidad de decidir si desea aceptarla o no. También puede eliminar las cookies que ya están 
                    almacenadas en su dispositivo a través de la configuración de su navegador.
                  </p>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">5. Cookies de Terceros</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Además de nuestras propias cookies, también podemos utilizar cookies de terceros para mejorar la 
                    experiencia del usuario, analizar el uso del sitio y personalizar el contenido. Estos terceros pueden 
                    incluir proveedores de servicios de análisis y redes de publicidad. Estas empresas pueden utilizar 
                    cookies para recopilar información sobre sus visitas a nuestro sitio y otros sitios web.
                  </p>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">6. Cambios en nuestra Política de Cookies</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Podemos actualizar nuestra Política de Cookies de vez en cuando para reflejar cambios en nuestras 
                    prácticas o por otras razones operativas, legales o regulatorias. Por lo tanto, le recomendamos 
                    que revise esta política periódicamente para estar informado sobre cómo utilizamos las cookies.
                  </p>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">7. Contacto</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Si tiene alguna pregunta sobre nuestra Política de Cookies, por favor contáctenos a través de nuestra página de 
                    <Link href="/contacto" className="text-goal-blue dark:text-goal-gold hover:underline ml-1">Contacto</Link>.
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
