import EquiposListServer from "@/components/data/EquiposList.server";
import Footer from '@/components/layout/footer';
import Hero from '@/components/layout/Hero';
import Navbar from '@/components/layout/Navbar';
import QuickLinks from '@/components/sections/QuickLinks';
import TorneoActual from '@/components/torneos/TorneoActual';

export default function Home() {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Contenido de la página */}
            <div className="relative">
                <Navbar/>
                <main>
                    <Hero/>

                    {/* Sección de torneo actual */}
                    <TorneoActual />

                    {/* Sección de equipos participantes */}
                    <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
                        <div className="container mx-auto px-4">
                            <EquiposListServer showTitle={true} />
                        </div>
                    </section>

                    {/* Sección de acceso rápido */}
                    <section className="py-16 bg-white dark:bg-neutral-800">
                        <div className="container mx-auto px-4">
                            <QuickLinks />
                        </div>
                    </section>

                    {/* Aquí puedes agregar más secciones en el futuro */}
                </main>
                
                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}
