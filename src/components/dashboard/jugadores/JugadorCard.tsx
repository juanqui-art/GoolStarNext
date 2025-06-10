// src/components/dashboard/jugadores/JugadorCard.tsx
'use client';

import { Eye, Edit, Trash2, User, AlertTriangle } from 'lucide-react';
import type { components } from '@/types/api';

type Jugador = components['schemas']['Jugador'];
type Equipo = components['schemas']['Equipo'];

interface JugadorCardProps {
    jugador: Jugador;
    equipos: Equipo[];
    onEdit: () => void;
    onDelete: () => void;
    onView: () => void;
}

export default function JugadorCard({ jugador, equipos, onEdit, onDelete, onView }: JugadorCardProps) {
    const equipo = equipos.find(e => e.id === jugador.equipo);
    const isActivo = jugador.activo_segunda_fase !== false;
    const isSuspendido = jugador.suspendido === true;
    
    return (
        <div className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
            <div className="flex items-center justify-between gap-4">
                {/* Info principal */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Avatar/Dorsal */}
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        {jugador.numero_dorsal ? (
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {jugador.numero_dorsal}
                            </span>
                        ) : (
                            <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        )}
                    </div>

                    {/* Detalles */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-neutral-900 dark:text-white truncate">
                                {jugador.nombre_completo}
                            </h3>
                            
                            {/* Estados */}
                            <div className="flex items-center gap-1">
                                {!isActivo && (
                                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                        Inactivo
                                    </span>
                                )}
                                {isSuspendido && (
                                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        Suspendido
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Información secundaria */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                            <span>{equipo?.nombre || 'Sin equipo'}</span>
                            {jugador.posicion && (
                                <>
                                    <span className="hidden sm:inline">•</span>
                                    <span>{jugador.posicion}</span>
                                </>
                            )}
                            {jugador.cedula && (
                                <>
                                    <span className="hidden sm:inline">•</span>
                                    <span>CI: {jugador.cedula}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                        onClick={onView}
                        className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Ver detalles"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    
                    <button
                        onClick={onEdit}
                        className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Editar jugador"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                        onClick={onDelete}
                        className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Eliminar jugador"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}