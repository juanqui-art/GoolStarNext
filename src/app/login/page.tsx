// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useRedirectIfAuthenticated } from '@/lib/auth/useAuth';
import { useAuthStore } from '@/store/auth-store';
import { Loader2, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { z } from 'zod';

// Schema de validación
const loginSchema = z.object({
  username: z.string().min(1, 'El nombre de usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirigir si ya está autenticado
  const auth = useRedirectIfAuthenticated();
  const login = useAuthStore((state) => state.login);

  // Configurar el formulario
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    } as LoginFormData,
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      await handleLogin(value);
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      await login(data);
      toast.success('¡Bienvenido!', {
        description: 'Has iniciado sesión correctamente',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      toast.error('Error al iniciar sesión', {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Si ya está autenticado, no mostrar nada mientras redirige
  if (auth.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Accede al panel de administración de GoolStar
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            {/* Campo Username */}
            <form.Field name="username">
              {(field) => (
                <div>
                  <label 
                    htmlFor="username"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >
                    Nombre de usuario
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Ingresa tu nombre de usuario"
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  />
                  {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mt-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{String(field.state.meta.errors[0])}</span>
                    </div>
                  )}
                </div>
              )}
            </form.Field>

            {/* Campo Password */}
            <form.Field name="password">
              {(field) => (
                <div>
                  <label 
                    htmlFor="password"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Ingresa tu contraseña"
                      disabled={isLoading}
                      className="w-full px-4 py-3 pr-12 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mt-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{String(field.state.meta.errors[0])}</span>
                    </div>
                  )}
                </div>
              )}
            </form.Field>

            {/* Botón de login */}
            <button
              type="submit"
              disabled={isLoading || !form.state.isValid}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Links adicionales */}
          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm transition-colors"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-sm text-neutral-600 dark:text-neutral-400">
          <p>Solo para administradores autorizados</p>
        </div>
      </div>
    </div>
  );
}