import { supabase } from '@/lib/supabase';

// 일반 회원 가입
export async function registerGeneral({
  email,
  password,
  name,
  nickname,
  belt,
}: {
  email: string;
  password: string;
  name?: string;
  nickname: string;
  belt: string;
}) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('회원가입에 실패했습니다.');

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: data.user.id,
    name,
    nickname,
    belt_level: belt,
    email_value: email,
    role: 'user',
  });
  if (profileError) throw profileError;
}

// 도장 회원 가입
export async function registerDojang({
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
}: {
  email: string;
  password: string;
  name?: string;
  nickname: string;
  belt: string;
  licenseNumber: string;
  ownerName: string;
  phone: string;
  address: string;
  businessFileUrl?: string;
}) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('회원가입에 실패했습니다.');

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: data.user.id,
    name,
    nickname,
    belt_level: belt,
    email_value: email,
    role: 'manager',
  });
  if (profileError) throw profileError;

  const { error: dojangError } = await supabase.from('dojang').insert({
    profile_id: data.user.id,
    business_number: licenseNumber,
    representative: ownerName,
    phone_value: phone,
    address,
    business_file_url: businessFileUrl,
  });
  if (dojangError) throw dojangError;
}

// 사업자등록증 파일 업로드
export async function uploadBusinessFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('business-files')
    .upload(fileName, file);
  if (error) throw error;

  const { data } = supabase.storage
    .from('business-files')
    .getPublicUrl(fileName);
  return data.publicUrl;
}
