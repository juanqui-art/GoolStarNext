// src/app/equipos/page.tsx - CÓDIGO COMPLETO
import EquiposListServer from '@/components/data/EquiposList.server';
import EquiposLoading from "@/components/data/EquiposLoading";
import EquiposLayout from '@/components/equipos/EquiposLayout';
import { serverApi } from '@/lib/api/server';
import { Metadata } from 'next';
import { Suspense } from 'react';

// Props de página con searchParams como Promise en Next.js 15
interface EquiposPageProps {
    searchParams: Promise<{
        categoria?: string;
        search?: string;
        page?: string;
    }>;
}

// Metadata dinámica corregida para Next.js 15
export async function generateMetadata({ searchParams }: EquiposPageProps): Promise<Metadata> {
    try {
        // Await searchParams antes de usar sus propiedades
        const params = await searchParams;

        const baseTitle = 'Equipos Participantes | GoolStar';
        const baseDescription = `Explora los equipos participantes en nuestros torneos de fútbol indoor`;

        // Personalizar según filtros
        if (params.categoria) {
            return {
                title: `Equipos - Categoría ${params.categoria} | GoolStar`,
                description: `Equipos de la categoría ${params.categoria} en GoolStar`,
                openGraph: {
                    title: `Equipos - Categoría ${params.categoria} | GoolStar`,
                    description: `Equipos de la categoría ${params.categoria} en GoolStar`,
                    images: ['/images/equipos-categoria-og.jpg'],
                },
            };
        }

        if (params.search) {
            return {
                title: `Buscar: ${params.search} | Equipos GoolStar`,
                description: `Resultados de búsqueda para "${params.search}" en equipos`,
                openGraph: {
                    title: `Buscar: ${params.search} | Equipos GoolStar`,
                    description: `Resultados de búsqueda para "${params.search}" en equipos`,
                    images: ['/images/equipos-search-og.jpg'],
                },
            };
        }

        return {
            title: baseTitle,
            description: baseDescription,
            keywords: ['equipos', 'fútbol indoor', 'torneos', 'GoolStar', 'participantes'],
            openGraph: {
                title: baseTitle,
                description: baseDescription,
                type: 'website',
                images: [
                    {
                        url: '/images/equipos-og.jpg',
                        width: 1200,
                        height: 630,
                        alt: 'Equipos GoolStar',
                    }
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: baseTitle,
                description: baseDescription,
                images: ['/images/equipos-twitter.jpg'],
            },
        };
    } catch (error) {
        console.error('Error generando metadata:', error);
        // Fallback metadata si hay error
        return {
            title: 'Equipos Participantes | GoolStar',
            description: 'Explora los equipos participantes en nuestros torneos de fútbol indoor',
            keywords: ['equipos', 'fútbol indoor', 'GoolStar'],
            openGraph: {
                title: 'Equipos Participantes | GoolStar',
                description: 'Explora los equipos participantes en nuestros torneos de fútbol indoor',
                images: ['/images/default-og.jpg'],
            },
        };
    }
}

export default async function EquiposPage({ searchParams }: EquiposPageProps) {
    // Await searchParams antes de usar sus propiedades
    const params = await searchParams;

    // Convertir searchParams a props del componente
    const categoria = params.categoria ? parseInt(params.categoria) : undefined;
    const search = params.search;
    const page = params.page ? parseInt(params.page) : 1;

    return (
        <EquiposLayout>
            <Suspense
                fallback={<EquiposLoading />}
                key={`${categoria}-${search}-${page}`} // Key para re-suspensar en cambios
            >
                <EquiposListServer
                    showTitle={false}
                    categoria={categoria}
                    searchQuery={search}
                />
            </Suspense>
        </EquiposLayout>
    );
}

// Generar rutas estáticas para categorías principales (opcional)
export async function generateStaticParams() {
    try {
        // Intentar obtener categorías de la API si está disponible
        const stats = await serverApi.equipos.getStats();

        // Generar params para las categorías encontradas
        return Object.keys(stats.por_categoria).map((categoria) => ({
            categoria: categoria.toLowerCase().replace(/\s+/g, '-'),
        }));
    } catch (error) {
        console.error('Error generando static params:', error);
        // Fallback a categorías conocidas
        return [
            { categoria: 'varones' },
            { categoria: 'senior' },
            { categoria: 'libre' },
            { categoria: 'sub-18' },
        ];
    }
}