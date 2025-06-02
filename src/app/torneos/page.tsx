// src/app/torneos/page.tsx - Página principal de torneos
import { Suspense } from 'react';
import { serverApi } from '@/lib/api/server';
import { Metadata } from 'next';

// Metadata estática para la página principal de torneos
export const metadata: Metadata = {
  title: 'Torneos | GoolStar',
  description: 'Explora todos los torneos de fútbol indoor disponibles en GoolStar',
  keywords: ['torneos', 'fútbol indoor', 'competiciones', 'GoolStar'],
  openGraph: {
    title: 'Torneos | GoolStar',
    description: 'Explora todos los torneos de fútbol indoor disponibles en GoolStar',
    images: ['/images/torneos-og.jpg'],
  },
};

export default async function TorneosPage() {
  try {
    // Obtener la lista de torneos
    const torneos = await serverApi.torneos.getAll();

    return (
      <main className="min-h-screen bg-neutral-950">
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold text-white mb-8">Torneos</h1>
          
          {/* Lista de torneos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {torneos.results.map((torneo) => (
              <div 
                key={torneo.id} 
                className="bg-neutral-900 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{torneo.nombre}</h2>
                  <p className="text-gray-400 mb-4">
                    {torneo.categoria?.nombre || 'Sin categoría'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-500 font-semibold">
                      {torneo.estado === 'activo' ? 'En curso' : torneo.estado}
                    </span>
                    <a 
                      href={`/torneos/${torneo.id}`}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
                    >
                      Ver detalles
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {torneos.results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">No hay torneos disponibles actualmente</p>
            </div>
          )}
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error al cargar los torneos:', error);
    return (
      <main className="min-h-screen bg-neutral-950">
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-8">Torneos</h1>
          <p className="text-xl text-red-500">Error al cargar los torneos. Por favor, inténtelo de nuevo más tarde.</p>
        </div>
      </main>
    );
  }
}