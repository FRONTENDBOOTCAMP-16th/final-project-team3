'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@/src/lib/queryClient';
import './globals.css';
import Sidebar from '../components/layout/Sidebar/sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-bg-page">
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-center" />
        </QueryClientProvider>
      </body>
    </html>
  );
}
