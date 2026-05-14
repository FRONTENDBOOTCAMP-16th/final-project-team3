import DojangClient from '@/components/dojang/DojangClient';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '도장찾기 | Black Belt BJJ',
  description: '전국 주짓수 도장을 지도에서 찾아보세요. 인증 도장 정보 제공',
  openGraph: {
    title: '도장찾기 | Black Belt BJJ',
    description: '전국 주짓수 도장을 지도에서 찾아보세요. 인증 도장 정보 제공',
  },
};

export const revalidate = 3600; // 도장 정보는 자주 안 바뀌므로 1시간 캐시

export default async function DojangsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from('dojang').select('name');

  return (
    <DojangClient initialVerifiedDojangs={data?.map((d) => d.name) ?? []} />
  );
}
