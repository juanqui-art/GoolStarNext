export default function EquiposLoading() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            {/* Header skeleton */}
            <div className="pt-28 pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded w-64 mx-auto mb-6 animate-pulse"></div>
                        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-96 mx-auto animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Content skeleton */}
            <div className="py-16 bg-white dark:bg-neutral-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 12 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-4 animate-pulse"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-600 rounded-lg"></div>
                                        <div className="flex-1">
                                            <div className="h-5 bg-neutral-200 dark:bg-neutral-600 rounded w-32 mb-2"></div>
                                            <div className="h-4 bg-neutral-200 dark:bg-neutral-600 rounded w-24"></div>
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