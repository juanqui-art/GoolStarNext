// src/app/partidos/loading.tsx
import PartidosLoading from '@/components/data/PartidosLoading';
import Navbar from '@/components/layout/Navbar';

export default function PartidosLoadingPage() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            <div className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-sm shadow-sm dark:bg-neutral-900/95">
                <Navbar />
            </div>

            <div className="pt-28 pb-16">
                <div className="container mx-auto px-4">
                    <div className="backdrop-blur-sm bg-white/50 dark:bg-neutral-800/50 rounded-2xl p-6 md:p-8 shadow-xl border border-neutral-200/50 dark:border-neutral-700/50">
                        <PartidosLoading />
                    </div>
                </div>
            </div>
        </div>
    );
}