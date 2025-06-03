"use client";

import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";
import { ReactNode, useEffect } from "react";

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      enableColorScheme={false}
    >
      <ThemeInitializer>{children}</ThemeInitializer>
    </NextThemeProvider>
  );
}

function ThemeInitializer({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    // Asegurarse de que el tema se aplique al elemento html
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme) {
      root.classList.add(theme);
    } else {
      root.classList.add('dark');
    }
  }, [theme]);

  return <>{children}</>;
}
