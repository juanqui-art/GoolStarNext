'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { getEquipos } from '@/services/equipoService';
import type { components } from '@/types/api';
import Image from 'next/image';

// Utilizamos el tipo de equipo directamente de la API generada
type Equipo = components['schemas']['Equipo'];

interface EquiposListProps {
  categoria?: number;
  limit?: number;
  showTitle?: boolean;
}

export default function EquiposList({ categoria, limit, showTitle = true }: EquiposListProps) {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const equiposRef = useRef<HTMLDivElement>(null);
  const equipoRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    async function loadEquipos() {
      try {
        setLoading(true);
        // Hacemos la petición a la API usando el nuevo servicio
        const params: { categoria?: number; limit?: number } = {};
        
        if (categoria) {
          params.categoria = categoria;
        }
        
        const data = await getEquipos(params);
        // Si hay un límite, aplicarlo
        const equiposToShow = limit ? data.results.slice(0, limit) : data.results;
        setEquipos(equiposToShow);
        setError(null);
      } catch (err) {
        console.error('Error al cargar equipos:', err);
        setError('No se pudieron cargar los equipos. Verifica que tu API esté funcionando.');
      } finally {
        setLoading(false);
      }
    }

    loadEquipos();
  }, [categoria, limit]);

  // Efecto de animación con GSAP cuando los equipos cargan
  useEffect(() => {
    if (!loading && equipos.length > 0 && equiposRef.current) {
      // Resetear cualquier animación previa
      gsap.set(equipoRefs.current, { opacity: 0, y: 50 });
      
      // Animar la entrada de los equipos
      gsap.to(equipoRefs.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      });
    }
  }, [loading, equipos]);

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
        <p className="text-sm mt-2 text-red-600">
          Asegúrate de que tu servidor backend esté ejecutándose
        </p>
      </div>
    );
  }

  return (
    <div className="my-8">
      {showTitle && (
        <h2 className="text-2xl font-heading mb-6 text-center">Equipos Participantes</h2>
      )}
      
      {equipos.length === 0 ? (
        <p className="text-center text-gray-500">No hay equipos registrados actualmente.</p>
      ) : (
        <div 
          ref={equiposRef} 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {equipos.map((equipo, index) => (
            <div 
              key={equipo.id} 
              ref={(el) => {
                equipoRefs.current[index] = el;
                return undefined;
              }}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-lg transition-all border border-white/10"
            >
              <div className="flex flex-col items-center">
                {equipo.logo ? (
                  <Image
                    src={equipo.logo}
                    alt={`Logo de ${equipo.nombre}`}
                    width={80}
                    height={80}
                    className="h-20 w-20 object-contain mb-4"
                  />
                ) : (
                  <div className="h-20 w-20 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Sin logo</span>
                  </div>
                )}
                <h3 className="font-heading text-xl mb-1">{equipo.nombre}</h3>
                <p className="text-sm text-gray-400">
                  Categoría: {equipo.categoria_nombre}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
