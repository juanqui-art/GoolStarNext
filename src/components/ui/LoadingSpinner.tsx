'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary',
  className = ''
}: LoadingSpinnerProps) {
  const spinnerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Animación con GSAP en lugar de CSS nativo
    const spinner = spinnerRef.current;
    if (spinner) {
      gsap.to(spinner, {
        rotation: 360,
        repeat: -1,
        duration: 1,
        ease: "linear"
      });
    }
    
    return () => {
      // Limpiar animación
      if (spinner) {
        gsap.killTweensOf(spinner);
      }
    };
  }, []);
  
  // Determinar tamaño
  const sizeClass = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  }[size];
  
  // Determinar color
  const colorClass = {
    primary: 'border-t-primary border-l-primary/30 border-b-primary/10 border-r-primary/10',
    white: 'border-t-white border-l-white/30 border-b-white/10 border-r-white/10'
  }[color];
  
  return (
    <div className="flex justify-center items-center p-4">
      <div 
        ref={spinnerRef}
        className={`rounded-full ${sizeClass} ${colorClass} ${className}`}
        aria-label="Cargando"
      />
    </div>
  );
}
