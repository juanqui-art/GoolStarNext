'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { getEquipos } from '@/services/equipoService';
import type { components } from '@/types/api';

type Equipo = components['schemas']['Equipo'];

interface EquiposDestacadosProps {
  limit?: number;
  autoplay?: boolean;
  interval?: number; // en milisegundos
}

export default function EquiposDestacados({ 
  limit = 5, 
  autoplay = true, 
  interval = 3000 
}: EquiposDestacadosProps) {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Refs para animaciones
  const containerRef = useRef<HTMLDivElement>(null);
  const equipoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar los equipos
  useEffect(() => {
    async function loadEquipos() {
      try {
        setLoading(true);
        // Ordenamos por algún criterio que destaque equipos importantes
        const data = await getEquipos({ 
          ordering: '-created_at', // Asumiendo que tiene un campo created_at
          limit 
        });
        setEquipos(data.results.slice(0, limit));
        setError(null);
      } catch (err) {
        console.error('Error al cargar equipos destacados:', err);
        setError('No se pudieron cargar los equipos destacados.');
      } finally {
        setLoading(false);
      }
    }

    loadEquipos();
  }, [limit]);

  // Configurar autoplay
  useEffect(() => {
    if (autoplay && equipos.length > 1) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % equipos.length);
      }, interval);
    }

    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
    };
  }, [autoplay, equipos.length, interval]);

  // Manejar cambios en el índice activo con animaciones GSAP
  useEffect(() => {
    if (equipos.length <= 1 || !containerRef.current) return;

    // Limpiar cualquier animación previa
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline();
    timelineRef.current = tl;

    // Animación de salida para todos los equipos
    equipoRefs.current.forEach((ref, i) => {
      if (!ref) return;
      
      if (i === activeIndex) {
        // Animar entrada del equipo activo
        tl.to(ref, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        });
      } else {
        // Animar salida de los demás equipos
        tl.to(ref, {
          opacity: 0,
          scale: 0.9,
          duration: 0.3,
          ease: "power2.in"
        }, "<");
      }
    });
  }, [activeIndex, equipos.length]);

  // Configurar visualización inicial
  useEffect(() => {
    if (!loading && equipos.length > 0 && containerRef.current) {
      // Configuración inicial: ocultar todos excepto el activo
      equipoRefs.current.forEach((ref, i) => {
        if (!ref) return;
        
        gsap.set(ref, {
          opacity: i === activeIndex ? 1 : 0,
          scale: i === activeIndex ? 1 : 0.9
        });
      });
    }
  }, [loading, equipos, activeIndex]);

  // Cambiar al equipo anterior
  const prevEquipo = () => {
    setActiveIndex((prev) => (prev - 1 + equipos.length) % equipos.length);
  };

  // Cambiar al equipo siguiente
  const nextEquipo = () => {
    setActiveIndex((prev) => (prev + 1) % equipos.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md my-4">
        <h3 className="text-red-800 font-medium">Error</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (equipos.length === 0) {
    return (
      <div className="my-8 text-center">
        <p className="text-gray-500">No hay equipos destacados actualmente.</p>
      </div>
    );
  }

  return (
    <div className="my-12 relative" ref={containerRef}>
      <h2 className="text-3xl font-heading text-center mb-10">Equipos Destacados</h2>
      
      <div className="relative h-[400px] overflow-hidden rounded-xl">
        {equipos.map((equipo, index) => (
          <div 
            key={equipo.id}
            ref={(el) => {
              equipoRefs.current[index] = el;
              return undefined;
            }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-black/40 to-black/70 backdrop-blur-sm p-8 rounded-xl"
            style={{ 
              opacity: index === activeIndex ? 1 : 0,
            }}
          >
            <div className="flex flex-col items-center max-w-md mx-auto text-center">
              {equipo.logo ? (
                <img 
                  src={equipo.logo} 
                  alt={`Logo de ${equipo.nombre}`} 
                  className="h-32 w-32 object-contain mb-6"
                />
              ) : (
                <div className="h-32 w-32 bg-gray-200 rounded-full mb-6 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Sin logo</span>
                </div>
              )}
              
              <h3 className="font-heading text-3xl mb-2">{equipo.nombre}</h3>
              <p className="text-lg text-gray-300 mb-3">
                Categoría: {equipo.categoria_nombre}
              </p>
              
              {/* Aquí podrías mostrar más información destacada del equipo */}
              <div className="mt-6">
                <button 
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
                  onClick={() => {/* Navegar a detalle del equipo */}}
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Controles de navegación */}
        {equipos.length > 1 && (
          <>
            <button 
              onClick={prevEquipo}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="Equipo anterior"
            >
              &larr;
            </button>
            
            <button 
              onClick={nextEquipo}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="Equipo siguiente"
            >
              &rarr;
            </button>
            
            {/* Indicadores */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {equipos.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeIndex ? 'bg-primary' : 'bg-white/50'
                  }`}
                  aria-label={`Ver equipo ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
