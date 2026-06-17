import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSportBySlug } from '@/constants/sports';
import WriteClient from '@/components/community/WriteClient';

interface Props {
  params: Promise<{ sport: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sport: slug } = await params;
  const sport = getSportBySlug(slug);
  return {
    title: `${sport?.name ?? ''} 글쓰기 | Activio`,
    robots: { index: false },
  };
}

export default async function SportWritePage({ params }: Props) {
  const { sport: slug } = await params;
  const sport = getSportBySlug(slug);
  if (!sport) notFound();

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return <WriteClient sport={slug} />;
}
