// src/components/dashboard/FormularioLimpieza.tsx
'use client';

import type {components} from '@/types/api';
import {useForm} from '@tanstack/react-form';
import {AlertTriangle, CheckCircle, Loader2, Save, Users, X} from 'lucide-react';
import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {z} from 'zod';
import {apiClient} from '@/lib/api/client';
import { revalidateCleanupData } from '@/lib/actions/cleanup-actions';

// Tipos de la API
type Jugador = components['schemas']['Jugador'];
type Equipo = components['schemas']['Equipo'];

// Schema de validación
const formSchema = z.object({
    jugadores: z.array(z.object({
        id: z.number(),
        activo_segunda_fase: z.boolean()
    }))
});

type FormData = z.infer<typeof formSchema>;

interface FormularioLimpiezaProps {
    equipo: Equipo;
    jugadores: Jugador[];
    onClose: () => void;
    onSuccess: () => void;
}

export default function FormularioLimpieza({
                                               equipo,
                                               jugadores,
                                               onClose,
                                               onSuccess
                                           }: FormularioLimpiezaProps) {
    const [loading, setLoading] = useState(false);
    const [jugadoresActivos, setJugadoresActivos] = useState<number>(0);

    // Inicializar datos del formulario
    const jugadoresIniciales = jugadores.map(j => ({
        id: j.id,
        activo_segunda_fase: j.activo_segunda_fase !== false // Default true
    }));

    // Configurar TanStack Form
    const form = useForm({
        defaultValues: {
            jugadores: jugadoresIniciales
        } as FormData,
        validators: {
            onChange: formSchema,
        },
        onSubmit: async ({value}) => {
            await handleGuardarCambios(value);
        },
    });

    // Contar jugadores activos cuando cambie el formulario
    useEffect(() => {
        const subscription = form.store.subscribe(() => {
            const formState = form.state;
            const jugadoresData = formState.values.jugadores;
            const activos = jugadoresData.filter((j: {activo_segunda_fase: boolean}) => j.activo_segunda_fase).length;
            setJugadoresActivos(activos);
        });

        return subscription;
    }, [form]);

    // Calcular activos iniciales
    useEffect(() => {
        const activos = jugadoresIniciales.filter(j => j.activo_segunda_fase).length;
        setJugadoresActivos(activos);
    }, [jugadoresIniciales]);

    const handleGuardarCambios = async (data: FormData) => {
        try {
            setLoading(true);

            // Actualizar cada jugador usando el apiClient autenticado
            const updates = data.jugadores.map(async (jugadorData) => {
                try {
                    // Usar el apiClient que maneja automáticamente la autenticación JWT
                    const updatedJugador = await apiClient.request<Jugador>(
                        `/jugadores/${jugadorData.id}/`,
                        {
                            method: 'PATCH',
                            body: JSON.stringify({
                                activo_segunda_fase: jugadorData.activo_segunda_fase
                            }),
                        }
                    );
                    return updatedJugador;
                } catch (error) {
                    console.error(`Error actualizando jugador ${jugadorData.id}:`, error);
                    throw new Error(`Error actualizando jugador ${jugadorData.id}`);
                }
            });

            await Promise.all(updates);

            // Revalidar los datos del servidor usando Server Action
            await revalidateCleanupData();

            toast.success(`✅ Plantilla de ${equipo.nombre} actualizada`, {
                description: `${jugadoresActivos} jugadores activos para eliminatorias`
            });

            onSuccess();
            onClose();

        } catch (error) {
            console.error('Error guardando cambios:', error);
            toast.error('Error al guardar cambios', {
                description: 'Verifica tu conexión e intenta nuevamente'
            });
        } finally {
            setLoading(false);
        }
    };


    const handleSeleccionarTodos = () => {
        const todosActivos = jugadoresIniciales.map(j => ({
            ...j,
            activo_segunda_fase: true
        }));
        form.setFieldValue('jugadores', todosActivos);
    };

    const handleDesactivarTodos = () => {
        const todosInactivos = jugadoresIniciales.map(j => ({
            ...j,
            activo_segunda_fase: false
        }));
        form.setFieldValue('jugadores', todosInactivos);
    };

    const estaEnLimite = jugadoresActivos === 12;
    const excedeLimite = jugadoresActivos > 12;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-2xl md:max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="p-4 md:p-6 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400"/>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white truncate">
                                    Limpiar: {equipo.nombre}
                                </h2>
                                <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
                                    Máximo 12 jugadores
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-1.5 md:p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors flex-shrink-0"
                        >
                            <X className="w-4 h-4 md:w-5 md:h-5"/>
                        </button>
                    </div>
                </div>

                {/* Contador y alertas */}
                <div className="p-4 md:p-6 border-b border-neutral-200 dark:border-neutral-700 space-y-4">
                    {/* Contador principal */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className={`text-2xl md:text-3xl font-bold ${
                                excedeLimite ? 'text-red-600 dark:text-red-400' :
                                    estaEnLimite ? 'text-green-600 dark:text-green-400' :
                                        'text-amber-600 dark:text-amber-400'
                            }`}>
                                {jugadoresActivos}/12
                            </div>
                            <div className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                                jugadores activos
                            </div>

                            {/* Estado badges */}
                            {excedeLimite && (
                                <div className="flex items-center gap-1 md:gap-2 text-red-600 dark:text-red-400">
                                    <AlertTriangle className="w-3 h-3 md:w-4 md:h-4"/>
                                    <span className="text-xs md:text-sm font-medium">
                                        {jugadoresActivos - 12} de más
                                    </span>
                                </div>
                            )}

                            {estaEnLimite && (
                                <div className="flex items-center gap-1 md:gap-2 text-green-600 dark:text-green-400">
                                    <CheckCircle className="w-3 h-3 md:w-4 md:h-4"/>
                                    <span className="text-xs md:text-sm font-medium">
                                        Perfecto
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Botones de acción rápida */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleSeleccionarTodos}
                                className="px-3 md:px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md flex items-center gap-1.5 border border-green-700/20"
                            >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Todos</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleDesactivarTodos}
                                className="px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md flex items-center gap-1.5 border border-red-700/20"
                            >
                                <X className="w-3.5 h-3.5" />
                                <span>Ninguno</span>
                            </button>
                        </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                        <div
                            className={`h-3 rounded-full transition-all duration-300 ${
                                excedeLimite ? 'bg-red-500' :
                                    estaEnLimite ? 'bg-green-500' :
                                        'bg-amber-500'
                            }`}
                            style={{width: `${Math.min((jugadoresActivos / 12) * 100, 100)}%`}}
                        />
                    </div>
                </div>

                {/* Lista de jugadores */}
                <form
                    className="p-4 md:p-6 max-h-80 md:max-h-96 overflow-y-auto"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        {jugadores.map((jugador, index) => (
                            <form.Field
                                key={jugador.id}
                                name={`jugadores[${index}].activo_segunda_fase` as const}
                            >
                                {(field) => (
                                    <label
                                        className="flex items-center gap-2 md:gap-3 p-2 md:p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(field.state.value)}
                                            onChange={(e) => field.handleChange(e.target.checked)}
                                            className="w-4 h-4 md:w-5 md:h-5 text-blue-600 rounded focus:ring-blue-500 flex-shrink-0"
                                        />

                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm md:text-base font-medium text-neutral-900 dark:text-white truncate">
                                                {jugador.primer_nombre} {jugador.primer_apellido}
                                            </div>
                                            <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-neutral-600 dark:text-neutral-400 flex-wrap">
                                                {jugador.numero_dorsal && (
                                                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 md:px-2 py-0.5 rounded text-xs">
                                                        #{jugador.numero_dorsal}
                                                    </span>
                                                )}
                                                {jugador.posicion && (
                                                    <span className="truncate">{jugador.posicion}</span>
                                                )}
                                                {jugador.suspendido && (
                                                    <span className="text-red-500 text-xs">
                                                        Suspendido
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {field.state.value && (
                                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0"/>
                                        )}
                                    </label>
                                )}
                            </form.Field>
                        ))}
                    </div>
                </form>

                {/* Footer con botones */}
                <div className="p-4 md:p-6 border-t border-neutral-200 dark:border-neutral-700 space-y-3">
                    {/* Mensaje de estado */}
                    <div className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 text-center">
                        {excedeLimite && (
                            <span className="text-red-600 dark:text-red-400">
                                ⚠️ Debes desactivar {jugadoresActivos - 12} jugadores más
                            </span>
                        )}
                        {estaEnLimite && (
                            <span className="text-green-600 dark:text-green-400">
                                ✅ Plantilla lista para eliminatorias
                            </span>
                        )}
                        {jugadoresActivos < 12 && (
                            <span className="text-amber-600 dark:text-amber-400">
                                ℹ️ Puedes activar {12 - jugadoresActivos} jugadores más
                            </span>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 md:px-5 py-2.5 text-sm md:text-base font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700/80 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            onClick={(e) => {
                                e.preventDefault();
                                form.handleSubmit();
                            }}
                            className="flex items-center gap-2 px-5 md:px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base font-medium rounded-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg border border-blue-700/20 disabled:transform-none disabled:hover:shadow-md"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
                            <span className="sm:hidden">{loading ? 'Guardando...' : 'Guardar'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}