// src/app/partidos/[id]/page.tsx - REFACTORIZADO
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, Trophy, AlertCircle, RefreshCw } from 'lucide-react';
import { serverApi } from '@/lib/api/server';
import type { components } from '@/types/api';

// Tipos correctos de la API
type PartidoDetalle = components['schemas']['PartidoDetalle'];
type Gol = components['schemas']['Gol'];
type Tarjeta = components['schemas']['Tarjeta'];

interface PartidoDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Metadata dinámica usando datos reales
export async function generateMetadata({ params }: PartidoDetailPageProps): Promise<Metadata> {
    try {
        const { id } = await params;
        const partido = await serverApi.partidos.getById(id);

        return {
            title: `${partido.equipo_1.nombre} vs ${partido.equipo_2.nombre} | GoolStar`,
            description: `Detalles del partido entre ${partido.equipo_1.nombre} y ${partido.equipo_2.nombre} - ${partido.completado ? 'Finalizado' : 'Programado'}`,
            openGraph: {
                title: `${partido.equipo_1.nombre} vs ${partido.equipo_2.nombre} | GoolStar`,
                description: `Partido de fútbol indoor en GoolStar${partido.completado ? ` - Resultado: ${partido.goles_equipo_1}-${partido.goles_equipo_2}` : ''}`,
                images: ['/images/partido-og.jpg'],
            },
        };
    } catch {
        return {
            title: 'Partido | GoolStar',
            description: 'Detalles del partido',
        };
    }
}

// Tipo para eventos del partido
type EventoPartido = {
    id: string;
    tipo: 'gol' | 'tarjeta';
    minuto?: number;
    jugador_nombre: string;
    equipo_nombre: string;
    equipo_id: number;
    detalles?: string;
    autogol?: boolean;
    tipoTarjeta?: 'AMARILLA' | 'ROJA';
    motivo?: string;
    fecha: string;
};

// Función para combinar y ordenar eventos
function combinarEventos(goles: Gol[], tarjetas: Tarjeta[]): EventoPartido[] {
    const eventos: EventoPartido[] = [];
    
    // Agregar goles
    goles.forEach(gol => {
        eventos.push({
            id: `gol-${gol.id}`,
            tipo: 'gol',
            minuto: gol.minuto ?? undefined,
            jugador_nombre: gol.jugador_nombre,
            equipo_nombre: gol.equipo_nombre,
            equipo_id: gol.jugador,
            autogol: gol.autogol,
            fecha: gol.fecha_partido
        });
    });
    
    // Agregar tarjetas
    tarjetas.forEach(tarjeta => {
        eventos.push({
            id: `tarjeta-${tarjeta.id}`,
            tipo: 'tarjeta',
            minuto: tarjeta.minuto ?? undefined,
            jugador_nombre: tarjeta.jugador_nombre,
            equipo_nombre: '',
            equipo_id: tarjeta.jugador,
            tipoTarjeta: tarjeta.tipo,
            motivo: tarjeta.motivo,
            fecha: tarjeta.fecha
        });
    });
    
    // Ordenar por minuto (eventos sin minuto van al final)
    return eventos.sort((a, b) => {
        if (a.minuto === undefined && b.minuto === undefined) return 0;
        if (a.minuto === undefined) return 1;
        if (b.minuto === undefined) return -1;
        return a.minuto - b.minuto;
    });
}

// Componente para mostrar timeline de eventos profesional
function MatchEvents({ partido }: { partido: PartidoDetalle }) {
    const eventos = combinarEventos(partido.goles || [], partido.tarjetas || []);
    
    if (eventos.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Sin eventos registrados</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-500">No hay goles ni tarjetas en este partido</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-1">
            {eventos.map((evento, index) => {
                const esEquipo1 = evento.equipo_id === partido.equipo_1.id;
                
                return (
                    <div key={evento.id} className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 ${
                        index % 2 === 0 ? 'bg-neutral-25 dark:bg-neutral-800/30' : ''
                    }`}>
                        {/* Minuto */}
                        <div className="w-12 text-center">
                            {evento.minuto !== undefined ? (
                                <div className="bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-800 text-xs font-bold px-2 py-1 rounded">
                                    {evento.minuto}&apos;
                                </div>
                            ) : (
                                <div className="text-xs text-neutral-400">-</div>
                            )}
                        </div>
                        
                        {/* Timeline line */}
                        <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full border-2 ${
                                evento.tipo === 'gol' 
                                    ? 'bg-goal-gold border-goal-gold shadow-lg shadow-goal-gold/25' 
                                    : evento.tipoTarjeta === 'AMARILLA'
                                        ? 'bg-yellow-500 border-yellow-500 shadow-lg shadow-yellow-500/25'
                                        : 'bg-red-500 border-red-500 shadow-lg shadow-red-500/25'
                            }`}></div>
                            {index < eventos.length - 1 && (
                                <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-700 mt-1"></div>
                            )}
                        </div>
                        
                        {/* Contenido del evento */}
                        <div className={`flex-1 flex items-center ${
                            esEquipo1 ? 'justify-start' : 'justify-end'
                        }`}>
                            <div className={`max-w-md ${
                                esEquipo1 ? 'text-left' : 'text-right'
                            }`}>
                                {/* Icono y tipo de evento */}
                                <div className={`flex items-center gap-2 mb-1 ${
                                    esEquipo1 ? 'flex-row' : 'flex-row-reverse'
                                }`}>
                                    {evento.tipo === 'gol' ? (
                                        <div className="w-6 h-6 bg-goal-gold/20 rounded-full flex items-center justify-center">
                                            <Trophy className="w-3 h-3 text-goal-gold" />
                                        </div>
                                    ) : (
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                            evento.tipoTarjeta === 'AMARILLA'
                                                ? 'bg-yellow-100 dark:bg-yellow-900/30'
                                                : 'bg-red-100 dark:bg-red-900/30'
                                        }`}>
                                            <div className={`w-2 h-3 rounded-sm ${
                                                evento.tipoTarjeta === 'AMARILLA' ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}></div>
                                        </div>
                                    )}
                                    
                                    <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                                        {evento.jugador_nombre}
                                    </div>
                                </div>
                                
                                {/* Detalles */}
                                <div className={`text-sm text-neutral-600 dark:text-neutral-400 ${
                                    esEquipo1 ? 'text-left' : 'text-right'
                                }`}>
                                    {evento.tipo === 'gol' ? (
                                        <div className="flex items-center gap-2">
                                            <span>Gol</span>
                                            {evento.autogol && (
                                                <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded text-xs">
                                                    Autogol
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <span>Tarjeta {evento.tipoTarjeta?.toLowerCase()}</span>
                                            {evento.motivo && (
                                                <div className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                                                    {evento.motivo}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Equipo */}
                                <div className={`text-xs text-neutral-500 dark:text-neutral-500 mt-1 ${
                                    esEquipo1 ? 'text-left' : 'text-right'
                                }`}>
                                    {evento.equipo_nombre || (esEquipo1 ? partido.equipo_1.nombre : partido.equipo_2.nombre)}
                                </div>
                            </div>
                        </div>
                        
                        {/* Marcador en el momento (solo para goles) */}
                        {evento.tipo === 'gol' && (
                            <div className="w-12 text-center">
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {/* Aquí podrías calcular el marcador en ese momento */}
                                    <div className="w-2 h-2 bg-goal-gold rounded-full mx-auto"></div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// Componente para estadísticas del partido
function MatchStats({ partido }: { partido: PartidoDetalle }) {
    // Para determinar a qué equipo pertenece cada gol, usamos el equipo_nombre del gol
    const goles1 = partido.goles?.filter(g => g.equipo_nombre === partido.equipo_1.nombre).length || 0;
    const goles2 = partido.goles?.filter(g => g.equipo_nombre === partido.equipo_2.nombre).length || 0;
    
    // Para tarjetas, necesitamos una lógica diferente ya que no tienen equipo_nombre directo
    // Por simplicidad, usaremos el total de tarjetas
    const totalTarjetas = partido.tarjetas?.length || 0;
    const tarjetas1 = Math.floor(totalTarjetas / 2); // Distribución aproximada
    const tarjetas2 = totalTarjetas - tarjetas1;
    
    const stats = [
        {
            label: 'Goles',
            equipo1: goles1,
            equipo2: goles2,
            icon: Trophy,
            color: 'text-goal-gold'
        },
        {
            label: 'Tarjetas',
            equipo1: tarjetas1,
            equipo2: tarjetas2,
            icon: AlertCircle,
            color: 'text-yellow-500'
        }
    ];
    
    return (
        <div className="space-y-4">
            {stats.map((stat) => {
                const Icon = stat.icon;
                const total = stat.equipo1 + stat.equipo2;
                const porcentaje1 = total > 0 ? (stat.equipo1 / total) * 100 : 50;
                const porcentaje2 = total > 0 ? (stat.equipo2 / total) * 100 : 50;
                
                return (
                    <div key={stat.label} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{stat.equipo1}</span>
                            <div className="flex items-center gap-2">
                                <Icon className={`w-4 h-4 ${stat.color}`} />
                                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{stat.label}</span>
                            </div>
                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{stat.equipo2}</span>
                        </div>
                        
                        {total > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className="h-full bg-goal-blue transition-all duration-500"
                                        style={{ width: `${porcentaje1}%` }}
                                    ></div>
                                </div>
                                <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className="h-full bg-goal-orange transition-all duration-500 ml-auto"
                                        style={{ width: `${porcentaje2}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// Componente principal de información del partido
function PartidoInfo({ partido }: { partido: PartidoDetalle }) {
    const fechaPartido = new Date(partido.fecha);
    const esHoy = fechaPartido.toDateString() === new Date().toDateString();
    const esPasado = fechaPartido < new Date();

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden">
            {/* Header del partido */}
            <header className={`p-6 text-white ${
                partido.completado
                    ? 'bg-gradient-to-r from-green-600 to-green-700'
                    : esPasado
                        ? 'bg-gradient-to-r from-red-600 to-red-700'
                        : 'bg-gradient-to-r from-goal-blue to-goal-orange'
            }`} role="banner" aria-label="Información principal del partido">
                <div className="text-center">
                    {/* Estado del partido */}
                    <div className="mb-4">
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                            partido.completado
                                ? 'bg-white/20'
                                : esHoy
                                    ? 'bg-goal-gold text-goal-black'
                                    : 'bg-white/20'
                        }`}>
                            {partido.completado ? 'Finalizado' : esHoy ? 'HOY' : esPasado ? 'Pendiente' : 'Programado'}
                        </span>
                    </div>

                    {/* Equipos y resultado */}
                    <div className="grid grid-cols-3 items-center gap-2 sm:gap-4 mb-4">
                        {/* Equipo 1 */}
                        <div className="text-center">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-2">
                                {partido.equipo_1.logo && (
                                    <Image
                                        src={partido.equipo_1.logo}
                                        alt={`Logo ${partido.equipo_1.nombre}`}
                                        width={32}
                                        height={32}
                                        className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                                    />
                                )}
                                <h2 className="text-lg sm:text-xl font-bold text-center break-words">{partido.equipo_1.nombre}</h2>
                            </div>
                            {partido.completado && (
                                <div className="text-5xl  font-bold">{partido.goles_equipo_1 || 0}</div>
                            )}
                        </div>

                        {/* VS o resultado */}
                        <div className="text-center">
                            {partido.completado ? (
                                <div className="text-xl sm:text-2xl font-bold">-</div>
                            ) : (
                                <div className="text-sm sm:text-lg font-medium">VS</div>
                            )}
                        </div>

                        {/* Equipo 2 */}
                        <div className="text-center">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-2">
                                <h2 className="text-lg sm:text-xl font-bold text-center break-words order-2 sm:order-1">{partido.equipo_2.nombre}</h2>
                                {partido.equipo_2.logo && (
                                    <Image
                                        src={partido.equipo_2.logo}
                                        alt={`Logo ${partido.equipo_2.nombre}`}
                                        width={32}
                                        height={32}
                                        className="w-6 h-6 sm:w-8 sm:h-8 object-contain order-1 sm:order-2"
                                    />
                                )}
                            </div>
                            {partido.completado && (
                                <div className="text-5xl font-bold">{partido.goles_equipo_2 || 0}</div>
                            )}
                        </div>
                    </div>

                    {/* Resultado por penales si existe */}
                    {partido.penales_equipo_1 !== null && partido.penales_equipo_2 !== null && (
                        <div className="mt-2 text-sm opacity-90">
                            Penales: {partido.penales_equipo_1} - {partido.penales_equipo_2}
                        </div>
                    )}

                    {/* Jugadores con goles y tarjetas */}
                    {partido.completado && (partido.goles?.length > 0 || partido.tarjetas?.length > 0) && (
                        <div className="mt-8 relative">
                            {/* Línea divisoria decorativa */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-white/30 rounded-full"></div>
                            
                            <div className="pt-6 grid grid-cols-2 gap-12 text-sm max-w-3xl mx-auto">
                                {/* Equipo 1 */}
                                <div className="text-right">
                                    <div className="space-y-2">
                                        {/* Goles equipo 1 */}
                                        {partido.goles?.filter(g => g.equipo_nombre === partido.equipo_1.nombre).map((gol, index) => (
                                            <div 
                                                key={`gol-${gol.id}`} 
                                                className="group flex items-center justify-end gap-3 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-goal-gold/30"
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                <span className="text-sm font-semibold text-white/95 group-hover:text-white transition-colors duration-200">{gol.jugador_nombre}</span>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-lg drop-shadow-sm filter group-hover:scale-110 transition-transform duration-200">⚽</span>
                                                    {gol.autogol && (
                                                        <span className="text-xs bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded-full border border-red-400/30">
                                                            AG
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {/* Tarjetas equipo 1 - aproximación por distribución */}
                                        {partido.tarjetas?.slice(0, Math.ceil(partido.tarjetas.length / 2)).map((tarjeta, index) => (
                                            <div 
                                                key={`tarjeta-${tarjeta.id}`} 
                                                className="group flex items-center justify-end gap-3 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-yellow-400/30"
                                                style={{ animationDelay: `${(partido.goles?.filter(g => g.equipo_nombre === partido.equipo_1.nombre).length || index) * 100}ms` }}
                                            >
                                                <span className="text-sm font-semibold text-white/95 group-hover:text-white transition-colors duration-200">{tarjeta.jugador_nombre}</span>
                                                <div className="flex items-center">
                                                    <span className={`text-lg drop-shadow-sm filter group-hover:scale-110 transition-transform duration-200 ${
                                                        tarjeta.tipo === 'AMARILLA' ? 'brightness-110' : 'brightness-100'
                                                    }`}>
                                                        {tarjeta.tipo === 'AMARILLA' ? '🟨' : '🟥'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Línea divisoria central */}
                                <div className="absolute left-1/2 top-6 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent transform -translate-x-1/2"></div>

                                {/* Equipo 2 */}
                                <div className="text-left">
                                    <div className="space-y-2">
                                        {/* Goles equipo 2 */}
                                        {partido.goles?.filter(g => g.equipo_nombre === partido.equipo_2.nombre).map((gol, index) => (
                                            <div 
                                                key={`gol-${gol.id}`} 
                                                className="group flex items-center justify-start gap-3 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-goal-gold/30"
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                <div className="flex items-center gap-1">
                                                    <span className="text-lg drop-shadow-sm filter group-hover:scale-110 transition-transform duration-200">⚽</span>
                                                    {gol.autogol && (
                                                        <span className="text-xs bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded-full border border-red-400/30">
                                                            AG
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-sm font-semibold text-white/95 group-hover:text-white transition-colors duration-200">{gol.jugador_nombre}</span>
                                            </div>
                                        ))}
                                        
                                        {/* Tarjetas equipo 2 - aproximación por distribución */}
                                        {partido.tarjetas?.slice(Math.ceil(partido.tarjetas.length / 2)).map((tarjeta, index) => (
                                            <div 
                                                key={`tarjeta-${tarjeta.id}`} 
                                                className="group flex items-center justify-start gap-3 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-yellow-400/30"
                                                style={{ animationDelay: `${(partido.goles?.filter(g => g.equipo_nombre === partido.equipo_2.nombre).length || index) * 100}ms` }}
                                            >
                                                <div className="flex items-center">
                                                    <span className={`text-lg drop-shadow-sm filter group-hover:scale-110 transition-transform duration-200 ${
                                                        tarjeta.tipo === 'AMARILLA' ? 'brightness-110' : 'brightness-100'
                                                    }`}>
                                                        {tarjeta.tipo === 'AMARILLA' ? '🟨' : '🟥'}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-semibold text-white/95 group-hover:text-white transition-colors duration-200">{tarjeta.jugador_nombre}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Victoria por default */}
                    {partido.victoria_por_default && (
                        <div className="mt-4">
                            <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                                Victoria por {partido.victoria_por_default}
                            </span>
                        </div>
                    )}
                </div>
            </header>

            {/* Información del partido */}
            <section className="p-6" aria-label="Detalles del partido">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Información básica */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
                            Información del Partido
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-goal-blue" />
                                <div>
                                    <div className="font-medium">
                                        {fechaPartido.toLocaleDateString('es-ES', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                        {fechaPartido.toLocaleTimeString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>

                            {partido.cancha && (
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-goal-orange" />
                                    <div>
                                        <div className="font-medium">Cancha</div>
                                        <div className="text-sm text-neutral-600 dark:text-neutral-400">{partido.cancha}</div>
                                    </div>
                                </div>
                            )}

                            {partido.jornada && (
                                <div className="flex items-center gap-3">
                                    <Trophy className="w-5 h-5 text-goal-gold" />
                                    <div>
                                        <div className="font-medium">{partido.jornada.nombre}</div>
                                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                            Jornada {partido.jornada.numero}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {partido.es_eliminatorio && (
                                <div className="flex items-center gap-3">
                                    <Trophy className="w-5 h-5 text-red-500" />
                                    <div>
                                        <div className="font-medium text-red-600 dark:text-red-400">
                                            Partido Eliminatorio
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Estado del partido */}
                    {/*<div>*/}
                    {/*    <h3 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200">*/}
                    {/*        Estado del Partido*/}
                    {/*    </h3>*/}
                    {/*    <div className="space-y-3">*/}
                    {/*        <div className="flex justify-between">*/}
                    {/*            <span className="text-neutral-600 dark:text-neutral-400">Acta firmada:</span>*/}
                    {/*            <span className={`font-medium ${*/}
                    {/*                partido.acta_firmada ? 'text-green-600' : 'text-red-600'*/}
                    {/*            }`}>*/}
                    {/*                {partido.acta_firmada ? 'Sí' : 'No'}*/}
                    {/*            </span>*/}
                    {/*        </div>*/}

                    {/*        {partido.acta_firmada_equipo_1 !== undefined && (*/}
                    {/*            <div className="flex justify-between">*/}
                    {/*                <span className="text-neutral-600 dark:text-neutral-400">Acta {partido.equipo_1.nombre}:</span>*/}
                    {/*                <span className={`font-medium ${*/}
                    {/*                    partido.acta_firmada_equipo_1 ? 'text-green-600' : 'text-red-600'*/}
                    {/*                }`}>*/}
                    {/*                    {partido.acta_firmada_equipo_1 ? 'Firmada' : 'Pendiente'}*/}
                    {/*                </span>*/}
                    {/*            </div>*/}
                    {/*        )}*/}

                    {/*        {partido.acta_firmada_equipo_2 !== undefined && (*/}
                    {/*            <div className="flex justify-between">*/}
                    {/*                <span className="text-neutral-600 dark:text-neutral-400">Acta {partido.equipo_2.nombre}:</span>*/}
                    {/*                <span className={`font-medium ${*/}
                    {/*                    partido.acta_firmada_equipo_2 ? 'text-green-600' : 'text-red-600'*/}
                    {/*                }`}>*/}
                    {/*                    {partido.acta_firmada_equipo_2 ? 'Firmada' : 'Pendiente'}*/}
                    {/*                </span>*/}
                    {/*            </div>*/}
                    {/*        )}*/}

                    {/*        /!* Inasistencias *!/*/}
                    {/*        {(partido.inasistencia_equipo_1 || partido.inasistencia_equipo_2) && (*/}
                    {/*            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">*/}
                    {/*                <div className="text-yellow-800 dark:text-yellow-200 font-medium text-sm">*/}
                    {/*                    Inasistencias registradas*/}
                    {/*                </div>*/}
                    {/*                {partido.inasistencia_equipo_1 && (*/}
                    {/*                    <div className="text-yellow-700 dark:text-yellow-300 text-sm">*/}
                    {/*                        • {partido.equipo_1.nombre}*/}
                    {/*                    </div>*/}
                    {/*                )}*/}
                    {/*                {partido.inasistencia_equipo_2 && (*/}
                    {/*                    <div className="text-yellow-700 dark:text-yellow-300 text-sm">*/}
                    {/*                        • {partido.equipo_2.nombre}*/}
                    {/*                    </div>*/}
                    {/*                )}*/}
                    {/*            </div>*/}
                    {/*        )}*/}

                    {/*        {partido.observaciones && (*/}
                    {/*            <div>*/}
                    {/*                <span className="text-neutral-600 dark:text-neutral-400">Observaciones:</span>*/}
                    {/*                <p className="text-sm mt-1 p-3 bg-neutral-50 dark:bg-neutral-700 rounded">*/}
                    {/*                    {partido.observaciones}*/}
                    {/*                </p>*/}
                    {/*            </div>*/}
                    {/*        )}*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </section>
        </div>
    );
}

function ErrorView({ error, retry }: { error: string; retry?: () => void }) {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 shadow-lg max-w-md mx-4">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                        Error al cargar el partido
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                        {error}
                    </p>
                    <div className="space-y-3">
                        {retry && (
                            <button
                                onClick={retry}
                                className="w-full bg-goal-blue hover:bg-goal-blue/90 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reintentar
                            </button>
                        )}
                        <Link
                            href="/partidos"
                            className="block w-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-lg transition-colors text-center"
                        >
                            Volver a partidos
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default async function PartidoDetailPage({ params }: PartidoDetailPageProps) {
    try {
        const { id } = await params;
        
        if (!id || isNaN(Number(id))) {
            notFound();
        }

        const partido = await serverApi.partidos.getById(id);

        if (!partido) {
            notFound();
        }

        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
                {/* Breadcrumbs */}
                <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="container mx-auto px-4 py-4">
                        <nav aria-label="Navegación de migas de pan" className="flex items-center space-x-2 text-sm">
                            <Link href="/" className="text-goal-blue dark:text-goal-gold hover:underline">
                                Inicio
                            </Link>
                            <span className="text-neutral-400">/</span>
                            <Link href="/partidos" className="text-goal-blue dark:text-goal-gold hover:underline">
                                Partidos
                            </Link>
                            <span className="text-neutral-400">/</span>
                            <span className="text-neutral-600 dark:text-neutral-400">
                                {partido.equipo_1.nombre} vs {partido.equipo_2.nombre}
                            </span>
                        </nav>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-4 sm:py-8">
                    <div className="space-y-4 sm:space-y-8">
                        {/* Información principal del partido */}
                        <PartidoInfo partido={partido} />

                        {/* Match Center Profesional */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-8">
                            {/* Timeline de Eventos - Columna principal */}
                            <section className="xl:col-span-2 bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-lg" aria-label="Timeline de eventos del partido">
                                <div className="bg-gradient-to-r from-goal-blue/10 via-goal-gold/10 to-goal-orange/10 p-6 border-b border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                                            <div className="w-6 h-6 bg-gradient-to-r from-goal-blue to-goal-orange rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                            Match Center
                                        </h2>
                                        <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                                            <div className="flex items-center gap-1">
                                                <Trophy className="w-4 h-4 text-goal-gold" />
                                                <span>{partido.goles?.length || 0} goles</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                                                <span>{partido.tarjetas?.length || 0} tarjetas</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <MatchEvents partido={partido} />
                                </div>
                            </section>

                            {/* Panel lateral con estadísticas */}
                            <section className="space-y-6">
                                {/* Estadísticas */}
                                <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-lg">
                                    <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-neutral-50 dark:from-neutral-700/50 to-transparent">
                                        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                                            <div className="w-5 h-5 bg-goal-blue/20 rounded flex items-center justify-center">
                                                <div className="w-2 h-2 bg-goal-blue rounded"></div>
                                            </div>
                                            Estadísticas
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <MatchStats partido={partido} />
                                    </div>
                                </div>

                                {/* Información adicional */}
                                {(partido.observaciones || partido.victoria_por_default || partido.penales_equipo_1 !== null) && (
                                    <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-lg">
                                        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-goal-orange/10 to-transparent">
                                            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                                                <AlertCircle className="w-5 h-5 text-goal-orange" />
                                                Información adicional
                                            </h3>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            {partido.penales_equipo_1 !== null && partido.penales_equipo_2 !== null && (
                                                <div className="bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-lg">
                                                    <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-2">Definición por penales</div>
                                                    <div className="flex items-center justify-center gap-4 text-lg font-bold">
                                                        <span className="text-goal-blue">{partido.equipo_1.nombre}</span>
                                                        <span className="text-2xl text-neutral-600 dark:text-neutral-400">{partido.penales_equipo_1} - {partido.penales_equipo_2}</span>
                                                        <span className="text-goal-orange">{partido.equipo_2.nombre}</span>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {partido.victoria_por_default && (
                                                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500">
                                                    <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Victoria por defecto</div>
                                                    <div className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                                        {partido.victoria_por_default}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {partido.observaciones && (
                                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                                                    <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Observaciones</div>
                                                    <div className="text-sm text-blue-700 dark:text-blue-300">
                                                        {partido.observaciones}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* Enlaces relacionados */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg">
                            <h2 className="text-xl font-semibold mb-6 text-neutral-800 dark:text-neutral-200">
                                Información relacionada
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                <Link
                                    href={`/equipos/${partido.equipo_1.id}`}
                                    className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg hover:bg-goal-blue/10 dark:hover:bg-goal-blue/20 transition-colors"
                                >
                                    <Users className="w-5 h-5 text-goal-blue" />
                                    <div>
                                        <div className="font-medium text-sm">Ver equipo</div>
                                        <div className="text-xs text-neutral-600 dark:text-neutral-400">{partido.equipo_1.nombre}</div>
                                    </div>
                                </Link>

                                <Link
                                    href={`/equipos/${partido.equipo_2.id}`}
                                    className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg hover:bg-goal-blue/10 dark:hover:bg-goal-blue/20 transition-colors"
                                >
                                    <Users className="w-5 h-5 text-goal-blue" />
                                    <div>
                                        <div className="font-medium text-sm">Ver equipo</div>
                                        <div className="text-xs text-neutral-600 dark:text-neutral-400">{partido.equipo_2.nombre}</div>
                                    </div>
                                </Link>

                                {partido.jornada && (
                                    <Link
                                        href={`/partidos?jornada=${partido.jornada.id}`}
                                        className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg hover:bg-goal-gold/10 dark:hover:bg-goal-gold/20 transition-colors"
                                    >
                                        <Calendar className="w-5 h-5 text-goal-gold" />
                                        <div>
                                            <div className="font-medium text-sm">Ver jornada</div>
                                            <div className="text-xs text-neutral-600 dark:text-neutral-400">{partido.jornada.nombre}</div>
                                        </div>
                                    </Link>
                                )}

                                <Link
                                    href="/tabla"
                                    className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg hover:bg-goal-orange/10 dark:hover:bg-goal-orange/20 transition-colors"
                                >
                                    <Trophy className="w-5 h-5 text-goal-orange" />
                                    <div>
                                        <div className="font-medium text-sm">Tabla posiciones</div>
                                        <div className="text-xs text-neutral-600 dark:text-neutral-400">Ver clasificación</div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Navegación a otros partidos */}
                        <div className="bg-gradient-to-r from-goal-blue/5 to-goal-orange/5 dark:from-goal-blue/10 dark:to-goal-orange/10 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200 text-center">
                                Explorar más partidos
                            </h3>
                            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
                                <Link
                                    href="/partidos?estado=programado"
                                    className="bg-white dark:bg-neutral-800 hover:bg-goal-blue/10 dark:hover:bg-goal-blue/20 text-neutral-700 dark:text-neutral-300 px-6 py-3 rounded-lg transition-all duration-300 border border-neutral-200 dark:border-neutral-700 hover:border-goal-blue"
                                >
                                    Próximos partidos
                                </Link>
                                <Link
                                    href="/partidos?estado=completado"
                                    className="bg-white dark:bg-neutral-800 hover:bg-green-500/10 dark:hover:bg-green-500/20 text-neutral-700 dark:text-neutral-300 px-6 py-3 rounded-lg transition-all duration-300 border border-neutral-200 dark:border-neutral-700 hover:border-green-500"
                                >
                                    Resultados recientes
                                </Link>
                                <Link
                                    href="/partidos"
                                    className="bg-goal-orange hover:bg-goal-orange/90 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    Todos los partidos
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error al cargar el partido:', error);
        
        const errorMessage = error instanceof Error 
            ? error.message 
            : 'No se pudo cargar la información del partido';
            
        return <ErrorView error={errorMessage} />;
    }
}