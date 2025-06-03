// // src/components/data/TorneosList.server.tsx
// import Link from 'next/link';
// import { Calendar, Trophy, Users, Target, AlertCircle, PlayCircle, CheckCircle } from 'lucide-react';
// import type { components } from '@/types/api';
// import * as Sentry from '@sentry/nextjs';
//
// // Usar los tipos correctos de la API
// type Torneo = components['schemas']['Torneo'];
// type TorneoDetalle = components['schemas']['TorneoDetalle'];
// type PaginatedTorneoList = components['schemas']['PaginatedTorneoList'];
//
// interface TorneosListServerProps {
//     categoria?: number;
//     activos_only?: boolean;
//     limit?: number;
//     showTitle?: boolean;
//     searchQuery?: string;
//     ordenamiento?: string;
// }
//
// // Datos de ejemplo para fallback
// const TORNEOS_EJEMPLO: Torneo[] = [
//     {
//         id: 1,
//         nombre: "CATEGORÍA VARONES - PRIMER CAMPEONATO GOOL⭐STAR",
//         categoria_nombre: "Varones",
//         fecha_inicio: "2025-03-01",
//         fecha_fin: "2025-05-30",
//         activo: true,
//         finalizado: false,
//         tiene_fase_grupos: true,
//         tiene_eliminacion_directa: true,
//         numero_grupos: 4,
//         equipos_clasifican_por_grupo: 2,
//         fase_actual: "grupos" as components['schemas']['FaseActualEnum'],
//         total_equipos: 25,
//         categoria: 1
//     },
//     {
//         id: 2,
//         nombre: "COPA SENIOR - SEGUNDA EDICIÓN",
//         categoria_nombre: "Senior",
//         fecha_inicio: "2025-06-01",
//         fecha_fin: "2025-08-15",
//         activo: false,
//         finalizado: false,
//         tiene_fase_grupos: true,
//         tiene_eliminacion_directa: true,
//         numero_grupos: 2,
//         equipos_clasifican_por_grupo: 3,
//         fase_actual: "inscripcion" as components['schemas']['FaseActualEnum'],
//         total_equipos: 12,
//         categoria: 2
//     },
//     {
//         id: 3,
//         nombre: "TORNEO JUVENIL - PRIMERA DIVISIÓN",
//         categoria_nombre: "Sub-18",
//         fecha_inicio: "2024-12-01",
//         fecha_fin: "2025-02-28",
//         activo: false,
//         finalizado: true,
//         tiene_fase_grupos: true,
//         tiene_eliminacion_directa: true,
//         numero_grupos: 3,
//         equipos_clasifican_por_grupo: 2,
//         fase_actual: "finalizado" as components['schemas']['FaseActualEnum'],
//         total_equipos: 18,
//         categoria: 3
//     }
// ];
//
// // Función para obtener datos de torneos
// async function obtenerTorneos(params: any) {
//     try {
//         // Agregar breadcrumb para seguimiento en Sentry
//         Sentry.addBreadcrumb({
//             category: 'torneos',
//             message: `Obteniendo torneos con parámetros: ${JSON.stringify(params)}`,
//             level: 'info',
//             data: { params, timestamp: new Date().toISOString() }
//         });
//
//         // Intentar importar el API dinámicamente
//         const { serverApi } = await import('@/lib/api/server');
//
//         if (params.activos_only && typeof serverApi?.torneos?.getActivos === 'function') {
//             console.log('🏆 Obteniendo torneos activos...');
//
//             const data = await serverApi.torneos.getActivos({
//                 ordering: params.ordenamiento || '-fecha_inicio',
//                 search: params.searchQuery
//             });
//
//             if (data?.results && Array.isArray(data.results)) {
//                 console.log(`✅ Se encontraron ${data.results.length} torneos activos`);
//
//                 let torneos = data.results;
//
//                 // Aplicar límite si se especificó
//                 if (params.limit) {
//                     torneos = torneos.slice(0, params.limit);
//                 }
//
//                 return {
//                     torneos,
//                     esEjemplo: false,
//                     total: data.count || torneos.length,
//                     metadatos: {
//                         tipo: 'activos',
//                         actualizado: new Date().toISOString()
//                     }
//                 };
//             }
//         } else if (typeof serverApi?.torneos?.getAll === 'function') {
//             console.log('🏆 Obteniendo todos los torneos...');
//
//             const queryParams: any = {
//                 ordering: params.ordenamiento || '-fecha_inicio',
//                 search: params.searchQuery
//             };
//
//             if (params.categoria) {
//                 queryParams.categoria = params.categoria;
//             }
//
//             const data = await serverApi.torneos.getAll(queryParams);
//
//             if (data?.results && Array.isArray(data.results)) {
//                 console.log(`✅ Se encontraron ${data.results.length} torneos`);
//
//                 let torneos = data.results;
//
//                 // Filtrar por activos si es necesario
//                 if (params.activos_only) {
//                     torneos = torneos.filter((torneo: Torneo) => torneo.activo);
//                 }
//
//                 // Aplicar límite si se especificó
//                 if (params.limit) {
//                     torneos = torneos.slice(0, params.limit);
//                 }
//
//                 return {
//                     torneos,
//                     esEjemplo: false,
//                     total: data.count || torneos.length,
//                     metadatos: {
//                         tipo: params.activos_only ? 'activos' : 'todos',
//                         actualizado: new Date().toISOString()
//                     }
//                 };
//             }
//         }
//
//         console.warn('⚠️ No se pudo conectar con la API de torneos');
//         Sentry.captureMessage('No se pudo conectar con la API de torneos', 'warning');
//
//     } catch (error) {
//         console.error('❌ Error al obtener torneos:', error);
//         Sentry.captureException(error, {
//             tags: { component: 'TorneosList', operation: 'obtenerTorneos' }
//         });
//     }
//
//     // Fallback a datos de ejemplo
//     return getFallbackData(params);
// }
//
// // Función auxiliar para obtener datos de ejemplo como fallback
// function getFallbackData(params: any) {
//     console.warn('⚠️ Usando datos de ejemplo como fallback para torneos');
//     Sentry.captureMessage('Usando datos de ejemplo como fallback para torneos', 'warning');
//
//     let torneosEjemplo = [...TORNEOS_EJEMPLO];
//
//     // Aplicar filtros a los datos de ejemplo
//     if (params.activos_only) {
//         torneosEjemplo = torneosEjemplo.filter(t => t.activo);
//     }
//
//     if (params.categoria) {
//         torneosEjemplo = torneosEjemplo.filter(t => t.categoria === params.categoria);
//     }
//
//     if (params.searchQuery) {
//         const query = params.searchQuery.toLowerCase();
//         torneosEjemplo = torneosEjemplo.filter(t =>
//             t.nombre.toLowerCase().includes(query) ||
//             t.categoria_nombre.toLowerCase().includes(query)
//         );
//     }
//
//     if (params.limit) {
//         torneosEjemplo = torneosEjemplo.slice(0, params.limit);
//     }
//
//     return {
//         torneos: torneosEjemplo,
//         esEjemplo: true,
//         total: torneosEjemplo.length
//     };
// }
//
// // Componente para mostrar el estado del torneo
// function EstadoTorneo({ torneo }: { torneo: Torneo }) {
//     const fechaInicio = new Date(torneo.fecha_inicio);
//     const fechaFin = torneo.fecha_fin ? new Date(torneo.fecha_fin) : null;
//     const ahora = new Date();
//
//     if (torneo.finalizado) {
//         return (
//             <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
//                 <CheckCircle className="w-3 h-3" />
//                 Finalizado
//             </span>
//         );
//     }
//
//     if (torneo.activo) {
//         return (
//             <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
//                 <PlayCircle className="w-3 h-3" />
//                 En curso
//             </span>
//         );
//     }
//
//     if (fechaInicio > ahora) {
//         return (
//             <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
//                 <Calendar className="w-3 h-3" />
//                 Próximo
//             </span>
//         );
//     }
//
//     return (
//         <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium">
//             <Target className="w-3 h-3" />
//             Programado
//         </span>
//     );
// }
//
// // Componente para mostrar la fase actual
// function FaseActual({ fase }: { fase: components['schemas']['FaseActualEnum'] | undefined }) {
//     if (!fase) return null;
//
//     const faseTexto = {
//         'inscripcion': 'Inscripción',
//         'grupos': 'Fase de Grupos',
//         'octavos': 'Octavos de Final',
//         'cuartos': 'Cuartos de Final',
//         'semifinales': 'Semifinales',
//         'final': 'Final',
//         'finalizado': 'Finalizado'
//     };
//
//     const faseColor = {
//         'inscripcion': 'text-blue-600 dark:text-blue-400',
//         'grupos': 'text-green-600 dark:text-green-400',
//         'octavos': 'text-orange-600 dark:text-orange-400',
//         'cuartos': 'text-red-600 dark:text-red-400',
//         'semifinales': 'text-purple-600 dark:text-purple-400',
//         'final': 'text-goal-gold',
//         'finalizado': 'text-gray-600 dark:text-gray-400'
//     };
//
//     return (
//         <span className={`text-sm font-medium ${faseColor[fase] || 'text-neutral-600'}`}>
//             {faseTexto[fase] || fase}
//         </span>
//     );
// }
//
// // Componente individual de torneo
// function TorneoCard({ torneo }: { torneo: Torneo }) {
//     const fechaInicio = new Date(torneo.fecha_inicio);
//     const fechaFin = torneo.fecha_fin ? new Date(torneo.fecha_fin) : null;
//
//     return (
//         <Link
//             href={`/torneos/${torneo.id}`}
//             className="group block bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md hover:border-goal-gold/50 transition-all duration-300"
//         >
//             <div className="space-y-4">
//                 {/* Header con estado y categoría */}
//                 <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-2">
//                             <EstadoTorneo torneo={torneo} />
//                             <span className="text-sm text-neutral-500 dark:text-neutral-400">
//                                 {torneo.categoria_nombre}
//                             </span>
//                         </div>
//                         <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-goal-blue dark:group-hover:text-goal-gold transition-colors line-clamp-2">
//                             {torneo.nombre}
//                         </h3>
//                     </div>
//                 </div>
//
//                 {/* Información de fechas */}
//                 <div className="space-y-2">
//                     <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
//                         <Calendar className="w-4 h-4" />
//                         <span>
//                             Inicio: {fechaInicio.toLocaleDateString('es-ES', {
//                             day: 'numeric',
//                             month: 'short',
//                             year: 'numeric'
//                         })}
//                         </span>
//                     </div>
//                     {fechaFin && (
//                         <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
//                             <Target className="w-4 h-4" />
//                             <span>
//                                 Fin: {fechaFin.toLocaleDateString('es-ES', {
//                                 day: 'numeric',
//                                 month: 'short',
//                                 year: 'numeric'
//                             })}
//                             </span>
//                         </div>
//                     )}
//                 </div>
//
//                 {/* Información del formato */}
//                 <div className="grid grid-cols-2 gap-4">
//                     <div className="flex items-center gap-2">
//                         <Users className="w-4 h-4 text-goal-blue" />
//                         <span className="text-sm text-neutral-600 dark:text-neutral-400">
//                             {torneo.total_equipos} equipos
//                         </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <Trophy className="w-4 h-4 text-goal-orange" />
//                         <span className="text-sm text-neutral-600 dark:text-neutral-400">
//                             {torneo.numero_grupos || 0} grupos
//                         </span>
//                     </div>
//                 </div>
//
//                 {/* Fase actual */}
//                 {torneo.fase_actual && (
//                     <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
//                         <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
//                             Fase actual:
//                         </div>
//                         <FaseActual fase={torneo.fase_actual} />
//                     </div>
//                 )}
//
//                 {/* Indicador de formato */}
//                 <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
//                     {torneo.tiene_fase_grupos && (
//                         <span className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
//                             Grupos
//                         </span>
//                     )}
//                     {torneo.tiene_eliminacion_directa && (
//                         <span className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
//                             Eliminatorias
//                         </span>
//                     )}
//                 </div>
//             </div>
//         </Link>
//     );
// }
//
// // Componente de aviso para datos de ejemplo
// function AvisoEjemplo() {
//     return (
//         <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//             <div className="flex items-center gap-3">
//                 <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
//                 <div>
//                     <h3 className="text-blue-800 dark:text-blue-200 font-medium text-sm">
//                         Mostrando datos de ejemplo
//                     </h3>
//                     <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
//                         La conexión con la API está en desarrollo. Estos son torneos de ejemplo para demostrar la funcionalidad.
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// // Componente principal
// export default async function TorneosListServer({
//                                                     categoria,
//                                                     activos_only = false,
//                                                     limit,
//                                                     showTitle = true,
//                                                     searchQuery,
//                                                     ordenamiento = '-fecha_inicio'
//                                                 }: TorneosListServerProps) {
//
//     const { torneos, esEjemplo, total, metadatos } = await obtenerTorneos({
//         categoria,
//         activos_only,
//         limit,
//         searchQuery,
//         ordenamiento
//     });
//
//     // Estado vacío
//     if (torneos.length === 0) {
//         return (
//             <div className="w-full max-w-6xl mx-auto">
//                 {showTitle && (
//                     <h2 className="text-3xl font-heading text-center mb-6">
//                         {activos_only ? 'Torneos Activos' : 'Torneos'}
//                     </h2>
//                 )}
//
//                 <div className="text-center py-12">
//                     <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
//                         <Trophy className="w-8 h-8 text-neutral-400" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
//                         No hay torneos disponibles
//                     </h3>
//                     <p className="text-neutral-500 dark:text-neutral-400 mb-4">
//                         {searchQuery
//                             ? `No se encontraron torneos que coincidan con "${searchQuery}"`
//                             : activos_only
//                                 ? 'No hay torneos activos en este momento.'
//                                 : 'Aún no se han programado torneos.'
//                         }
//                     </p>
//                     <Link
//                         href="/contacto"
//                         className="inline-flex items-center bg-goal-blue hover:bg-goal-blue/90 text-white px-6 py-2 rounded-lg transition-colors"
//                     >
//                         <Trophy className="w-4 h-4 mr-2" />
//                         Organizar torneo
//                     </Link>
//                 </div>
//             </div>
//         );
//     }
//
//     return (
//         <div className="w-full max-w-6xl mx-auto">
//             {showTitle && (
//                 <div className="text-center mb-8">
//                     <h2 className="text-3xl font-heading mb-2">
//                         {activos_only ? 'Torneos Activos' : 'Torneos'}
//                     </h2>
//                     {searchQuery && (
//                         <p className="text-neutral-600 dark:text-neutral-400">
//                             Resultados para: "{searchQuery}"
//                         </p>
//                     )}
//                     {categoria && (
//                         <p className="text-neutral-600 dark:text-neutral-400">
//                             Categoría filtrada
//                         </p>
//                     )}
//                 </div>
//             )}
//
//             {/* Aviso si son datos de ejemplo */}
//             {esEjemplo && <AvisoEjemplo />}
//
//             {/* Grid de torneos */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {torneos.map((torneo) => (
//                     <TorneoCard key={torneo.id} torneo={torneo} />
//                 ))}
//             </div>
//
//             {/* Información adicional */}
//             <div className="flex flex-col sm:flex-row justify-between items-center mt-8 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
//                 <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
//                     <div className="flex items-center gap-2">
//                         <Trophy className="w-4 h-4" />
//                         <span>
//                             {torneos.length} torneo{torneos.length !== 1 ? 's' : ''}
//                             {limit && total > torneos.length && ` de ${total} total`}
//                             {esEjemplo && ' (datos de ejemplo)'}
//                         </span>
//                     </div>
//
//                     {metadatos?.tipo && (
//                         <div className="flex items-center gap-2">
//                             <Target className="w-4 h-4" />
//                             <span className="capitalize">{metadatos.tipo}</span>
//                         </div>
//                     )}
//                 </div>
//
//                 {limit && total > torneos.length && (
//                     <Link
//                         href="/torneos"
//                         className="text-goal-blue dark:text-goal-gold hover:underline mt-2 sm:mt-0"
//                     >
//                         Ver todos los torneos →
//                     </Link>
//                 )}
//             </div>
//
//             {/* Enlaces relacionados */}
//             <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
//                 <Link
//                     href="/tabla"
//                     className="flex items-center gap-2 text-goal-blue dark:text-goal-gold hover:underline"
//                 >
//                     <Trophy className="w-4 h-4" />
//                     Tabla de posiciones
//                 </Link>
//                 <Link
//                     href="/partidos"
//                     className="flex items-center gap-2 text-goal-orange hover:underline"
//                 >
//                     <Calendar className="w-4 h-4" />
//                     Próximos partidos
//                 </Link>
//                 <Link
//                     href="/goleadores"
//                     className="flex items-center gap-2 text-goal-blue dark:text-goal-gold hover:underline"
//                 >
//                     <Target className="w-4 h-4" />
//                     Goleadores
//                 </Link>
//                 <Link
//                     href="/equipos"
//                     className="flex items-center gap-2 text-goal-orange hover:underline"
//                 >
//                     <Users className="w-4 h-4" />
//                     Ver equipos
//                 </Link>
//             </div>
//         </div>
//     );
// }