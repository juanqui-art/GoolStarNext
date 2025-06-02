import {ThemeProvider} from "@/components/theme/ThemeProvider";
import type {Metadata} from "next";
import {Geist, Geist_Mono, Playfair_Display} from "next/font/google";
import "./globals.css";
import { ApiDebugger } from "@/hooks/useDebugApi";

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
    title: "GoolStar - Gestión de Torneos de Fútbol Indoor",
    description: "Plataforma profesional para la organización y seguimiento de torneos de fútbol indoor en Ecuador",
    keywords: ["fútbol indoor", "torneos", "deportes", "Ecuador", "GoolStar"],
    authors: [{name: "GoolStar Team"}],
    openGraph: {
        title: "GoolStar - Tu Momento de Brillar",
        description: "Únete al torneo más emocionante de fútbol indoor",
        images: ["/images/og-image.jpg"],
        locale: "es_EC",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "GoolStar - Torneos de Fútbol Indoor",
        description: "Plataforma de gestión de torneos deportivos",
        images: ["/images/twitter-card.jpg"],
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-icon.png",
    },
    manifest: "/manifest.json",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
        >
        <ThemeProvider>
            {children}
            {/*<ApiDebugger />*/}
        </ThemeProvider>
        </body>
        </html>
    );
}