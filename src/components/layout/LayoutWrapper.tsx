"use client";

import {ReactNode} from 'react';
import Footer from './footer';
import Navbar from './Navbar';

interface LayoutWrapperProps {
    children: ReactNode;
    navbarVariant?: 'transparent' | 'solid';
    showFooter?: boolean;
    className?: string;
    navbarClassName?: string;
}

/**
 * Wrapper unificado para todas las páginas
 * Maneja automáticamente el spacing del navbar y layout consistente
 */
export default function LayoutWrapper({
                                          children,
                                          navbarVariant = 'transparent',
                                          showFooter = true,
                                          className = '',
                                          navbarClassName = ''
                                      }: LayoutWrapperProps) {
    return (
        <div className="layout-wrapper">
            {/* Navbar fixed unificado */}
            <Navbar
                variant={navbarVariant}
                className={navbarClassName}
            />

            {/* Main content con padding automático */}
            <main className={`layout-main ${className}`}>
                {children}
            </main>

            {/* Footer opcional */}
            {showFooter && <Footer/>}
        </div>
    );
}