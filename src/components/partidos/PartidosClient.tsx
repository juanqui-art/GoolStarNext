'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CalendarDays, Filter, Search } from 'lucide-react';
import { ListadoPartidosWrapper } from './PartidosData';
import type { components } from '@/types/api';

// Registrar el plugin ScrollTrigger
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

type Partido = components['schemas']['Partido'];

interface PartidosFiltroProps {
  initialSearch?: string;
  onSearchChange: (search: string) => void;
  filterType: 'todos' | 'finalizados' | 'proximos';
  onFilterChange: (filter: 'todos' | 'finalizados' | 'proximos') => void;
}

export function PartidosFiltro({ 
  initialSearch = '', 
  onSearchChange, 
  filterType, 
  onFilterChange 
}: PartidosFiltroProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchQuery);
  };

  return (
    <section className="py-8 bg-neutral-100 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Búsqueda */}
              <form onSubmit={handleSubmit} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar equipos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 focus:ring-2 focus:ring-goal-blue focus:border-transparent"
                  />
                </div>
              </form>

              {/* Filtros */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-neutral-400" />
                <select
                  value={filterType}
                  onChange={(e) => onFilterChange(e.target.value as any)}
                  className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 focus:ring-2 focus:ring-goal-blue focus:border-transparent"
                >
                  <option value="todos">Todos los partidos</option>
                  <option value="finalizados">Finalizados</option>
                  <option value="proximos">Próximos</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface PartidosClientProps {
  partidos: Partido[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function PartidosClient({ partidos, totalPages, currentPage, onPageChange }: PartidosClientProps) {
  // Referencias para animaciones
  const partidosRef = useRef<HTMLDivElement>(null);

  // Animaciones de entrada
  useEffect(() => {
    if (partidosRef.current) {
      // Animación principal del contenedor
      gsap.fromTo(
        partidosRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: partidosRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
      
      // Animación secuencial de las tarjetas de partidos utilizando GSAP
      const partidoCards = partidosRef.current.querySelectorAll('.partido-card');
      gsap.fromTo(
        partidoCards,
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1, // Reemplaza el delay inline con stagger de GSAP
          duration: 0.6,
          ease: "power2.out"
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [partidos]);

  // Manejar delegación de eventos para la paginación
  useEffect(() => {
    const handlePaginationClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      if (!button) return;
      
      const page = button.dataset.page;
      if (page) {
        const pageNumber = parseInt(page);
        onPageChange(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const paginationContainer = document.querySelector('.flex.justify-center.items-center.space-x-2');
    if (paginationContainer) {
      paginationContainer.addEventListener('click', handlePaginationClick);
    }

    return () => {
      if (paginationContainer) {
        paginationContainer.removeEventListener('click', handlePaginationClick);
      }
    };
  }, [onPageChange]);

  return (
    <section ref={partidosRef} className="py-16 bg-white dark:bg-neutral-800">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-neutral-800 dark:text-neutral-100">
            Todos los <span className="text-goal-blue">Partidos</span>
          </h2>

          <ListadoPartidosWrapper 
            page={currentPage}
            pageSize={12}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </section>
  );
}

export function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const heroTl = gsap.timeline();
    
    if (titleRef.current) {
      heroTl.fromTo(
        titleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    }
    
    // Animación de los elementos decorativos del fondo
    if (heroRef.current) {
      const decorations = heroRef.current.querySelectorAll('.bg-goal-blue, .bg-goal-gold');
      gsap.fromTo(
        decorations, 
        { scale: 0.8, opacity: 0.5 }, 
        {
          scale: 1,
          opacity: 1,
          duration: 2,
          ease: "power1.inOut",
          stagger: 0.2
        }
      );
    }
  }, []);
  
  return (
    <section ref={heroRef} className="relative py-20">
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
            <CalendarDays className="inline-block w-12 h-12 mr-4 text-goal-blue" />
            <span className="text-goal-blue dark:text-goal-gold">Partidos</span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8">
            Sigue todos los encuentros del torneo, resultados en vivo y próximos partidos
          </p>
        </div>
      </div>
    </section>
  );
}

export function StatsSection() {
  const statsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (statsRef.current) {
      // Animar la sección de estadísticas con GSAP
      gsap.fromTo(
        statsRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
      
      // Animar los números con contador
      const counters = statsRef.current.querySelectorAll('.counter-value');
      counters.forEach(counter => {
        const target = parseFloat(counter.textContent || '0');
        gsap.fromTo(
          counter,
          { innerText: 0 },
          {
            innerText: target,
            duration: 1.5,
            ease: "power2.out",
            delay: 0.2,
            snap: { innerText: 1 }, // Redondear a enteros
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 90%",
            }
          }
        );
      });
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  return (
    <section ref={statsRef} className="py-8 bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-goal-blue mb-2 counter-value">67</div>
            <div className="text-neutral-600 dark:text-neutral-400">Partidos Jugados</div>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-goal-gold mb-2 counter-value">3</div>
            <div className="text-neutral-600 dark:text-neutral-400">Próximos 7 días</div>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-goal-orange mb-2 counter-value">25</div>
            <div className="text-neutral-600 dark:text-neutral-400">Equipos Activos</div>
          </div>
        </div>
      </div>
    </section>
  );
}
