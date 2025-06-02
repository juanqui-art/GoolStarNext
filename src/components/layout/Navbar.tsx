"use client";

import { X, Menu } from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface NavbarProps {
    variant?: 'transparent' | 'solid';
    className?: string;
}

const Navbar = ({ variant = 'transparent', className = '' }: NavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    // Solo se ejecuta en el cliente después de que el componente se monte
    useEffect(() => {
        setMounted(true);
    }, []);

    // Manejar scroll
    useEffect(() => {
        if (variant !== 'transparent') return;

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check inicial

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [variant]);

    // Cerrar menú móvil al cambiar de ruta
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevenir scroll del body cuando el menú está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const toggleMenu = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const closeMenu = useCallback(() => {
        setIsOpen(false);
    }, []);

    // Enlaces de navegación
    const navLinks = [
        { href: '/', label: 'Inicio' },
        { href: '/torneos', label: 'Torneos' },
        { href: '/equipos', label: 'Equipos' },
        { href: '/partidos', label: 'Partidos' },
        { href: '/tabla', label: 'Tabla' },
        { href: '/goleadores', label: 'Goleadores' },
        { href: '/contacto', label: 'Contacto' }
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    // Clases del navbar
    const navbarClasses = `
        fixed top-0 left-0 right-0 z-50 
        transition-all duration-300 ease-in-out 
        h-16 md:h-20
        ${variant === 'solid' || isScrolled
        ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-lg border-b border-neutral-200/50 dark:border-neutral-700/50'
        : 'bg-transparent'
    }
        ${className}
    `;

    // Loading state - sin animaciones complejas
    if (!mounted) {
        return (
            <nav className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 bg-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex justify-between items-center h-full">
                        <div className="flex-shrink-0 h-full flex items-center">
                            <div className="h-8 md:h-10 lg:h-12 w-[120px] bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                        </div>
                        <div className="lg:hidden">
                            <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <>
            {/* Navbar Principal */}
            <nav className={navbarClasses}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex justify-between items-center h-full">

                        {/* Logo */}
                        <div className="flex-shrink-0 h-full flex items-center">
                            <Link
                                href={"/"}
                                className={"block h-8 md:h-10 lg:h-12 w-auto hover:scale-105 transition-transform duration-300"}
                                aria-label={"GoolStar - Ir al inicio"}
                            >
                                <Image
                                    alt={"GoolStar Logo"}
                                    src={"/images/logos/logooficial.svg"}
                                    width={120}
                                    height={40}
                                    className={"h-full w-auto object-contain"}
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Enlaces Desktop */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                                        relative px-3 py-2 text-sm font-medium 
                                        transition-colors duration-300 rounded-md
                                        hover:bg-neutral-100 dark:hover:bg-neutral-800
                                        ${isActive(link.href)
                                        ? 'text-goal-gold dark:text-goal-gold bg-goal-gold/10'
                                        : 'text-gray-700 dark:text-gray-100 hover:text-goal-blue dark:hover:text-goal-gold'
                                    }
                                    `}
                                    aria-current={isActive(link.href) ? 'page' : undefined}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Botón Menú Móvil - SIMPLIFICADO */}
                        <div className="lg:hidden">
                            <button
                                onClick={toggleMenu}
                                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
                                aria-expanded={isOpen}
                                aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                            >
                                {/* ICONOS SIMPLES - SIN ANIMACIONES COMPLEJAS */}
                                {isOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Overlay del Menú Móvil */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    aria-hidden={"true"}
                    onClick={closeMenu}
                >
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                </div>
            )}

            {/* Menú Móvil - SIMPLIFICADO */}
            <div className={`
                fixed top-0 right-0 z-50 h-full w-80 max-w-sm 
                bg-white dark:bg-neutral-900 shadow-xl
                transform transition-transform duration-300 ease-in-out lg:hidden
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                {/* Header del menú */}
                <div className="flex items-center justify-end p-4 border-b border-neutral-200 dark:border-neutral-700">
                    <button
                        onClick={closeMenu}
                        className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        aria-label={"Cerrar menú"}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Enlaces del menú */}
                <div className="p-4 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeMenu}
                            className={`
                                block px-4 py-3 rounded-lg text-base font-medium
                                transition-colors duration-200
                                ${isActive(link.href)
                                ? 'bg-goal-gold/10 text-goal-gold border border-goal-gold/20'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                            }
                            `}
                            aria-current={isActive(link.href) ? 'page' : undefined}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Footer del menú */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 dark:border-neutral-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        2025 GoolStar
                    </p>
                </div>
            </div>
        </>
    );
};

export default Navbar;