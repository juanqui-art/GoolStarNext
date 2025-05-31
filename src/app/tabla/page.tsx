// src/app/tabla/page.tsx
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

// Metadata dinámica
export async function generateMetadata({ searchParams }: TablaPageProps): Promise<Metadata> {
    try {
        const params = await searchParams;

        const baseTitle = 'Tabla de Posiciones | GoolStar';
        const baseDescription = 'Consulta la tabla de posiciones actualizada del torneo de fútbol indoor GoolStar';

        if (params.grupo) {
            return {
                title: `Tabla Grupo ${params.grupo.toUpperCase()} | GoolStar`,
                description: `Clasificación del Grupo ${params.grupo.toUpperCase()} en el torneo GoolStar`,
                openGraph: {
                    title: `Tabla Grupo ${params.grupo.toUpperCase()} | GoolStar`,
                    description: `Clasificación del Grupo ${params.grupo.toUpperCase()} en el torneo GoolStar`,
                    images: ['/images/tabla-grupo-og.jpg'],
                },
            };
        }

        return {
            title: baseTitle,
            description: baseDescription,
            keywords: ['tabla', 'posiciones', 'clasificación', 'fútbol indoor', 'GoolStar'],
            openGraph: {
                title: baseTitle,
                description: baseDescription,
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
                title: baseTitle,
                description: baseDescription,
                images: ['/images/tabla-twitter.jpg'],
            },
        };
    } catch (error) {
        console.error('Error generando metadata para tabla:', error);
        return {
            title: 'Tabla de Posiciones | GoolStar',
            description: 'Tabla de posiciones del torneo',
        };
    }
}

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