/**
 * Optimizador de requests para evitar rate limiting
 * 
 * Implementa caching agresivo, debouncing y request queuing
 * para reducir la carga en el backend y evitar throttling.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live en milliseconds
}

interface QueuedRequest<T = unknown> {
  key: string;
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
}

class RequestOptimizer {
  private cache = new Map<string, CacheEntry<unknown>>();
  private pendingRequests = new Map<string, Promise<unknown>>();
  private requestQueue: QueuedRequest<any>[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  private isProcessingQueue = false;
  private lastRequestTime = 0;
  private minRequestInterval = 250; // Mínimo 250ms entre requests

  /**
   * Genera clave de cache para un request
   */
  private getCacheKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET';
    const headers = JSON.stringify(options?.headers || {});
    const body = options?.body || '';
    return `${method}:${url}:${headers}:${body}`;
  }

  /**
   * Verifica si hay datos válidos en cache
   */
  private getCachedData<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    console.log(`📦 Cache HIT para: ${key.split(':')[1]}`);
    return entry.data as T;
  }

  /**
   * Almacena datos en cache
   */
  private setCachedData<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Procesa cola de requests con rate limiting
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift()!;
      
      // Asegurar mínimo intervalo entre requests
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < this.minRequestInterval) {
        const delay = this.minRequestInterval - timeSinceLastRequest;
        console.log(`⏱️ Throttling request: esperando ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      try {
        this.lastRequestTime = Date.now();
        const result = await request.promise;
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Request optimizado con cache y throttling
   */
  async optimizedFetch<T>(
    url: string, 
    options: RequestInit & { 
      cacheTTL?: number,
      skipCache?: boolean,
      priority?: 'high' | 'low'
    } = {}
  ): Promise<T> {
    const { cacheTTL = 300000, skipCache = false, priority = 'low', ...fetchOptions } = options;
    const cacheKey = this.getCacheKey(url, fetchOptions);

    // 1. Verificar cache primero (solo para GET)
    if (!skipCache && (!fetchOptions.method || fetchOptions.method === 'GET')) {
      const cachedData = this.getCachedData<T>(cacheKey);
      if (cachedData !== null) {
        return cachedData;
      }
    }

    // 2. Verificar si ya hay un request pendiente para esta URL
    if (this.pendingRequests.has(cacheKey)) {
      console.log(`🔄 Request deduplicado para: ${url}`);
      return this.pendingRequests.get(cacheKey)! as Promise<T>;
    }

    // 3. Crear promise para el request
    const requestPromise = new Promise<T>((resolve, reject) => {
      const actualRequest = async () => {
        try {
          console.log(`🌐 Request optimizado a: ${url}`);
          const response = await fetch(url, fetchOptions);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const data = await response.json();
          
          // Cache solo respuestas exitosas de GET
          if (!fetchOptions.method || fetchOptions.method === 'GET') {
            this.setCachedData(cacheKey, data, cacheTTL);
          }
          
          return data;
        } finally {
          this.pendingRequests.delete(cacheKey);
        }
      };

      // Agregar a cola según prioridad
      const queuedRequest: QueuedRequest<any> = { // eslint-disable-line @typescript-eslint/no-explicit-any
        key: cacheKey,
        promise: actualRequest(),
        resolve,
        reject
      };

      if (priority === 'high') {
        this.requestQueue.unshift(queuedRequest);
      } else {
        this.requestQueue.push(queuedRequest);
      }

      this.processQueue();
    });

    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  /**
   * Limpia cache expirado
   */
  cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Obtiene estadísticas del optimizador
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      queueLength: this.requestQueue.length,
      cacheEntries: Array.from(this.cache.keys())
    };
  }

  /**
   * Limpia completamente el cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('🧹 Cache limpiado completamente');
  }
}

// Instancia singleton
export const requestOptimizer = new RequestOptimizer();

// Auto-limpieza cada 5 minutos
setInterval(() => {
  requestOptimizer.cleanExpiredCache();
}, 5 * 60 * 1000);