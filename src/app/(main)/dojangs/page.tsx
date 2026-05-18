import DojangClient from '@/components/dojang/DojangClient';
import { supabasePublic } from '@/lib/supabase/public';
import { cacheTag, cacheLife } from 'next/cache';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '도장찾기 | Black Belt BJJ',
  description: '전국 주짓수 도장을 지도에서 찾아보세요. 인증 도장 정보 제공',
  openGraph: {
    title: '도장찾기 | Black Belt BJJ',
    description: '전국 주짓수 도장을 지도에서 찾아보세요. 인증 도장 정보 제공',
  },
};

async function getDojangs() {
  'use cache';
  cacheTag('dojangs');
  cacheLife('hours');

  const { data } = await supabasePublic.from('dojang').select('name');
  return data?.map((d) => d.name) ?? [];
}

async function DojangContent() {
  const initialVerifiedDojangs = await getDojangs();
  return <DojangClient initialVerifiedDojangs={initialVerifiedDojangs} />;
}

export default function DojangsPage() {
  return <DojangContent />;
}
