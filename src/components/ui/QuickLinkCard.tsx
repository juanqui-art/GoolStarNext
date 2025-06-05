'use client';

import {useRef, useEffect, JSX} from 'react';
import Link from 'next/link';
import gsap from 'gsap';

interface QuickLinkCardProps {
  title: string;
  description: string;
  icon: JSX.Element;
  href: string;
  accentColor: 'gold' | 'blue' | 'orange';
}

export default function QuickLinkCard({ 
  title, 
  description, 
  icon, 
  href,
  accentColor = 'gold'
}: QuickLinkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mapeo de colores de acento a clases CSS
  const accentColorMap = {
    gold: {
      iconBg: 'bg-goal-gold/10',
      iconText: 'text-goal-gold',
      hoverBorder: 'group-hover:border-goal-gold/50',
      shadow: 'group-hover:shadow-[0_0_15px_rgba(255,215,0,0.15)]'
    },
    blue: {
      iconBg: 'bg-goal-blue/10',
      iconText: 'text-goal-blue',
      hoverBorder: 'group-hover:border-goal-blue/50',
      shadow: 'group-hover:shadow-[0_0_15px_rgba(0,105,146,0.15)]'
    },
    orange: {
      iconBg: 'bg-goal-orange/10',
      iconText: 'text-goal-orange',
      hoverBorder: 'group-hover:border-goal-orange/50',
      shadow: 'group-hover:shadow-[0_0_15px_rgba(255,127,17,0.15)]'
    }
  };
  
  const { iconBg, iconText, hoverBorder, shadow } = accentColorMap[accentColor];
  
  useEffect(() => {
    // Animación hover con GSAP
    if (cardRef.current) {
      const card = cardRef.current;
      
      // Configuración inicial
      gsap.set(card, { 
        scale: 1, 
        y: 0,
        clearProps: "all" 
      });
      
      // Animación al hacer hover
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { 
          y: -5, 
          scale: 1.02, 
          duration: 0.3, 
          ease: 'power2.out' 
        });
      });
      
      // Animación al quitar el hover
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { 
          y: 0, 
          scale: 1, 
          duration: 0.3, 
          ease: 'power2.out' 
        });
      });
    }
    
    return () => {
      // Limpieza de animaciones
      if (cardRef.current) {
        cardRef.current.removeEventListener('mouseenter', () => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
        cardRef.current.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);
  
  return (
    <Link href={href} className="block">
      <div 
        ref={cardRef}
        className={`group bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 ${hoverBorder} rounded-lg p-4 sm:p-5 transition-all duration-300 ${shadow} min-h-[140px] sm:min-h-[160px] flex flex-col`}
      >
        <div className={`${iconBg} w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 flex-shrink-0`}>
          <div className={`${iconText}`}>
            {icon}
          </div>
        </div>
        
        <h3 className="font-semibold text-base sm:text-lg mb-2 text-neutral-800 dark:text-neutral-100 leading-tight">
          {title}
        </h3>
        
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed flex-1">
          {description}
        </p>
      </div>
    </Link>
  );
}
