"use client";

import { X, Menu } from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface NavbarProps {
    variant?: 'transparent' | 'solid';
    className?: string;
}

const Navbar = ({ variant = 'transparent', className = '' }: NavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const closeMenu = useCallback(() => {
        setIsOpen(false);
    }, []);

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

    const navbarClasses = `
        fixed top-0 left-0 right-0 z-50 
        h-18
        transition-colors duration-300
        ${variant === 'solid' 
            ? 'bg-neutral-50/60 dark:bg-neutral-900/60 backdrop-blur-md shadow-elevation-2 dark:border-neutral-700'
            : 'bg-neutral-50/60 dark:bg-neutral-950/60 backdrop-blur-md shadow-elevation-1  dark:border-neutral-800/30'
        }
        ${className}
    `;

    return (
        <>
            <nav className={navbarClasses}>
                <div className="max-w-7xl mx-auto px-4 h-full">
                    <div className="flex justify-between items-center h-full">
                        
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            {/* Logo para modo claro */}
                            <div className="relative">
                                <Image
                                    alt="GoolStar Logo"
                                    src="/images/logos/logooficial.svg"
                                    width={120}
                                    height={40}
                                    className="h-10 w-auto block dark:hidden"
                                    style={{ filter: 'brightness(0) saturate(100%)' }}
                                    priority
                                />
                                {/* Logo para modo oscuro */}
                                <Image
                                    alt="GoolStar Logo"
                                    src="/images/logos/logooficial.svg"
                                    width={120}
                                    height={40}
                                    className="h-10 w-auto hidden dark:block"
                                    priority
                                />
                            </div>
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden lg:flex lg:space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                                        px-3 py-2 text-base font-medium rounded-md
                                        transition-colors duration-200
                                        ${isActive(link.href)
                                            ? 'text-goal-blue bg-goal-blue-100 font-semibold hover:bg-goal-blue-200'
                                            : 'text-neutral-700 dark:text-neutral-200 hover:text-goal-blue hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                        }
                                    `}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="lg:hidden p-2 rounded-md text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
                        onClick={closeMenu}
                    />
                    <div className="fixed top-0 right-0 z-50 h-full w-72 bg-neutral-50 dark:bg-neutral-900 shadow-elevation-3 lg:hidden">
                        <div className="flex justify-end p-4 border-b border-neutral-200 dark:border-neutral-700">
                            <button 
                                onClick={closeMenu} 
                                className="p-2 rounded-md text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                                aria-label="Cerrar menú"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={closeMenu}
                                    className={`
                                        block px-4 py-3 rounded-md text-base font-medium
                                        transition-colors duration-200
                                        ${isActive(link.href)
                                            ? 'text-goal-gold bg-goal-gold-100 font-semibold hover:bg-goal-gold-200'
                                            : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800'
                                        }
                                    `}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Navbar;