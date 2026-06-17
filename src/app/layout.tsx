import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Providers from './providers';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Black Belt BJJ',
  description: '주짓수 수련자를 위한 올인원 커뮤니티 플랫폼',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={plusJakartaSans.variable}
      suppressHydrationWarning
    >
      <body className="bg-bg-page">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
