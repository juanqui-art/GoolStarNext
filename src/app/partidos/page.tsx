// src/app/partidos/page.tsx - CORREGIDO para evitar Dynamic Server Usage
import PartidosListServer from '@/components/data/PartidosList.server';
import PartidosLoading from '@/components/data/PartidosLoading';
import PartidosLayout from '@/components/partidos/PartidosLayout';
import { Metadata } from 'next';
import { Suspense } from 'react';

// Tipo para ordenamiento de partidos basado en la API real
type PartidosOrdenamiento = 'fecha' | '-fecha' | 'jornada';

// Tipo para estado de partidos más específico
type EstadoPartido = 'completado' | 'pendiente' | 'programado';

// Props de página con searchParams como Promise en Next.js 15
interface PartidosPageProps {
    searchParams: Promise<{
        equipo?: string;
        jornada?: string;
        estado?: EstadoPartido;
        search?: string;
        page?: string;
        ordenar?: PartidosOrdenamiento;
    }>;
}

// Función para validar el ordenamiento
function isValidOrdenamiento(ordenamiento: string): ordenamiento is PartidosOrdenamiento {
    const validOrderings: PartidosOrdenamiento[] = [
        'fecha', '-fecha', 'jornada'
    ];
    return validOrderings.includes(ordenamiento as PartidosOrdenamiento);
}

// ✅ METADATA ESTÁTICA - Sin usar searchParams para evitar Dynamic Server Usage
export const metadata: Metadata = {
    title: 'Partidos | GoolStar',
    description: 'Consulta todos los partidos del torneo de fútbol indoor - resultados, horarios y calendario completo',
    keywords: ['partidos', 'fútbol indoor', 'resultados', 'calendario', 'GoolStar'],
    openGraph: {
        title: 'Partidos | GoolStar',
        description: 'Consulta todos los partidos del torneo de fútbol indoor - resultados, horarios y calendario completo',
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
        title: 'Partidos | GoolStar',
        description: 'Consulta todos los partidos del torneo de fútbol indoor - resultados, horarios y calendario completo',
        images: ['/images/partidos-twitter.jpg'],
    },
};

export default async function PartidosPage({ searchParams }: PartidosPageProps) {
    // Await searchParams antes de usar sus propiedades
    const params = await searchParams;

    // Convertir searchParams a props del componente con validación
    const equipo_id = params.equipo ? parseInt(params.equipo) : undefined;
    const jornada_id = params.jornada ? parseInt(params.jornada) : undefined;
    const search = params.search;
    const page = params.page ? parseInt(params.page) : 1;

    // Validar y establecer ordenamiento con valor por defecto
    let ordenamiento: PartidosOrdenamiento = '-fecha'; // Por defecto: más recientes primero
    if (params.ordenar && isValidOrdenamiento(params.ordenar)) {
        ordenamiento = params.ordenar;
    }

    // Determinar estado del partido de forma más precisa
    let completado: boolean | undefined;
    if (params.estado === 'completado') {
        completado = true;
    } else if (params.estado === 'pendiente' || params.estado === 'programado') {
        completado = false;
    }
    // Si no se especifica estado, se mostrarán todos los partidos (completado = undefined)

    // Validar que los IDs sean números válidos
    const equipoIdValido = equipo_id && !isNaN(equipo_id) && equipo_id > 0 ? equipo_id : undefined;
    const jornadaIdValida = jornada_id && !isNaN(jornada_id) && jornada_id > 0 ? jornada_id : undefined;
    const pageValida = page && !isNaN(page) && page > 0 ? page : 1;

    return (
        <PartidosLayout>
            <Suspense
                fallback={<PartidosLoading />}
                key={`${equipoIdValido}-${jornadaIdValida}-${completado}-${search}-${pageValida}-${ordenamiento}`}
            >
                <PartidosListServer
                    showTitle={false}
                    equipo_id={equipoIdValido}
                    jornada_id={jornadaIdValida}
                    completado={completado}
                    searchQuery={search}
                    ordenamiento={ordenamiento}
                />
            </Suspense>
        </PartidosLayout>
    );
}