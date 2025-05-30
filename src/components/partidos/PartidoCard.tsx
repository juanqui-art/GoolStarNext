// src/components/partidos/PartidoCard.tsx
'use client';

import {partidoUtils} from '@/services/partidoService';
import type {components} from '@/types/api';
import gsap from 'gsap';
import {AlertCircle, Clock, MapPin, Trophy} from 'lucide-react';
import Link from 'next/link';
import {useEffect, useRef} from 'react';

type Partido = components['schemas']['Partido'];

interface PartidoCardProps {
    partido: Partido;
    showDate?: boolean;
    showJornada?: boolean;
    className?: string;
}

export default function PartidoCard({
                                        partido,
                                        showDate = true,
                                        showJornada = true,
                                        className = ''
                                    }: PartidoCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    // Obtener datos del partido usando utilidades
    const resultado = partidoUtils.getResultado(partido);
    const estado = partidoUtils.getEstado(partido);
    const tieneVictoriaDefault = partidoUtils.tieneVictoriaPorDefault(partido);

    useEffect(() => {
        // Animación hover con GSAP
        if (cardRef.current) {
            const card = cardRef.current;

            const handleMouseEnter = () => {
                gsap.to(card, {
                    y: -3,
                    scale: 1.02,
                    duration: 0.3,
                    ease: 'power2.out',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                });
            };

            const handleMouseLeave = () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                });
            };

            card.addEventListener('mouseenter', handleMouseEnter);
            card.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                card.removeEventListener('mouseenter', handleMouseEnter);
                card.removeEventListener('mouseleave', handleMouseLeave);
            };
        }
    }, []);

    // Determinar colores basados en el estado
    const getEstadoColor = () => {
        switch (estado.color) {
            case 'green':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'blue':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'yellow':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'red':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    return (
        <div
            ref={cardRef}
            className={`bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-md transition-all duration-300 ${className}`}
        >
            {/* Header con fecha y estado */}
            <div
                className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                    {showDate && (
                        <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                            <Clock className="w-4 h-4 mr-1"/>
                            {partidoUtils.formatearFechaCorta(partido.fecha)}
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        {showJornada && partido.jornada_nombre && (
                            <span className="text-xs px-2 py-1 bg-goal-blue/10 text-goal-blue rounded-full">
                {partido.jornada_nombre}
                </span>
                        )}

                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getEstadoColor()}`}>
    {estado.texto}
    </span>
                    </div>
                </div>
            </div>

            {/* Cuerpo del partido */}
            <div className="p-4">
                {/* Equipos y marcador */}
                <div className="flex items-center justify-between mb-3">
                    {/* Equipo 1 */}
                    <div className="flex-1 text-center">
                        <div className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                            {partido.equipo_1_nombre}
                        </div>
                        {partido.completado && (
                            <div className={`text-2xl font-bold ${
                                resultado === 'victoria_local'
                                    ? 'text-goal-gold'
                                    : 'text-neutral-500 dark:text-neutral-400'
                            }`}>
                                {partido.goles_equipo_1}
                            </div>
                        )}
                    </div>

                    {/* VS o marcador */}
                    <div className="px-4">
                        {partido.completado ? (
                            <div className="text-center">
                                <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                                    {tieneVictoriaDefault ? 'W.O.' : 'FT'}
                                </div>
                                {partido.penales_equipo_1 !== null && partido.penales_equipo_2 !== null && (
                                    <div className="text-xs text-neutral-400">
                                        Pen: {partido.penales_equipo_1}-{partido.penales_equipo_2}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="text-lg font-bold text-neutral-400 dark:text-neutral-500">
                                    VS
                                </div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {new Date(partido.fecha).toLocaleTimeString('es-ES', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Equipo 2 */}
                    <div className="flex-1 text-center">
                        <div className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                            {partido.equipo_2_nombre}
                        </div>
                        {partido.completado && (
                            <div className={`text-2xl font-bold ${
                                resultado === 'victoria_visitante'
                                    ? 'text-goal-gold'
                                    : 'text-neutral-500 dark:text-neutral-400'
                            }`}>
                                {partido.goles_equipo_2}
                            </div>
                        )}
                    </div>
                </div>

                {/* Información adicional */}
                <div className="space-y-2">
                    {partido.cancha && (
                        <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                            <MapPin className="w-4 h-4 mr-2"/>
                            {partido.cancha}
                        </div>
                    )}

                    {tieneVictoriaDefault && (
                        <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                            <AlertCircle className="w-4 h-4 mr-2"/>
                            Victoria por {partido.victoria_por_default}
                        </div>
                    )}

                    {partido.es_eliminatorio && (
                        <div className="flex items-center text-sm text-goal-orange">
                            <Trophy className="w-4 h-4 mr-2"/>
                            Partido eliminatorio
                        </div>
                    )}
                </div>

                {/* Botón para ver detalles */}
                <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                    <Link
                        href={`/partidos/${partido.id}`}
                        className="block w-full text-center py-2 px-4 bg-goal-blue/10 text-goal-blue rounded-md hover:bg-goal-blue/20 transition-colors duration-200 text-sm font-medium"
                    >
                        Ver detalles
                    </Link>
                </div>
            </div>
        </div>
    );
}