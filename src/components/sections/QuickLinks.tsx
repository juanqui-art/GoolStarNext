'use client';

import { useRef, useEffect } from 'react';
import { CalendarDays, Table, Trophy, Users, Image } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import QuickLinkCard from '../ui/QuickLinkCard';

// Registrar el plugin ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function QuickLinks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animación de entrada con GSAP
    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll('.card-item');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
      
      tl.fromTo(
        cards,
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 0.7, 
          ease: 'power2.out'
        }
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

  const quickLinks = [
    {
      title: 'Calendario',
      description: 'Consulta los próximos partidos y resultados del torneo',
      icon: <CalendarDays size={24} />,
      href: '/partidos',
      accentColor: 'gold' as const
    },
    {
      title: 'Tabla de Posiciones',
      description: 'Revisa la clasificación actual de todos los equipos',
      icon: <Table size={24} />,
      href: '/tabla',
      accentColor: 'blue' as const
    },
    {
      title: 'Goleadores',
      description: 'Conoce a los máximos anotadores del campeonato',
      icon: <Trophy size={24} />,
      href: '/goleadores',
      accentColor: 'orange' as const
    },
    {
      title: 'Equipos',
      description: 'Información completa sobre los equipos participantes',
      icon: <Users size={24} />,
      href: '/equipos',
      accentColor: 'blue' as const
    },
    {
      title: 'Galería',
      description: 'Fotos y videos de los mejores momentos del torneo',
      icon: <Image size={24} />,
      href: '/galeria',
      accentColor: 'gold' as const
    }
  ];

  return (
    <div ref={sectionRef} className="w-full">
      <h2 className="text-3xl font-heading text-center mb-8">
        Acceso Rápido
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {quickLinks.map((link, index) => (
          <div key={index} className="card-item">
            <QuickLinkCard 
              title={link.title} 
              description={link.description} 
              icon={link.icon} 
              href={link.href} 
              accentColor={link.accentColor}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
