// src/app/torneos/opengraph-image.tsx - IMAGEN DINÁMICA PARA TORNEOS
import { ImageResponse } from 'next/og';
import { serverApi } from '@/lib/api/server';
import type { components } from '@/types/api';

// Tipos de la API
type Torneo = components['schemas']['Torneo'];

// Configuración de la imagen
export const alt = 'GoolStar Torneos - Campeonatos de Indoor Fútbol en Cuenca, Ecuador';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

// Runtime edge para mejor rendimiento
export const runtime = 'edge';

export default async function Image() {
    try {
        // 📊 OBTENER DATOS REALES DEL TORNEO ACTIVO
        let torneoActivo: Torneo | null = null;
        let estadisticas = {
            equipos: '25+',
            partidos: '67+',
            categoria: 'Varones',
            fase: 'Grupos',
            nombre: 'PRIMER CAMPEONATO GOOL⭐️STAR'
        };

        try {
            const torneosActivos = await serverApi.torneos.getActivos();
            
            if (Array.isArray(torneosActivos)) {
                torneoActivo = torneosActivos[0] || null;
            } else if (torneosActivos?.results?.length > 0) {
                torneoActivo = torneosActivos.results[0];
            }

            // Actualizar estadísticas con datos reales
            if (torneoActivo) {
                estadisticas = {
                    equipos: `${torneoActivo.total_equipos}`,
                    partidos: '70+', // Fallback static value since basic Torneo doesn't include total_partidos
                    categoria: torneoActivo.categoria_nombre || 'Varones',
                    fase: torneoActivo.fase_actual || 'Grupos',
                    nombre: torneoActivo.nombre
                };
            }
        } catch (apiError) {
            console.warn('API no disponible, usando datos estáticos:', apiError);
        }

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0a0a0a',
                        position: 'relative',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                >
                    {/* 🎨 FONDO GRADIENTE ESPECÍFICO PARA TORNEOS */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `
                                radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.4) 0%, transparent 50%),
                                radial-gradient(circle at 75% 75%, rgba(255, 127, 17, 0.4) 0%, transparent 50%),
                                radial-gradient(circle at 50% 50%, rgba(0, 105, 146, 0.2) 0%, transparent 70%)
                            `,
                        }}
                    />

                    {/* 🏆 INDICADOR DE TORNEO */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '30px',
                            left: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            backgroundColor: 'rgba(255, 215, 0, 0.2)',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '2px solid rgba(255, 215, 0, 0.4)',
                        }}
                    >
                        <div style={{ fontSize: '20px' }}>🏆</div>
                        <div
                            style={{
                                fontSize: '16px',
                                color: '#FFD700',
                                fontWeight: 'bold',
                            }}
                        >
                            TORNEO ACTIVO
                        </div>
                    </div>

                    {/* 🏆 LOGO PRINCIPAL */}
                    <div
                        style={{
                            fontSize: '56px',
                            fontWeight: 'bold',
                            color: '#FFD700',
                            marginBottom: '8px',
                            textShadow: '0 0 30px rgba(255, 215, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.5)',
                            letterSpacing: '1px',
                            textAlign: 'center',
                        }}
                    >
                        GOOL⭐STAR
                    </div>

                    {/* 📍 NOMBRE DEL TORNEO */}
                    <div
                        style={{
                            fontSize: '24px',
                            color: '#FF7F11',
                            fontWeight: 'bold',
                            marginBottom: '30px',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                            textAlign: 'center',
                            maxWidth: '900px',
                            lineHeight: 1.2,
                        }}
                    >
                        {estadisticas.nombre}
                    </div>

                    {/* 📊 ESTADÍSTICAS DEL TORNEO EN GRID */}
                    <div
                        style={{
                            display: 'flex',
                            gap: '40px',
                            marginBottom: '30px',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Equipos */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 215, 0, 0.15)',
                                padding: '16px 20px',
                                borderRadius: '12px',
                                border: '2px solid rgba(255, 215, 0, 0.3)',
                                minWidth: '100px',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    color: '#FFD700',
                                    lineHeight: 1,
                                }}
                            >
                                {estadisticas.equipos}
                            </div>
                            <div
                                style={{
                                    fontSize: '14px',
                                    color: '#e5e5e5',
                                    textAlign: 'center',
                                    marginTop: '4px',
                                }}
                            >
                                Equipos
                            </div>
                        </div>

                        {/* Partidos */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 127, 17, 0.15)',
                                padding: '16px 20px',
                                borderRadius: '12px',
                                border: '2px solid rgba(255, 127, 17, 0.3)',
                                minWidth: '100px',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    color: '#FF7F11',
                                    lineHeight: 1,
                                }}
                            >
                                {estadisticas.partidos}
                            </div>
                            <div
                                style={{
                                    fontSize: '14px',
                                    color: '#e5e5e5',
                                    textAlign: 'center',
                                    marginTop: '4px',
                                }}
                            >
                                Partidos
                            </div>
                        </div>

                        {/* Categoría */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0, 105, 146, 0.15)',
                                padding: '16px 20px',
                                borderRadius: '12px',
                                border: '2px solid rgba(0, 105, 146, 0.3)',
                                minWidth: '100px',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    color: '#006992',
                                    lineHeight: 1,
                                }}
                            >
                                {estadisticas.categoria}
                            </div>
                            <div
                                style={{
                                    fontSize: '14px',
                                    color: '#e5e5e5',
                                    textAlign: 'center',
                                    marginTop: '4px',
                                }}
                            >
                                Categoría
                            </div>
                        </div>

                        {/* Fase */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 215, 0, 0.15)',
                                padding: '16px 20px',
                                borderRadius: '12px',
                                border: '2px solid rgba(255, 215, 0, 0.3)',
                                minWidth: '100px',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    color: '#FFD700',
                                    lineHeight: 1,
                                }}
                            >
                                {estadisticas.fase}
                            </div>
                            <div
                                style={{
                                    fontSize: '14px',
                                    color: '#e5e5e5',
                                    textAlign: 'center',
                                    marginTop: '4px',
                                }}
                            >
                                Fase
                            </div>
                        </div>
                    </div>

                    {/* 🔥 CALL TO ACTION */}
                    <div
                        style={{
                            fontSize: '22px',
                            color: 'white',
                            textAlign: 'center',
                            fontWeight: '600',
                            marginBottom: '20px',
                        }}
                    >
                        Sigue toda la acción del torneo
                    </div>

                    {/* 📍 UBICACIÓN ESPECÍFICA */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '20px',
                            fontSize: '14px',
                            color: '#999',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <div
                            style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: '#FF7F11',
                                borderRadius: '50%',
                            }}
                        />
                        Cancha Goal Star • Pumayunga • Cuenca
                    </div>

                    {/* 🌐 WEBSITE */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            right: '20px',
                            fontSize: '14px',
                            color: '#999',
                        }}
                    >
                        goolstar.vercel.app/torneos
                    </div>

                    {/* 🎨 BARRA DECORATIVA INFERIOR */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '0',
                            left: '0',
                            right: '0',
                            height: '4px',
                            background: 'linear-gradient(90deg, #006992 0%, #FFD700 50%, #FF7F11 100%)',
                        }}
                    />
                </div>
            ),
            {
                ...size,
            }
        );
    } catch (error) {
        console.error('Error generando OpenGraph image para torneos:', error);

        // 🚨 FALLBACK SIMPLE Y CONFIABLE PARA TORNEOS
        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0a0a0a',
                        color: 'white',
                        fontFamily: 'system-ui, sans-serif',
                    }}
                >
                    {/* Fondo gradiente fallback */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
                        }}
                    />
                    
                    <div
                        style={{
                            fontSize: '64px',
                            fontWeight: 'bold',
                            marginBottom: '20px',
                            color: '#FFD700',
                            textShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
                        }}
                    >
                        GOOL⭐STAR
                    </div>
                    <div style={{ fontSize: '32px', marginBottom: '10px', color: '#FF7F11' }}>
                        Torneos Activos
                    </div>
                    <div style={{ fontSize: '24px', color: '#e5e5e5' }}>
                        Cuenca, Ecuador
                    </div>
                    
                    {/* Barra decorativa */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '0',
                            left: '0',
                            right: '0',
                            height: '4px',
                            background: 'linear-gradient(90deg, #006992 0%, #FFD700 50%, #FF7F11 100%)',
                        }}
                    />
                </div>
            ),
            { ...size }
        );
    }
}