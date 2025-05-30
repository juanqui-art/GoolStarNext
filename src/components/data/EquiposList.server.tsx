import { getServerEquipos } from '@/lib/api/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

interface EquiposListServerProps {
    categoria?: number;
    limit?: number;
    showTitle?: boolean;
    searchQuery?: string;
}

// Componente de loading separado para mejor reutilización
function EquiposSkeletonGrid({ count = 12 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="py-2 flex items-center space-x-3 animate-pulse"
                >
                    <div className="w-2 h-2 rounded-full bg-goal-gold/40"></div>
                    <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-32"></div>
                </div>
            ))}
        </div>
    );
}

// Componente de error mejorado
function EquiposError({ error, retry }: { error: string; retry?: () => void }) {
    return (
        <div className="text-center py-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/40 rounded-full">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                    Error al cargar equipos
                </h3>
                <p className="text-red-600 dark:text-red-400 text-sm mb-4">
                    {error}
                </p>
                {retry && (
                    <button
                        onClick={retry}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
                    >
                        Reintentar
                    </button>
                )}
            </div>
        </div>
    );
}

// Componente principal del listado
export default async function EquiposListServer({
                                                    categoria,
                                                    limit,
                                                    showTitle = true,
                                                    searchQuery
                                                }: EquiposListServerProps) {
    try {
        // Obtener todos los equipos del servidor con parámetros mejorados
        const data = await getServerEquipos({
            categoria,
            ordering: 'nombre',
            all_pages: true,
            page_size: 50,
            search: searchQuery // Agregar soporte para búsqueda
        });

        // Aplicar límite si se especificó
        const equipos = limit ? data.results.slice(0, limit) : data.results;

        // Si no hay equipos, mostrar mensaje apropiado
        if (equipos.length === 0) {
            return (
                <div className="w-full max-w-4xl mx-auto">
                    {showTitle && (
                        <h2 className="text-3xl font-heading text-center mb-6">
                            Equipos Participantes
                        </h2>
                    )}

                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                            No hay equipos registrados
                        </h3>
                        <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                            {searchQuery
                                ? `No se encontraron equipos que coincidan con "${searchQuery}"`
                                : categoria
                                    ? 'No hay equipos en esta categoría actualmente.'
                                    : 'Aún no se han registrado equipos en el torneo.'
                            }
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full max-w-4xl mx-auto">
                {showTitle && (
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-heading mb-2">
                            Equipos Participantes
                        </h2>
                        {categoria && (
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Categoría: {/* Aquí podrías mostrar el nombre de la categoría */}
                            </p>
                        )}
                    </div>
                )}

                {/* Lista mejorada de equipos */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 border border-neutral-200 dark:border-neutral-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
                        {equipos.map((equipo) => (
                            <Link
                                key={equipo.id}
                                href={`/equipos/${equipo.id}`} // Ruta para detalle del equipo
                                className="py-2 flex items-center space-x-3 group hover:bg-neutral-50 dark:hover:bg-neutral-700/50 rounded-md px-2 -mx-2 transition-colors"
                            >
                                <div className="w-2 h-2 rounded-full bg-goal-gold/70 group-hover:bg-goal-gold transition-colors"></div>
                                <span className="text-neutral-700 dark:text-neutral-200 group-hover:text-goal-blue dark:group-hover:text-goal-gold transition-colors flex-1">
                                    {equipo.nombre}
                                </span>
                                {/* Indicador de grupo si existe */}
                                {equipo.grupo && (
                                    <span className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 px-2 py-1 rounded-full">
                                        Grupo {equipo.grupo}
                                    </span>
                                )}
                                {/* Icono de enlace */}
                                <svg className="w-4 h-4 text-neutral-400 group-hover:text-goal-blue dark:group-hover:text-goal-gold transition-colors opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Información adicional */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                    <p>
                        {equipos.length} equipo{equipos.length !== 1 ? 's' : ''}
                        {limit && data.results.length > limit && ` de ${data.results.length} total`}
                        {categoria ? ' en esta categoría' : ' participantes en el torneo'}
                    </p>

                    {limit && data.results.length > limit && (
                        <Link
                            href="/equipos"
                            className="text-goal-blue dark:text-goal-gold hover:underline mt-2 sm:mt-0"
                        >
                            Ver todos los equipos →
                        </Link>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error al cargar equipos:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar los equipos.';

        return <EquiposError error={errorMessage} />;
    }
}