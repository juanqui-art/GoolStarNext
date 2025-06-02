'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/footer';
import { PhoneCall, MapPin, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Registrar el plugin ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactoPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animaciones para la entrada de elementos
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
    
    // Animación para el formulario
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }
    
    // Animación para la información de contacto
    if (infoRef.current) {
      const infoItems = infoRef.current.querySelectorAll('.info-item');
      
      gsap.fromTo(
        infoItems,
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.5, 
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: infoRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    }
    
    // Animación para el mapa
    if (mapRef.current) {
      gsap.fromTo(
        mapRef.current,
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.7, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: mapRef.current,
            start: "top 90%",
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
          className="relative py-28"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-goal-blue/10 blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-goal-gold/10 blur-3xl"></div>
            <div className="absolute top-1/3 left-1/4 w-20 h-20 rounded-full bg-goal-gold/20 blur-xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 
                ref={titleRef}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-neutral-800 dark:text-neutral-100"
              >
                <span className="text-goal-blue dark:text-goal-gold">Contacto</span>
              </h1>
              
              <p 
                ref={descriptionRef}
                className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto"
              >
                Estamos aquí para responder tus preguntas, recibir tus comentarios o ayudarte 
                a formar parte de la comunidad Gool⭐️Star. ¡Contáctanos!
              </p>
            </div>
          </div>
        </section>

        {/* Contacto y Mapa Section */}
        <section className="py-16 bg-white dark:bg-neutral-800">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Información de Contacto */}
              <div ref={infoRef} className="order-2 lg:order-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-neutral-800 dark:text-neutral-100">
                  Información de Contacto
                </h2>
                
                <div className="space-y-8">
                  <div className="flex items-start space-x-4 info-item">
                    <div className="bg-goal-blue/10 dark:bg-goal-blue/20 p-3 rounded-full">
                      <PhoneCall className="w-6 h-6 text-goal-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Teléfono</h3>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        <a href="tel:+593978692269" className="hover:text-goal-blue dark:hover:text-goal-gold transition-colors">
                          +593 97 869 2269
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 info-item">
                    <div className="bg-goal-gold/10 dark:bg-goal-gold/20 p-3 rounded-full">
                      <MapPin className="w-6 h-6 text-goal-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Dirección</h3>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        CANCHA GOAL STAR<br />
                        Pumayunga (junto antena Claro)
                      </p>
                    </div>
                  </div>
                  
                  {/*<div className="flex items-start space-x-4 info-item">*/}
                  {/*  <div className="bg-goal-blue/10 dark:bg-goal-blue/20 p-3 rounded-full">*/}
                  {/*    <Mail className="w-6 h-6 text-goal-blue" />*/}
                  {/*  </div>*/}
                  {/*  <div>*/}
                  {/*    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Email</h3>*/}
                  {/*    <p className="text-neutral-600 dark:text-neutral-400">*/}
                  {/*      <a href="mailto:info@goolstar.com" className="hover:text-goal-blue dark:hover:text-goal-gold transition-colors">*/}
                  {/*        info@goolstar.com*/}
                  {/*      </a>*/}
                  {/*    </p>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                  
                  <div className="flex items-start space-x-4 info-item">
                    <div className="bg-goal-gold/10 dark:bg-goal-gold/20 p-3 rounded-full">
                      <Clock className="w-6 h-6 text-goal-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Horarios</h3>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Lunes a Viernes: 16:00 - 22:00<br />
                        Sábados y Domingos: 10:00 - 22:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Formulario de Contacto */}
              <div ref={formRef} className="order-1 lg:order-2 bg-white dark:bg-neutral-700 rounded-2xl p-6 md:p-8 shadow-xl border border-neutral-200/80 dark:border-neutral-600/80">
                <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-neutral-100">Envíanos un Mensaje</h2>
                
                <div className="mb-6 p-4 bg-neutral-100 dark:bg-neutral-600 rounded-lg border border-neutral-200 dark:border-neutral-500">
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-2">
                    <span className="font-medium">Nota:</span> El formulario de contacto estará disponible próximamente.
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    Por el momento, comunícate con nosotros a través de WhatsApp o llámanos directamente.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
                  <Link 
                    href={`https://wa.me/593978692269?text=Hola%20GoolStar,%20me%20gustaría%20obtener%20más%20información.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                    </svg>
                    <span>Contactar por WhatsApp</span>
                  </Link>
                  
                  <Link 
                    href="tel:+593978692269"
                    className="flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-goal-blue hover:bg-goal-blue/90 text-white font-medium rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <PhoneCall className="w-4 h-4 mr-2" />
                    <span>Llamar</span>
                  </Link>
                </div>
                
                <div className="text-neutral-600 dark:text-neutral-400 text-sm text-center">
                  <p>También puedes visitarnos directamente en nuestras instalaciones en:</p>
                  <p className="font-medium mt-1">CANCHA GOAL STAR - Pumayunga (junto antena Claro)</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Google Maps Section - Sin API key */}
        <section className="py-12 bg-neutral-50 dark:bg-neutral-900">
          <div className="container mx-auto px-4">
            <div ref={mapRef} className="rounded-2xl overflow-hidden bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-6 shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-1">Nuestra Ubicación</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  CANCHA GOAL STAR - Pumayunga (junto antena Claro)
                </p>
              </div>
              
              <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-6 text-center">
                <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                  Coordenadas: -2.8772140232030554, -79.02492279762701
                </p>
                
                <Link 
                  href="https://www.google.com/maps/place/-2.8772140232030554,-79.02492279762701" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center px-5 py-2.5 bg-goal-blue hover:bg-goal-blue/90 text-white font-medium rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <span>Ver en Google Maps</span>
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Link>
                
                <div className="mt-6 text-neutral-500 dark:text-neutral-400 text-sm">
                  <p>Para visitar nuestras instalaciones:</p>
                  <ol className="list-decimal list-inside mt-2 text-left max-w-md mx-auto">
                    <li className="mb-1">Abre Google Maps en tu dispositivo</li>
                    <li className="mb-1">Ingresa estas coordenadas: -2.8772140232030554, -79.02492279762701</li>
                    <li>¡Ven a visitarnos y disfruta de nuestras instalaciones deportivas!</li>
                  </ol>
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
