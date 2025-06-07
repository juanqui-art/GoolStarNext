// src/app/layout.tsx - ACTUALIZADO CON TU FACEBOOK APP ID REAL
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from '@next/third-parties/google';
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

export const metadata: Metadata = {
    metadataBase: new URL('https://goolstar.vercel.app'),
    title: {
        default: "GoolStar - Tu Momento de Brillar en Cuenca",
        template: "%s | GoolStar"
    },
    description: "Organizamos los mejores campeonatos de fútbol indoor en Cuenca, Ecuador. Únete a la competencia más emocionante de la ciudad con premios de $1,900 y 25+ equipos participantes.",
    keywords: [
        "fútbol indoor Cuenca",
        "torneos deportivos Ecuador",
        "GoolStar",
        "campeonatos fútbol sala",
        "deportes Cuenca",
        "Pumayunga cancha",
        "Goal Star Ecuador",
        "competencias deportivas"
    ],
    authors: [{ name: "GoolStar Team", url: "https://goolstar.vercel.app" }],
    creator: "GoolStar Ecuador",
    publisher: "GoolStar",

    // 🌍 INFORMACIÓN GEOGRÁFICA
    applicationName: "GoolStar",
    category: "sports",
    classification: "Deportes y Recreación",

    // 🔗 URLs CANÓNICAS
    alternates: {
        canonical: 'https://goolstar.vercel.app',
    },

    // 📱 REDES SOCIALES - FACEBOOK & INSTAGRAM
    openGraph: {
        type: 'website',
        locale: 'es_EC',
        url: 'https://goolstar.vercel.app',
        siteName: 'GoolStar Ecuador',
        title: 'GoolStar - Tu Momento de Brillar en Cuenca',
        description: 'Organizamos los mejores campeonatos de fútbol indoor en Cuenca, Ecuador. Únete a la competencia más emocionante de la ciudad.',
        images: [
            {
                url: '/opengraph-image',
                width: 1200,
                height: 630,
                alt: 'GoolStar - Campeonatos de Fútbol Indoor en Cuenca, Ecuador',
                type: 'image/png',
            },
            {
                url: '/images/logo-square.png',
                width: 400,
                height: 400,
                alt: 'Logo GoolStar',
                type: 'image/png',
            }
        ],
        videos: [
            {
                url: 'https://goolstar.vercel.app/videos/highlights.mp4',
                width: 1280,
                height: 720,
                type: 'video/mp4',
            }
        ],
    },

    // 🐦 TWITTER/X
    twitter: {
        card: 'summary_large_image',
        site: '@GoolStarEc',
        creator: '@GoolStarEc',
        title: 'GoolStar - Campeonatos de Fútbol Indoor en Cuenca',
        description: '🏆 Organizamos los mejores torneos de fútbol indoor en Cuenca, Ecuador. 25+ equipos, $1,900 en premios. ¡Tu momento de brillar!',
        images: ['/opengraph-image'],
    },

    // 🤖 ROBOTS Y SEO
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

    // 📲 ICONOS Y MANIFEST
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon.png', type: 'image/png', sizes: '32x32' },
            { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
            { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
        ],
        apple: [
            { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
        ],
        shortcut: ['/favicon.ico'],
    },
    manifest: '/manifest.json',


    // 📊 VERIFICACIONES Y ANALYTICS
    verification: {
        google: 'tu-codigo-google-site-verification', // Reemplazar con tu código real
        // facebook: 'tu-codigo-facebook-domain-verification', // Si tienes uno
    },

    // 🌐 METADATOS CON TU FACEBOOK APP ID REAL
    other: {
        // ✅ FACEBOOK APP ID REAL - RESUELVE LA ADVERTENCIA
        'fb:app_id': '1753629471919536',

        // 📄 TU PÁGINA DE FACEBOOK
        'fb:pages': '61569913888626',
        'article:publisher': 'https://www.facebook.com/profile.php?id=61569913888626',

        // 📊 INFORMACIÓN ADICIONAL PARA FACEBOOK
        'og:updated_time': new Date().toISOString(),
        'og:see_also': [
            'https://goolstar.vercel.app/torneos',
            'https://goolstar.vercel.app/equipos',
            'https://goolstar.vercel.app/tabla',
        ],

        // 📝 DATOS ESTRUCTURADOS BÁSICOS
        'article:author': 'GoolStar Ecuador',

        // 🗺️ INFORMACIÓN GEOGRÁFICA
        'geo.region': 'EC-A', // Ecuador - Azuay
        'geo.placename': 'Cuenca, Ecuador',
        'geo.position': '-2.8972;-79.0058', // Coordenadas de Cuenca
        'ICBM': '-2.8972, -79.0058',

        // 📞 INFORMACIÓN DE CONTACTO Y NEGOCIO
        'contact:phone_number': '+593978692269',
        'contact:postal_code': '010101',
        'contact:country_name': 'Ecuador',
        'contact:email': 'info@goolstar.com',

        // 🏆 DATOS DEL TORNEO ACTUAL
        'tournament:name': 'Primer Campeonato GoolStar',
        'tournament:teams': '25',
        'tournament:prize': '$1900',
        'tournament:location': 'Pumayunga, Cuenca',
        'tournament:status': 'active',
    },
};

// 🎨 VIEWPORT CONFIGURATION - Fixed themeColor warnings
export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#FFD700' },
        { media: '(prefers-color-scheme: dark)', color: '#006992' },
    ],
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
        <head>
            {/* 📊 META TAGS ESPECÍFICOS PARA TU FACEBOOK */}
            <meta property="fb:app_id" content="1753629471919536" />
            <meta property="fb:pages" content="61569913888626" />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content="es_EC" />
            <meta property="og:locale:alternate" content="es_ES" />
            <meta property="og:locale:alternate" content="en_US" />

            {/* 🏢 DATOS DE NEGOCIO LOCAL */}
            <meta name="geo.region" content="EC-A" />
            <meta name="geo.placename" content="Cuenca, Ecuador" />
            <meta name="geo.position" content="-2.8972;-79.0058" />
            <meta name="ICBM" content="-2.8972, -79.0058" />

            {/* 📱 PWA Y MOBILE */}
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="GoolStar" />

            {/* 🔍 DATOS ESTRUCTURADOS JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SportsOrganization",
                        "name": "GoolStar",
                        "description": "Organizamos campeonatos de fútbol indoor en Cuenca, Ecuador",
                        "url": "https://goolstar.vercel.app",
                        "logo": "https://goolstar.vercel.app/images/logos/logooficial.svg",
                        "image": "https://goolstar.vercel.app/opengraph-image",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Pumayunga (junto antena Claro)",
                            "addressLocality": "Cuenca",
                            "addressRegion": "Azuay",
                            "postalCode": "010101",
                            "addressCountry": "EC"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": "-2.8972",
                            "longitude": "-79.0058"
                        },
                        "telephone": "+593978692269",
                        "sport": "Soccer",
                        "sameAs": [
                            "https://www.facebook.com/profile.php?id=61569913888626",
                            "https://www.tiktok.com/@goolstar0"
                        ],
                        "event": {
                            "@type": "SportsEvent",
                            "name": "Primer Campeonato GoolStar",
                            "startDate": "2025-03-01",
                            "endDate": "2025-05-30",
                            "location": {
                                "@type": "Place",
                                "name": "Cancha Goal Star",
                                "address": "Pumayunga, Cuenca, Ecuador"
                            },
                            "offers": {
                                "@type": "Offer",
                                "price": "100",
                                "priceCurrency": "USD",
                                "description": "Inscripción por equipo"
                            }
                        }
                    })
                }}
            />
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
        >
        {/* 📱 DIV REQUERIDO PARA FACEBOOK SDK */}
        <div id="fb-root"></div>
        
        {/* Use Next.js Script component for Facebook SDK */}
        <Script strategy="afterInteractive" id="facebook-sdk">
          {`
            window.fbAsyncInit = function() {
                FB.init({
                    appId: '1753629471919536',
                    cookie: true,
                    xfbml: true,
                    version: 'v18.0'
                });
            };
            
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/es_ES/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
          `}
        </Script>

        <ThemeProvider>
            {children}
        </ThemeProvider>
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        </body>
        </html>
    );
}