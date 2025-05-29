"use client";

import gsap from 'gsap';
import {X} from 'lucide-react';
import {useTheme} from 'next-themes';
import Image from "next/image";
import Link from 'next/link';
import {useEffect, useRef, useState, useLayoutEffect} from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);
    const mobileMenuRef = useRef(null);
    const menuButtonRef = useRef(null);
    const menuItemsRef = useRef([]);
    const navbarRef = useRef(null);
    const mainLogoRef = useRef(null);
    const mobileLogoRef = useRef(null);
    const mobileHeaderRef = useRef(null);

    // Solo se ejecuta en el cliente después de que el componente se monte
    useEffect(() => {
        setMounted(true);
    }, []);

    // Sincroniza la posición exacta del logo móvil con el logo principal
    useLayoutEffect(() => {
        if (!isOpen || !mainLogoRef.current || !mobileLogoRef.current || !mobileHeaderRef.current || !navbarRef.current) return;
        
        // Calculamos las posiciones exactas
        const navbarRect = navbarRef.current.getBoundingClientRect();
        const logoRect = mainLogoRef.current.getBoundingClientRect();
        
        // Aplicamos la posición exacta al logo móvil para evitar saltos
        gsap.set(mobileHeaderRef.current, {
            paddingTop: navbarRect.top > 0 ? navbarRect.top : 0,
            height: navbarRect.height
        });
    }, [isOpen]);

    // Efecto para manejar las animaciones del menú móvil
    useEffect(() => {
        if (!mobileMenuRef.current) return;

        const menuTl = gsap.timeline({paused: true});

        // Animación para el menú móvil (solo fade in/out, sin movimiento vertical)
        menuTl.fromTo(
            mobileMenuRef.current,
            {
                opacity: 0,
                pointerEvents: 'none'
            },
            {
                opacity: 1,
                duration: 0.3,
                ease: "power3.out",
                pointerEvents: 'auto'
            }
        );

        // Animación para cada elemento del menú
        menuItemsRef.current.forEach((item, index) => {
            if (!item) return;
            menuTl.fromTo(
                item,
                {opacity: 0, y: -10},
                {opacity: 1, y: 0, duration: 0.2, ease: "power2.out"},
                "-=0.15"
            );
        });

        if (isOpen) {
            menuTl.play();
            // Bloquear el scroll cuando el menú está abierto
            document.body.style.overflow = 'hidden';
        } else {
            menuTl.reverse();
            // Restaurar el scroll cuando el menú está cerrado
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    // Animación para el botón hamburguesa
    useEffect(() => {
        if (!menuButtonRef.current) return;

        const lines = menuButtonRef.current.querySelectorAll('span:not(.sr-only)');
        if (lines.length < 3) return;

        if (isOpen) {
            gsap.to(lines[0], {rotation: 45, y: 8, duration: 0.3, ease: "power2.inOut"});
            gsap.to(lines[1], {opacity: 0, duration: 0.2, ease: "power2.inOut"});
            gsap.to(lines[2], {rotation: -45, y: -8, duration: 0.3, ease: "power2.inOut"});
        } else {
            gsap.to(lines[0], {rotation: 0, y: 0, duration: 0.3, ease: "power2.inOut"});
            gsap.to(lines[1], {opacity: 1, duration: 0.2, ease: "power2.inOut", delay: 0.1});
            gsap.to(lines[2], {rotation: 0, y: 0, duration: 0.3, ease: "power2.inOut"});
        }
    }, [isOpen]);

    const closeMenu = () => {
        setIsOpen(false);
    };

    // Función para asignar las referencias a los elementos del menú
    const setMenuItemRef = (el, index) => {
        menuItemsRef.current[index] = el;
    };

    return (
        <nav 
            ref={navbarRef}
            className="absolute top-0 left-0 right-0 z-[100] transition-all duration-300 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Barra de navegación */}
                <div className="flex justify-between items-center h-16">
                    {/* Logo a la izquierda */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                          <span className="text-xl font-bold">
                            <Image
                                ref={mainLogoRef}
                                alt="GoolStar Logo"
                                src="/images/logos/logooficial.svg"
                                width={120}
                                height={60}
                                className="h-12 w-auto transition-transform duration-300 hover:scale-105"
                                priority
                            />
                          </span>
                        </Link>
                    </div>

                    {/* Enlaces centrados */}
                    <div className="hidden md:flex md:justify-end md:flex-1">
                        <div className="flex space-x-20">
                            <Link href="/"
                                  className="text-gray-700 dark:text-gray-100 flex flex-col items-center px-3 py-2 font-medium relative group">
                                <span>Inicio</span>
                                <span
                                    className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            </Link>
                            <Link href="/torneos"
                                  className="text-gray-600 dark:text-gray-300 flex flex-col items-center px-3 py-2  font-medium relative group">
                                <span>Torneos</span>
                                <span
                                    className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            </Link>
                            <Link href="/equipos"
                                  className="text-gray-600 dark:text-gray-300 flex flex-col items-center px-3 py-2  font-medium relative group">
                                <span>Equipos</span>
                                <span
                                    className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            </Link>
                            <Link href="/contacto"
                                  className="text-gray-600 dark:text-gray-300 flex flex-col items-center px-3 py-2  font-medium relative group">
                                <span>Contacto</span>
                                <span
                                    className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            </Link>
                        </div>
                    </div>

                    {/* Botón de menú móvil mejorado */}
                    <div className="flex items-center md:hidden">
                        <button
                            ref={menuButtonRef}
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex flex-col items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white focus:outline-none"
                            aria-expanded={isOpen}
                            aria-label="Menú principal"
                        >
                            <span className="sr-only">Abrir menú principal</span>
                            <span
                                className="w-6 h-0.5 bg-current mb-1.5 transform transition-transform duration-300"></span>
                            <span
                                className="w-6 h-0.5 bg-current mb-1.5 transform transition-opacity duration-300"></span>
                            <span 
                                className="w-6 h-0.5 bg-current transform transition-transform duration-300"></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Menú móvil mejorado - no se anima verticalmente para evitar saltos */}
            <div
                ref={mobileMenuRef}
                className={`md:hidden fixed inset-0 bg-gradient-to-b from-black/90 to-black/75 backdrop-blur-lg z-50 ${isOpen ? '' : 'pointer-events-none opacity-0'}`}
                style={{ top: 0 }}
            >
                <div className="h-full flex flex-col">
                    {/* Cabecera del menú móvil con exactamente la misma estructura que la principal */}
                    <div
                        ref={mobileHeaderRef}
                        className="flex justify-between items-center px-4 sm:px-6 lg:px-8 border-b border-gray-700/30"
                    >
                        <div className="flex-shrink-0">
                            <div className="flex items-center">
                                <Image
                                    ref={mobileLogoRef}
                                    alt="GoolStar Logo"
                                    src="/images/logos/logooficial.svg"
                                    width={120}
                                    height={60}
                                    className="h-12 w-auto"
                                    priority
                                />
                            </div>
                        </div>
                        <button
                            onClick={closeMenu}
                            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors duration-300"
                            aria-label="Cerrar menú"
                        >
                            <X className="h-6 w-6"/>
                        </button>
                    </div>

                    {/* Enlaces del menú móvil */}
                    <div className="flex-1 flex flex-col justify-center overflow-y-auto py-6 px-4 space-y-2">
                        <Link href="/"
                              onClick={closeMenu}
                              ref={(el) => setMenuItemRef(el, 0)}
                              className="block px-5 py-4 rounded-xl text-lg font-semibold text-gray-100 hover:bg-gradient-to-r hover:from-amber-400/20 hover:to-amber-300/20 hover:text-amber-300 transition-colors duration-300 text-center"
                        >
                            Inicio
                        </Link>
                        <Link href="/torneos"
                              onClick={closeMenu}
                              ref={(el) => setMenuItemRef(el, 1)}
                              className="block px-5 py-4 rounded-xl text-lg font-semibold text-gray-100 hover:bg-gradient-to-r hover:from-amber-400/20 hover:to-orange-400/20 hover:text-orange-300 transition-colors duration-300 text-center"
                        >
                            Torneos
                        </Link>
                        <Link href="/equipos"
                              onClick={closeMenu}
                              ref={(el) => setMenuItemRef(el, 2)}
                              className="block px-5 py-4 rounded-xl text-lg font-semibold text-gray-100 hover:bg-gradient-to-r hover:from-orange-400/20 hover:to-blue-500/20 hover:text-blue-300 transition-colors duration-300 text-center"
                        >
                            Equipos
                        </Link>
                        <Link href="/contacto"
                              onClick={closeMenu}
                              ref={(el) => setMenuItemRef(el, 3)}
                              className="block px-5 py-4 rounded-xl text-lg font-semibold text-gray-100 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-blue-600/20 hover:text-blue-300 transition-colors duration-300 text-center"
                        >
                            Contacto
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
