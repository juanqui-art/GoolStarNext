import {ThemeProvider} from "@/components/theme/ThemeProvider";
import type {Metadata} from "next";
import {Geist, Geist_Mono, Playfair_Display} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair-display",
    display: 'swap',
});

// ========================================
// CONFIGURACIÓN OPENGRAPH COMPLETA
// ========================================

// src/app/layout.tsx - CON DESCRIPCIONES MEJORADAS
export const metadata: Metadata = {
    metadataBase: new URL('https://goolstar.vercel.app'),

    title: {
        default: "GoolStar - Campeonatos de Fútbol Indoor en Cuenca",
        template: "%s | GoolStar"
    },

    // 🎯 DESCRIPCIÓN PRINCIPAL MEJORADA
    description: "GoolStar organiza campeonatos de fútbol indoor en Cuenca, Ecuador. Plataforma oficial para seguimiento de partidos en vivo, tabla de posiciones y estadísticas del torneo.",

    // 🏷️ KEYWORDS ESPECÍFICAS DE CUENCA
    keywords: [
        "fútbol indoor Cuenca",
        "campeonatos Cuenca Ecuador",
        "torneos deportivos Cuenca",
        "GoolStar",
        "fútbol sala Cuenca",
        "competencias deportivas Azuay",
        "tabla posiciones",
        "goleadores torneo",
        "partidos en vivo",
        "Goal Star cancha",
        "Pumayunga fútbol"
    ],

    authors: [{name: "GoolStar Team"}],
    creator: "GoolStar - Organizadores de Torneos",
    publisher: "GoolStar Ecuador",

    // 🌍 GEOLOCALIZACIÓN ESPECÍFICA
    alternates: {
        canonical: 'https://goolstar.vercel.app',
        languages: {
            'es-EC': 'https://goolstar.vercel.app',
            'es': 'https://goolstar.vercel.app',
        },
    },

    // 📱 OPENGRAPH MEJORADO
    openGraph: {
        title: {
            default: "GoolStar - Tu Momento de Brillar en Cuenca",
            template: "%s | GoolStar Cuenca"
        },
        description: "Organizamos los mejores campeonatos de fútbol indoor en Cuenca, Ecuador. Únete a la competencia más emocionante de la ciudad.",
        url: 'https://goolstar.vercel.app',
        siteName: 'GoolStar Cuenca',
        locale: 'es_EC',
        type: 'website',

        // 📍 INFORMACIÓN GEOGRÁFICA
        countryName: 'Ecuador',

        // region: 'Azuay',
        // placeName: 'Cuenca',
    },

    // 🐦 TWITTER MEJORADO
    twitter: {
        card: 'summary_large_image',
        title: "GoolStar - Campeonatos de Fútbol Indoor Cuenca",
        description: "🏆⚽ Organizamos campeonatos de fútbol indoor en Cuenca, Ecuador. ¡Tu momento de brillar ha llegado!",
        site: '@GoolStarEc',
        creator: '@GoolStarEc',
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },

    // 📍 INFORMACIÓN LOCAL/GEOGRÁFICA
    other: {
        'geo.region': 'EC-A', // Código ISO de Azuay
        'geo.placename': 'Cuenca',
        'geo.position': '-2.9001285;-79.0058965', // Coordenadas de Cuenca
        'ICBM': '-2.9001285, -79.0058965',
        'DC.title': 'GoolStar - Campeonatos Fútbol Indoor Cuenca',
        'organization': 'GoolStar Ecuador',
        'locality': 'Cuenca',
        'region': 'Azuay',
        'country-name': 'Ecuador',
    },



    category: 'Sports',
    classification: 'Indoor Football Tournaments',
};
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
        >
        <ThemeProvider>
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}