import { supabase } from '@/lib/supabase';

// 일반 회원 가입
export async function registerGeneral({
  email,
  password,
  name,
  belt,
}: {
  email: string;
  password: string;
  name: string;
  belt: string;
}) {
  // 일반 - supabase auth 회원가입
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;

  // 일반 - profiles 테이블에 추가 정보 저장
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      name,
      belt_level: belt,
      email_value: email,
      role: 'user',
    })
    .eq('id', data.user!.id);
  if (profileError) throw profileError;
}

// 도장 회원 가입
export async function registerDojang({
  email,
  password,
  name,
  belt,
  licenseNumber,
  gymName,
  ownerName,
  phone,
  address,
  businessFileUrl,
}: {
  email: string;
  password: string;
  name: string;
  belt: string;
  licenseNumber: string;
  gymName: string;
  ownerName: string;
  phone: string;
  address: string;
  businessFileUrl?: string;
}) {
  // 도장 - supabase auth 회원가입
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;

  // 도장 - profiles 테이블에 추가 정보 저장
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      name,
      belt_level: belt,
      email_value: email,
      role: 'manager',
      business_number: licenseNumber,
      representative: ownerName,
      phone_value: phone,
      address,
      business_file_url: businessFileUrl,
    })
    .eq('id', data.user!.id);
  if (profileError) throw profileError;
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
