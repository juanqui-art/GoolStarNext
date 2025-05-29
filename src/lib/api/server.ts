import { cookies } from 'next/headers';
import type { components } from '@/types/api';

type Equipo = components['schemas']['Equipo'];
type PaginatedEquipoList = components['schemas']['PaginatedEquipoList'];

/**
 * Obtener equipos en el servidor con soporte para paginación
 */
export async function getServerEquipos(params?: { 
  page?: number; 
  ordering?: string; 
  search?: string;
  categoria?: number;
  page_size?: number;
  all_pages?: boolean; // Nuevo parámetro para obtener todas las páginas
}): Promise<PaginatedEquipoList> {
  const fetchPage = async (page: number = 1): Promise<PaginatedEquipoList> => {
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', page.toString());
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.categoria) queryParams.append('categoria', params.categoria.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/equipos?${queryParams.toString()}`,
      {
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 60 }
      }
    );

    if (!response.ok) {
      throw new Error('Error al cargar los equipos');
    }

    return response.json();
  };

  // Si no se solicita todas las páginas, devolver solo la primera
  if (!params?.all_pages) {
    return fetchPage(params?.page || 1);
  }

  // Si se solicitan todas las páginas, hacer fetch secuencial
  let currentPage = 1;
  let allResults: any[] = [];
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetchPage(currentPage);
    allResults = [...allResults, ...response.results];
    
    // Verificar si hay más páginas
    hasMore = !!response.next;
    currentPage++;
    
    // Prevenir bucles infinitos
    if (currentPage > 50) break;
  }

  // Devolver un objeto con la misma estructura pero con todos los resultados
  return {
    count: allResults.length,
    next: null,
    previous: null,
    results: allResults
  };
}

/**
 * Obtener un equipo por ID en el servidor
 */
export async function getServerEquipoById(id: string): Promise<Equipo> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipos/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${cookies().get('auth-token')?.value}`
    },
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error('Error al cargar el equipo');
  }

  return response.json();
}

export const serverApi = {
  getEquipos: getServerEquipos,
  getEquipoById: getServerEquipoById
};
