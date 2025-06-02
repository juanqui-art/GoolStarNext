// src/app/partidos/page.tsx - TIPOS CORREGIDOS
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
                openGraph: {
                    title: `Partidos del Equipo | GoolStar`,
                    description: `Todos los partidos del equipo seleccionado en el torneo GoolStar`,
                    images: ['/images/partidos-equipo-og.jpg'],
                },
            };
        }

        if (params.estado === 'completado') {
            return {
                title: `Resultados de Partidos | GoolStar`,
                description: `Resultados y marcadores de los partidos finalizados del torneo`,
                openGraph: {
                    title: `Resultados de Partidos | GoolStar`,
                    description: `Resultados y marcadores de los partidos finalizados del torneo`,
                    images: ['/images/partidos-resultados-og.jpg'],
                },
            };
        }

        if (params.estado === 'pendiente' || params.estado === 'programado') {
            return {
                title: `Próximos Partidos | GoolStar`,
                description: `Calendario de partidos programados y próximos encuentros`,
                openGraph: {
                    title: `Próximos Partidos | GoolStar`,
                    description: `Calendario de partidos programados y próximos encuentros`,
                    images: ['/images/partidos-proximos-og.jpg'],
                },
            };
        }

        if (params.search) {
            return {
                title: `Buscar: ${params.search} | Partidos GoolStar`,
                description: `Resultados de búsqueda para "${params.search}" en partidos`,
                openGraph: {
                    title: `Buscar: ${params.search} | Partidos GoolStar`,
                    description: `Resultados de búsqueda para "${params.search}" en partidos`,
                    images: ['/images/partidos-search-og.jpg'],
                },
            };
        }

        if (params.jornada) {
            return {
                title: `Partidos de la Jornada | GoolStar`,
                description: `Todos los partidos de la jornada seleccionada`,
                openGraph: {
                    title: `Partidos de la Jornada | GoolStar`,
                    description: `Todos los partidos de la jornada seleccionada`,
                    images: ['/images/partidos-jornada-og.jpg'],
                },
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