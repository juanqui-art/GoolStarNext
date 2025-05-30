import EquiposListServer from '@/components/data/EquiposList.server';
import EquiposLoading from "@/components/data/EquiposLoading";
import EquiposLayout from '@/components/equipos/EquiposLayout';
import {Suspense} from 'react';

export const metadata = {
    title: 'Equipos Participantes | GoolStar',
    description: 'Explora los equipos participantes en nuestros torneos de fútbol indoor',
};


export default function EquiposPage() {
    return (
        <EquiposLayout>
            <Suspense fallback={<EquiposLoading/>}>
                <EquiposListServer showTitle={false}/>
            </Suspense>
        </EquiposLayout>
    );
}
