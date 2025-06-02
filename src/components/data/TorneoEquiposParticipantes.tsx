'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { getEquiposByTorneo } from '@/services/equipoService';
import type { components } from '@/types/api';
import Image from 'next/image';

// Tipos
type Equipo = components['schemas']['Equipo'];

interface TorneoEquiposParticipantesProps {
  torneoId: string;
  titulo?: string;
}

export default function TorneoEquiposParticipantes({ 
  torneoId, 
  titulo = "Equipos Participantes" 
}: TorneoEquiposParticipantesProps) {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Referencias para animaciones con GSAP
  const sectionRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const equiposContainerRef = useRef<HTMLDivElement>(null);
  const equipoRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    async function loadEquipos() {
      try {
        setLoading(true);
        const data = await getEquiposByTorneo(torneoId);
        setEquipos(data.results);
        setError(null);
      } catch (err) {
        console.error('Error al cargar equipos del torneo:', err);
        setError('No se pudieron cargar los equipos participantes.');
      } finally {
        setLoading(false);
      }
    }

    loadEquipos();
  }, [torneoId]);

  // Animaciones con GSAP cuando el componente se monta y los equipos están cargados
  useEffect(() => {
    if (!loading && equipos.length > 0) {
      // Reiniciamos todas las animaciones anteriores
      gsap.set([tituloRef.current, equiposContainerRef.current, ...equipoRefs.current], { 
        clearProps: "all" 
      });
      
      // Timeline para secuencia de animaciones
      const tl = gsap.timeline({
        defaults: { 
          ease: "power3.out",
          duration: 0.8
        }
      });
      
      // Animación del título
      tl.fromTo(tituloRef.current, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1 }
      );
      
      // Animación de los equipos con stagger
      tl.fromTo(equipoRefs.current, 
        { y: 40, opacity: 0 }, 
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1,
          duration: 0.6
        },
        "-=0.4" // Inicio ligeramente antes de que termine la animación anterior
      );
    }
  }, [loading, equipos]);

  if (loading) {
    return (
      <div className="py-16 bg-neutral-950">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="w-12 h-12 border-t-2 border-l-2 border-primary rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-neutral-950">
        <div className="container mx-auto px-4">
          <div className="bg-red-900/20 text-red-200 p-4 rounded-lg text-center">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (equipos.length === 0) {
    return (
      <div className="py-16 bg-neutral-950">
        <div className="container mx-auto px-4">
          <h2 ref={tituloRef} className="text-3xl md:text-4xl font-heading text-white text-center mb-10">
            {titulo}
          </h2>
          <p className="text-center text-white/70">
            No hay equipos registrados en este torneo aún.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section ref={sectionRef} className="py-16 bg-neutral-950">
      <div className="container mx-auto px-4">
        <h2 ref={tituloRef} className="text-3xl md:text-4xl font-heading text-white text-center mb-12">
          {titulo}
        </h2>

        <div ref={equiposContainerRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {equipos.map((equipo, index) => (
            <div
              key={equipo.id}
              ref={el => { equipoRefs.current[index] = el; }}
              className="bg-neutral-900 rounded-lg overflow-hidden group hover:bg-neutral-800 transition-all duration-300 border border-neutral-800 hover:border-primary/50"
            >
              <div className="aspect-square w-full overflow-hidden relative">
                {equipo.logo ? (
                  <Image
                    src={equipo.logo}
                    alt={equipo.nombre}
                    width={200}
                    height={200}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-4xl text-primary/60 font-bold">
                    {equipo.nombre.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white truncate mb-1">
                  {equipo.nombre}
                </h3>
                {equipo.categoria && (
                  <p className="text-sm text-primary/80">
                    {equipo.categoria.nombre}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
