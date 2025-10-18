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
  { label: 'Home', href: '/', icon: '🏠' },
  { label: 'Pilots', href: '/pilots', icon: '📋' },
  { label: 'Pilot Picker (AI Powered)', href: '/picker', icon: '🤖' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-primary/20">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex h-16 items-center px-6 border-b border-primary/20">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Pilot Project Ideas for HDR
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
                      isActive && 'bg-gradient-to-r from-primary/20 to-accent/20 text-foreground shadow-sm border-l-2 border-primary'
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
