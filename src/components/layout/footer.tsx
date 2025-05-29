'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar el plugin ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (footerRef.current && logoRef.current && contentRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none none"
        }
      });

      // Animación del logo
      tl.fromTo(
        logoRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      // Animación del contenido
      tl.fromTo(
        contentRef.current.querySelectorAll('.animate-item'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );

      // Limpiar animaciones al desmontar
      return () => {
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
        }
        tl.kill();
      };
    }
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer 
      ref={footerRef}
      className="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo y descripción */}
          <div ref={logoRef} className="md:col-span-4 flex flex-col items-center md:items-start">
            <div className="mb-4">
              <div className="font-bold text-2xl text-neutral-800 dark:text-neutral-100">
                <span className="text-goal-gold">GOOL</span>
                <span className="text-goal-gold">⭐</span>
                <span className="text-goal-blue">STAR</span>
              </div>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6 text-center md:text-left">
              La mejor plataforma para torneos de fútbol amateur, 
              donde la pasión por el deporte se encuentra con la 
              tecnología para brindarte una experiencia única.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="animate-item text-neutral-600 hover:text-goal-gold transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="animate-item text-neutral-600 hover:text-goal-blue transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="animate-item text-neutral-600 hover:text-goal-orange transition-colors duration-300">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Enlaces y contacto */}
          <div ref={contentRef} className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Enlaces */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-neutral-800 dark:text-neutral-100 animate-item">Navegación</h3>
              <ul className="space-y-2">
                <li className="animate-item">
                  <Link href="/" className="text-neutral-600 dark:text-neutral-400 hover:text-goal-gold dark:hover:text-goal-gold transition-colors duration-300">
                    Inicio
                  </Link>
                </li>
                <li className="animate-item">
                  <Link href="/torneos" className="text-neutral-600 dark:text-neutral-400 hover:text-goal-gold dark:hover:text-goal-gold transition-colors duration-300">
                    Torneos
                  </Link>
                </li>
                <li className="animate-item">
                  <Link href="/equipos" className="text-neutral-600 dark:text-neutral-400 hover:text-goal-gold dark:hover:text-goal-gold transition-colors duration-300">
                    Equipos
                  </Link>
                </li>
                <li className="animate-item">
                  <Link href="/tabla" className="text-neutral-600 dark:text-neutral-400 hover:text-goal-gold dark:hover:text-goal-gold transition-colors duration-300">
                    Tabla de Posiciones
                  </Link>
                </li>
                <li className="animate-item">
                  <Link href="/goleadores" className="text-neutral-600 dark:text-neutral-400 hover:text-goal-gold dark:hover:text-goal-gold transition-colors duration-300">
                    Goleadores
                  </Link>
                </li>
              </ul>
            </div>

            {/* Enlaces legales */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-neutral-800 dark:text-neutral-100 animate-item">Legal</h3>
              <ul className="space-y-2">
                <li className="animate-item">
                  <Link href="/terminos" className="text-neutral-600 dark:text-neutral-400 hover:text-goal-blue dark:hover:text-goal-blue transition-colors duration-300">
                    Términos y Condiciones
                  </Link>
                </li>
                <li className="animate-item">
                  <Link href="/privacidad" className="text-neutral-600 dark:text-neutral-400 hover:text-goal-blue dark:hover:text-goal-blue transition-colors duration-300">
                    Política de Privacidad
                  </Link>
                </li>
                <li className="animate-item">
                  <Link href="/cookies" className="text-neutral-600 dark:text-neutral-400 hover:text-goal-blue dark:hover:text-goal-blue transition-colors duration-300">
                    Política de Cookies
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-neutral-800 dark:text-neutral-100 animate-item">Contacto</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3 animate-item">
                  <MapPin size={18} className="text-goal-orange mt-0.5" />
                  <span className="text-neutral-600 dark:text-neutral-400 text-sm">
                    Calle Principal 123, Quito, Ecuador
                  </span>
                </li>
                <li className="flex items-center space-x-3 animate-item">
                  <Phone size={18} className="text-goal-orange" />
                  <span className="text-neutral-600 dark:text-neutral-400 text-sm">
                    +593 98 765 4321
                  </span>
                </li>
                <li className="flex items-center space-x-3 animate-item">
                  <Mail size={18} className="text-goal-orange" />
                  <span className="text-neutral-600 dark:text-neutral-400 text-sm">
                    info@goolstar.com
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800 my-8"></div>

        {/* Copyright */}
        <div className="text-center text-neutral-500 dark:text-neutral-500 text-sm">
          <p> {currentYear} GoolStar. Todos los derechos reservados.</p>
          <p className="mt-1">Diseñado y desarrollado con pasión en Ecuador.</p>
        </div>
      </div>
    </footer>
  );
}