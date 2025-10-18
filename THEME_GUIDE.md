# Theme System Guide

## Overview

The HDR Pilot Navigator now uses a comprehensive theming system built on:
- **shadcn/ui** primitives for all UI components
- **next-themes** for runtime theme switching (light/dark/system)
- **Theme registry** for switchable design theme packs
- **CSS variables** for centralized design tokens

## Architecture

### 1. Design Tokens (`app/globals.css`)

All colors are defined as HSL values in CSS custom properties:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 10%;
  --primary: 0 72% 51%;
  --primary-foreground: 0 0% 100%;
  /* ... etc */
}

.dark {
  --background: 0 0% 7%;
  --foreground: 0 0% 98%;
  /* ... dark variants */
}
```

### 2. Theme Registry (`lib/themes.ts`)

Defines switchable theme packs:

```typescript
export const THEMES: ThemeDef[] = [
  {
    name: 'Default',
    className: 'theme-default',
    light: { /* HSL token map */ },
    dark: { /* HSL token map */ }
  },
  {
    name: 'Notebook',
    className: 'theme-notebook',
    light: { /* placeholder tokens */ },
    dark: { /* placeholder tokens */ }
  }
];
```

### 3. Theme Provider (`components/theme-provider.tsx`)

Wraps the app with next-themes:
- Enables system detection
- Persists user preference
- Applies `.dark` class automatically

### 4. Theme Switcher (`components/theme-switcher.tsx`)

Provides UI for:
- **Mode selection**: Light / Dark / System
- **Design theme selection**: Default / Notebook / etc.
- Persists design theme choice in `localStorage`

## How to Add a New Theme Pack

### Example: Adding tweakcn "Notebook" Theme

1. **Obtain the theme tokens** from tweakcn or design system
   - You'll need HSL values for all shadcn tokens
   - Both light and dark variants

2. **Update `lib/themes.ts`**:

```typescript
{
  name: 'Notebook',
  className: 'theme-notebook',
  light: {
    '--background': '43 46% 95%',      // Warm paper tone
    '--foreground': '30 20% 15%',      // Ink black
    '--primary': '28 80% 52%',         // Burnt orange
    '--primary-foreground': '0 0% 100%',
    '--muted': '43 20% 93%',           // Subtle warm gray
    '--accent': '43 60% 70%',          // Warm highlight
    '--border': '43 20% 85%',
    '--input': '43 20% 85%',
    '--ring': '28 80% 52%',
    '--card': '43 30% 98%',
    '--popover': '43 46% 95%',
    // ... all other tokens
  },
  dark: {
    '--background': '30 15% 12%',      // Dark wood
    '--foreground': '43 20% 92%',      // Off-white
    '--primary': '28 75% 55%',
    // ... dark variants
  }
}
```

3. **Add CSS classes in `app/globals.css`**:

```css
.theme-notebook {
  --background: 43 46% 95%;
  --foreground: 30 20% 15%;
  /* ... all light tokens */
}

.theme-notebook.dark {
  --background: 30 15% 12%;
  --foreground: 43 20% 92%;
  /* ... all dark tokens */
}
```

4. **Test**:
   - Refresh the app
   - Open theme switcher (top-right)
   - Select "Notebook" under Design Theme
   - Toggle between light/dark modes
   - Verify all components render correctly

### Important Notes

- **No component changes needed** — tokens handle everything
- **All shadcn tokens must be defined** to avoid fallback issues
- **Test both light & dark modes** for the new theme
- **Use HSL format** (`hue saturation% lightness%`)
- **Maintain contrast ratios** for accessibility (WCAG AA)

## Testing Checklist

Use this 60-second test plan after adding a theme:

### Visual Tests
- [ ] Light mode renders correctly
- [ ] Dark mode renders correctly
- [ ] System mode follows OS preference
- [ ] Design theme switches instantly
- [ ] No color flashing on page load

### Component Tests
- [ ] Buttons (primary, outline, ghost variants)
- [ ] Inputs and forms
- [ ] Cards and badges
- [ ] Sidebar and topbar
- [ ] Dialogs and sheets
- [ ] Tooltips and dropdowns

### Mobile Tests
- [ ] Mobile sheet opens/closes smoothly
- [ ] Focus trap works in modals
- [ ] Keyboard navigation (Tab, Esc)
- [ ] Touch targets are accessible

### Accessibility Tests
- [ ] Color contrast passes WCAG AA (4.5:1 for text)
- [ ] Focus rings visible on all interactive elements
- [ ] Screen reader announces theme changes

## Troubleshooting

### Theme doesn't apply immediately
- Check browser console for errors
- Verify `localStorage` contains `design-theme` key
- Clear Next.js cache: `rm -rf .next && npm run build`

### Colors look wrong
- Confirm HSL values are correct (not RGB/Hex)
- Check that `.dark` variant is defined for dark mode
- Verify all tokens are present (missing tokens fall back to root)

### Build fails
- Run `npm run build` to catch TypeScript errors
- Check for missing Radix UI packages
- Verify all imports resolve correctly

## File Structure

```
app/
├── globals.css              # Design tokens + theme classes
├── layout.tsx               # ThemeProvider wrapper
components/
├── theme-provider.tsx       # next-themes wrapper
├── theme-switcher.tsx       # UI for theme selection
├── FeedbackButton.tsx       # Example shadcn Dialog usage
├── layout/
│   ├── Sidebar.tsx          # Uses tokens (border-border, etc.)
│   └── Topbar.tsx           # Includes ThemeSwitcher
└── ui/                      # shadcn components (generated)
lib/
└── themes.ts                # Theme registry + helpers
```

## Future Enhancements

Consider these additions:

1. **More theme packs**: Add "Ocean", "Forest", "Monochrome", etc.
2. **Per-route themes**: Different themes for /picker vs /pilots
3. **Custom theme builder**: Let users create themes in-app
4. **Animate transitions**: Smooth color changes on theme switch
5. **Export themes**: Share custom themes as JSON

## Resources

- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [next-themes Docs](https://github.com/pacocoursey/next-themes)
- [Radix Colors](https://www.radix-ui.com/colors) (for inspiration)
- [tweakcn](https://tweakcn.com/) (premium theme packs)
- [HSL Color Picker](https://hslpicker.com/)

---

**Last Updated**: October 2025  
**Built with**: Next.js 14, shadcn/ui, Tailwind CSS, Radix UI

