// src/components/data/EquiposList.server.tsx - MEJORADO
import { getServerEquipos } from '@/lib/api/server';
import Link from 'next/link';
import { Users, Trophy, Calendar } from 'lucide-react';

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

// Componente individual de equipo mejorado
function EquipoCard({ equipo }: { equipo: any }) {
    return (
        <Link
            href={`/equipos/${equipo.id}`}
            className="group block bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md hover:border-goal-gold/50 transition-all duration-300"
        >
            <div className="flex items-center gap-4">
                {/* Logo del equipo */}
                {equipo.logo ? (
                    <div className="w-12 h-12 relative">
                        <img
                            src={equipo.logo}
                            alt={`Logo ${equipo.nombre}`}
                            className="w-full h-full object-contain rounded"
                        />
                    </div>
                ) : (
                    <div className="w-12 h-12 bg-goal-gold/20 rounded-lg flex items-center justify-center">
                        <span className="text-goal-gold font-bold text-lg">
                            {equipo.nombre.substring(0, 2).toUpperCase()}
                        </span>
                    </div>
                )}

                {/* Información del equipo */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-goal-blue dark:group-hover:text-goal-gold transition-colors">
                        {equipo.nombre}
                    </h3>

                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {equipo.categoria_nombre}
                        </span>

                        {equipo.grupo && (
                            <span className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 px-2 py-1 rounded-full">
                                Grupo {equipo.grupo}
                            </span>
                        )}

                        {!equipo.activo && (
                            <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full">
                                Inactivo
                            </span>
                        )}
                    </div>
                </div>

                {/* Icono de enlace */}
                <svg
                    className="w-5 h-5 text-neutral-400 group-hover:text-goal-blue dark:group-hover:text-goal-gold transition-colors opacity-0 group-hover:opacity-100"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
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
            all_pages: !limit, // Solo todas las páginas si no hay límite
            page_size: limit || 50,
            search: searchQuery
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
                            <Users className="w-8 h-8 text-neutral-400" />
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
                        <Link
                            href="/contacto"
                            className="inline-flex items-center bg-goal-blue hover:bg-goal-blue/90 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            <Trophy className="w-4 h-4 mr-2" />
                            Inscribir mi equipo
                        </Link>
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full max-w-6xl mx-auto">
                {showTitle && (
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-heading mb-2">
                            Equipos Participantes
                        </h2>
                        {searchQuery && (
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Resultados para: "{searchQuery}"
                            </p>
                        )}
                        {categoria && (
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Categoría seleccionada
                            </p>
                        )}
                    </div>
                )}

                {/* Grid mejorado de equipos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {equipos.map((equipo) => (
                        <EquipoCard key={equipo.id} equipo={equipo} />
                    ))}
                </div>

                {/* Información adicional mejorada */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-8 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                    <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>
                                {equipos.length} equipo{equipos.length !== 1 ? 's' : ''}
                                {limit && data.results.length > limit && ` de ${data.results.length} total`}
                            </span>
                        </div>

                        {categoria && (
                            <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4" />
                                <span>Categoría filtrada</span>
                            </div>
                        )}
                    </div>

                    {limit && data.results.length > limit && (
                        <Link
                            href="/equipos"
                            className="flex items-center gap-2 text-goal-blue dark:text-goal-gold hover:underline mt-2 sm:mt-0"
                        >
                            <span>Ver todos los equipos</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    )}
                </div>

                {/* CTA para inscripción */}
                {!limit && (
                    <div className="mt-8 text-center p-6 bg-gradient-to-r from-goal-blue/10 to-goal-gold/10 rounded-xl">
                        <h3 className="text-lg font-semibold mb-2">¿Tu equipo quiere participar?</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                            Únete a la próxima edición del torneo GoolStar
                        </p>
                        <Link
                            href="/contacto"
                            className="inline-flex items-center bg-goal-gold hover:bg-goal-gold/90 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            Inscribir equipo
                        </Link>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('Error al cargar equipos:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar los equipos.';
        return <EquiposError error={errorMessage} />;
    }
}