// src/app/goleadores/loading.tsx
export default function GoleadoresLoadingPage() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            {/* Header skeleton */}
            <div className="pt-28 pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded w-80 mx-auto mb-6 animate-pulse"></div>
                        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-96 mx-auto animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Filters skeleton */}
            <div className="py-8 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full w-32 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content skeleton */}
            <div className="py-16 bg-white dark:bg-neutral-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Table skeleton for desktop */}
                        <div className="hidden lg:block bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                                    <tr>
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <th key={i} className="px-4 py-4">
                                                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16 mx-auto animate-pulse"></div>
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                    {Array.from({ length: 10 }).map((_, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-4 text-center">
                                                <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg mx-auto animate-pulse"></div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"></div>
                                                    <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-32 animate-pulse"></div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-24 animate-pulse"></div>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-8 mx-auto animate-pulse"></div>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-6 mx-auto animate-pulse"></div>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-12 mx-auto animate-pulse"></div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile skeleton */}
                        <div className="lg:hidden space-y-4">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-sm border border-neutral-200 dark:border-neutral-700"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse"></div>
                                            <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-32 mb-2 animate-pulse"></div>
                                            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24 animate-pulse"></div>
                                        </div>
                                        <div className="text-right">
                                            <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-8 mb-1 ml-auto animate-pulse"></div>
                                            <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-20 mb-1 ml-auto animate-pulse"></div>
                                            <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-16 ml-auto animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}