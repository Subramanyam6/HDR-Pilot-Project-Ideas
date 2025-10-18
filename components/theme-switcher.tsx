'use client';

import * as React from 'react';
import { Moon, Sun, Monitor, Palette } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { THEMES } from '@/lib/themes';
import { cn } from '@/lib/utils';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [designTheme, setDesignTheme] = React.useState<string>('theme-default');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Load saved design theme from localStorage
    const savedDesignTheme = localStorage.getItem('design-theme');
    if (savedDesignTheme) {
      setDesignTheme(savedDesignTheme);
      applyDesignTheme(savedDesignTheme);
    }
  }, []);

  const applyDesignTheme = (themeClass: string) => {
    // Remove all theme classes
    THEMES.forEach((t) => {
      document.documentElement.classList.remove(t.className);
    });
    // Add new theme class
    if (themeClass !== 'theme-default') {
      document.documentElement.classList.add(themeClass);
    }
  };

  const handleDesignThemeChange = (themeClass: string) => {
    setDesignTheme(themeClass);
    localStorage.setItem('design-theme', themeClass);
    applyDesignTheme(themeClass);
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Theme settings">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const renderThemeIcon = () => {
    if (theme === 'dark') return <Moon className="h-5 w-5" />;
    if (theme === 'light') return <Sun className="h-5 w-5" />;
    return <Monitor className="h-5 w-5" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Theme settings"
        >
          {renderThemeIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mode</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === 'light' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {theme === 'dark' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === 'system' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Design Theme</DropdownMenuLabel>
        {THEMES.map((t) => (
          <DropdownMenuItem
            key={t.className}
            onClick={() => handleDesignThemeChange(t.className)}
            className="cursor-pointer"
          >
            <Palette className="mr-2 h-4 w-4" />
            <span>{t.name}</span>
            {designTheme === t.className && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

