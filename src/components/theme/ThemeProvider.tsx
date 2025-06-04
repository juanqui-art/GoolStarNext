"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ReactNode, useEffect } from "react";

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      enableColorScheme={false}
    >
      <ThemeInitializer>{children}</ThemeInitializer>
    </NextThemeProvider>
  );
}

function ThemeInitializer({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Forzar el tema oscuro en el elemento html
    const root = window.document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
    
    // Aplicamos también mediante propiedad CSS
    document.documentElement.style.setProperty('color-scheme', 'dark');
  }, []);

  return <>{children}</>;
}
