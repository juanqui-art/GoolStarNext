// src/components/dashboard/DashboardGuard.tsx
'use client';

import { useRequireAuth } from '@/lib/auth/useAuth';
import { Loader2, Shield } from 'lucide-react';

interface DashboardGuardProps {
  children: React.ReactNode;
}

export default function DashboardGuard({ children }: DashboardGuardProps) {
  const { isAuthenticated, isLoading, user } = useRequireAuth();

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            Verificando acceso...
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Validando credenciales de administrador
          </p>
        </div>
      </div>
    );
  }

  // Mostrar error si no está autenticado (aunque el middleware debería redirigir)
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            Acceso Denegado
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            No tienes permisos para acceder a esta página
          </p>
        </div>
      </div>
    );
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>;
}