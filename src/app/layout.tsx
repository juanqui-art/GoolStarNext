import { ThemeProvider } from "@/components/theme/ThemeProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
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

export const metadata: Metadata = {
    metadataBase: new URL('https://goolstar.vercel.app'),

    // SEO básico
    title: {
        default: "GoolStar - Tu Momento de Brillar",
        template: "%s | GoolStar"
    },
    description: "Plataforma profesional para la organización y seguimiento de torneos de fútbol indoor en Ecuador. Únete al torneo más emocionante de la región.",
    keywords: [
        "indoor",
        "fútbol indoor",
        "torneos",
        "deportes",
        "Ecuador",
        "GoolStar",
        "campeonatos",
        "fútbol sala",
        "Cuenca",
        "Pumayunga"
    ],
    authors: [{ name: "GoolStar Team", url: "https://goolstar.vercel.app" }],
    creator: "GoolStar",
    publisher: "GoolStar",

    // OpenGraph completo
    openGraph: {
        type: "website",
        locale: "es_EC",
        siteName: "GoolStar",
        title: "GoolStar - Tu Momento de Brillar",
        description: "Únete al torneo más emocionante de fútbol indoor en Ecuador. Equipos, partidos, goleadores y más en la mejor plataforma deportiva.",
        url: "https://goolstar.vercel.app",
    },

    // Twitter Cards
    twitter: {
        card: "summary_large_image",
        site: "@GoolStarEc",
        creator: "@GoolStarEc",
        title: "GoolStar - Tu Momento de Brillar",
        description: "🏆 Torneos de indoor fútbol  en Ecuador. ¡Únete a la competencia más emocionante!",
    },

    // Configuraciones adicionales
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

    // Verificaciones
    verification: {
        google: process.env.GOOGLE_VERIFICATION_CODE,
    },

    // Enlaces alternativos
    alternates: {
        canonical: "https://goolstar.vercel.app",
        languages: {
            'es-EC': 'https://goolstar.vercel.app',
            'es': 'https://goolstar.vercel.app',
        },
    },

    // Iconos
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-icon.png",
        shortcut: "/favicon.ico",
    },

    // Manifest
    manifest: "/manifest.json",

    // Información adicional personalizada
    other: {
        "sport:league": "Indoor Soccer Ecuador",
        "sport:location": "Pumayunga, Cuenca, Ecuador",
        "business:contact_data:locality": "Cuenca",
        "business:contact_data:region": "Azuay",
        "business:contact_data:country_name": "Ecuador",
    }
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