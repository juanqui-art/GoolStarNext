// src/components/social/FacebookShare.tsx - COMPONENTE PARA COMPARTIR
'use client';

import { useEffect, useState } from 'react';
import { Share } from 'lucide-react';

// Extender el objeto global Window para incluir FB
declare global {
    interface Window {
        FB: {
            ui: (params: object, callback?: (response: { error_message?: string }) => void) => void;
        };
        fbAsyncInit: () => void;
    }
}

interface FacebookShareProps {
    url?: string;
    quote?: string;
    className?: string;
    children?: React.ReactNode;
}

export default function FacebookShare({
                                          url = '',
                                          quote = '',
                                          className = '',
                                          children
                                      }: FacebookShareProps) {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);

    useEffect(() => {
        // Verificar si el SDK de Facebook ya está cargado
        const checkFBSDK = () => {
            if (window.FB) {
                setIsSDKLoaded(true);
            } else {
                // Reintentar en 500ms si aún no está cargado
                setTimeout(checkFBSDK, 500);
            }
        };

        checkFBSDK();
    }, []);

    const shareToFacebook = () => {
        if (!isSDKLoaded || !window.FB) {
            console.warn('Facebook SDK not loaded yet');
            // Fallback: compartir usando URL directa
            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url || window.location.href)}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            return;
        }

        // Usar el SDK de Facebook para una experiencia mejor
        window.FB.ui({
            method: 'share',
            href: url || window.location.href,
            quote: quote,
        }, function(response: { error_message?: string }) {
            if (response && !response.error_message) {
                console.log('¡Compartido exitosamente!');
                // Aquí podrías agregar analytics o notificaciones
            }
        });
    };

    return (
        <button
            onClick={shareToFacebook}
            className={`inline-flex items-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-lg transition-colors duration-200 ${className}`}
            aria-label="Compartir en Facebook"
        >
            {children || (
                <>
                    <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Compartir</span>
                </>
            )}
        </button>
    );
}

// Componente específico para compartir resultados de partidos
export function SharePartidoResult({
                                       equipoLocal,
                                       equipoVisitante,
                                       golesLocal,
                                       golesVisitante,
                                       partidoId
                                   }: {
    equipoLocal: string;
    equipoVisitante: string;
    golesLocal: number;
    golesVisitante: number;
    partidoId: string | number;
}) {
    const resultado = `${equipoLocal} ${golesLocal}-${golesVisitante} ${equipoVisitante}`;
    const quote = `🏆 ¡Qué partidazo! ${resultado} - Sigue todos los resultados en GoolStar`;
    const url = `https://goolstar.vercel.app/partidos/${partidoId}`;

    return (
        <FacebookShare url={url} quote={quote} className="text-sm">
            <Share className="w-4 h-4" />
            <span>Compartir resultado</span>
        </FacebookShare>
    );
}

// Componente para seguir la página de Facebook
export function FacebookFollowButton({ className = '' }: { className?: string }) {
    return (
        <div className={`fb-like ${className}`}
             data-href="https://www.facebook.com/profile.php?id=61569913888626"
             data-width=""
             data-layout="button_count"
             data-action="like"
             data-size="large"
             data-share="true">
        </div>
    );
}

// Componente para mostrar comentarios de Facebook
export function FacebookComments({
                                     url = '',
                                     numPosts = 5,
                                     width = '100%',
                                     className = ''
                                 }: {
    url?: string;
    numPosts?: number;
    width?: string;
    className?: string;
}) {
    return (
        <div className={className}>
            <div className="fb-comments"
                 data-href={url || (typeof window !== 'undefined' ? window.location.href : '')}
                 data-width={width}
                 data-numposts={numPosts}>
            </div>
        </div>
    );
}