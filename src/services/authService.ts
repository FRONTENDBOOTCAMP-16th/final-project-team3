import { supabase } from '@/lib/supabase';

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
