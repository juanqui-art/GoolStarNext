// src/app/opengraph-image.tsx - VERSIÓN ROBUSTA Y OPTIMIZADA
import { ImageResponse } from 'next/og';

// Configuración de la imagen
export const alt = 'GoolStar - Campeonatos de Indoor Fútbol en Cuenca, Ecuador';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

// Runtime edge para mejor rendimiento
export const runtime = 'edge';

export default async function Image() {
    try {
        // 📊 DATOS ESTÁTICOS CONFIABLES (evita errores de API)
        const estadisticas = {
            equipos: '25+',
            partidos: '67+',
            premios: '$1.9K',
            ubicacion: 'Cuenca, Ecuador'
        };

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
                    {/* 🎨 FONDO GRADIENTE MEJORADO */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `
                                radial-gradient(circle at 20% 30%, rgba(0, 105, 146, 0.3) 0%, transparent 50%),
                                radial-gradient(circle at 80% 70%, rgba(255, 127, 17, 0.3) 0%, transparent 50%),
                                radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.2) 0%, transparent 70%)
                            `,
                        }}
                    />

                    {/* 🇪🇨 BANDERA ECUATORIANA */}
                    {/*<div*/}
                    {/*    style={{*/}
                    {/*        position: 'absolute',*/}
                    {/*        top: '20px',*/}
                    {/*        right: '20px',*/}
                    {/*        display: 'flex',*/}
                    {/*        flexDirection: 'column',*/}
                    {/*        width: '60px',*/}
                    {/*        height: '40px',*/}
                    {/*        borderRadius: '4px',*/}
                    {/*        overflow: 'hidden',*/}
                    {/*        border: '2px solid rgba(255, 255, 255, 0.2)',*/}
                    {/*        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <div style={{ backgroundColor: '#FFD700', height: '33.33%', width: '100%' }} />*/}
                    {/*    <div style={{ backgroundColor: '#006992', height: '33.33%', width: '100%' }} />*/}
                    {/*    <div style={{ backgroundColor: '#FF0000', height: '33.33%', width: '100%' }} />*/}
                    {/*</div>*/}

                    {/* 🏆 LOGO PRINCIPAL CON EFECTO */}
                    <div
                        style={{
                            fontSize: '72px',
                            fontWeight: 'bold',
                            color: '#FFD700',
                            marginBottom: '16px',
                            textShadow: '0 0 30px rgba(255, 215, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.5)',
                            letterSpacing: '2px',
                            textAlign: 'center',
                        }}
                    >
                        GOOL⭐STAR
                    </div>

                    {/* 📍 UBICACIÓN DESTACADA */}
                    <div
                        style={{
                            fontSize: '32px',
                            color: '#FF7F11',
                            fontWeight: 'bold',
                            marginBottom: '24px',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                            textAlign: 'center',
                        }}
                    >
                        {estadisticas.ubicacion}
                    </div>

                    {/* 💫 DESCRIPCIÓN PRINCIPAL */}
                    <div
                        style={{
                            fontSize: '28px',
                            color: 'white',
                            textAlign: 'center',
                            marginBottom: '40px',
                            maxWidth: '800px',
                            lineHeight: 1.3,
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                        }}
                    >
                        Organizamos Campeonatos de Indoor Fútbol
                    </div>

                    {/* 📊 ESTADÍSTICAS EN CARDS */}
                    <div
                        style={{
                            display: 'flex',
                            gap: '50px',
                            marginBottom: '30px',
                            alignItems: 'center',
                        }}
                    >
                        {/* Equipos */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 215, 0, 0.15)',
                                padding: '20px 24px',
                                borderRadius: '12px',
                                border: '2px solid rgba(255, 215, 0, 0.3)',
                                minWidth: '120px',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '40px',
                                    fontWeight: 'bold',
                                    color: '#FFD700',
                                    lineHeight: 1,
                                }}
                            >
                                {estadisticas.equipos}
                            </div>
                            <div
                                style={{
                                    fontSize: '16px',
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
                                padding: '20px 24px',
                                borderRadius: '12px',
                                border: '2px solid rgba(255, 127, 17, 0.3)',
                                minWidth: '120px',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '40px',
                                    fontWeight: 'bold',
                                    color: '#FF7F11',
                                    lineHeight: 1,
                                }}
                            >
                                {estadisticas.partidos}
                            </div>
                            <div
                                style={{
                                    fontSize: '16px',
                                    color: '#e5e5e5',
                                    textAlign: 'center',
                                    marginTop: '4px',
                                }}
                            >
                                Partidos
                            </div>
                        </div>

                        {/* Premios */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0, 105, 146, 0.15)',
                                padding: '20px 24px',
                                borderRadius: '12px',
                                border: '2px solid rgba(0, 105, 146, 0.3)',
                                minWidth: '120px',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '40px',
                                    fontWeight: 'bold',
                                    color: '#006992',
                                    lineHeight: 1,
                                }}
                            >
                                {estadisticas.premios}
                            </div>
                            <div
                                style={{
                                    fontSize: '16px',
                                    color: '#e5e5e5',
                                    textAlign: 'center',
                                    marginTop: '4px',
                                }}
                            >
                                Premios
                            </div>
                        </div>
                    </div>

                    {/* 🔥 CALL TO ACTION */}
                    <div
                        style={{
                            fontSize: '20px',
                            color: '#e5e5e5',
                            textAlign: 'center',
                            fontStyle: 'italic',
                            marginBottom: '20px',
                        }}
                    >
                        { "Tu momento de brillar en las canchas"}
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
                        Cancha Goal Star • Pumayunga
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
                        goolstar.vercel.app
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
        console.error('Error generando OpenGraph image:', error);

        // 🚨 FALLBACK SIMPLE Y CONFIABLE
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
                        backgroundColor: '#006992',
                        color: 'white',
                        fontFamily: 'system-ui, sans-serif',
                    }}
                >
                    <div
                        style={{
                            fontSize: '64px',
                            fontWeight: 'bold',
                            marginBottom: '20px',
                            color: '#FFD700',
                        }}
                    >
                        GOOL⭐STAR
                    </div>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>
                        Cuenca, Ecuador
                    </div>
                    <div style={{ fontSize: '24px' }}>
                        Campeonatos de Fútbol Indoor
                    </div>
                </div>
            ),
            { ...size }
        );
    }
}