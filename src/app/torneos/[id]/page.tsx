import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { fetchTorneo } from '@/lib/api/client';
import TorneoHero from '@/components/torneos/TorneoHero';
import TorneoEquiposParticipantes from '@/components/data/TorneoEquiposParticipantes';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Parámetros para la página
interface TorneoPageProps {
  params: {
    id: string;
  };
}

export default async function TorneoPage({ params }: TorneoPageProps) {
  // Desestructurar el id de los parámetros
  const { id } = await params;
  
  try {
    // Obtener datos del torneo
    const torneo = await fetchTorneo(id);
    
    if (!torneo) {
      return notFound();
    }
    
    return (
      <main className="min-h-screen bg-neutral-950">
        {/* Hero Section del Torneo */}
        <TorneoHero torneo={torneo} />
        
        {/* Sección de Equipos Participantes */}
        <Suspense fallback={<LoadingSpinner />}>
          <TorneoEquiposParticipantes 
            torneoId={id} 
            titulo={`Equipos Participantes - ${torneo.nombre}`}
          />
        </Suspense>
        
        {/* Aquí pueden ir otras secciones del torneo */}
      </main>
    );
  } catch (error) {
    console.error('Error al cargar los datos del torneo:', error);
    return notFound();
  }
}

// Generar metadatos para SEO
export async function generateMetadata({ params }: TorneoPageProps) {
  // Desestructurar el id de los parámetros
  const { id } = await params;
  
  try {
    const torneo = await fetchTorneo(id);
    
    if (!torneo) {
      return {
        title: 'Torneo no encontrado | GoolStar',
        description: 'El torneo que buscas no existe'
      };
    }
    
    return {
      title: `${torneo.nombre} | GoolStar`,
      description: `Toda la información sobre el torneo ${torneo.nombre}. Fechas, equipos, resultados y más.`
    };
  } catch (error) {
    return {
      title: 'Torneo | GoolStar',
      description: 'Detalles del torneo'
    };
  }
}