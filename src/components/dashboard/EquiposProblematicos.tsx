// src/components/dashboard/EquiposProblematicos.tsx
'use client';

import type {components} from '@/types/api';
import {AlertTriangle, CheckCircle, MessageCircle, Settings, Users} from 'lucide-react';
import {useState} from 'react';
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

export default function EquiposProblematicos({equipos}: EquiposProblematicosProps) {
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

    const handleNotificarWhatsApp = (equipo: EquipoConJugadores) => {
        // Generar lista de jugadores activos
        const jugadoresActivos = equipo.jugadores
            .filter(j => j.activo_segunda_fase)
            .map((j, index) => `${index + 1}. ${j.nombre_completo}`)
            .join('\n');

        // Generar mensaje para WhatsApp
        const mensaje = encodeURIComponent(
            `¡Hola ! 👋

Tu equipo ${equipo.nombre} tiene ${equipo.jugadores_activos} jugadores registrados. Para la fase eliminatoria del torneo solo puedes mantener 12 jugadores activos (reglamento de GoolStar).

JUGADORES ACTUALES:
${jugadoresActivos}

Por favor, envíame la lista de los 12 jugadores que quieres mantener para la siguiente fase.

Los jugadores no seleccionados quedarán como "reservas" y podrían volver a activarse si es necesario.

Tiempo límite: 16 de Junio de 2025

¡Gracias por tu colaboración! ⚽`
        );

        // Abrir WhatsApp Web con el número oficial de GoolStar
        const whatsappUrl = `https://wa.me/593978692269?text=${mensaje}`;
        window.open(whatsappUrl, '_blank');
    };

    const equiposProblematicos = equipos.filter(e => e.necesita_limpieza);
    const equiposLimpios = equipos.filter(e => !e.necesita_limpieza);

    return (
        <div className="space-y-6">

            {/* Resumen ejecutivo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3">
                        <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-600 dark:text-red-400 flex-shrink-0"/>
                        <div className="min-w-0">
                            <div className="text-xl md:text-2xl font-bold text-red-700 dark:text-red-300">
                                {equiposProblematicos.length}
                            </div>
                            <div className="text-xs md:text-sm text-red-600 dark:text-red-400">
                                Necesitan limpieza
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3">
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400 flex-shrink-0"/>
                        <div className="min-w-0">
                            <div className="text-xl md:text-2xl font-bold text-green-700 dark:text-green-300">
                                {equiposLimpios.length}
                            </div>
                            <div className="text-xs md:text-sm text-green-600 dark:text-green-400">
                                Ya están listos
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3">
                        <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0"/>
                        <div className="min-w-0">
                            <div className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-300">
                                {equipos.reduce((acc, e) => acc + e.jugadores_activos, 0)}
                            </div>
                            <div className="text-xs md:text-sm text-blue-600 dark:text-blue-400">
                                Jugadores activos totales
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de equipos problemáticos */}
            {equiposProblematicos.length > 0 && (
                <div>
                    <h3 className="text-base md:text-lg font-semibold text-red-700 dark:text-red-300 mb-3 md:mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"/>
                        <span className="truncate">Equipos que Necesitan Limpieza ({equiposProblematicos.length})</span>
                    </h3>

                    <div className="space-y-3">
                        {equiposProblematicos.map((equipo) => (
                            <div
                                key={equipo.id}
                                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 md:p-4"
                            >
                                {/* Layout móvil: stack vertical */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 dark:bg-red-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Users className="w-5 h-5 md:w-6 md:h-6 text-red-600 dark:text-red-400"/>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-semibold text-neutral-900 dark:text-white text-sm md:text-base truncate">
                                                {equipo.nombre}
                                            </h4>
                                            {/* Información compacta para móviles */}
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                                                <span>Grupo {equipo.grupo || 'N/A'}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-red-600 dark:text-red-400 font-medium">
                                                        {equipo.jugadores_activos} jugadores
                                                    </span>
                                                    <span className="text-red-600 dark:text-red-400">•</span>
                                                    <span className="text-red-600 dark:text-red-400">
                                                        {equipo.jugadores_activos - 12} de más
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botones adaptados para móviles */}
                                    <div className="flex items-center gap-2 self-center sm:self-auto">
                                        <button
                                            onClick={() => handleNotificarWhatsApp(equipo)}
                                            className="flex items-center  gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs md:text-sm"
                                            title="Notificar por WhatsApp"
                                        >
                                            <MessageCircle className="w-3 h-3 md:w-4 md:h-4"/>
                                            <span className=" inline">WhatsApp</span>
                                            {/*<span className="sm:hidden">WA</span>*/}
                                        </button>
                                        <button
                                            onClick={() => handleLimpiarEquipo(equipo)}
                                            className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs md:text-sm"
                                        >
                                            <Settings className="w-3 h-3 md:w-4 md:h-4"/>
                                            <span className="hidden sm:inline">Limpiar Ahora</span>
                                            <span className="sm:hidden">Limpiar</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Lista de equipos limpios */}
            {equiposLimpios.length > 0 && (
                <div>
                    <h3 className="text-base md:text-lg font-semibold text-green-700 dark:text-green-300 mb-3 md:mb-4 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"/>
                        <span className="truncate">Equipos Listos para Eliminatorias ({equiposLimpios.length})</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                        {equiposLimpios.map((equipo) => (
                            <div
                                key={equipo.id}
                                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2 md:p-3"
                            >
                                <div className="flex items-center gap-2 md:gap-3">
                                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400 flex-shrink-0"/>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-neutral-900 dark:text-white truncate text-sm md:text-base">
                                            {equipo.nombre}
                                        </h4>
                                        <div className="text-xs md:text-sm text-green-600 dark:text-green-400">
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
                <div className="text-center py-8 md:py-12">
                    <Users className="w-12 h-12 md:w-16 md:h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-3 md:mb-4"/>
                    <h3 className="text-base md:text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        No hay equipos para mostrar
                    </h3>
                    <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 px-4">
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