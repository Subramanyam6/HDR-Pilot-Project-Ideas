'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { FeedbackButton } from '@/components/FeedbackButton';

export function Topbar() {
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
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Pilot Project Ideas for HDR
              </h1>
            </div>
            <nav className="flex-1 space-y-2">
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start">
                  <span className="mr-2">🏠</span>
                  Home
                </Button>
              </Link>
              <Link href="/pilots">
                <Button variant="ghost" className="w-full justify-start">
                  <span className="mr-2">📋</span>
                  Pilots
                </Button>
              </Link>
              <Link href="/picker">
                <Button variant="ghost" className="w-full justify-start">
                  <span className="mr-2">🤖</span>
                  Pilot Picker (AI Powered)
                </Button>
              </Link>
            </nav>
          </div>
        </SheetContent>
        </Sheet>
        
        {/* Title - visible on mobile */}
        <h1 className="md:hidden text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Pilot Project Ideas for HDR
        </h1>
      </div>

      {/* Search */}
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

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <FeedbackButton />
        <ThemeSwitcher />
      </div>
    </header>
  );
}
