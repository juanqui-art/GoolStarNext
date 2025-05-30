// src/app/partidos/[id]/loading.tsx
export default function PartidoDetailLoading() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            {/* Breadcrumbs skeleton */}
            <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center space-x-2">
                        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-12 animate-pulse"></div>
                        <span className="text-neutral-400">/</span>
                        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16 animate-pulse"></div>
                        <span className="text-neutral-400">/</span>
                        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-32 animate-pulse"></div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="space-y-8">
                    {/* Header skeleton */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-goal-blue to-goal-orange p-6">
                            <div className="text-center space-y-4">
                                <div className="h-6 bg-white/20 rounded w-24 mx-auto animate-pulse"></div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <div className="text-center">
                                        <div className="h-6 bg-white/20 rounded w-24 mx-auto mb-2 animate-pulse"></div>
                                        <div className="h-10 bg-white/20 rounded w-12 mx-auto animate-pulse"></div>
                                    </div>
                                    <div className="h-8 bg-white/20 rounded w-8 mx-auto animate-pulse"></div>
                                    <div className="text-center">
                                        <div className="h-6 bg-white/20 rounded w-20 mx-auto mb-2 animate-pulse"></div>
                                        <div className="h-10 bg-white/20 rounded w-12 mx-auto animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-32 animate-pulse"></div>
                                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-40 animate-pulse"></div>
                                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-36 animate-pulse"></div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-28 animate-pulse"></div>
                                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-32 animate-pulse"></div>
                                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden">
                                <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                                    <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-32 animate-pulse"></div>
                                </div>
                                <div className="p-6 space-y-3">
                                    {Array.from({ length: 3 }).map((_, j) => (
                                        <div key={j} className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                                            <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-600 rounded-full animate-pulse"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-neutral-200 dark:bg-neutral-600 rounded w-32 animate-pulse"></div>
                                                <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-24 animate-pulse"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}