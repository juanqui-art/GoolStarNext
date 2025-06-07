// src/app/goleadores/page.tsx - CORREGIDO
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

// Metadata ESTÁTICA para evitar dynamic server usage
export const metadata: Metadata = {
    title: 'Goleadores | GoolStar',
    description: '"Ranking oficial de goleadores del torneo GoolStar 2025. Estadísticas actualizadas de los máximos anotadores del fútbol indoor más competitivo."',
    keywords: ['goleadores', 'fútbol indoor', 'máximos anotadores', 'estadísticas', 'GoolStar'],
    openGraph: {
        title: 'Goleadores | GoolStar',
        description: '"Ranking oficial de goleadores del torneo GoolStar 2025. Estadísticas actualizadas de los máximos anotadores del fútbol indoor más competitivo."',
        type: 'website',

    },
    twitter: {
        card: 'summary_large_image',
        title: 'Goleadores | GoolStar',
        description: 'Consulta la tabla de goleadores del torneo de fútbol indoor - máximos anotadores y estadísticas de goles',
    },
};

export default async function GoleadoresPage({ searchParams }: GoleadoresPageProps) {
    // Await searchParams antes de usar sus propiedades
    const params = await searchParams;

    // Convertir searchParams a props del componente
    const torneo_id = params.torneo ? parseInt(params.torneo) : undefined;
    const equipo_id = params.equipo ? parseInt(params.equipo) : undefined;
    const search = params.search;
    const page = params.page ? parseInt(params.page) : 1;
    const limite = params.limite ? parseInt(params.limite) : 21;

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