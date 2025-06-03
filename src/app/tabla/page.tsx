// src/app/tabla/page.tsx - CORREGIDO
import TablaListServer from '@/components/data/TablaList.server'
import TablaLoading from '@/components/data/TablaLoading';
import TablaLayout from '@/components/tabla/TablaLayout';
import { Metadata } from 'next';
import { Suspense } from 'react';

// Props de página con searchParams como Promise en Next.js 15
interface TablaPageProps {
    searchParams: Promise<{
        grupo?: string;
        actualizar?: string;
        torneo?: string;
    }>;
}

// Metadata ESTÁTICA para evitar dynamic server usage
export const metadata: Metadata = {
    title: 'Tabla de Posiciones | GoolStar',
    description: 'Consulta la tabla de posiciones actualizada del torneo de fútbol indoor GoolStar',
    keywords: ['tabla', 'posiciones', 'clasificación', 'fútbol indoor', 'GoolStar'],
    openGraph: {
        title: 'Tabla de Posiciones | GoolStar',
        description: 'Consulta la tabla de posiciones actualizada del torneo de fútbol indoor GoolStar',
        type: 'website',
        images: [
            {
                url: '/images/tabla-og.jpg',
                width: 1200,
                height: 630,
                alt: 'Tabla de Posiciones GoolStar',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tabla de Posiciones | GoolStar',
        description: 'Consulta la tabla de posiciones actualizada del torneo de fútbol indoor GoolStar',
        images: ['/images/tabla-twitter.jpg'],
    },
};

export default async function TablaPage({ searchParams }: TablaPageProps) {
    // Await searchParams antes de usar sus propiedades
    const params = await searchParams;

    // Convertir searchParams a props del componente
    const grupo = params.grupo;
    const actualizar = params.actualizar === 'true';
    const torneoId = params.torneo ? parseInt(params.torneo) : undefined;

    return (
        <TablaLayout>
            <Suspense
                fallback={<TablaLoading />}
                key={`${grupo}-${actualizar}-${torneoId}`} // Key para re-suspensar en cambios
            >
                <TablaListServer
                    showTitle={false}
                    grupo={grupo}
                    actualizar={actualizar}
                    torneoId={torneoId}
                />
            </Suspense>
        </TablaLayout>
    );
}