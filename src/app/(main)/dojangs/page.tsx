import DojangClient from '@/components/dojang/DojangClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '도장찾기 | Activio',
  description: '전국 스포츠 도장을 지도에서 찾아보세요. 인증 도장 정보 제공',
  openGraph: {
    title: '도장찾기 | Activio',
    description: '전국 주짓수 도장을 지도에서 찾아보세요. 인증 도장 정보 제공',
  },
};

export default function DojangsPage() {
  return <DojangClient />;
}
