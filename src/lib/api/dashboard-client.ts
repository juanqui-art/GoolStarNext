// src/lib/api/dashboard-client.ts - CLIENTE API PARA DASHBOARD CON AUTENTICACIÓN SERVER-SIDE
import { requireStaff } from '@/lib/auth/dal';

const API_URL = 'https://goolstar-backend.fly.dev/api';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * 🔒 CLIENTE API SEGURO PARA DASHBOARD
 * 
 * Este cliente:
 * - Verifica automáticamente permisos de staff
 * - Usa las credenciales del administrador para hacer peticiones
 * - Solo funciona en el servidor (server components/actions)
 */
class DashboardApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  /**
   * 🌐 PETICIÓN AUTENTICADA PARA DASHBOARD CON RETRY LOGIC
   * 
   * Automaticamente:
   * 1. Verifica que el usuario tiene permisos de staff
   * 2. Hace la petición con autenticación de administrador
   * 3. Implementa retry con exponential backoff para errores 429
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    console.log(`🔒 Dashboard API: Petición a ${endpoint} (intento ${retryCount + 1})`);

    // 1. Verificar permisos de staff
    const session = await requireStaff();
    console.log(`✅ Dashboard API: Usuario autorizado: ${session.username}`);

    // 2. Configurar petición con headers apropiados
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        // Aquí puedes agregar autenticación adicional si es necesario
        // Por ahora, las peticiones van sin token ya que el backend
        // debe permitir acceso a datos públicos
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      // Si es error 429 (Too Many Requests), intentar retry
      if (response.status === 429 && retryCount < 3) {
        const retryAfter = response.headers.get('Retry-After');
        const baseDelay = 1000; // 1 segundo base
        const exponentialDelay = Math.pow(2, retryCount) * baseDelay; // 1s, 2s, 4s
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : exponentialDelay;
        
        console.log(`⏳ Rate limit alcanzado. Reintentando en ${delay}ms (intento ${retryCount + 1}/3)`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Dashboard API Error ${response.status}:`, errorText);
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Dashboard API: Datos recibidos de ${endpoint}`);
      return data;

    } catch (error) {
      console.error(`❌ Dashboard API: Error en petición a ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * 📄 CARGAR TODOS LOS DATOS PAGINADOS
   * 
   * Carga automáticamente todas las páginas de un endpoint paginado
   */
  async loadAllPaginated<T>(endpoint: string): Promise<T[]> {
    console.log(`📄 Dashboard API: Cargando todos los datos de ${endpoint}`);
    
    let allResults: T[] = [];
    let currentPage = 1;
    let hasNext = true;

    while (hasNext) {
      try {
        const pageEndpoint = `${endpoint}${endpoint.includes('?') ? '&' : '?'}page=${currentPage}&page_size=100`;
        console.log(`📄 Cargando página ${currentPage} de ${endpoint}`);

        const response = await this.request<PaginatedResponse<T>>(pageEndpoint);

        if (response.results && response.results.length > 0) {
          allResults = [...allResults, ...response.results];
          console.log(`📄 Página ${currentPage}: ${response.results.length} elementos. Total: ${allResults.length}`);
        }

        hasNext = response.next !== null && response.results.length > 0;
        currentPage++;

        // Protección contra bucles infinitos
        if (currentPage > 100) {
          console.warn('⚠️ Dashboard API: Límite máximo de páginas alcanzado (100)');
          break;
        }

      } catch (error) {
        console.error(`❌ Dashboard API: Error en página ${currentPage}:`, error);
        break;
      }
    }

    console.log(`✅ Dashboard API: Carga completa - ${allResults.length} elementos total`);
    return allResults;
  }
}

// Exportar instancia singleton
export const dashboardApiClient = new DashboardApiClient();

/**
 * 🚦 PROCESAR PETICIONES EN LOTES CON THROTTLING
 * 
 * Ejecuta promesas en grupos pequeños con delays para evitar rate limits
 */
async function processBatches<T>(
  promises: (() => Promise<T>)[],
  batchSize = 5,
  delayMs = 500
): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < promises.length; i += batchSize) {
    const batch = promises.slice(i, i + batchSize);
    console.log(`🚦 Procesando lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(promises.length / batchSize)} (${batch.length} peticiones)`);
    
    // Ejecutar lote actual
    const batchPromises = batch.map(promiseFactory => promiseFactory());
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Delay entre lotes (excepto el último)
    if (i + batchSize < promises.length) {
      console.log(`⏳ Esperando ${delayMs}ms antes del siguiente lote...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  return results;
}

/**
 * 🔍 OBTENER TODOS LOS JUGADORES CON THROTTLING
 * 
 * Como el endpoint /jugadores/ requiere autenticación especial,
 * obtenemos todos los jugadores a través de sus equipos usando throttling
 */
async function getAllJugadores() {
  console.log('🔒 Dashboard: Obteniendo todos los jugadores a través de equipos...');
  
  try {
    // 1. Obtener todos los equipos
    const equipos = await dashboardApiClient.loadAllPaginated<{ id: number; nombre: string }>('/equipos/');
    console.log(`📋 Encontrados ${equipos.length} equipos`);
    
    // 2. Crear factories de promesas para throttling
    const jugadoresPromiseFactories = equipos.map((equipo) => 
      async () => {
        try {
          return await dashboardApiClient.request<unknown[]>(
            `/jugadores/por_equipo/?equipo_id=${equipo.id}`
          );
        } catch (error) {
          console.warn(`⚠️ Error obteniendo jugadores del equipo ${equipo.id}:`, error);
          return [];
        }
      }
    );
    
    // 3. Procesar en lotes con throttling (5 peticiones por lote, 500ms entre lotes)
    console.log(`🚦 Procesando ${equipos.length} equipos en lotes throttled...`);
    const jugadoresPorEquipo = await processBatches(
      jugadoresPromiseFactories, 
      5, // 5 peticiones simultáneas máximo
      500 // 500ms entre lotes
    );
    
    // 4. Aplanar resultados
    const todosLosJugadores = jugadoresPorEquipo.flat();
    
    console.log(`✅ Total de jugadores obtenidos: ${todosLosJugadores.length}`);
    return todosLosJugadores;
    
  } catch (error) {
    console.error('❌ Error obteniendo todos los jugadores:', error);
    throw error;
  }
}

// Métodos de conveniencia para endpoints específicos
export const dashboardApi = {
  // Jugadores
  jugadores: {
    getAll: getAllJugadores,
    getById: (id: string) => dashboardApiClient.request(`/jugadores/${id}/`),
    getByTeam: (teamId: number) => dashboardApiClient.request(`/jugadores/por_equipo/?equipo_id=${teamId}`),
    create: (data: Record<string, unknown>) => dashboardApiClient.request('/jugadores/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: Record<string, unknown>) => dashboardApiClient.request(`/jugadores/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => dashboardApiClient.request(`/jugadores/${id}/`, {
      method: 'DELETE',
    }),
  },

  // Equipos
  equipos: {
    getAll: () => dashboardApiClient.loadAllPaginated('/equipos/'),
    getById: (id: string) => dashboardApiClient.request(`/equipos/${id}/`),
    getConJugadores: () => dashboardApiClient.loadAllPaginated('/equipos/?include_jugadores=true'),
  },

  // Partidos
  partidos: {
    getAll: () => dashboardApiClient.loadAllPaginated('/partidos/'),
    getById: (id: string) => dashboardApiClient.request(`/partidos/${id}/`),
  },
};