// src/components/data/EquiposProblematicos.server.tsx
import { getServerEquiposConJugadores } from '@/lib/api/server';
import EquiposProblematicos from '@/components/dashboard/EquiposProblematicos';

interface EquiposProblematicosServerProps {
    key?: string; // Para forzar re-render
}

// Componente Server que obtiene los datos y los pasa al Client Component
export default async function EquiposProblematicosServer({ key }: EquiposProblematicosServerProps = {}) {
    try {
        // Obtener equipos con jugadores usando la función server-side
        const equiposConJugadores = await getServerEquiposConJugadores();

        // Pasar los datos al Client Component
        return <EquiposProblematicos key={key} equipos={equiposConJugadores} />;
    } catch (error) {
        console.error('Error en EquiposProblematicosServer:', error);
        
        // Si hay error, pasar array vacío al Client Component para manejo graceful
        return <EquiposProblematicos key={key} equipos={[]} />;
    }
}