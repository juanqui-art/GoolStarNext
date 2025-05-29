# GoolStar Next - Plataforma de Torneos de Fútbol Indoor

![GoolStar Logo](/public/images/pelota.webp)

## Descripción del Proyecto

GoolStar es una plataforma web moderna para la organización y promoción de torneos de fútbol indoor. Diseñada con una interfaz elegante y animaciones dinámicas, esta aplicación permite a los usuarios conocer los torneos disponibles y contactar a los organizadores.

## Tecnologías Utilizadas

- **Framework**: [Next.js 15.3.2](https://nextjs.org/) con App Router
- **Frontend**: [React 19](https://react.dev/)
- **Estilización**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animaciones**: [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/) v3.13.0
- **Tipado**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: 
  - [Radix UI](https://www.radix-ui.com/) para componentes accesibles
  - Componentes personalizados con class-variance-authority y Tailwind
- **Formularios**: [TanStack Form](https://tanstack.com/form/latest) con adaptador Zod
- **Dependencias principales**:
  - date-fns: Manipulación de fechas
  - next-themes: Soporte para temas claro/oscuro
  - sonner: Notificaciones toast modernas
  - react-dropzone: Carga de archivos
  - zod: Validación de esquemas

## Estructura del Proyecto

```
goolstar-next/
├── public/             # Archivos estáticos (imágenes, fuentes)
├── src/
│   ├── app/            # Rutas de la aplicación (App Router)
│   ├── components/     # Componentes React reutilizables
│   │   ├── animations/ # Componentes de animación con GSAP
│   │   ├── layout/     # Componentes de estructura (Navbar, Hero, etc.)
│   │   └── ui/         # Componentes de interfaz reutilizables
│   ├── lib/            # Utilidades y helpers
│   ├── styles/         # Estilos globales
│   └── types/          # Definiciones de tipos TypeScript
├── docs/               # Documentación adicional
└── tests/              # Pruebas
```

## Requisitos

- Node.js 18.0 o superior
- pnpm (recomendado como gestor de paquetes)

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/goolstar-next.git
cd goolstar-next
```

2. Instala las dependencias:
```bash
pnpm install
```

3. Inicia el servidor de desarrollo:
```bash
pnpm dev
```

El sitio estará disponible en [http://localhost:3000](http://localhost:3000).

## Características Principales

- **Diseño Responsive**: Adaptable a dispositivos móviles y de escritorio
- **Animaciones Dinámicas**: Implementadas con GSAP para una experiencia visual atractiva
- **Integración con WhatsApp**: Botón de contacto directo para consultas
- **Interfaz Moderna**: Diseño elegante con efectos visuales de alta calidad

## Notas Importantes de Desarrollo

- **Animaciones**: El proyecto utiliza exclusivamente GSAP para animaciones. No usar Framer Motion para mantener la consistencia del código.
- **Tailwind CSS v4**: Si se modifica la estructura de carpetas, asegúrate de que el paquete `@tailwindcss/postcss` esté instalado correctamente.
- **Generación de Tipos API**: Utiliza `pnpm generate-types` para generar tipos TypeScript a partir del esquema OpenAPI del backend.

## Despliegue

El proyecto está configurado para ser desplegado en plataformas como Vercel o Netlify. Para construir para producción:

```bash
pnpm build
pnpm start
```

## Contribución

1. Crea un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia [Especificar licencia].
