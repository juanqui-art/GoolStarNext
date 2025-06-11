import type { Metadata, Viewport } from "next";

/**
 * 📊 METADATA CENTRALIZADO PARA GOOLSTAR
 * 
 * Separado del layout para mejor performance y mantenibilidad
 */

// 🎯 DATOS BASE DEL SITIO
const SITE_CONFIG = {
  name: "GoolStar",
  url: "https://goolstar.vercel.app",
  description: "Organizamos los mejores campeonatos de fútbol indoor en Cuenca, Ecuador. Únete a la competencia más emocionante de la ciudad con premios de $1,900 y 25+ equipos participantes.",
  facebook: {
    appId: "1753629471919536",
    pageId: "61569913888626",
    pageUrl: "https://www.facebook.com/profile.php?id=61569913888626"
  },
  contact: {
    phone: "+593978692269",
    email: "info@goolstar.com"
  },
  location: {
    name: "Cuenca, Ecuador",
    coordinates: { lat: "-2.8972", lng: "-79.0058" },
    address: "Pumayunga (junto antena Claro)"
  }
} as const;

// 📝 KEYWORDS BASE
const BASE_KEYWORDS = [
  "fútbol indoor Cuenca",
  "torneos deportivos Ecuador", 
  "GoolStar",
  "campeonatos fútbol sala",
  "deportes Cuenca",
  "Pumayunga cancha",
  "Goal Star Ecuador",
  "competencias deportivas"
];

/**
 * 🌐 METADATA PRINCIPAL
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: "GoolStar - Tu Momento de Brillar en Cuenca",
    template: "%s | GoolStar"
  },
  description: SITE_CONFIG.description,
  keywords: BASE_KEYWORDS,
  authors: [{ name: "GoolStar Team", url: SITE_CONFIG.url }],
  creator: "GoolStar Ecuador",
  publisher: "GoolStar",
  applicationName: SITE_CONFIG.name,
  category: "sports",
  classification: "Deportes y Recreación",

  // 🔗 URLs CANÓNICAS
  alternates: {
    canonical: SITE_CONFIG.url,
  },

  // 📱 OPEN GRAPH
  openGraph: {
    type: 'website',
    locale: 'es_EC',
    url: SITE_CONFIG.url,
    siteName: 'GoolStar Ecuador',
    title: 'GoolStar - Tu Momento de Brillar en Cuenca',
    description: SITE_CONFIG.description,
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

  // 📊 VERIFICACIONES
  verification: {
    google: 'tu-codigo-google-site-verification',
  },

  // 🌐 METADATOS ADICIONALES
  other: {
    'fb:app_id': SITE_CONFIG.facebook.appId,
    'fb:pages': SITE_CONFIG.facebook.pageId,
    'article:publisher': SITE_CONFIG.facebook.pageUrl,
    'geo.region': 'EC-A',
    'geo.placename': SITE_CONFIG.location.name,
    'geo.position': `${SITE_CONFIG.location.coordinates.lat};${SITE_CONFIG.location.coordinates.lng}`,
    'ICBM': `${SITE_CONFIG.location.coordinates.lat}, ${SITE_CONFIG.location.coordinates.lng}`,
    'contact:phone_number': SITE_CONFIG.contact.phone,
    'contact:email': SITE_CONFIG.contact.email,
    'tournament:name': 'Primer Campeonato GoolStar',
    'tournament:teams': '25',
    'tournament:prize': '$1900',
    'tournament:status': 'active',
  },
};

/**
 * 🎨 VIEWPORT CONFIGURATION
 */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFD700' },
    { media: '(prefers-color-scheme: dark)', color: '#006992' },
  ],
};

/**
 * 🔍 JSON-LD STRUCTURED DATA
 */
export const getStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  "name": SITE_CONFIG.name,
  "description": SITE_CONFIG.description,
  "url": SITE_CONFIG.url,
  "logo": `${SITE_CONFIG.url}/images/logos/logooficial.svg`,
  "image": `${SITE_CONFIG.url}/opengraph-image`,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": SITE_CONFIG.location.address,
    "addressLocality": "Cuenca",
    "addressRegion": "Azuay",
    "postalCode": "010101",
    "addressCountry": "EC"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": SITE_CONFIG.location.coordinates.lat,
    "longitude": SITE_CONFIG.location.coordinates.lng
  },
  "telephone": SITE_CONFIG.contact.phone,
  "sport": "Soccer",
  "sameAs": [
    SITE_CONFIG.facebook.pageUrl,
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
      "address": `${SITE_CONFIG.location.address}, Cuenca, Ecuador`
    },
    "offers": {
      "@type": "Offer", 
      "price": "100",
      "priceCurrency": "USD",
      "description": "Inscripción por equipo"
    }
  }
});

/**
 * 📄 CREAR METADATA ESPECÍFICO POR PÁGINA
 */
export const createPageMetadata = (page: {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  image?: string;
}): Metadata => ({
  title: page.title,
  description: page.description || SITE_CONFIG.description,
  keywords: page.keywords ? [...BASE_KEYWORDS, ...page.keywords] : BASE_KEYWORDS,
  alternates: {
    canonical: page.canonical || SITE_CONFIG.url,
  },
  openGraph: {
    title: page.title || "GoolStar - Tu Momento de Brillar en Cuenca",
    description: page.description || SITE_CONFIG.description,
    images: page.image ? [page.image] : metadata.openGraph?.images,
  },
});