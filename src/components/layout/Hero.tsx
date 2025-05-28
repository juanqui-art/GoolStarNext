"use client";

import Link from 'next/link';
import BrillarAnimation from '../animations/BrillarAnimation';

const Hero = () => {
  return (
    <div className="relative h-screen min-h-[600px] w-full overflow-hidden flex items-center">
        {/* Imagen de fondo a pantalla completa */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/images/pelota.webp"
            alt="Fútbol Indoor"
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay oscuro general */}
          <div className="absolute inset-0 bg-black/60"></div>
          
          {/* Gradiente superior para integración con navbar */}
          <div className="absolute top-0 left-0 right-0 h-[240px] bg-gradient-to-b from-black via-black/60 to-transparent z-10"></div>
        </div>

        {/* Efecto de luz dorada desde abajo */}
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-primary/30 to-transparent z-[1]"></div>

        {/* Contenido centrado - ajustado para dar espacio a la navbar */}
        <div className="container relative mx-auto px-4 z-10 pt-16">
          <div className="max-w-3xl mx-auto text-center">
            {/* Título principal con combinación de fuentes moderna y dinámica */}
            <h1 className="text-white flex flex-col items-center justify-center">
              <span className="font-subtitle text-4xl md:text-6xl tracking-wide ">
                Tu Momento de
              </span>
              <span className="font-heading text-7xl md:text-9xl tracking-wider uppercase px-2">
                <BrillarAnimation className="" />
              </span>
              <span className="font-subtitle text-4xl md:text-6xl tracking-wide">
                Ha Llegado
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="text-xl md:text-2xl mb-10 text-white/90 font-subtitle mt-12">
              Únete al torneo más emocionante de fútbol indoor
            </p>

            {/* Botón de WhatsApp con diseño minimalista y elegante */}
            <div className="relative inline-block mt-2">
              <a
                href="https://wa.me/593000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center bg-transparent text-white px-8 py-4 text-base font-light tracking-widest uppercase rounded-md border border-accent/50 hover:border-accent backdrop-blur-sm transition-all duration-300 hover:bg-accent/5 shadow-sm hover:shadow-neon-blue"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 opacity-80 group-hover:opacity-100 transition-all"
                  fill="white"
                  viewBox="0 0 24 24"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <div className="overflow-hidden relative">
                  <span className="inline-block text-white group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    Contáctanos
                  </span>
                </div>
              </a>
              {/* Línea animada bajo el botón - color azul */}
              <div className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-accent group-hover:w-full group-hover:left-0 transition-all duration-300 ease-out"></div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Hero;
