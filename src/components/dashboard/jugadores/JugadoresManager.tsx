// src/components/dashboard/jugadores/JugadoresManager.tsx
'use client';

import {apiClient} from '@/lib/api/client';
import type {components} from '@/types/api';
import {AlertTriangle, Grid3X3, List, Plus, RefreshCw, Search, UserPlus, Users, X} from 'lucide-react';
import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import JugadorCard from './JugadorCard';
import JugadoresTable from './JugadoresTable';
import JugadorForm from './JugadorForm';

// Tipos de la API
type Jugador = components['schemas']['Jugador'];
type Equipo = components['schemas']['Equipo'];

// Estados de filtro
type FiltroEstado = 'todos' | 'activos' | 'inactivos' | 'suspendidos';
type VistaMode = 'tabla' | 'cards';

interface JugadoresStats {
    total: number;
    activos: number;
    suspendidos: number;
    sinEquipo: number;
}

export default function JugadoresManager() {
    // Estados principales
    const [jugadores, setJugadores] = useState<Jugador[]>([]);
    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<JugadoresStats>({
        total: 0,
        activos: 0,
        suspendidos: 0,
        sinEquipo: 0
    });

    // Estados de UI
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos');
    const [equipoFiltro, setEquipoFiltro] = useState<number | null>(null);
    const [vistaMode, setVistaMode] = useState<VistaMode>('tabla');

    // Estados de modales
    const [showForm, setShowForm] = useState(false);
    const [jugadorEditando, setJugadorEditando] = useState<Jugador | null>(null);
    const [jugadorDetalle, setJugadorDetalle] = useState<Jugador | null>(null);

    // Cargar datos iniciales
    useEffect(() => {
        cargarDatos();
    }, []);

    // Función para cargar todos los datos paginados
    const cargarTodosPaginado = async <T, >(endpoint: string): Promise<T[]> => {
        let allResults: T[] = [];
        let currentPage = 1;
        let hasNext = true;

        while (hasNext) {
            try {
                // Usar paginación con parámetros page y page_size
                const pageEndpoint = `${endpoint}${endpoint.includes('?') ? '&' : '?'}page=${currentPage}&page_size=100`;
                console.log(`Cargando página ${currentPage} de ${endpoint}`);

                const response = await apiClient.request<{
                    results: T[];
                    next: string | null;
                    count: number;
                }>(pageEndpoint);

                if (response.results && response.results.length > 0) {
                    allResults = [...allResults, ...response.results];
                    console.log(`Página ${currentPage}: ${response.results.length} elementos. Total acumulado: ${allResults.length}`);
                }

                // Verificar si hay más páginas
                hasNext = response.next !== null && response.results.length > 0;
                currentPage++;

                // Protección contra bucles infinitos
                if (currentPage > 50) {
                    console.warn('Se alcanzó el límite máximo de páginas (50)');
                    break;
                }

            } catch (error) {
                console.error(`Error cargando página ${currentPage}:`, error);
                break;
            }
        }

        console.log(`Carga completa: ${allResults.length} elementos total`);
        return allResults;
    };

    const cargarDatos = async () => {
        try {
            setLoading(true);

            // Cargar todos los datos usando paginación recursiva
            const [jugadoresData, equiposData] = await Promise.all([
                cargarTodosPaginado<Jugador>('/jugadores/'),
                cargarTodosPaginado<Equipo>('/equipos/')
            ]);

            console.log(`Cargados ${jugadoresData.length} jugadores y ${equiposData.length} equipos`);

            setJugadores(jugadoresData);
            setEquipos(equiposData);

            // Calcular estadísticas
            const estadisticas: JugadoresStats = {
                total: jugadoresData.length,
                activos: jugadoresData.filter(j => j.activo_segunda_fase !== false).length,
                suspendidos: jugadoresData.filter(j => j.suspendido === true).length,
                sinEquipo: jugadoresData.filter(j => !j.equipo).length
            };
            setStats(estadisticas);

        } catch (error) {
            console.error('Error cargando datos:', error);
            toast.error('Error al cargar jugadores');
        } finally {
            setLoading(false);
        }
    };

    // Filtrar jugadores por búsqueda, estado y equipo
    const jugadoresFiltrados = jugadores.filter(jugador => {
        // Filtro por búsqueda
        const matchBusqueda = busqueda === '' ||
            jugador.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) ||
            jugador.primer_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            jugador.primer_apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
            (jugador.numero_dorsal && jugador.numero_dorsal.toString().includes(busqueda));

        // Filtro por estado
        const matchEstado = (() => {
            switch (filtroEstado) {
                case 'activos':
                    return jugador.activo_segunda_fase !== false;
                case 'inactivos':
                    return jugador.activo_segunda_fase === false;
                case 'suspendidos':
                    return jugador.suspendido === true;
                default:
                    return true;
            }
        })();

        // Filtro por equipo
        const matchEquipo = equipoFiltro === null || jugador.equipo === equipoFiltro;

        return matchBusqueda && matchEstado && matchEquipo;
    });

    // Handlers de acciones
    const handleCrearJugador = () => {
        setJugadorEditando(null);
        setShowForm(true);
    };

    const handleEditarJugador = (jugador: Jugador) => {
        setJugadorEditando(jugador);
        setShowForm(true);
    };

    const handleVerDetalle = (jugador: Jugador) => {
        setJugadorDetalle(jugador);
    };

    const handleEliminarJugador = async (jugador: Jugador) => {
        if (!confirm(`¿Estás seguro de eliminar a ${jugador.nombre_completo}?`)) {
            return;
        }

        try {
            await apiClient.request(`/jugadores/${jugador.id}/`, {
                method: 'DELETE'
            });

            toast.success('Jugador eliminado correctamente');
            cargarDatos(); // Recargar datos
        } catch (error) {
            console.error('Error eliminando jugador:', error);
            toast.error('Error al eliminar jugador');
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setJugadorEditando(null);
        cargarDatos(); // Recargar datos
    };

    if (loading) {
        return <div>Cargando...</div>; // Se mostrará el skeleton del parent
    }

    return (
        <div className="space-y-6">
            {/* Acciones rápidas - Solo mostrar si hay problemas que requieren atención */}
            {(stats.suspendidos > 0 || stats.sinEquipo > 5) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.suspendidos > 0 && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400"/>
                                <div>
                                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                        {stats.suspendidos} jugador{stats.suspendidos > 1 ? 'es' : ''} suspendido{stats.suspendidos > 1 ? 's' : ''}
                                    </p>
                                    <button
                                        onClick={() => setFiltroEstado('suspendidos')}
                                        className="text-xs text-red-600 dark:text-red-400 hover:underline"
                                    >
                                        Ver suspendidos →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {stats.sinEquipo > 5 && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <UserPlus className="w-6 h-6 text-amber-600 dark:text-amber-400"/>
                                <div>
                                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                        {stats.sinEquipo} jugadores sin equipo
                                    </p>
                                    <button
                                        onClick={() => setEquipoFiltro(null)}
                                        className="text-xs text-amber-600 dark:text-amber-400 hover:underline"
                                    >
                                        Asignar equipos →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Controles compactos */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Filtro por estado */}
                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value as FiltroEstado)}
                        className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="activos">Activos</option>
                        <option value="inactivos">Inactivos</option>
                        <option value="suspendidos">Suspendidos</option>
                    </select>

                    {/* Filtro por equipo */}
                    <select
                        value={equipoFiltro || ''}
                        onChange={(e) => setEquipoFiltro(e.target.value ? Number(e.target.value) : null)}
                        className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm"
                    >
                        <option value="">Todos los equipos</option>
                        {equipos.map(equipo => (
                            <option key={equipo.id} value={equipo.id}>
                                {equipo.nombre}
                            </option>
                        ))}
                    </select>

                    {/* Selector de vista */}
                    <div className="flex border border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setVistaMode('tabla')}
                            className={`p-2 transition-colors ${
                                vistaMode === 'tabla'
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-600'
                            }`}
                            title="Vista tabla"
                        >
                            <List className="w-4 h-4"/>
                        </button>
                        <button
                            onClick={() => setVistaMode('cards')}
                            className={`p-2 transition-colors ${
                                vistaMode === 'cards'
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-600'
                            }`}
                            title="Vista cards"
                        >
                            <Grid3X3 className="w-4 h-4"/>
                        </button>
                    </div>

                    {/* Espaciador flexible */}
                    <div className="flex-1"></div>

                    {/* Controles de acción */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={cargarDatos}
                            className="p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors"
                            title="Actualizar datos"
                        >
                            <RefreshCw className="w-4 h-4 text-neutral-600 dark:text-neutral-400"/>
                        </button>
                        
                        <button
                            onClick={handleCrearJugador}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            <Plus className="w-4 h-4"/>
                            <span className="hidden sm:inline">Nuevo Jugador</span>
                            <span className="sm:hidden">Nuevo</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Búsqueda global */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Buscar jugadores..."
                />
                {busqueda && (
                    <button
                        onClick={() => setBusqueda('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Lista de jugadores */}
            {vistaMode === 'tabla' ? (
                <JugadoresTable
                    jugadores={jugadoresFiltrados}
                    equipos={equipos}
                    globalFilter={busqueda}
                    onGlobalFilterChange={setBusqueda}
                    onEdit={handleEditarJugador}
                    onDelete={handleEliminarJugador}
                    onView={handleVerDetalle}
                />
            ) : (
                <div
                    className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                    {jugadoresFiltrados.length === 0 ? (
                        <div className="p-12 text-center">
                            <Users className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4"/>
                            <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                No se encontraron jugadores
                            </h3>
                            <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                                {filtroEstado !== 'todos' || equipoFiltro
                                    ? 'Intenta ajustar los filtros de búsqueda'
                                    : 'Comienza agregando tu primer jugador'
                                }
                            </p>
                            {(filtroEstado === 'todos' && !equipoFiltro) && (
                                <button
                                    onClick={handleCrearJugador}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                                >
                                    <Plus className="w-4 h-4"/>
                                    Crear Primer Jugador
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                            {jugadoresFiltrados.map((jugador) => (
                                <JugadorCard
                                    key={jugador.id}
                                    jugador={jugador}
                                    equipos={equipos}
                                    onEdit={() => handleEditarJugador(jugador)}
                                    onDelete={() => handleEliminarJugador(jugador)}
                                    onView={() => handleVerDetalle(jugador)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Modal de formulario */}
            {showForm && (
                <JugadorForm
                    jugador={jugadorEditando}
                    equipos={equipos}
                    onClose={() => setShowForm(false)}
                    onSuccess={handleFormSuccess}
                />
            )}

            {/* Modal de detalle */}
            {jugadorDetalle && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div
                        className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                                    Detalles del Jugador
                                </h2>
                                <button
                                    onClick={() => setJugadorDetalle(null)}
                                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Nombre
                                        Completo</label>
                                    <p className="text-neutral-900 dark:text-white">
                                        {jugadorDetalle.nombre_completo || `${jugadorDetalle.primer_nombre} ${jugadorDetalle.primer_apellido}` || 'Sin nombre'}
                                    </p>
                                </div>
                                <div>
                                    <label
                                        className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Dorsal</label>
                                    <p className="text-neutral-900 dark:text-white">{jugadorDetalle.numero_dorsal || 'Sin asignar'}</p>
                                </div>
                                <div>
                                    <label
                                        className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Equipo</label>
                                    <p className="text-neutral-900 dark:text-white">{jugadorDetalle.equipo_nombre || 'Sin equipo'}</p>
                                </div>
                                <div>
                                    <label
                                        className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Posición</label>
                                    <p className="text-neutral-900 dark:text-white">{jugadorDetalle.posicion || 'No especificada'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}