import DojangClient from '@/components/dojang/DojangClient';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
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
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    },
  );
  const { data } = await supabase.from('dojang').select('name');

  return (
    <DojangClient initialVerifiedDojangs={data?.map((d) => d.name) ?? []} />
  );
}
