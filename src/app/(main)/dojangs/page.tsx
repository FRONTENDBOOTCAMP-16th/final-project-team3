import DojangClient from '@/components/dojang/DojangClient';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

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
