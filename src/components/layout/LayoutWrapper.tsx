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
    fullBleedContent?: boolean; 
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
                                         navbarClassName = '',
                                         fullBleedContent = false, 
                                     }: LayoutWrapperProps) {
    return (
        <div className="layout-wrapper">
            {/* Navbar fixed unificado */}
            <Navbar
                variant={navbarVariant}
                className={`${navbarClassName} z-50`} 
            />

            {/* Main content con padding automático o sin padding para contenido fullbleed */}
            <main className={`${fullBleedContent ? 'layout-main--custom-padding' : 'layout-main'} ${className}`}>
                {children}
            </main>

            {/* Footer opcional */}
            {showFooter && <Footer/>}
        </div>
    );
}