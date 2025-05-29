// Este archivo es un componente de servidor (Server Component)
import EquiposLayout from '@/components/equipos/EquiposLayout';
import EquiposListServer from '@/components/data/EquiposList.server';

export const metadata = {
  title: 'Equipos Participantes | GoolStar',
  description: 'Explora los equipos participantes en nuestros torneos de fútbol indoor',
};

export default function EquiposPage() {
  return (
    <EquiposLayout>
      <EquiposListServer showTitle={false} />
    </EquiposLayout>
  );
}
