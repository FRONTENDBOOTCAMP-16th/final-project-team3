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
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, nickname, belt }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error);
  }
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
  const res = await fetch('/api/register-dojang', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
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
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error);
  }
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
// 로그인
export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  const { data: profile } = await supabase
    .from('profiles')
    .select('nickname, role')
    .eq('id', data.user.id)
    .single();

  return { user: data.user, profile };
}
