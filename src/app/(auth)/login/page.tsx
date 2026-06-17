import { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: '로그인 | Activio',
  description: 'Activio 스포츠 커뮤니티에 로그인하세요.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LoginClient />;
}
