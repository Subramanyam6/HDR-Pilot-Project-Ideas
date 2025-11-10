'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ExternalLink, Github } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Pilots', href: '/pilots' },
  { label: 'About', href: '/about' },
];

export function Sidebar() {
  const pathname = usePathname() ?? '/';

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

          <div className="mt-6 border-t border-primary/15 pt-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold tracking-tight text-foreground">
              <span className="text-lg md:text-xl">Demos</span>
              <span
                className="flex h-8 w-8 items-center justify-center text-[0.525rem] font-black uppercase tracking-[0.16em] text-white text-center drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]"
                style={{
                  clipPath:
                    'polygon(98.00% 50.00%, 92.47% 56.73%, 95.65% 64.83%, 88.31% 69.52%, 88.83% 78.21%, 80.41% 80.41%, 78.21% 88.83%, 69.52% 88.31%, 64.83% 95.65%, 56.73% 92.47%, 50.00% 98.00%, 43.27% 92.47%, 35.17% 95.65%, 30.48% 88.31%, 21.79% 88.83%, 19.59% 80.41%, 11.17% 78.21%, 11.69% 69.52%, 4.35% 64.83%, 7.53% 56.73%, 2.00% 50.00%, 7.53% 43.27%, 4.35% 35.17%, 11.69% 30.48%, 11.17% 21.79%, 19.59% 19.59%, 21.79% 11.17%, 30.48% 11.69%, 35.17% 4.35%, 43.27% 7.53%, 50.00% 2.00%, 56.73% 7.53%, 64.83% 4.35%, 69.52% 11.69%, 78.21% 11.17%, 80.41% 19.59%, 88.83% 21.79%, 88.31% 30.48%, 95.65% 35.17%, 92.47% 43.27%)',
                  lineHeight: 1,
                  animation: 'badge-flash 1.08s steps(7) infinite',
                }}
              >
                NEW
              </span>
            </div>
            <Link
              href="https://huggingface.co/spaces/Subramanyam6/HDR_AI_Proposal_Verification_Assistant_V2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-md border border-transparent px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-primary/5"
            >
              <div>
                <span className="block">1. AI Proposal</span>
                <span className="block text-muted-foreground">Verification Assistant</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </Link>
          </div>
        </nav>
        <div className="px-4 pb-6">
          <a
            href="https://github.com/Subramanyam6/HDR-Pilot-Project-Ideas"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-white transition-transform duration-200 btn-github-gradient focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
            onMouseEnter={(event) => {
              event.currentTarget.classList.add('animate-wiggle-soft');
            }}
            onAnimationEnd={(event) => {
              event.currentTarget.classList.remove('animate-wiggle-soft');
            }}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <Github className="h-4 w-4 text-white" />
            </span>
            GitHub
          </a>
        </div>
      </div>
    </aside>
  );
}
