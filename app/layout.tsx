import type { Metadata } from 'next';
import './globals.css';
import { Merriweather, Source_Serif_4, JetBrains_Mono } from 'next/font/google';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { ThemeProvider } from '@/components/theme-provider';
import { ChatProvider } from '@/components/chat/ChatProvider';
import { ChatWidget } from '@/components/ChatWidget';
import { Analytics } from '@vercel/analytics/react';

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  display: 'swap',
  variable: '--font-sans',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Pilot Project Ideas for HDR',
  description: 'Explore and discover pilot project ideas across sectors',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${merriweather.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ChatProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto bg-background">
                  {children}
                </main>
              </div>
            </div>
            <ChatWidget />
            <Analytics />
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
