import MyPageClient from './MyPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '마이페이지 | Activio',
  description: '내 프로필과 활동 내역을 확인하세요',
  robots: { index: false },
};

export default function Page() {
  return <MyPageClient />;
}
