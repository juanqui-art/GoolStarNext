// src/app/torneos/[id]/page.tsx - ACTUALIZADO
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { serverApi } from '@/lib/api/server';
import TorneoHero from '@/components/torneos/TorneoHero';
// import TorneoEquiposParticipantesServer from '@/components/data/TorneoEquiposParticipantes.server';
import TorneoEquiposLoading from '@/components/data/TorneoEquiposLoading';
import { Metadata } from 'next';

// Parámetros para la página
interface TorneoPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Metadata dinámica
export async function generateMetadata({ params }: TorneoPageProps): Promise<Metadata> {
    try {
        const { id } = await params;
        const torneo = await serverApi.torneos.getById(id);

        if (!torneo) {
            return {
                title: 'Torneo no encontrado | GoolStar',
                description: 'El torneo que buscas no existe'
            };
        }

        return {
            title: `${torneo.nombre} | GoolStar`,
            description: `Toda la información sobre el torneo ${torneo.nombre}. Fechas, equipos, resultados y más.`,
            keywords: ['torneo', 'fútbol indoor', torneo.nombre, 'GoolStar'],
            openGraph: {
                title: `${torneo.nombre} | GoolStar`,
                description: `Torneo ${torneo.nombre} - ${torneo.categoria?.nombre || 'Información del torneo'}`,
                images: ['/images/torneo-og.jpg'],
            },
        };
    } catch (error) {
        console.error('Error generando metadata para torneo:', error);
        return {
            title: 'Torneo | GoolStar',
            description: 'Detalles del torneo'
        };
    }
}

export default async function TorneoPage({ params }: TorneoPageProps) {
    try {
        // Desestructurar el id de los parámetros
        const { id } = await params;

        // Obtener datos del torneo
        const torneo = await serverApi.torneos.getById(id);

        if (!torneo) {
            return notFound();
        }

        return (
            <main className="min-h-screen bg-neutral-950">
                {/* Hero Section del Torneo */}
                <TorneoHero torneo={torneo} />

                {/* Sección de Equipos Participantes */}
                <Suspense fallback={<TorneoEquiposLoading />}>
                    {/*<TorneoEquiposParticipantesServer*/}
                    {/*    torneoId={id}*/}
                    {/*    titulo={`Equipos Participantes - ${torneo.nombre}`}*/}
                    {/*    showStats={true}*/}
                    {/*/>*/}
                </Suspense>

                {/* Aquí pueden ir otras secciones del torneo como:
                    - Partidos recientes
                    - Tabla de posiciones
                    - Próximos partidos
                    - Estadísticas generales
                */}
            </main>
        );
    } catch (error) {
        console.error('Error al cargar los datos del torneo:', error);
        return notFound();
    }
}