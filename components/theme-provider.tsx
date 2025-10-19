'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <NextThemesProvider {...props}>
      {mounted ? children : <span className="hidden">{children}</span>}
    </NextThemesProvider>
  );
}

// Theme persistence helper
export function useThemePersistence() {
  const { theme, setTheme } = useTheme();
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;

    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (savedTheme && savedTheme !== theme) {
      setTheme(savedTheme);
    }
  }, [hydrated, theme, setTheme]);
}
