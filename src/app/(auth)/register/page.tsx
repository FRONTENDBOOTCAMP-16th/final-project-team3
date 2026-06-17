import { Metadata } from 'next';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
  title: '회원가입 | Activio',
  description: 'Activio 스포츠 커뮤니티에 가입하세요.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <RegisterClient />;
}
