import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/layout/Hero';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Contenido de la página */}
      <div className="relative">
        <Navbar />
        <main>
          <Hero />
          {/* Aquí puedes agregar más secciones en el futuro */}
        </main>
      </div>
    </div>
  );
}
