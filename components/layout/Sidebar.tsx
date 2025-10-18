'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Pilots', href: '/pilots' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return static version during SSR
    return (
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-primary/20 lg:bg-background">
        <div className="flex h-16 items-center border-b border-primary/20 px-6">
          <h1 className="text-xl font-bold text-foreground">
            HDR Pilot Ideas
          </h1>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          <div className="h-10 w-full bg-muted/20 rounded-md" />
          <div className="h-10 w-full bg-muted/20 rounded-md" />
        </nav>
      </aside>
    );
  }

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-primary/20">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex h-16 items-center px-6 border-b border-primary/20">
          <h1 className="text-xl font-bold text-foreground">
            HDR Pilot Ideas
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6" aria-label="Main navigation">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      'hover:bg-accent hover:text-accent-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      isActive && 'bg-primary/10 text-foreground shadow-sm border-l-2 border-primary'
                    )}
                  >
                    {item.icon && <span className="text-lg">{item.icon}</span>}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
