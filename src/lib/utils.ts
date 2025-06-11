import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * = LOGGING CONDICIONAL PARA DESARROLLO
 * 
 * Logs que solo aparecen en desarrollo, autom�ticamente eliminados en producci�n
 */
const isDev = process.env.NODE_ENV === 'development';

export const devLog = {
  info: (message: string, ...args: unknown[]) => {
    if (isDev) console.log(`9 ${message}`, ...args);
  },
  success: (message: string, ...args: unknown[]) => {
    if (isDev) console.log(` ${message}`, ...args);
  },
  warning: (message: string, ...args: unknown[]) => {
    if (isDev) console.warn(`� ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    if (isDev) console.error(`L ${message}`, ...args);
  },
  api: (endpoint: string, method = 'GET') => {
    if (isDev) console.log(`< API ${method}:`, endpoint);
  },
  auth: (message: string, ...args: unknown[]) => {
    if (isDev) console.log(`= Auth: ${message}`, ...args);
  },
  data: (message: string, count?: number) => {
    if (isDev) console.log(`=� Data: ${message}${count ? ` (${count} items)` : ''}`, count);
  },
};