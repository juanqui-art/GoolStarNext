import EquiposListServer from "@/components/data/EquiposList.server";
import Footer from '@/components/layout/footer';
import Hero from '@/components/layout/Hero';
import Navbar from '@/components/layout/Navbar';
import QuickLinks from '@/components/sections/QuickLinks';
import TorneoActual from '@/components/torneos/TorneoActual';
import {Suspense} from 'react';
import EquiposLoading from '@/components/data/EquiposLoading';

export default function Home() {
    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="relative">
                <Navbar/>
                <main>
                    <Hero/>
                    <TorneoActual/>
                    <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
                        <div className="container mx-auto px-4">
                            <Suspense fallback={<EquiposLoading />}>
                                <EquiposListServer/>
                            </Suspense>
                        </div>
                    </section>
                    <section className="py-16 bg-white dark:bg-neutral-800">
                        <div className="container mx-auto px-4">
                            <QuickLinks/>
                        </div>
                    </section>
                </main>
                <Footer/>
            </div>
        </div>
    );
}
