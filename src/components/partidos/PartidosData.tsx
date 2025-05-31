'use client';

import { useState, useEffect } from 'react';
import PartidoCard from '@/components/partidos/PartidoCard';
import { getPartidos } from '@/services/partidoService';
import type { components } from '@/types/api';

type Partido = components['schemas']['Partido'];

// Componente para mostrar la cuadrícula de partidos
function PartidosGrid({ partidos, className = '' }: { partidos: Partido[], className?: string }) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
            {partidos.map((partido) => (
                <PartidoCard
                    key={partido.id}
                    partido={partido}
                    showDate
                    showJornada
                />
            ))}
        </div>
    );
}

// Componente de paginación simplificado
function Paginacion({
                        currentPage,
                        totalPages,
                        onPageChange
                    }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center mt-8 gap-2">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-4 py-2 rounded bg-neutral-100 disabled:opacity-50"
            >
                Anterior
            </button>

            <span className="px-4 py-2">
                Página {currentPage} de {totalPages}
            </span>

            <button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-4 py-2 rounded bg-neutral-100 disabled:opacity-50"
            >
                Siguiente
            </button>
        </div>
    );
}

// Componente principal que obtiene y muestra los partidos
export function ListadoPartidos({
    page = 1,
    pageSize = 12,
    search = '',
    filterType = 'todos',
    onPageChange = () => {}
}: {
    page?: number;
    pageSize?: number;
    search?: string;
    filterType?: 'todos' | 'finalizados' | 'proximos';
    onPageChange?: (page: number) => void;
}) {
    const [partidos, setPartidos] = useState<components['schemas']['Partido'][]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar datos cuando cambien los filtros
    useEffect(() => {
        const loadPartidos = async () => {
            setIsLoading(true);
            try {
                const response = await getPartidos({ 
                    page, 
                    page_size: pageSize, 
                    search,
                    ordering: filterType === 'proximos' ? 'fecha' : undefined
                });
                
                setPartidos(response?.results || []);
                setTotalPages(Math.ceil((response?.count || 0) / pageSize));
            } catch (error) {
                console.error('Error al cargar partidos:', error);
                setPartidos([]);
                setTotalPages(1);
            } finally {
                setIsLoading(false);
            }
        };

        loadPartidos();
    }, [page, pageSize, search, filterType]);

    if (isLoading) {
        return (
            <div className="py-16 text-center">
                <div className="text-lg text-neutral-600">Cargando partidos...</div>
            </div>
        );
    }

    if (partidos.length === 0) {
        return (
            <div className="py-16 text-center">
                <h3 className="text-xl font-medium text-neutral-600">
                    No se encontraron partidos
                </h3>
            </div>
        );
    }

    return (
        <>
            <PartidosGrid partidos={partidos} className="mb-12" />
            <Paginacion
                currentPage={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </>
    );
}
