// src/app/equipos/page.tsx - CORREGIDO
import EquiposListServer from '@/components/data/EquiposList.server';
import EquiposLoading from "@/components/data/EquiposLoading";
import EquiposLayout from '@/components/equipos/EquiposLayout';
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

// Metadata ESTÁTICA para evitar dynamic server usage
export const metadata: Metadata = {
    title: 'Equipos Participantes | GoolStar',
    description: 'Explora los equipos participantes en nuestros torneos de fútbol indoor',
    keywords: ['equipos', 'fútbol indoor', 'torneos', 'GoolStar', 'participantes'],
    openGraph: {
        title: 'Equipos Participantes | GoolStar',
        description: 'Explora los equipos participantes en nuestros torneos de fútbol indoor',
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
        title: 'Equipos Participantes | GoolStar',
        description: 'Explora los equipos participantes en nuestros torneos de fútbol indoor',
        images: ['/images/equipos-twitter.jpg'],
    },
};

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
        // Solo generar params básicos sin depender de la API en build time
        return [
            { categoria: 'varones' },
            { categoria: 'senior' },
            { categoria: 'libre' },
            { categoria: 'sub-18' },
        ];
    } catch (error) {
        console.error('Error generando static params:', error);
        // Fallback a categorías conocidas
        return [
            { categoria: 'varones' },
            { categoria: 'senior' },
        ];
    }
}