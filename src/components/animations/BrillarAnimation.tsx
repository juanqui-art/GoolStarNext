"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface BrillarAnimationProps {
  className?: string;
}

const BrillarAnimation: React.FC<BrillarAnimationProps> = ({ className }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<HTMLSpanElement[]>([]);

  // Configurar los refs para las letras
  const setLetterRef = (el: HTMLSpanElement | null, index: number) => {
    if (el) {
      letterRefs.current[index] = el;
    }
  };

  useEffect(() => {
    if (!textRef.current) return;

    // Limpiar cualquier animación anterior
    gsap.killTweensOf(letterRefs.current);

    // Timeline principal con mayor tiempo entre repeticiones
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 4, // Más tiempo entre ciclos completos
    });

    // Configuración inicial (asegura que las letras estén visibles al inicio)
    gsap.set(letterRefs.current, { opacity: 1, scale: 1, y: 0 });

    // Efecto de brillo/resplandor extremadamente sutil
    tl.to(letterRefs.current, {
      duration: 1.8,
      stagger: 0.12,
      scale: 1.01,  // Escala apenas perceptible
      color: "#e1c675", // Dorado mucho más apagado
      textShadow: "0 0 5px rgba(225, 198, 117, 0.25), 0 0 8px rgba(225, 198, 117, 0.15)", // Muy suave
      ease: "sine.inOut",
    })
    .to(letterRefs.current, {
      duration: 2,
      stagger: 0.08,
      scale: 1,
      color: "#f0f0f0",  // Un blanco muy sutil, casi gris claro
      textShadow: "0 0 3px rgba(225, 198, 117, 0.15), 0 0 5px rgba(225, 198, 117, 0.07)", // Apenas visible
      ease: "sine.inOut",
    }, "+=0.8"); // Más tiempo entre transiciones

    // Efecto de levitación muy sutil
    const floatTl = gsap.timeline({
      repeat: -1,
      yoyo: true,
    });

    letterRefs.current.forEach((letter, index) => {
      const delay = index * 0.05;
      floatTl.to(letter, {
        y: -2 - Math.random() * 2, // Movimiento muy reducido
        duration: 2 + Math.random() * 0.8, // Más lento
        ease: "sine.inOut",
        delay,
      }, 0);
    });

    // Limpiar al desmontar
    return () => {
      tl.kill();
      floatTl.kill();
    };
  }, []);

  // Divide "BRILLAR" en letras individuales para animar cada una
  const text = "BRILLAR";
  
  return (
    <span ref={textRef} className={`inline-block font-playfair ${className}`}>
      {text.split('').map((letter, index) => (
        <span
          key={index}
          ref={(el) => setLetterRef(el, index)}
          className="inline-block"
          style={{ willChange: 'transform, opacity, text-shadow' }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
};

export default BrillarAnimation;
