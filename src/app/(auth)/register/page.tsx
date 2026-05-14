import { Metadata } from 'next';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
  title: '회원가입 | Black Belt BJJ',
  description: '블랙벨트 주짓수 커뮤니티에 가입하세요.',
  robots: { index: false },
};

export default function Page() {
  return <RegisterClient />;
}
