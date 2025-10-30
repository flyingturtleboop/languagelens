'use client';

import './globals.css';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Hide Navbar/Footer on dashboard routes only
  const hideChrome = pathname?.startsWith('/dashboard');

  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <AuthProvider>
          {!hideChrome && <Navbar />}
          {children}
          {!hideChrome && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}
