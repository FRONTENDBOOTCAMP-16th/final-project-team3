import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidateTag } from 'next/cache';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc('increment_view_count', { post_id: id });

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  revalidateTag(`post-${id}`, { expire: 0 });
  return NextResponse.json({ success: true });
}
