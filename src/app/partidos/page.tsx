// src/app/partidos/page.tsx
import PartidosListServer from '@/components/data/PartidosList.server';
import PartidosLoading from '@/components/data/PartidosLoading';
import PartidosLayout from '@/components/partidos/PartidosLayout';
import { Metadata } from 'next';
import { Suspense } from 'react';

// Props de página con searchParams como Promise en Next.js 15
interface PartidosPageProps {
    searchParams: Promise<{
        equipo?: string;
        jornada?: string;
        estado?: 'completado' | 'pendiente' | 'programado';
        search?: string;
        page?: string;
        ordenar?: 'fecha' | '-fecha' | 'jornada';
    }>;
}

// Metadata estática (sin llamadas a API) para evitar errores
export async function generateMetadata({ searchParams }: PartidosPageProps): Promise<Metadata> {
    try {
        const params = await searchParams;

        // Metadata base sin llamadas a API
        const baseTitle = 'Partidos | GoolStar';
        const baseDescription = 'Consulta todos los partidos del torneo de fútbol indoor - resultados, horarios y calendario completo';

        // Personalizar según filtros sin depender de la API
        if (params.equipo) {
            return {
                title: `Partidos del Equipo | GoolStar`,
                description: `Todos los partidos del equipo seleccionado en el torneo GoolStar`,
            };
        }

        if (params.estado === 'completado') {
            return {
                title: `Resultados de Partidos | GoolStar`,
                description: `Resultados y marcadores de los partidos finalizados del torneo`,
            };
        }

        if (params.estado === 'pendiente' || params.estado === 'programado') {
            return {
                title: `Próximos Partidos | GoolStar`,
                description: `Calendario de partidos programados y próximos encuentros`,
            };
        }

        if (params.search) {
            return {
                title: `Buscar: ${params.search} | Partidos GoolStar`,
                description: `Resultados de búsqueda para "${params.search}" en partidos`,
            };
        }

        return {
            title: baseTitle,
            description: baseDescription,
            keywords: ['partidos', 'fútbol indoor', 'resultados', 'calendario', 'GoolStar'],
            openGraph: {
                title: baseTitle,
                description: baseDescription,
                type: 'website',
                images: [
                    {
                        url: '/images/partidos-og.jpg',
                        width: 1200,
                        height: 630,
                        alt: 'Partidos GoolStar',
                    }
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: baseTitle,
                description: baseDescription,
                images: ['/images/partidos-twitter.jpg'],
            },
        };
    } catch (error) {
        console.error('Error generando metadata para partidos:', error);
        // Metadata de emergencia
        return {
            title: 'Partidos | GoolStar',
            description: 'Partidos de fútbol indoor',
        };
    }
}

export default async function PartidosPage({ searchParams }: PartidosPageProps) {
    // Await searchParams antes de usar sus propiedades
    const params = await searchParams;

    // Convertir searchParams a props del componente
    const equipo_id = params.equipo ? parseInt(params.equipo) : undefined;
    const jornada_id = params.jornada ? parseInt(params.jornada) : undefined;
    const search = params.search;
    const page = params.page ? parseInt(params.page) : 1;
    const ordenamiento = params.ordenar || '-fecha';

    // Determinar estado del partido
    let completado: boolean | undefined;
    if (params.estado === 'completado') {
        completado = true;
    } else if (params.estado === 'pendiente' || params.estado === 'programado') {
        completado = false;
    }

    return (
        <PartidosLayout>
            <Suspense
                fallback={<PartidosLoading />}
                key={`${equipo_id}-${jornada_id}-${completado}-${search}-${page}-${ordenamiento}`}
            >
                <PartidosListServer
                    showTitle={false}
                    equipo_id={equipo_id}
                    jornada_id={jornada_id}
                    completado={completado}
                    searchQuery={search}
                    ordenamiento={ordenamiento as any}
                />
            </Suspense>
        </PartidosLayout>
    );
}