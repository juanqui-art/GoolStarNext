// src/components/dashboard/jugadores/JugadoresTable.tsx
'use client';

import { useMemo, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    createColumnHelper,
    flexRender,
    type ColumnDef,
    type SortingState,
    type ColumnFiltersState,
    type PaginationState,
} from '@tanstack/react-table';
import {
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    Eye,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    X,
    CheckCircle,
    AlertTriangle,
    User
} from 'lucide-react';
import type { components } from '@/types/api';

type Jugador = components['schemas']['Jugador'];
type Equipo = components['schemas']['Equipo'];

interface JugadoresTableProps {
    jugadores: Jugador[];
    equipos: Equipo[];
    globalFilter?: string;
    onGlobalFilterChange?: (value: string) => void;
    onEdit: (jugador: Jugador) => void;
    onDelete: (jugador: Jugador) => void;
    onView: (jugador: Jugador) => void;
}

// Helper para crear columnas tipadas
const columnHelper = createColumnHelper<Jugador>();

export default function JugadoresTable({ 
    jugadores, 
    equipos, 
    globalFilter: externalGlobalFilter,
    onGlobalFilterChange,
    onEdit, 
    onDelete, 
    onView 
}: JugadoresTableProps) {
    // Estados de la tabla
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [internalGlobalFilter, setInternalGlobalFilter] = useState('');
    
    // Usar filtro externo si se proporciona, sino usar interno
    const globalFilter = externalGlobalFilter !== undefined ? externalGlobalFilter : internalGlobalFilter;
    const setGlobalFilter = onGlobalFilterChange || setInternalGlobalFilter;
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    // Definición de columnas
    const columns = useMemo(() => [
        // Avatar/Dorsal
        columnHelper.display({
            id: 'avatar',
            header: '',
            cell: ({ row }) => {
                const jugador = row.original;
                return (
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        {jugador.numero_dorsal ? (
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                {jugador.numero_dorsal}
                            </span>
                        ) : (
                            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        )}
                    </div>
                );
            },
            size: 60,
        }),

        // Nombre completo
        columnHelper.accessor('nombre_completo', {
            header: 'Jugador',
            cell: ({ getValue, row }) => {
                const jugador = row.original;
                const isActivo = jugador.activo_segunda_fase !== false;
                const isSuspendido = jugador.suspendido === true;
                const nombreCompleto = getValue();
                
                return (
                    <div className="min-w-0">
                        <div className="font-medium text-neutral-900 dark:text-white truncate">
                            {nombreCompleto || `${jugador.primer_nombre} ${jugador.primer_apellido}` || 'Sin nombre'}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
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
                );
            },
            size: 200,
        }),

        // Equipo
        columnHelper.accessor('equipo', {
            header: 'Equipo',
            cell: ({ getValue }) => {
                const equipoId = getValue();
                const equipo = equipos.find(e => e.id === equipoId);
                return (
                    <span className="text-neutral-700 dark:text-neutral-300">
                        {equipo?.nombre || 'Sin equipo'}
                    </span>
                );
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },
            size: 150,
        }),

        // Posición
        columnHelper.accessor('posicion', {
            header: 'Posición',
            cell: ({ getValue }) => (
                <span className="text-neutral-600 dark:text-neutral-400">
                    {getValue() || '-'}
                </span>
            ),
            size: 120,
        }),

        // Dorsal (columna separada para ordenamiento)
        columnHelper.accessor('numero_dorsal', {
            header: 'Dorsal',
            cell: ({ getValue }) => (
                <span className="text-neutral-700 dark:text-neutral-300 font-mono">
                    {getValue() || '-'}
                </span>
            ),
            size: 80,
        }),

        // Estado
        columnHelper.display({
            id: 'estado',
            header: 'Estado',
            cell: ({ row }) => {
                const jugador = row.original;
                const isActivo = jugador.activo_segunda_fase !== false;
                const isSuspendido = jugador.suspendido === true;

                if (isSuspendido) {
                    return (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            Suspendido
                        </span>
                    );
                }

                return (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                        isActivo 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                        <CheckCircle className="w-3 h-3" />
                        {isActivo ? 'Activo' : 'Inactivo'}
                    </span>
                );
            },
            size: 100,
        }),

        // Acciones
        columnHelper.display({
            id: 'acciones',
            header: 'Acciones',
            cell: ({ row }) => {
                const jugador = row.original;
                return (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onView(jugador)}
                            className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Ver detalles"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                            onClick={() => onEdit(jugador)}
                            className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Editar"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                            onClick={() => onDelete(jugador)}
                            className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Eliminar"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                );
            },
            size: 120,
        }),
    ] as ColumnDef<Jugador>[], [equipos, onEdit, onDelete, onView]);

    // Configurar tabla
    const table = useReactTable({
        data: jugadores,
        columns,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: 'includesString',
    });

    return (
        <div className="space-y-4">
            {/* Solo mostrar búsqueda si no se está controlando externamente */}
            {externalGlobalFilter === undefined && (
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Buscar jugadores..."
                    />
                    {globalFilter && (
                        <button
                            onClick={() => setGlobalFilter('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}

            {/* Tabla */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {/* Header */}
                        <thead className="bg-neutral-50 dark:bg-neutral-700/50">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                                            style={{ width: header.getSize() }}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={`flex items-center gap-2 ${
                                                        header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                                                    }`}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {header.column.getCanSort() && (
                                                        <span className="text-neutral-400">
                                                            {{
                                                                asc: <ChevronUp className="w-4 h-4" />,
                                                                desc: <ChevronDown className="w-4 h-4" />,
                                                            }[header.column.getIsSorted() as string] ?? (
                                                                <ChevronsUpDown className="w-4 h-4" />
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>

                        {/* Body */}
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                            {table.getRowModel().rows.map(row => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            className="px-4 py-4 whitespace-nowrap"
                                            style={{ width: cell.column.getSize() }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Estado vacío */}
                {table.getRowModel().rows.length === 0 && (
                    <div className="p-12 text-center">
                        <User className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                            No se encontraron jugadores
                        </h3>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            {globalFilter ? 'Intenta ajustar la búsqueda' : 'No hay jugadores para mostrar'}
                        </p>
                    </div>
                )}
            </div>

            {/* Paginación */}
            {table.getPageCount() > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                    {/* Info de página */}
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{' '}
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                            table.getFilteredRowModel().rows.length
                        )}{' '}
                        de {table.getFilteredRowModel().rows.length} jugadores
                    </div>

                    {/* Controles de paginación */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                            className="p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                        >
                            <ChevronsLeft className="w-4 h-4" />
                        </button>
                        
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <span className="px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400">
                            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                        </span>

                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        
                        <button
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                            className="p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                        >
                            <ChevronsRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Selector de tamaño de página */}
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                        className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm"
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize} por página
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}