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
        ${variant === 'solid' 
            ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-lg border-b border-neutral-200/50 dark:border-neutral-700/50'
            : 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-lg border-b border-neutral-200/50 dark:border-neutral-700/50'
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
                            <Image
                                alt="GoolStar Logo"
                                src="/images/logos/logooficial.svg"
                                width={120}
                                height={40}
                                className="h-10 w-auto"
                                priority
                            />
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden lg:flex lg:space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                                        px-3 py-2 text-sm font-medium rounded-md
                                        ${isActive(link.href)
                                            ? 'text-goal-gold bg-goal-gold/10'
                                            : 'text-gray-700 dark:text-gray-100 hover:text-goal-gold'
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
                            className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300"
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
                    <div className="fixed top-0 right-0 z-50 h-full w-72 bg-white dark:bg-neutral-900 shadow-xl lg:hidden">
                        <div className="flex justify-end p-4 border-b border-neutral-200 dark:border-neutral-700">
                            <button onClick={closeMenu} className="p-2 rounded-md">
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
                                        ${isActive(link.href)
                                            ? 'text-goal-gold bg-goal-gold/10'
                                            : 'text-gray-700 dark:text-gray-300'
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