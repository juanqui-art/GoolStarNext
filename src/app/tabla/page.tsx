// src/app/tabla/page.tsx - CÓDIGO COMPLETO
import TablaListServer from '@/components/data/TablaList.server';
import TablaLoading from "@/components/data/TablaLoading";
import TablaLayout from '@/components/tabla/TablaLayout';
import { Metadata } from 'next';
import { Suspense } from 'react';

// Props de página con searchParams como Promise en Next.js 15
interface TablaPageProps {
    searchParams: Promise<{
        torneo?: string;
        categoria?: string;
        grupo?: string;
        actualizar?: string;
    }>;
}

// Metadata dinámica para SEO
export async function generateMetadata({ searchParams }: TablaPageProps): Promise<Metadata> {
    try {
        // Await searchParams antes de usar sus propiedades
        const params = await searchParams;

        const baseTitle = 'Tabla de Posiciones | GoolStar';
        const baseDescription = 'Consulta la tabla de posiciones actualizada del torneo GoolStar - Puntos, partidos jugados, goles y clasificación';

        // Personalizar según filtros
        if (params.grupo) {
            return {
                title: `Tabla Grupo ${params.grupo.toUpperCase()} | GoolStar`,
                description: `Tabla de posiciones del Grupo ${params.grupo.toUpperCase()} - Clasificación actualizada`,
                openGraph: {
                    title: `Tabla Grupo ${params.grupo.toUpperCase()} | GoolStar`,
                    description: `Tabla de posiciones del Grupo ${params.grupo.toUpperCase()} - Clasificación actualizada`,
                    images: ['/images/tabla-grupo-og.jpg'],
                },
            };
        }

        if (params.categoria) {
            return {
                title: `Tabla Categoría ${params.categoria} | GoolStar`,
                description: `Tabla de posiciones de la categoría ${params.categoria} en GoolStar`,
                openGraph: {
                    title: `Tabla Categoría ${params.categoria} | GoolStar`,
                    description: `Tabla de posiciones de la categoría ${params.categoria} en GoolStar`,
                    images: ['/images/tabla-categoria-og.jpg'],
                },
            };
        }

        if (params.torneo) {
            return {
                title: `Tabla de Posiciones - Torneo ${params.torneo} | GoolStar`,
                description: `Clasificación completa del torneo ${params.torneo} en GoolStar`,
                openGraph: {
                    title: `Tabla de Posiciones - Torneo ${params.torneo} | GoolStar`,
                    description: `Clasificación completa del torneo ${params.torneo} en GoolStar`,
                    images: ['/images/tabla-torneo-og.jpg'],
                },
            };
        }

        return {
            title: baseTitle,
            description: baseDescription,
            keywords: ['tabla posiciones', 'clasificación', 'fútbol indoor', 'GoolStar', 'puntos', 'torneo'],
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
        console.error('Error generando metadata:', error);
        // Fallback metadata si hay error
        return {
            title: 'Tabla de Posiciones | GoolStar',
            description: 'Consulta la tabla de posiciones actualizada del torneo GoolStar',
            keywords: ['tabla posiciones', 'clasificación', 'GoolStar'],
            openGraph: {
                title: 'Tabla de Posiciones | GoolStar',
                description: 'Consulta la tabla de posiciones actualizada del torneo GoolStar',
                images: ['/images/default-og.jpg'],
            },
        };
    }
}

export default async function TablaPage({ searchParams }: TablaPageProps) {
    // Await searchParams antes de usar sus propiedades
    const params = await searchParams;

    // Convertir searchParams a props del componente
    const torneoId = params.torneo ? parseInt(params.torneo) : undefined;
    const categoria = params.categoria;
    const grupo = params.grupo?.toUpperCase();
    const actualizar = params.actualizar === 'true';

    return (
        <TablaLayout>
            <Suspense
                fallback={<TablaLoading />}
                key={`${torneoId}-${categoria}-${grupo}-${actualizar}`} // Key para re-suspensar en cambios
            >
                <TablaListServer
                    showTitle={false}
                    torneoId={torneoId}
                    categoria={categoria}
                    grupo={grupo}
                    actualizar={actualizar}
                />
            </Suspense>
        </TablaLayout>
    );
}

// Generar rutas estáticas para grupos principales (opcional)
export async function generateStaticParams() {
    try {
        // Generar params para grupos comunes
        return [
            { grupo: 'a' },
            { grupo: 'b' },
            { grupo: 'c' },
            { grupo: 'd' },
            // Categorías comunes
            { categoria: 'varones' },
            { categoria: 'senior' },
            { categoria: 'libre' },
        ];
    } catch (error) {
        console.error('Error generando static params para tabla:', error);
        return [];
    }
}