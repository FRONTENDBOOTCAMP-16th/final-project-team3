import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  console.log('view count 호출됨:', id);
  const supabase = await createSupabaseServerClient();
  const result = await supabase.rpc('increment_view_count', { post_id: id });
  console.log('result:', result);
  return NextResponse.json({ success: true });
}
