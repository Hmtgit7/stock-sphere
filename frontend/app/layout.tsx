import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Navbar } from '@/components/layout/navbar';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { PortfolioProvider } from '@/context/portfolio-context';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StockSphere — Portfolio Dashboard',
  description: 'Live portfolio tracker with real-time market data',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <PortfolioProvider>
            <Navbar />
            <main className="pt-[72px] sm:pt-20">{children}</main>
          </PortfolioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
