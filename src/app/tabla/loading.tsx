// src/app/tabla/loading.tsx
export default function TablaPageLoading() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            {/* Header skeleton */}
            <div className="pt-28 pb-16 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Título skeleton */}
                        <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded w-96 mx-auto mb-6 animate-pulse"></div>
                        {/* Descripción skeleton */}
                        <div className="space-y-2 mb-8">
                            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-full max-w-3xl mx-auto animate-pulse"></div>
                            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-80 mx-auto animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros skeleton */}
            <div className="py-8 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full w-28 animate-pulse"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content skeleton */}
            <div className="py-16 bg-white dark:bg-neutral-800">
                <div className="container mx-auto px-4">
                    <div className="backdrop-blur-sm bg-white/50 dark:bg-neutral-800/50 rounded-2xl p-6 md:p-8 shadow-xl border border-neutral-200/50 dark:border-neutral-700/50">
                        {/* Tabla skeleton para desktop */}
                        <div className="hidden lg:block bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    {/* Header skeleton */}
                                    <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                                    <tr>
                                        {Array.from({ length: 10 }).map((_, i) => (
                                            <th key={i} className="px-4 py-4">
                                                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-8 mx-auto animate-pulse"></div>
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>

                                    {/* Body skeleton */}
                                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                    {Array.from({ length: 12 }).map((_, index) => (
                                        <tr key={index}>
                                            {/* Posición */}
                                            <td className="px-4 py-4 text-center">
                                                <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg mx-auto animate-pulse"></div>
                                            </td>

                                            {/* Equipo */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                                                    <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-32 animate-pulse"></div>
                                                </div>
                                            </td>

                                            {/* Resto de columnas */}
                                            {Array.from({ length: 8 }).map((_, i) => (
                                                <td key={i} className="px-4 py-4 text-center">
                                                    <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-8 mx-auto animate-pulse"></div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Vista móvil skeleton */}
                        <div className="lg:hidden bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 divide-y divide-neutral-200 dark:divide-neutral-700">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div key={index} className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse"></div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                                                <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-24 animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-8 animate-pulse"></div>
                                            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-6 animate-pulse"></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="text-center">
                                                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-8 mx-auto mb-1 animate-pulse"></div>
                                                <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-12 mx-auto animate-pulse"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer skeleton */}
                        <div className="flex justify-between items-center mt-8 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-48 animate-pulse"></div>
                            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24 animate-pulse"></div>
                        </div>

                        {/* Leyenda skeleton */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-goal-blue/5 to-goal-gold/5 dark:from-goal-blue/10 dark:to-goal-gold/10 rounded-lg">
                            <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-32 mx-auto mb-3 animate-pulse"></div>
                            <div className="flex justify-center gap-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"></div>
                                        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info section skeleton */}
            <div className="py-16 bg-neutral-50 dark:bg-neutral-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-64 mx-auto mb-12 animate-pulse"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse"></div>
                                        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-24 animate-pulse"></div>
                                    </div>
                                    <div className="space-y-2">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i} className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full animate-pulse"></div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA skeleton */}
            <div className="py-20 bg-white dark:bg-neutral-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto bg-gradient-to-r from-goal-blue/5 to-goal-gold/5 dark:from-goal-blue/10 dark:to-goal-gold/10 rounded-2xl p-8 shadow-lg border border-neutral-200/80 dark:border-neutral-700/80">
                        <div className="text-center">
                            <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-80 mx-auto mb-4 animate-pulse"></div>
                            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-96 mx-auto mb-8 animate-pulse"></div>

                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded-full w-40 animate-pulse"></div>
                                <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded-full w-36 animate-pulse"></div>
                                <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded-full w-32 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}