/**
 * Theme Registry for Runtime Theme Switching
 * 
 * This module defines theme packs that can be dynamically switched at runtime.
 * Each theme defines CSS custom properties (HSL values) for all shadcn tokens.
 * 
 * To add a new theme (e.g., tweakcn Notebook):
 * 1. Add a new ThemeDef object to the THEMES array
 * 2. Map all shadcn tokens (--background, --foreground, --primary, etc.) to HSL values
 * 3. Include both light and dark variants if needed
 * 4. The theme will automatically appear in the theme switcher
 */

export type ThemeDef = {
  name: string;
  className: string;
  light: Record<string, string>;
  dark: Record<string, string>;
};

export const THEMES: ThemeDef[] = [
  {
    name: 'Default',
    className: 'theme-default',
    light: {
      '--background': '0 0% 100%',
      '--foreground': '0 0% 10%',
      '--card': '0 0% 99%',
      '--card-foreground': '0 0% 10%',
      '--popover': '0 0% 100%',
      '--popover-foreground': '0 0% 10%',
      '--primary': '0 72% 51%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '0 0% 96%',
      '--secondary-foreground': '0 0% 20%',
      '--muted': '0 5% 96%',
      '--muted-foreground': '0 0% 45%',
      '--accent': '25 95% 53%',
      '--accent-foreground': '0 0% 10%',
      '--destructive': '0 84% 60%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '0 5% 90%',
      '--input': '0 5% 90%',
      '--ring': '0 72% 51%',
      '--radius': '0.75rem',
      '--success': '142 71% 45%',
      '--warning': '38 92% 50%',
    },
    dark: {
      '--background': '0 0% 7%',
      '--foreground': '0 0% 98%',
      '--card': '0 0% 10%',
      '--card-foreground': '0 0% 98%',
      '--popover': '0 0% 8%',
      '--popover-foreground': '0 0% 98%',
      '--primary': '0 84% 60%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '0 5% 16%',
      '--secondary-foreground': '0 0% 98%',
      '--muted': '0 5% 15%',
      '--muted-foreground': '0 0% 60%',
      '--accent': '25 95% 58%',
      '--accent-foreground': '0 0% 10%',
      '--destructive': '0 72% 51%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '0 5% 20%',
      '--input': '0 5% 18%',
      '--ring': '0 84% 60%',
      '--success': '142 71% 45%',
      '--warning': '38 92% 50%',
    },
  },
  {
    name: 'Notebook',
    className: 'theme-notebook',
    light: {
      // Placeholder: When you receive tweakcn Notebook theme,
      // paste the HSL token mappings here
      '--background': '43 46% 95%',
      '--foreground': '30 20% 15%',
      '--card': '43 30% 98%',
      '--card-foreground': '30 20% 15%',
      '--popover': '43 46% 95%',
      '--popover-foreground': '30 20% 15%',
      '--primary': '28 80% 52%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '43 20% 90%',
      '--secondary-foreground': '30 20% 25%',
      '--muted': '43 20% 93%',
      '--muted-foreground': '30 10% 50%',
      '--accent': '43 60% 70%',
      '--accent-foreground': '30 20% 15%',
      '--destructive': '0 84% 60%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '43 20% 85%',
      '--input': '43 20% 85%',
      '--ring': '28 80% 52%',
      '--radius': '0.75rem',
      '--success': '142 71% 45%',
      '--warning': '38 92% 50%',
    },
    dark: {
      // Placeholder: Dark variant for Notebook theme
      '--background': '30 15% 12%',
      '--foreground': '43 20% 92%',
      '--card': '30 15% 15%',
      '--card-foreground': '43 20% 92%',
      '--popover': '30 15% 10%',
      '--popover-foreground': '43 20% 92%',
      '--primary': '28 75% 55%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '30 15% 20%',
      '--secondary-foreground': '43 20% 90%',
      '--muted': '30 15% 18%',
      '--muted-foreground': '43 10% 60%',
      '--accent': '43 50% 45%',
      '--accent-foreground': '43 20% 92%',
      '--destructive': '0 72% 51%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '30 15% 25%',
      '--input': '30 15% 22%',
      '--ring': '28 75% 55%',
      '--success': '142 71% 45%',
      '--warning': '38 92% 50%',
    },
  },
];

export function getTheme(className: string): ThemeDef | undefined {
  return THEMES.find((t) => t.className === className);
}

export function generateThemeStyles(theme: ThemeDef, mode: 'light' | 'dark'): string {
  const vars = mode === 'light' ? theme.light : theme.dark;
  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n    ');
}

