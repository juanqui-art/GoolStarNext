// src/app/torneos/page.tsx - REFACTORIZADO COMO SERVER COMPONENT
import { Metadata } from 'next/';
import { Suspense } from 'react';
import TorneosLayout from '@/components/torneos/TorneosLayout';
import TorneoActualServer from '@/components/torneos/TorneoActualServer';
import TorneoEstadisticasServer from '@/components/torneos/TorneoEstadisticasServer';
import TorneosLoading from '@/components/data/TorneosLoading';
import { serverApi } from '@/lib/api/server';
import type { components } from '@/types/api';

// Tipos de la API
type Torneo = components['schemas']['Torneo'];

// =======================================
// METADATA DINÁMICA CON DATOS REALES
// =======================================

export async function generateMetadata(): Promise<Metadata> {
  try {
    // Obtener el torneo activo para metadata dinámica
    const torneosActivos = await serverApi.torneos.getActivos();

    let torneoActivo: Torneo | null = null;
    if (Array.isArray(torneosActivos)) {
      torneoActivo = torneosActivos[0] || null;
    } else if (torneosActivos?.results?.length > 0) {
      torneoActivo = torneosActivos.results[0];
    }

    // Metadata base
    const baseMetadata = {
      title: 'Torneos | GoolStar - Fútbol Indoor Ecuador',
      description: 'Descubre todos los torneos de fútbol indoor en GoolStar. Información completa sobre inscripciones, calendarios, premios y más.',
      keywords: [
        'torneos fútbol indoor',
        'GoolStar Ecuador',
        'campeonatos deportivos',
        'fútbol sala',
        'torneos Cuenca',
        'competencias deportivas'
      ]
    };

    // Si hay torneo activo, personalizar metadata
    if (torneoActivo) {
      const fechaInicio = new Date(torneoActivo.fecha_inicio).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      return {
        title: `${torneoActivo.nombre} | Gool⭐️Star`,
        description: `${torneoActivo.nombre} - Torneo de fútbol indoor ${torneoActivo.categoria_nombre}. Comenzó el ${fechaInicio} con ${torneoActivo.total_equipos || 0} equipos participantes. ¡Sigue toda la acción en GoolStar!`,
        keywords: [
          ...baseMetadata.keywords,
          torneoActivo.nombre,
          `categoría ${torneoActivo.categoria_nombre}`,
          'torneo activo',
          'fase de grupos'
        ],
        openGraph: {
          title: `${torneoActivo.nombre} | GoolStar`,
          description: `Torneo activo de fútbol indoor con ${torneoActivo.total_equipos || 0} equipos. ${torneoActivo.fase_actual ? `Fase actual: ${torneoActivo.fase_actual}` : 'En desarrollo'}`,
          type: 'website',
          locale: 'es_EC',
          siteName: 'GoolStar',
        },
        twitter: {
          card: 'summary_large_image',
          title: `${torneoActivo.nombre} | GoolStar`,
          description: `🏆 Torneo activo: ${torneoActivo.total_equipos || 0} equipos compitiendo por la gloria. ¡Sigue la acción en vivo!`,
          creator: '@GoolStarEc',
          site: '@GoolStarEc',
        },
        alternates: {
          canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/torneos`,
        },
        other: {
          'tournament:name': torneoActivo.nombre,
          'tournament:teams': torneoActivo.total_equipos?.toString() || '0',
          'tournament:category': torneoActivo.categoria_nombre,
          'tournament:status': torneoActivo.activo ? 'active' : 'inactive',
          'tournament:phase': torneoActivo.fase_actual || 'groups',
        }
      };
    }

    // Metadata de fallback
    return {
      ...baseMetadata,
      openGraph: {
        title: baseMetadata.title,
        description: baseMetadata.description,
        type: 'website',
        locale: 'es_EC',
        siteName: 'GoolStar',
      },
      twitter: {
        card: 'summary_large_image',
        title: baseMetadata.title,
        description: '🏆 La mejor plataforma de torneos de fútbol indoor en Ecuador. ¡Únete a la competencia!',
        creator: '@GoolStarEc',
        site: '@GoolStarEc',
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/torneos`,
      }
    };

  } catch (error) {
    console.error('Error generando metadata de torneos:', error);

    // Metadata de emergencia
    return {
      title: 'Torneos | GoolStar',
      description: 'Torneos de fútbol indoor en Ecuador',
      robots: 'index, follow',
    };
  }
}

// =======================================
// COMPONENTE DE LOADING PARA ESTADÍSTICAS
// =======================================

function EstadisticasLoading() {
  return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl p-6 text-center animate-pulse">
              <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-lg mx-auto mb-4"></div>
              <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24 mx-auto"></div>
            </div>
        ))}
      </div>
  );
}

// =======================================
// PÁGINA PRINCIPAL - SERVER COMPONENT
// =======================================

export default async function TorneosPage() {
  // Obtener datos del torneo activo para SSR
  let torneoActivo: Torneo | null = null;

  try {
    const torneosActivos = await serverApi.torneos.getActivos();

    if (Array.isArray(torneosActivos)) {
      torneoActivo = torneosActivos[0] || null;
    } else if (torneosActivos?.results?.length > 0) {
      torneoActivo = torneosActivos.results[0];
    }
  } catch (error) {
    console.error('Error obteniendo torneo activo:', error);
  }

  // Datos del torneo con valores por defecto
  const torneoData = {
    nombre: torneoActivo?.nombre || "PRIMER CAMPEONATO GOOL⭐️STAR",
    equiposInscritos: torneoActivo?.total_equipos || 25,
    categoria: torneoActivo?.categoria_nombre || "Varones",
    fechaInicio: torneoActivo?.fecha_inicio || "2025-03-22",
    activo: torneoActivo?.activo ?? true,
    fase: torneoActivo?.fase_actual || "grupos"
  };

  return (
      <TorneosLayout torneoData={torneoData}>
        {/* Sección de Torneo Actual */}
        <section id="torneo-actual" className="scroll-mt-20">
          <Suspense fallback={<TorneosLoading vista="tarjetas" />}>
            <TorneoActualServer />
          </Suspense>
        </section>

        {/* Sección de Estadísticas del Torneo */}
        <section className="py-16 bg-white dark:bg-neutral-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                Números del <span className="text-goal-gold">Torneo</span>
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Estadísticas en tiempo real de nuestro campeonato
              </p>
            </div>

            <Suspense fallback={<EstadisticasLoading />}>
              <TorneoEstadisticasServer torneoId={torneoActivo?.id} />
            </Suspense>
          </div>
        </section>
      </TorneosLayout>
  );
}