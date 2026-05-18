import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const {
    email,
    password,
    name,
    nickname,
    belt,
    licenseNumber,
    ownerName,
    phone,
    address,
    businessFileUrl,
  } = await req.json();

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
    id: data.user.id,
    name,
    nickname,
    belt_level: belt,
    email_value: email,
    role: 'manager',
  });

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(data.user.id);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const { error: dojangError } = await supabaseAdmin.from('dojang').insert({
    profile_id: data.user.id,
    business_number: licenseNumber,
    representative: ownerName,
    phone_value: phone,
    address,
    business_file_url: businessFileUrl,
  });

  if (dojangError) {
    await supabaseAdmin.from('profiles').delete().eq('id', data.user.id);
    await supabaseAdmin.auth.admin.deleteUser(data.user.id);
    return NextResponse.json({ error: dojangError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
