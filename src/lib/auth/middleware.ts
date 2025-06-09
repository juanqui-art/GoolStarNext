// src/lib/auth/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { AUTH_CONFIG } from './config';

export function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Obtener token del localStorage no es posible en middleware,
  // así que verificamos las cookies o headers
  const token = request.cookies.get(AUTH_CONFIG.TOKEN_CONFIG.ACCESS_TOKEN_KEY)?.value
    || request.headers.get('authorization')?.replace('Bearer ', '');

  const isProtectedRoute = AUTH_CONFIG.PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  const isAuthRoute = AUTH_CONFIG.AUTH_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  // Si es una ruta protegida y no hay token, redirigir al login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL(AUTH_CONFIG.REDIRECT_ROUTES.LOGIN_REQUIRED, request.url);
    // Guardar la URL a la que quería acceder para redirigir después del login
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si es una ruta de auth y ya tiene token, redirigir al dashboard
  if (isAuthRoute && token) {
    const dashboardUrl = new URL(AUTH_CONFIG.REDIRECT_ROUTES.ALREADY_AUTHENTICATED, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Configuración de rutas donde aplicar el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};