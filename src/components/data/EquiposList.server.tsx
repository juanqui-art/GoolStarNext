import {getServerEquipos} from '@/lib/api/server';


interface EquiposListServerProps {
    categoria?: number;
    limit?: number;
    showTitle?: boolean;
}

export default async function EquiposListServer({
                                                    categoria,
                                                    limit,
                                                    showTitle = true
                                                }: EquiposListServerProps) {
    try {
        // Obtener todos los equipos del servidor
        const data = await getServerEquipos({
            categoria,
            ordering: 'nombre', // Ordenar por nombre por defecto
            all_pages: true,   // Obtener todos los resultados paginados
            page_size: 50      // Máximo de resultados por página
        });

        // Aplicar límite si se especificó
        const equipos = limit ? data.results.slice(0, limit) : data.results;

        return (
            <div className="w-full max-w-4xl mx-auto">
                {showTitle && (
                    <h2 className="text-3xl font-heading text-center mb-6">
                        Equipos Participantes
                    </h2>
                )}

                {/* Lista simple de equipos */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 border border-neutral-200 dark:border-neutral-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
                        {equipos.map((equipo) => (
                            <div
                                key={equipo.id}
                                className="py-2 flex items-center space-x-3 group"
                            >
                                <div className="w-2 h-2 rounded-full bg-goal-gold/70"></div>
                                <span className="text-neutral-700 dark:text-neutral-200 group-hover:text-goal-blue dark:group-hover:text-goal-gold transition-colors">
                                    {equipo.nombre}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mensaje informativo */}
                <p className="text-center text-neutral-500 dark:text-neutral-400 text-sm mt-4">
                    {equipos.length} equipos participantes en el torneo
                </p>
            </div>
        );
    } catch (error) {
        console.error('Error al cargar equipos:', error);
        return (
            <div className="text-center py-8">
                <p className="text-red-400">No se pudieron cargar los equipos. Por favor, inténtalo de nuevo más
                    tarde.</p>
            </div>
        );
    }
}
