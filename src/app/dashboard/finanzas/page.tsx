// src/app/dashboard/finanzas/page.tsx
import { Metadata } from 'next';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardGuard from '@/components/dashboard/DashboardGuard';
import { DollarSign } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Gestión Financiera | Dashboard GoolStar',
    description: 'Control de ingresos, gastos y pagos del torneo',
    robots: 'noindex, nofollow'
};

export default function FinanzasPage() {
    return (
        <DashboardGuard>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
                                Gestión Financiera
                            </h1>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Control de ingresos, gastos y pagos del torneo
                            </p>
                        </div>
                    </div>

                    {/* Coming Soon */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-12 text-center">
                        <DollarSign className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                            Próximamente
                        </h3>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Gestión financiera completa en desarrollo
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        </DashboardGuard>
    );
}