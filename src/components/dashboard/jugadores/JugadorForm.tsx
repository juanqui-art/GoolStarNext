// src/components/dashboard/jugadores/JugadorForm.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { X, Save, Loader2, User, Calendar, MapPin, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import type { components } from '@/types/api';

type Jugador = components['schemas']['Jugador'];
type Equipo = components['schemas']['Equipo'];

// Validación de cédula ecuatoriana
const validarCedulaEcuatoriana = (cedula: string): boolean => {
    if (!/^\d{10}$/.test(cedula)) return false;
    
    const digits = cedula.split('').map(Number);
    const provincia = parseInt(cedula.substring(0, 2));
    
    if (provincia < 1 || provincia > 24) return false;
    
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;
    
    for (let i = 0; i < 9; i++) {
        let producto = digits[i] * coeficientes[i];
        if (producto > 9) producto -= 9;
        suma += producto;
    }
    
    const digitoVerificador = suma % 10 === 0 ? 0 : 10 - (suma % 10);
    return digitoVerificador === digits[9];
};

// Schema de validación mejorado
const jugadorSchema = z.object({
    primer_nombre: z.string()
        .min(2, 'Mínimo 2 caracteres')
        .max(50, 'Máximo 50 caracteres')
        .regex(/^[a-zA-ZÀ-ſ\s]+$/, 'Solo se permiten letras'),
    segundo_nombre: z.string()
        .max(50, 'Máximo 50 caracteres')
        .regex(/^[a-zA-ZÀ-ſ\s]*$/, 'Solo se permiten letras')
        .optional(),
    primer_apellido: z.string()
        .min(2, 'Mínimo 2 caracteres')
        .max(50, 'Máximo 50 caracteres')
        .regex(/^[a-zA-ZÀ-ſ\s]+$/, 'Solo se permiten letras'),
    segundo_apellido: z.string()
        .max(50, 'Máximo 50 caracteres')
        .regex(/^[a-zA-ZÀ-ſ\s]*$/, 'Solo se permiten letras')
        .optional(),
    cedula: z.string()
        .max(20, 'Máximo 20 caracteres')
        .refine((val) => !val || validarCedulaEcuatoriana(val), {
            message: 'Cédula ecuatoriana inválida'
        })
        .optional(),
    fecha_nacimiento: z.string()
        .refine((val) => {
            if (!val) return true;
            const fecha = new Date(val);
            const hoy = new Date();
            const edad = hoy.getFullYear() - fecha.getFullYear();
            return edad >= 16 && edad <= 50;
        }, {
            message: 'La edad debe estar entre 16 y 50 años'
        })
        .optional(),
    numero_dorsal: z.number()
        .min(1, 'Mínimo 1')
        .max(99, 'Máximo 99')
        .optional(),
    posicion: z.string()
        .max(30, 'Máximo 30 caracteres')
        .optional(),
    equipo: z.number().optional(),
    activo_segunda_fase: z.boolean(),
    suspendido: z.boolean(),
    partidos_suspension_restantes: z.number().min(0).optional()
});

// Schema para validación onBlur (más estricta)
const jugadorSchemaBlur = jugadorSchema.extend({
    primer_nombre: z.string()
        .min(2, 'Mínimo 2 caracteres')
        .max(50, 'Máximo 50 caracteres')
        .regex(/^[a-zA-ZÀ-ſ\s]+$/, 'Solo se permiten letras')
        .refine((val) => val.trim().length >= 2, {
            message: 'El nombre no puede ser solo espacios'
        }),
    primer_apellido: z.string()
        .min(2, 'Mínimo 2 caracteres')
        .max(50, 'Máximo 50 caracteres')
        .regex(/^[a-zA-ZÀ-ſ\s]+$/, 'Solo se permiten letras')
        .refine((val) => val.trim().length >= 2, {
            message: 'El apellido no puede ser solo espacios'
        })
});

type FormData = z.infer<typeof jugadorSchema>;

interface JugadorFormProps {
    jugador?: Jugador | null;
    equipos: Equipo[];
    onClose: () => void;
    onSuccess: () => void;
}

const posicionesComunes = [
    'Portero',
    'Defensa',
    'Lateral Derecho',
    'Lateral Izquierdo', 
    'Mediocampista',
    'Mediocampista Defensivo',
    'Mediocampista Ofensivo',
    'Extremo Derecho',
    'Extremo Izquierdo',
    'Delantero',
    'Delantero Centro'
];

export default function JugadorForm({ jugador, equipos, onClose, onSuccess }: JugadorFormProps) {
    const [loading, setLoading] = useState(false);
    const isEditing = !!jugador;

    // Función para generar valores iniciales
    const generarValoresIniciales = useCallback((jugadorData?: Jugador | null): FormData => ({
        primer_nombre: jugadorData?.primer_nombre || '',
        segundo_nombre: jugadorData?.segundo_nombre || '',
        primer_apellido: jugadorData?.primer_apellido || '',
        segundo_apellido: jugadorData?.segundo_apellido || '',
        cedula: jugadorData?.cedula || '',
        fecha_nacimiento: jugadorData?.fecha_nacimiento || '',
        numero_dorsal: jugadorData?.numero_dorsal || undefined,
        posicion: jugadorData?.posicion || '',
        equipo: jugadorData?.equipo || undefined,
        activo_segunda_fase: jugadorData?.activo_segunda_fase !== false,
        suspendido: jugadorData?.suspendido === true,
        partidos_suspension_restantes: jugadorData?.partidos_suspension_restantes || 0
    }), []);

    // Configurar valores iniciales
    const valoresIniciales = generarValoresIniciales(jugador);

    // Validación async para dorsal único
    const validarDorsalUnico = useCallback(async (dorsal: number, equipoId?: number) => {
        if (!dorsal || !equipoId) return undefined;
        
        try {
            const response = await apiClient.request(
                `/jugadores/?equipo=${equipoId}&numero_dorsal=${dorsal}${jugador?.id ? `&exclude=${jugador.id}` : ''}`,
                { method: 'GET' }
            ) as Response;
            
            if (!response.ok) return undefined;
            
            const jugadores = await response.json();
            return jugadores.length > 0 ? 'Este número de dorsal ya está en uso en el equipo' : undefined;
        } catch {
            return undefined;
        }
    }, [jugador?.id]);

    // Configurar formulario con validación optimizada
    const form = useForm({
        defaultValues: valoresIniciales,
        validators: {
            onChange: jugadorSchema,
            onBlur: jugadorSchemaBlur,
        },
        onSubmit: async ({ value }) => {
            await handleSubmit(value);
        },
    });

    // Efecto para actualizar valores del formulario cuando cambie el jugador
    useEffect(() => {
        if (jugador !== undefined) { // undefined significa que no se ha cargado aún
            const nuevosValores = generarValoresIniciales(jugador);
            form.reset(nuevosValores);
        }
    }, [jugador, form, generarValoresIniciales]);

    const handleSubmit = async (data: FormData) => {
        try {
            setLoading(true);

            // Preparar datos para la API
            const payload = {
                ...data,
                // Convertir strings vacíos a null para campos opcionales
                segundo_nombre: data.segundo_nombre || null,
                segundo_apellido: data.segundo_apellido || null,
                cedula: data.cedula || null,
                fecha_nacimiento: data.fecha_nacimiento || null,
                posicion: data.posicion || null,
                numero_dorsal: data.numero_dorsal || null,
                equipo: data.equipo || null,
            };

            if (isEditing && jugador) {
                // Actualizar jugador existente
                await apiClient.request(`/jugadores/${jugador.id}/`, {
                    method: 'PATCH',
                    body: JSON.stringify(payload),
                });
                
                toast.success('Jugador actualizado correctamente');
            } else {
                // Crear nuevo jugador
                await apiClient.request('/jugadores/', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });
                
                toast.success('Jugador creado correctamente');
            }

            onSuccess();

        } catch (error: unknown) {
            console.error('Error guardando jugador:', error);
            
            // Manejar errores específicos con parser mejorado
            const handleApiError = (error: unknown) => {
                if (error && typeof error === 'object' && 'response' in error) {
                    const errorResponse = error.response as Response;
                    
                    if (errorResponse?.status === 400) {
                        errorResponse.json().then((errorData) => {
                            const errorMessages: Record<string, string> = {
                                numero_dorsal: 'El número de dorsal ya está en uso en este equipo',
                                cedula: 'La cédula ya está registrada en el sistema',
                                primer_nombre: 'Error en el primer nombre',
                                primer_apellido: 'Error en el primer apellido',
                                fecha_nacimiento: 'Fecha de nacimiento inválida',
                                equipo: 'El equipo seleccionado no es válido',
                                posicion: 'La posición seleccionada no es válida'
                            };
                            
                            // Encontrar el primer error y mostrarlo
                            for (const [field, message] of Object.entries(errorMessages)) {
                                if (errorData[field]) {
                                    toast.error(message);
                                    return;
                                }
                            }
                            
                            // Error genérico si no se encuentra un campo específico
                            toast.error('Error de validación. Revisa los datos ingresados');
                        }).catch(() => {
                            toast.error('Error de validación. Revisa los datos ingresados');
                        });
                    } else if (errorResponse?.status === 404) {
                        toast.error('Jugador o equipo no encontrado');
                    } else if (errorResponse?.status === 403) {
                        toast.error('No tienes permisos para realizar esta acción');
                    } else if (errorResponse?.status >= 500) {
                        toast.error('Error del servidor. Inténtalo nuevamente');
                    } else {
                        toast.error('Error al guardar jugador');
                    }
                } else {
                    toast.error('Error de conexión. Verifica tu internet');
                }
            };
            
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white">
                                {isEditing ? 'Editar Jugador' : 'Nuevo Jugador'}
                            </h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {isEditing ? 'Modifica la información del jugador' : 'Completa los datos del nuevo jugador'}
                            </p>
                        </div>
                    </div>
                    
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Formulario */}
                <form 
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="p-4 md:p-6 max-h-[calc(95vh-180px)] md:max-h-[calc(95vh-200px)] overflow-y-auto space-y-6"
                >
                    {/* Información personal */}
                    <div>
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Información Personal
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Primer nombre */}
                            <form.Field name="primer_nombre">
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                            Primer Nombre *
                                        </label>
                                        <input
                                            type="text"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ej: Juan"
                                            aria-describedby="primer-nombre-error"
                                            aria-invalid={field.state.meta.errors.length > 0}
                                            aria-required="true"
                                        />
                                        {field.state.meta.errors?.length > 0 && (
                                            <p id="primer-nombre-error" className="text-red-500 text-xs mt-1">{String(field.state.meta.errors[0])}</p>
                                        )}
                                    </div>
                                )}
                            </form.Field>

                            {/* Segundo nombre */}
                            <form.Field name="segundo_nombre">
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                            Segundo Nombre
                                        </label>
                                        <input
                                            type="text"
                                            value={field.state.value || ''}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ej: Carlos"
                                        />
                                    </div>
                                )}
                            </form.Field>

                            {/* Primer apellido */}
                            <form.Field name="primer_apellido">
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                            Primer Apellido *
                                        </label>
                                        <input
                                            type="text"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ej: Pérez"
                                        />
                                        {field.state.meta.errors?.length > 0 && (
                                            <p className="text-red-500 text-xs mt-1">{String(field.state.meta.errors[0])}</p>
                                        )}
                                    </div>
                                )}
                            </form.Field>

                            {/* Segundo apellido */}
                            <form.Field name="segundo_apellido">
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                            Segundo Apellido
                                        </label>
                                        <input
                                            type="text"
                                            value={field.state.value || ''}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ej: González"
                                        />
                                    </div>
                                )}
                            </form.Field>

                            {/* Cédula */}
                            <form.Field name="cedula">
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                            Cédula
                                        </label>
                                        <input
                                            type="text"
                                            value={field.state.value || ''}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ej: 1234567890"
                                        />
                                    </div>
                                )}
                            </form.Field>

                            {/* Fecha de nacimiento */}
                            <form.Field name="fecha_nacimiento">
                                {(field) => (
                                    <div>
                                        <label className="flex items-center gap-1 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                            <Calendar className="w-4 h-4" />
                                            Fecha de Nacimiento
                                        </label>
                                        <input
                                            type="date"
                                            value={field.state.value || ''}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                )}
                            </form.Field>
                        </div>
                    </div>

                    {/* Información deportiva */}
                    <div>
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                            <Hash className="w-4 h-4" />
                            Información Deportiva
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Número de dorsal con validación async */}
                            <form.Field 
                                name="numero_dorsal"
                                validators={{
                                    onChangeAsyncDebounceMs: 500,
                                    onChangeAsync: async ({ value }) => {
                                        const equipoId = form.getFieldValue('equipo');
                                        if (value && equipoId) {
                                            return await validarDorsalUnico(value, equipoId);
                                        }
                                        return undefined;
                                    }
                                }}
                            >
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                            Número de Dorsal
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="99"
                                            value={field.state.value || ''}
                                            onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : undefined)}
                                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="1-99"
                                            aria-describedby="dorsal-error"
                                            aria-invalid={field.state.meta.errors.length > 0}
                                        />
                                        {field.state.meta.isValidating && (
                                            <p className="text-blue-500 text-xs mt-1 flex items-center gap-1">
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Verificando disponibilidad...
                                            </p>
                                        )}
                                        {field.state.meta.errors?.length > 0 && (
                                            <p id="dorsal-error" className="text-red-500 text-xs mt-1">{String(field.state.meta.errors[0])}</p>
                                        )}
                                    </div>
                                )}
                            </form.Field>

                            {/* Posición */}
                            <form.Field name="posicion">
                                {(field) => (
                                    <div>
                                        <label className="flex items-center gap-1 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                            <MapPin className="w-4 h-4" />
                                            Posición
                                        </label>
                                        <select
                                            value={field.state.value || ''}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Seleccionar posición</option>
                                            {posicionesComunes.map(posicion => (
                                                <option key={posicion} value={posicion}>
                                                    {posicion}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </form.Field>

                            {/* Equipo */}
                            <form.Field name="equipo">
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                            Equipo
                                        </label>
                                        <select
                                            value={field.state.value || ''}
                                            onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : undefined)}
                                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Sin equipo</option>
                                            {equipos.map(equipo => (
                                                <option key={equipo.id} value={equipo.id}>
                                                    {equipo.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </form.Field>
                        </div>
                    </div>

                    {/* Estados */}
                    <div>
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
                            Estados
                        </h3>
                        
                        <div className="space-y-4">
                            {/* Activo segunda fase */}
                            <form.Field name="activo_segunda_fase">
                                {(field) => (
                                    <label className="flex items-center gap-3 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.checked)}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <div>
                                            <div className="font-medium text-neutral-900 dark:text-white">
                                                Activo para segunda fase
                                            </div>
                                            <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                                El jugador puede participar en eliminatorias
                                            </div>
                                        </div>
                                    </label>
                                )}
                            </form.Field>

                            {/* Suspendido */}
                            <form.Field name="suspendido">
                                {(field) => (
                                    <label className="flex items-center gap-3 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.checked)}
                                            className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                                        />
                                        <div>
                                            <div className="font-medium text-neutral-900 dark:text-white">
                                                Suspendido
                                            </div>
                                            <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                                El jugador no puede participar temporalmente
                                            </div>
                                        </div>
                                    </label>
                                )}
                            </form.Field>

                            {/* Partidos de suspensión */}
                            <form.Field name="partidos_suspension_restantes">
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                            Partidos de suspensión restantes
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={field.state.value || 0}
                                            onChange={(e) => field.handleChange(Number(e.target.value))}
                                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                )}
                            </form.Field>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-neutral-200 dark:border-neutral-700">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
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
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Jugador')}
                    </button>
                </div>
            </div>
        </div>
    );
}