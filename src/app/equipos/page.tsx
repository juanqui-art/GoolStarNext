// src/app/equipos/page.tsx
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
        const stats = await serverApi.equipos.getStats();

        const baseTitle = 'Equipos Participantes | GoolStar';
        const baseDescription = `Explora los ${stats.total} equipos participantes en nuestros torneos de fútbol indoor`;

        // Personalizar según filtros
        if (params.categoria) {
            return {
                title: `Equipos - Categoría ${params.categoria} | GoolStar`,
                description: `Equipos de la categoría ${params.categoria} en GoolStar`,
            };
        }

        if (params.search) {
            return {
                title: `Buscar: ${params.search} | Equipos GoolStar`,
                description: `Resultados de búsqueda para "${params.search}" en equipos`,
            };
        }

        return {
            title: baseTitle,
            description: baseDescription,
            openGraph: {
                title: baseTitle,
                description: baseDescription,
                images: ['/images/equipos-og.jpg'],
            },
        };
    } catch (error) {
        console.error('Error generando metadata:', error);
        // Fallback metadata si hay error
        return {
            title: 'Equipos Participantes | GoolStar',
            description: 'Explora los equipos participantes en nuestros torneos de fútbol indoor',
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
        const stats = await serverApi.equipos.getStats();

        // Generar params para las categorías más comunes
        return Object.keys(stats.por_categoria).map((categoria) => ({
            categoria: categoria.toLowerCase(),
        }));
    } catch (error) {
        console.error('Error generando static params:', error);
        return [];
    }
}