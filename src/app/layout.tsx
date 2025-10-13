import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import './globals.css';

export const metadata: Metadata = {
  title: 'Türkçe Kart',
  description: 'Learn Turkish with flashcards!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn(
        'font-body antialiased h-full',
      )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
