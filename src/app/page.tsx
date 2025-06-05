import EquiposListServer from "@/components/data/EquiposList.server";
import EquiposLoading from '@/components/data/EquiposLoading';
import Hero from '@/components/layout/Hero';
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import QuickLinks from '@/components/sections/QuickLinks';
import TorneoActualServer from '@/components/torneos/TorneoActualServer';
import { Suspense } from 'react';

// Loading component para TorneoActual
function TorneoActualLoading() {
    return (
        <section className="py-12 sm:py-16 md:py-20 bg-neutral-100 dark:bg-neutral-900">
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
                <div className="max-w-xl mx-auto mb-8">
                    <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow-sm animate-pulse">
                        <div className="text-center">
                            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-24 mx-auto mb-2"></div>
                            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-48 mx-auto mb-2"></div>
                            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-64 mx-auto"></div>
                        </div>
                    </div>
                </div>

                <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded w-96 mx-auto mb-8 animate-pulse"></div>

                <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-md mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-start space-x-3 animate-pulse">
                                <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
                                <div className="flex-1">
                                    <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-24 mb-2"></div>
                                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-32"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-pulse">
                    <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full w-48"></div>
                    <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full w-44"></div>
                </div>
            </div>
        </section>
    );
}

export default function Home() {
    return (
        <LayoutWrapper>
            <Hero />

            {/* TorneoActual con datos reales de la API */}
            <Suspense fallback={<TorneoActualLoading />}>
                <TorneoActualServer />
            </Suspense>

            <section className="py-12 sm:py-16 bg-neutral-50 dark:bg-neutral-900">
                <div className="container mx-auto px-4 sm:px-6 md:px-8">
                    <Suspense fallback={<EquiposLoading />}>
                        <EquiposListServer />
                    </Suspense>
                </div>
            </section>

            <section className="py-12 sm:py-16 bg-white dark:bg-neutral-800">
                <div className="container mx-auto px-4 sm:px-6 md:px-8">
                    <QuickLinks />
                </div>
            </section>
        </LayoutWrapper>
    );
}