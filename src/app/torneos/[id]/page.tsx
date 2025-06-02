// src/app/torneos/[id]/page.tsx - CORREGIDO
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { serverApi } from '@/lib/api/server';
import TorneoHero from '@/components/torneos/TorneoHero';
import TorneoEquiposParticipantes from '@/components/data/TorneoEquiposParticipantes';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { components } from '@/types/api';

// Tipos correctos de la API
type TorneoDetalle = components['schemas']['TorneoDetalle'];

// Parámetros para la página - Corregido para Next.js 15
interface TorneoPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generar metadatos para SEO
export async function generateMetadata({ params }: TorneoPageProps): Promise<Metadata> {
  try {
    // Desestructurar el id de los parámetros
    const { id } = await params;

    const torneo = await serverApi.torneos.getById(id);

    if (!torneo) {
      return {
        title: 'Torneo no encontrado | GoolStar',
        description: 'El torneo que buscas no existe',
        robots: 'noindex, nofollow'
      };
    }

    return {
      title: `${torneo.nombre} | GoolStar`,
      description: `Toda la información sobre el torneo ${torneo.nombre}. Fechas, equipos, resultados y más.`,
      keywords: [`torneo`, `${torneo.nombre}`, `fútbol indoor`, `GoolStar`, `${torneo.categoria?.nombre || ''}`],
      openGraph: {
        title: `${torneo.nombre} | GoolStar`,
        description: `Torneo de fútbol indoor: ${torneo.nombre}. ${torneo.categoria?.nombre || ''} - ${torneo.total_equipos} equipos participantes`,
        type: 'website',
        images: [
          {
            url: '/images/torneo-og.jpg',
            width: 1200,
            height: 630,
            alt: `Torneo ${torneo.nombre}`,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${torneo.nombre} | GoolStar`,
        description: `Torneo de fútbol indoor: ${torneo.nombre}`,
        images: ['/images/torneo-twitter.jpg'],
      },
    };
  } catch (error) {
    console.error('Error generando metadata para torneo:', error);
    return {
      title: 'Torneo | GoolStar',
      description: 'Detalles del torneo',
      robots: 'noindex, nofollow'
    };
  }
}

export default async function TorneoPage({ params }: TorneoPageProps) {
  try {
    // Desestructurar el id de los parámetros
    const { id } = await params;
    let torneo: TorneoDetalle;

    // Si no hay ID, intentar obtener el primer torneo activo
    if (!id) {
      console.log('No se proporcionó ID de torneo, buscando torneos activos...');
      const torneosActivos = await serverApi.torneos.getActivos();
      
      if (!torneosActivos?.results?.length) {
        console.error('No se encontraron torneos activos');
        notFound();
      }
      
      // Usar el primer torneo activo
      torneo = torneosActivos.results[0];
      console.log(`Usando primer torneo activo:`, { id: torneo.id, nombre: torneo.nombre });
    } else {
      // Validar que el ID sea un número válido
      const torneoId = parseInt(id);
      if (isNaN(torneoId) || torneoId <= 0) {
        console.error('ID de torneo inválido:', id);
        notFound();
      }

      // Obtener datos del torneo usando la API del servidor
      try {
        torneo = await serverApi.torneos.getById(torneoId);
        console.log('Datos del torneo recibidos:', torneo);
      } catch (error) {
        console.error('Error al obtener datos del torneo:', error);
        notFound();
      }

      if (!torneo) {
        console.error('Torneo no encontrado para ID:', torneoId);
        notFound();
      }
    }

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
          {/* Hero Section del Torneo */}
          <TorneoHero torneo={torneo} />

          {/* Sección de Equipos Participantes */}
          <Suspense fallback={<LoadingSpinner />}>
            <TorneoEquiposParticipantes
                torneoId={id}
                titulo={`Equipos Participantes - ${torneo.nombre}`}
            />
          </Suspense>

          {/* Estadísticas del Torneo */}
          <section className="py-16 bg-white dark:bg-neutral-800">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 text-center">
                  <h3 className="text-2xl font-bold text-goal-blue dark:text-goal-gold mb-2">
                    {torneo.total_equipos}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">Equipos Participantes</p>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 text-center">
                  <h3 className="text-2xl font-bold text-goal-orange mb-2">
                    {torneo.total_partidos}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">Total de Partidos</p>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 text-center">
                  <h3 className="text-2xl font-bold text-green-600 mb-2">
                    {torneo.partidos_jugados}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">Partidos Jugados</p>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 text-center">
                  <h3 className="text-2xl font-bold text-red-600 mb-2">
                    {torneo.partidos_pendientes}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">Partidos Pendientes</p>
                </div>
              </div>
            </div>
          </section>

          {/* Información del Torneo */}
          <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12 text-neutral-800 dark:text-neutral-100">
                  Información del Torneo
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
                      Detalles Generales
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">Categoría:</span>
                        <span className="font-medium">{torneo.categoria?.nombre || 'No especificada'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">Fecha de inicio:</span>
                        <span className="font-medium">
                        {new Date(torneo.fecha_inicio).toLocaleDateString('es-ES')}
                      </span>
                      </div>
                      {torneo.fecha_fin && (
                          <div className="flex justify-between">
                            <span className="text-neutral-600 dark:text-neutral-400">Fecha de fin:</span>
                            <span className="font-medium">
                          {new Date(torneo.fecha_fin).toLocaleDateString('es-ES')}
                        </span>
                          </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">Estado:</span>
                        <span className={`font-medium ${
                            torneo.finalizado
                                ? 'text-red-600'
                                : torneo.activo
                                    ? 'text-green-600'
                                    : 'text-yellow-600'
                        }`}>
                        {torneo.finalizado ? 'Finalizado' : torneo.activo ? 'En curso' : 'Programado'}
                      </span>
                      </div>
                      {torneo.fase_actual && (
                          <div className="flex justify-between">
                            <span className="text-neutral-600 dark:text-neutral-400">Fase actual:</span>
                            <span className="font-medium capitalize">{torneo.fase_actual}</span>
                          </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
                      Formato del Torneo
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">Fase de grupos:</span>
                        <span className="font-medium">
                        {torneo.tiene_fase_grupos ? 'Sí' : 'No'}
                      </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">Eliminación directa:</span>
                        <span className="font-medium">
                        {torneo.tiene_eliminacion_directa ? 'Sí' : 'No'}
                      </span>
                      </div>
                      {torneo.numero_grupos && (
                          <div className="flex justify-between">
                            <span className="text-neutral-600 dark:text-neutral-400">Número de grupos:</span>
                            <span className="font-medium">{torneo.numero_grupos}</span>
                          </div>
                      )}
                      {torneo.equipos_clasifican_por_grupo && (
                          <div className="flex justify-between">
                            <span className="text-neutral-600 dark:text-neutral-400">Clasifican por grupo:</span>
                            <span className="font-medium">{torneo.equipos_clasifican_por_grupo}</span>
                          </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enlaces de navegación */}
                <div className="mt-12 flex flex-wrap justify-center gap-4">
                  <a
                      href={`/torneos/${id}/partidos`}
                      className="bg-goal-blue hover:bg-goal-blue/90 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    Ver Partidos
                  </a>
                  <a
                      href="/tabla"
                      className="bg-goal-gold hover:bg-goal-gold/90 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    Tabla de Posiciones
                  </a>
                  <a
                      href="/goleadores"
                      className="bg-goal-orange hover:bg-goal-orange/90 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    Goleadores
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>
    );
  } catch (error) {
    console.error('Error al cargar los datos del torneo:', error);
    notFound();
  }
}