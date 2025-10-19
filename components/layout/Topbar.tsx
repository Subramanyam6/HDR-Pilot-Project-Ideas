'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';

export function Topbar() {
  const pathname = usePathname() ?? '/';
  const showSearch = !(pathname.startsWith('/pilots') || pathname === '/');

  return (
    <header className="flex h-16 items-center justify-between border-b border-primary/20 px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="flex flex-col h-full">
              <div className="flex h-16 items-center border-b border-primary/20 mb-6">
                <h1 className="text-xl font-bold text-foreground">
                  HDR Pilot Ideas
                </h1>
              </div>
            <nav className="flex-1 space-y-2">
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href="/">
                  Home
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href="/pilots">
                  Pilots
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href="/picker">
                  Pilot Picker
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href="/about">
                  About
                </Link>
              </Button>
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Title - visible on mobile */}
        <h1 className="md:hidden text-lg font-bold text-foreground">
          HDR Pilot Ideas
        </h1>
      </div>

      {/* Search */}
      {showSearch ? (
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search pilots..."
              className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
      </div>
    </header>
  );
}
