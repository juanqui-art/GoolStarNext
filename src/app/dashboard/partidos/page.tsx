// src/app/dashboard/partidos/page.tsx
import { Metadata } from 'next';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardGuard from '@/components/dashboard/DashboardGuard';
import { Calendar} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Gestión de Partidos | Dashboard GoolStar',
    description: 'Administrar partidos, resultados y calendario del torneo',
    robots: 'noindex, nofollow'
};

export default function PartidosPage() {
    return (
        <DashboardGuard>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                            <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
                                Gestión de Partidos
                            </h1>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Administrar partidos, resultados y calendario del torneo
                            </p>
                        </div>
                    </div>

                    {/* Coming Soon */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-12 text-center">
                        <Calendar className="w-16 h-16 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                            Próximamente
                        </h3>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Gestión de partidos y calendario en desarrollo
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        </DashboardGuard>
    );
}