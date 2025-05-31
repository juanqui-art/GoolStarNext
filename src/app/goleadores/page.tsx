// src/app/goleadores/page.tsx
import GoleadoresListServer from '@/components/data/GoleadoresList.server';
import GoleadoresLoading from '@/components/data/GoleadoresLoading';
import GoleadoresLayout from '@/components/goleadores/GoleadoresLayout';
import { Metadata } from 'next';
import { Suspense } from 'react';

// Props de página con searchParams como Promise en Next.js 15
interface GoleadoresPageProps {
    searchParams: Promise<{
        torneo?: string;
        equipo?: string;
        search?: string;
        page?: string;
        limite?: string;
    }>;
}

// Metadata estática optimizada para SEO
export async function generateMetadata({ searchParams }: GoleadoresPageProps): Promise<Metadata> {
    try {
        const params = await searchParams;

        const baseTitle = 'Goleadores | GoolStar';
        const baseDescription = 'Consulta la tabla de goleadores del torneo de fútbol indoor - máximos anotadores y estadísticas de goles';

        // Personalizar según filtros
        if (params.torneo) {
            return {
                title: `Goleadores del Torneo | GoolStar`,
                description: `Máximos goleadores del torneo seleccionado en GoolStar`,
            };
        }

        if (params.equipo) {
            return {
                title: `Goleadores del Equipo | GoolStar`,
                description: `Goleadores del equipo seleccionado en el torneo GoolStar`,
            };
        }

        if (params.search) {
            return {
                title: `Buscar: ${params.search} | Goleadores GoolStar`,
                description: `Resultados de búsqueda para "${params.search}" en goleadores`,
            };
        }

        return {
            title: baseTitle,
            description: baseDescription,
            keywords: ['goleadores', 'fútbol indoor', 'máximos anotadores', 'estadísticas', 'GoolStar'],
            openGraph: {
                title: baseTitle,
                description: baseDescription,
                type: 'website',
                images: [
                    {
                        url: '/images/goleadores-og.jpg',
                        width: 1200,
                        height: 630,
                        alt: 'Goleadores GoolStar',
                    }
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: baseTitle,
                description: baseDescription,
                images: ['/images/goleadores-twitter.jpg'],
            },
        };
    } catch (error) {
        console.error('Error generando metadata para goleadores:', error);
        return {
            title: 'Goleadores | GoolStar',
            description: 'Tabla de goleadores del torneo',
        };
    }
}

export default async function GoleadoresPage({ searchParams }: GoleadoresPageProps) {
    // Await searchParams antes de usar sus propiedades
    const params = await searchParams;

    // Convertir searchParams a props del componente
    const torneo_id = params.torneo ? parseInt(params.torneo) : undefined;
    const equipo_id = params.equipo ? parseInt(params.equipo) : undefined;
    const search = params.search;
    const page = params.page ? parseInt(params.page) : 1;
    const limite = params.limite ? parseInt(params.limite) : 20;

    return (
        <GoleadoresLayout>
            <Suspense
                fallback={<GoleadoresLoading />}
                key={`${torneo_id}-${equipo_id}-${search}-${page}-${limite}`}
            >
                <GoleadoresListServer
                    showTitle={false}
                    torneo_id={torneo_id}
                    equipo_id={equipo_id}
                    searchQuery={search}
                    limit={limite}
                />
            </Suspense>
        </GoleadoresLayout>
    );
}