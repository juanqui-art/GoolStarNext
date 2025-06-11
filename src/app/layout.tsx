// src/app/layout.tsx - OPTIMIZADO Y SIMPLIFICADO
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from '@next/third-parties/google';
import { getStructuredData } from "@/lib/metadata";
import "./globals.css";

// Re-export metadata from centralized config
export { metadata, viewport } from "@/lib/metadata";

// 🎨 FONT CONFIGURATION
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: 'swap',
    preload: true,
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: 'swap',
    preload: false,
});

const playfairDisplay = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair-display",
    display: 'swap',
    preload: false,
});


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
        <head>
            {/* 🚀 PRELOAD CRITICAL HERO IMAGE */}
            <link
                rel="preload"
                as="image"
                href="/images/pelota.webp"
                type="image/webp"
                fetchPriority="high"
            />
            
            {/* 🔍 DATOS ESTRUCTURADOS JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(getStructuredData())
                }}
            />
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
        >
        {/* 📱 FACEBOOK SDK */}
        <div id="fb-root"></div>
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
        </body>
        
        {/* 📊 GOOGLE ANALYTICS */}
        {process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        </html>
    );
}