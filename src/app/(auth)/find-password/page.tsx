import { Metadata } from 'next';
import FindPasswordClient from './FindPasswordClient';

export const metadata: Metadata = {
  title: '비밀번호 찾기 | Black Belt BJJ',
  description: '이름과 이메일로 비밀번호를 재설정하세요.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <FindPasswordClient />;
}
