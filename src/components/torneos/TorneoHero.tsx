'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
// import Image from 'next/image';
import type { components } from '@/types/api';

type TorneoDetalle = components['schemas']['TorneoDetalle'];

interface TorneoHeroProps {
  torneo: TorneoDetalle;
}

export default function TorneoHero({ torneo }: TorneoHeroProps) {
  // Referencias para animaciones
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Configuración de animaciones con GSAP
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    // Animación de entrada
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 }
    )
    .fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      '-=0.4'
    )
    .fromTo(
      infoRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
    );
    
    return () => {
      // Limpieza de la animación
      tl.kill();
    };
  }, [torneo.id]);

  // Formatear fechas para mostrar
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // Determinar el estado del torneo
  const getTorneoStatus = () => {
    if (torneo.finalizado) return { text: 'Finalizado', color: 'bg-red-500' };
    if (torneo.activo) return { text: 'En curso', color: 'bg-green-500' };
    return { text: 'Próximamente', color: 'bg-yellow-500' };
  };

  const status = getTorneoStatus();

  return (
    <div ref={heroRef} className="relative min-h-[60vh] flex items-center pt-24 pb-16">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/*<Image*/}
        {/*  src={"/images/torneo-bg.webp"}*/}
        {/*  alt={torneo.nombre}*/}
        {/*  fill*/}
        {/*  className={"w-full h-full object-cover object-center"}*/}
        {/*  priority*/}
        {/*/>*/}
        {/* Overlay para mejorar legibilidad */}
        <div ref={overlayRef} className="absolute inset-0 bg-black/70"></div>
        
        {/* Gradiente superior para integración con navbar */}
        <div className="absolute top-0 left-0 right-0 h-[80px] md:h-[120px] bg-gradient-to-b from-black/80 via-black/60 to-transparent z-10"></div>
        
        {/* Gradiente inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-neutral-950 to-transparent"></div>
      </div>

      {/* Contenido del hero */}
      <div className="container relative mx-auto px-4 z-10">
        <div className="max-w-4xl">
          {/* Badge de estado */}
          <div className="inline-block mb-4">
            <span className={`${status.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
              {status.text}
            </span>
          </div>
          
          {/* Título del torneo */}
          <h1 ref={titleRef} className="text-4xl md:text-6xl font-heading text-white mb-6">
            {torneo.nombre}
          </h1>
          
          {/* Información del torneo */}
          <div ref={infoRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
            <div>
              <h2 className="text-xl font-subtitle mb-4 text-primary">Información General</h2>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <span className="text-primary/80">Inicio:</span> 
                  <span>{formatDate(torneo.fecha_inicio)}</span>
                </p>
                {torneo.fecha_fin && (
                  <p className="flex items-center gap-2">
                    <span className="text-primary/80">Finalización:</span> 
                    <span>{formatDate(torneo.fecha_fin)}</span>
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <span className={"text-primary/80"}>Categoría:</span> 
                  <span>{torneo.categoria?.nombre || 'General'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-primary/80">Fase actual:</span> 
                  <span className="capitalize">{torneo.fase_actual || 'No iniciado'}</span>
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-subtitle mb-4 text-primary">Formato del Torneo</h2>
              <div className="space-y-2">
                {torneo.tiene_fase_grupos && (
                  <p className="flex items-center gap-2">
                    <span className="text-primary/80">Fase de grupos:</span> 
                    <span>{torneo.numero_grupos || 0} grupos</span>
                  </p>
                )}
                {torneo.tiene_fase_grupos && torneo.equipos_clasifican_por_grupo && (
                  <p className="flex items-center gap-2">
                    <span className="text-primary/80">Clasifican por grupo:</span> 
                    <span>{torneo.equipos_clasifican_por_grupo} equipos</span>
                  </p>
                )}
                {torneo.tiene_eliminacion_directa && (
                  <p className="flex items-center">
                    <span className="text-primary/80 mr-2">Eliminación directa:</span> 
                    <span>Sí</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
