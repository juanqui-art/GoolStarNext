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

export default function PrivacidadPage() {
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
                Política de <span className="text-goal-blue dark:text-goal-gold">Privacidad</span>
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
                    En Gool⭐Star, valoramos y respetamos su privacidad. Esta Política de Privacidad describe cómo recopilamos, 
                    utilizamos, procesamos y protegemos su información personal cuando utiliza nuestro sitio web y servicios. 
                    Al acceder a nuestro sitio o utilizar nuestros servicios, usted acepta las prácticas descritas en esta política.
                  </p>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">2. Información que Recopilamos</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    <strong className="text-neutral-800 dark:text-neutral-200">Información Personal:</strong> Podemos recopilar información personal como su nombre, 
                    dirección de correo electrónico, número de teléfono y dirección cuando se registra en nuestro sitio, 
                    participa en un torneo, o se comunica con nosotros.
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    <strong className="text-neutral-800 dark:text-neutral-200">Información de Uso:</strong> Recopilamos información sobre cómo interactúa con nuestro sitio, 
                    incluyendo las páginas que visita, el tiempo que pasa en cada página, y las acciones que realiza.
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    <strong className="text-neutral-800 dark:text-neutral-200">Información del Dispositivo:</strong> Podemos recopilar información sobre el dispositivo que utiliza 
                    para acceder a nuestro sitio, como el tipo de dispositivo, sistema operativo, navegador y dirección IP.
                  </p>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">3. Cómo Utilizamos su Información</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    Utilizamos la información que recopilamos para:
                  </p>
                  <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400 mb-6">
                    <li className="mb-2">Proporcionar, mantener y mejorar nuestros servicios</li>
                    <li className="mb-2">Procesar registros y gestionar su participación en torneos</li>
                    <li className="mb-2">Enviar notificaciones sobre cambios en nuestros servicios</li>
                    <li className="mb-2">Responder a sus preguntas y solicitudes</li>
                    <li className="mb-2">Personalizar su experiencia en nuestro sitio</li>
                    <li>Proteger la seguridad de nuestro sitio y usuarios</li>
                  </ul>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">4. Compartición de Información</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    No vendemos ni alquilamos su información personal a terceros. Podemos compartir su información en las siguientes circunstancias:
                  </p>
                  <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400 mb-6">
                    <li className="mb-2">Con proveedores de servicios que nos ayudan a operar nuestro sitio y servicios</li>
                    <li className="mb-2">Cuando sea requerido por ley, regulación, proceso legal o solicitud gubernamental</li>
                    <li>Para proteger los derechos, propiedad o seguridad de Gool⭐Star, nuestros usuarios u otros</li>
                  </ul>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">5. Seguridad de la Información</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Implementamos medidas de seguridad técnicas y organizativas diseñadas para proteger su información 
                    personal contra acceso, uso o divulgación no autorizados. Sin embargo, ninguna transmisión de datos por 
                    Internet o sistema de almacenamiento puede garantizar seguridad absoluta.
                  </p>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">6. Sus Derechos</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    Usted tiene ciertos derechos con respecto a su información personal, que incluyen:
                  </p>
                  <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400 mb-6">
                    <li className="mb-2">Acceder a la información personal que tenemos sobre usted</li>
                    <li className="mb-2">Corregir datos inexactos o incompletos</li>
                    <li className="mb-2">Solicitar la eliminación de su información personal</li>
                    <li className="mb-2">Oponerse al procesamiento de su información</li>
                    <li>Retirar su consentimiento en cualquier momento</li>
                  </ul>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">7. Cambios a esta Política</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestras 
                    prácticas de información o por otras razones operativas, legales o regulatorias. Le animamos a 
                    revisar esta política regularmente para estar informado sobre cómo estamos protegiendo su información.
                  </p>
                </div>

                <div className="content-section">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">8. Contacto</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Si tiene preguntas o inquietudes sobre esta Política de Privacidad o sobre cómo manejamos su 
                    información personal, por favor contáctenos a través de nuestra página de 
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
