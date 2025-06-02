"use client";

import gsap from 'gsap';
import { X, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from "next/image";
import Link from 'next/link';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';

interface NavbarProps {
    variant?: 'transparent' | 'solid';
    className?: string;
}

const Navbar = ({ variant = 'transparent', className = '' }: NavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    // Refs para animaciones - optimizados
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
    const navbarRef = useRef<HTMLElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    // Solo se ejecuta en el cliente después de que el componente se monte
    useEffect(() => {
        setMounted(true);
    }, []);

    // Manejar scroll con throttling mejorado
    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY;
        const shouldBeScrolled = scrollTop > 10;

        if (shouldBeScrolled !== isScrolled) {
            setIsScrolled(shouldBeScrolled);
        }
    }, [isScrolled]);

    useEffect(() => {
        if (variant !== 'transparent') return;

        let rafId: number;
        let lastScrollY = window.scrollY;

        const optimizedScrollHandler = () => {
            const currentScrollY = window.scrollY;

            // Solo actualizar si hay cambio significativo
            if (Math.abs(currentScrollY - lastScrollY) > 5) {
                handleScroll();
                lastScrollY = currentScrollY;
            }
        };

        const throttledScroll = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                optimizedScrollHandler();
                rafId = 0;
            });
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
        handleScroll(); // Check inicial

        return () => {
            window.removeEventListener('scroll', throttledScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [variant, handleScroll]);

    // Cerrar menú móvil al cambiar de ruta
    useEffect(() => {
        if (isOpen) {
            setIsOpen(false);
        }
    }, [pathname]);

    // Animaciones del menú móvil optimizadas
    useEffect(() => {
        if (!mobileMenuRef.current) return;

        // Limpiar timeline anterior
        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        const tl = gsap.timeline({
            paused: true,
            defaults: { ease: "power3.out" }
        });
        timelineRef.current = tl;

        // Configurar estados iniciales
        gsap.set(mobileMenuRef.current, {
            opacity: 0,
            pointerEvents: 'none'
        });

        const validItems = menuItemsRef.current.filter(Boolean);
        if (validItems.length > 0) {
            gsap.set(validItems, {
                opacity: 0,
                y: 30,
                scale: 0.9
            });
        }

        // Crear animación
        tl.to(mobileMenuRef.current, {
            opacity: 1,
            duration: 0.3,
            pointerEvents: 'auto'
        })
            .to(validItems, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.4,
                stagger: 0.08,
                ease: "back.out(1.4)"
            }, "-=0.2");

        if (isOpen) {
            tl.play();
            document.body.style.overflow = 'hidden';
        } else {
            tl.reverse();
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
        };
    }, [isOpen]);

    // Animación del botón hamburguesa optimizada
    useEffect(() => {
        if (!menuButtonRef.current) return;

        const button = menuButtonRef.current;
        const menuIcon = button.querySelector('[data-menu-icon]') as HTMLElement;
        const closeIcon = button.querySelector('[data-close-icon]') as HTMLElement;

        if (!menuIcon || !closeIcon) return;

        if (isOpen) {
            gsap.to(menuIcon, {
                opacity: 0,
                rotate: 90,
                scale: 0.8,
                duration: 0.2
            });
            gsap.to(closeIcon, {
                opacity: 1,
                rotate: 0,
                scale: 1,
                duration: 0.3,
                delay: 0.1,
                ease: "back.out(1.4)"
            });
        } else {
            gsap.to(closeIcon, {
                opacity: 0,
                rotate: -90,
                scale: 0.8,
                duration: 0.2
            });
            gsap.to(menuIcon, {
                opacity: 1,
                rotate: 0,
                scale: 1,
                duration: 0.3,
                delay: 0.1,
                ease: "back.out(1.4)"
            });
        }
    }, [isOpen]);

    const closeMenu = useCallback(() => {
        setIsOpen(false);
    }, []);

    const toggleMenu = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const setMenuItemRef = useCallback((el: HTMLAnchorElement | null, index: number) => {
        menuItemsRef.current[index] = el;
    }, []);

    // Memoizar enlaces de navegación
    const navLinks = useMemo(() => [
        { href: '/', label: 'Inicio', gradient: 'from-amber-400 to-amber-300' },
        { href: '/torneos', label: 'Torneos', gradient: 'from-amber-400 to-orange-400' },
        { href: '/equipos', label: 'Equipos', gradient: 'from-orange-400 to-blue-500' },
        { href: '/partidos', label: 'Partidos', gradient: 'from-blue-500 to-purple-500' },
        { href: '/tabla', label: 'Tabla', gradient: 'from-purple-500 to-pink-500' },
        { href: '/goleadores', label: 'Goleadores', gradient: 'from-pink-500 to-goal-gold' },
        { href: '/contacto', label: 'Contacto', gradient: 'from-goal-gold to-goal-orange' }
    ], []);

    const isActive = useCallback((href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    }, [pathname]);

    // Memoizar clases del navbar
    const navbarClasses = useMemo(() => {
        const baseClasses = "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out h-16 md:h-20";
        const variantClasses = variant === 'solid' || isScrolled
            ? "bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-lg border-b border-neutral-200/50 dark:border-neutral-700/50"
            : "bg-transparent";

        return `${baseClasses} ${variantClasses} ${className}`;
    }, [variant, isScrolled, className]);

    // No renderizar hasta que esté montado para evitar hidration mismatch
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
            <nav ref={navbarRef} className={navbarClasses}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex justify-between items-center h-full">
                        {/* Logo */}
                        <div className="flex-shrink-0 h-full flex items-center">
                            <Link
                                href="/"
                                className="block h-8 md:h-10 lg:h-12 w-auto transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-goal-gold focus:ring-offset-2 rounded"
                                aria-label="GoolStar - Ir al inicio"
                            >
                                <Image
                                    alt="GoolStar Logo"
                                    src="/images/logos/logooficial.svg"
                                    width={120}
                                    height={40}
                                    className="h-full w-auto object-contain"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Enlaces de navegación - Desktop */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                                        relative px-3 py-2 text-sm font-medium transition-colors duration-300 group rounded-md
                                        focus:outline-none focus:ring-2 focus:ring-goal-gold focus:ring-offset-2
                                        ${isActive(link.href)
                                        ? 'text-goal-gold dark:text-goal-gold'
                                        : 'text-gray-700 dark:text-gray-100 hover:text-goal-blue dark:hover:text-goal-gold'
                                    }
                                    `}
                                    aria-current={isActive(link.href) ? 'page' : undefined}
                                >
                                    {link.label}
                                    <span className={`
                                        absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r ${link.gradient} 
                                        transform origin-left transition-transform duration-300 
                                        ${isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                                    `}></span>
                                </Link>
                            ))}
                        </div>

                        {/* Botón de menú móvil */}
                        <div className="flex items-center lg:hidden">
                            <button
                                ref={menuButtonRef}
                                onClick={toggleMenu}
                                className="relative inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-goal-gold transition-colors duration-200"
                                aria-expanded={isOpen}
                                aria-label={isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
                                aria-controls="mobile-menu"
                            >
                                <Menu
                                    className="h-6 w-6 absolute inset-0 m-auto"
                                    data-menu-icon
                                    aria-hidden="true"
                                />
                                <X
                                    className="h-6 w-6 absolute inset-0 m-auto"
                                    data-close-icon
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Menú móvil */}
            <div
                ref={mobileMenuRef}
                id="mobile-menu"
                className="lg:hidden fixed inset-0 z-40 bg-gradient-to-br from-black/95 to-neutral-900/95 backdrop-blur-lg"
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-menu-title"
                style={{ pointerEvents: 'none', opacity: 0 }}
            >
                <div className="flex flex-col h-full">
                    {/* Header del menú móvil */}
                    <div className="flex justify-between items-center p-4 border-b border-white/10">
                        <Image
                            alt="GoolStar Logo"
                            src="/images/logos/logooficial.svg"
                            width={120}
                            height={40}
                            className="h-10 w-auto"
                        />
                        <button
                            onClick={closeMenu}
                            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                            aria-label="Cerrar menú de navegación"
                        >
                            <X className="h-6 w-6"/>
                        </button>
                    </div>

                    {/* Enlaces del menú móvil */}
                    <div className="flex-1 flex flex-col justify-center px-4 space-y-2">
                        <h2 id="mobile-menu-title" className="sr-only">Menú de navegación</h2>
                        {navLinks.map((link, index) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMenu}
                                ref={(el) => setMenuItemRef(el, index)}
                                className={`
                                    block px-5 py-4 rounded-xl text-lg font-semibold text-center transition-all duration-300
                                    focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent
                                    ${isActive(link.href)
                                    ? 'bg-goal-gold/20 text-goal-gold border border-goal-gold/30 shadow-lg'
                                    : 'text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                                }
                                `}
                                aria-current={isActive(link.href) ? 'page' : undefined}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Footer opcional del menú móvil */}
                    <div className="p-4 border-t border-white/10 text-center">
                        <p className="text-white/60 text-sm">
                            © 2025 GoolStar. Tu momento de brillar.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
