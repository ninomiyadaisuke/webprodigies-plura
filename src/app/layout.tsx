import { DM_Sans } from 'next/font/google';

import { ThemeProvider } from '@/providers/theme-provider';

import type { Metadata } from 'next';

import './globals.css';
import ModalProvider from '@/providers/modal-provider';

import { Toaster } from '@/components/ui/toaster';

const font = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plura',
  description: 'Plura is a platform for running your agency in one place',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
          <ModalProvider>
            {children}
            <Toaster />
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
