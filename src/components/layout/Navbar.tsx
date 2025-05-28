"use client";

import Image from "next/image";
import {useState, useEffect} from 'react';
import Link from 'next/link';
import {useTheme} from 'next-themes';
import {Moon, Sun} from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    // Solo se ejecuta en el cliente después de que el componente se monte
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <nav className="sticky top-0 z-50 transition-all duration-300 bg-black mt-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo a la izquierda */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                          <span className="text-xl font-bold">
                            <Image
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
                    <div className="hidden md:flex md:justify-center md:flex-1">
                        <div className="flex space-x-12">
                            <Link href="/"
                                  className="text-gray-700 dark:text-gray-100 flex flex-col items-center px-3 py-2 font-medium relative group">
                                <span>Inicio</span>
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            </Link>
                            <Link href="/torneos"
                                  className="text-gray-600 dark:text-gray-300 flex flex-col items-center px-3 py-2 text-sm font-medium relative group">
                                <span>Torneos</span>
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            </Link>
                            <Link href="/equipos"
                                  className="text-gray-600 dark:text-gray-300 flex flex-col items-center px-3 py-2 text-sm font-medium relative group">
                                <span>Equipos</span>
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            </Link>
                            <Link href="/contacto"
                                  className="text-gray-600 dark:text-gray-300 flex flex-col items-center px-3 py-2 text-sm font-medium relative group">
                                <span>Contacto</span>
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Botón de menú móvil */}
                    <div className="-mr-2 flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-colors duration-300 focus:outline-none"
                        >
                            <span className="sr-only">Abrir menú principal</span>
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Menú móvil */}
            {isOpen && (
                <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md transition-all duration-300 shadow-lg">
                    <div className="pt-2 pb-3 space-y-1 px-4">
                        <Link href="/"
                              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white bg-gradient-to-r from-amber-400/20 to-amber-300/20">
                            Inicio
                        </Link>
                        <Link href="/torneos"
                              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-amber-400/10 hover:to-orange-400/10 hover:text-gray-900 dark:hover:text-white transition-colors duration-300">
                            Torneos
                        </Link>
                        <Link href="/equipos"
                              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-orange-400/10 hover:to-blue-500/10 hover:text-gray-900 dark:hover:text-white transition-colors duration-300">
                            Equipos
                        </Link>
                        <Link href="/contacto"
                              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-blue-600/10 hover:text-gray-900 dark:hover:text-white transition-colors duration-300">
                            Contacto
                        </Link>
                        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700/60">
                            <div className="flex items-center justify-between px-4">
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-colors duration-300 focus:outline-none"
                                    aria-label="Cambiar tema"
                                >
                                    {mounted && (
                                        theme === 'dark' ? (
                                            <Sun className="h-5 w-5 text-amber-400"/>
                                        ) : (
                                            <Moon className="h-5 w-5 text-blue-500"/>
                                        )
                                    )}
                                </button>
                                <button
                                    className="w-full ml-4 bg-gradient-to-r from-amber-500 to-orange-400 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-amber-600 hover:to-orange-500 transition-all duration-300 shadow-md hover:shadow-lg">
                                    Iniciar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
