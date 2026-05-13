import { Metadata } from 'next';
import LoginClient from './LoginClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '로그인 | Black Belt BJJ',
  description: '블랙벨트 주짓수 커뮤니티에 로그인하세요.',
  robots: { index: false },
};

export default function Page() {
  return <LoginClient />;
}
