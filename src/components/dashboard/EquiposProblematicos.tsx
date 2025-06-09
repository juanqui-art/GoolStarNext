// src/components/dashboard/EquiposProblematicos.tsx
'use client';

import { useState } from 'react';
import { AlertTriangle, Users, CheckCircle, Settings } from 'lucide-react';
import type { components } from '@/types/api';
import FormularioLimpieza from './FormularioLimpieza';

// Tipos de la API
type Equipo = components['schemas']['Equipo'];
type Jugador = components['schemas']['Jugador'];

// Tipo extendido para el dashboard
interface EquipoConJugadores extends Equipo {
    jugadores: Jugador[];
    jugadores_activos: number;
    necesita_limpieza: boolean;
}

interface EquiposProblematicosProps {
    equipos: EquipoConJugadores[];
}

export default function EquiposProblematicos({ equipos }: EquiposProblematicosProps) {
    const [equipoSeleccionado, setEquipoSeleccionado] = useState<EquipoConJugadores | null>(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const handleLimpiarEquipo = (equipo: EquipoConJugadores) => {
        setEquipoSeleccionado(equipo);
        setMostrarFormulario(true);
    };

    const handleCerrarFormulario = () => {
        setMostrarFormulario(false);
        setEquipoSeleccionado(null);
    };

    const handleLimpiezaExitosa = () => {
        // Cerrar modal
        handleCerrarFormulario();
        
        // No es necesario hacer nada más, el Server Action se encarga de revalidar
    };

    const equiposProblematicos = equipos.filter(e => e.necesita_limpieza);
    const equiposLimpios = equipos.filter(e => !e.necesita_limpieza);

    return (
        <div className="space-y-6">

            {/* Resumen ejecutivo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <div>
                            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                                {equiposProblematicos.length}
                            </div>
                            <div className="text-sm text-red-600 dark:text-red-400">
                                Necesitan limpieza
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                                {equiposLimpios.length}
                            </div>
                            <div className="text-sm text-green-600 dark:text-green-400">
                                Ya están listos
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                {equipos.reduce((acc, e) => acc + e.jugadores_activos, 0)}
                            </div>
                            <div className="text-sm text-blue-600 dark:text-blue-400">
                                Jugadores activos totales
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de equipos problemáticos */}
            {equiposProblematicos.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Equipos que Necesitan Limpieza ({equiposProblematicos.length})
                    </h3>

                    <div className="space-y-3">
                        {equiposProblematicos.map((equipo) => (
                            <div
                                key={equipo.id}
                                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-lg flex items-center justify-center">
                                            <Users className="w-6 h-6 text-red-600 dark:text-red-400" />
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-neutral-900 dark:text-white">
                                                {equipo.nombre}
                                            </h4>
                                            <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                                                <span>Grupo {equipo.grupo || 'N/A'}</span>
                                                <span>•</span>
                                                <span className="text-red-600 dark:text-red-400 font-medium">
                                                    {equipo.jugadores_activos} jugadores activos
                                                </span>
                                                <span>•</span>
                                                <span className="text-red-600 dark:text-red-400">
                                                    {equipo.jugadores_activos - 12} de más
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleLimpiarEquipo(equipo)}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Limpiar Ahora
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Lista de equipos limpios */}
            {equiposLimpios.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Equipos Listos para Eliminatorias ({equiposLimpios.length})
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {equiposLimpios.map((equipo) => (
                            <div
                                key={equipo.id}
                                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3"
                            >
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-neutral-900 dark:text-white truncate">
                                            {equipo.nombre}
                                        </h4>
                                        <div className="text-sm text-green-600 dark:text-green-400">
                                            {equipo.jugadores_activos} jugadores activos
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Estado vacío */}
            {equipos.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        No hay equipos para mostrar
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Verifica que haya equipos registrados en el torneo activo.
                    </p>
                </div>
            )}

            {/* Modal de Formulario de Limpieza */}
            {mostrarFormulario && equipoSeleccionado && (
                <FormularioLimpieza
                    equipo={equipoSeleccionado}
                    jugadores={equipoSeleccionado.jugadores}
                    onClose={handleCerrarFormulario}
                    onSuccess={handleLimpiezaExitosa}
                />
            )}
        </div>
    );
}