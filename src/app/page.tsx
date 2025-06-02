import EquiposListServer from "@/components/data/EquiposList.server";
import EquiposLoading from '@/components/data/EquiposLoading';
import Hero from '@/components/layout/Hero';
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import QuickLinks from '@/components/sections/QuickLinks';
import TorneoActual from '@/components/torneos/TorneoActual';
import {Suspense} from 'react';

export default function Home() {
    return (
        <LayoutWrapper >
            <Hero/>
            <TorneoActual/>
            <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
                <div className="container mx-auto px-4">
                    <Suspense fallback={<EquiposLoading/>}>
                        <EquiposListServer/>
                    </Suspense>
                </div>
            </section>
            <section className="py-16 bg-white dark:bg-neutral-800">
                <div className="container mx-auto px-4">
                    <QuickLinks/>
                </div>
            </section>

        </LayoutWrapper>
    )
        ;
}
