'use client';

import { useSelectedLayoutSegment } from 'next/navigation';

import { ADMIN_META, type AdminPageKey } from '@/constants/adminMeta';

function isAdminPageKey(value: string): value is AdminPageKey {
  return value in ADMIN_META;
}

export default function AdminHeader() {
  const segment = useSelectedLayoutSegment();
  const page =
    segment && isAdminPageKey(segment) ? segment : 'dashboard';
  const { title, description } = ADMIN_META[page];

  return (
    <header className="fixed top-0 left-50 right-0 z-50 bg-white shadow-md flex justify-center">
      <div className="w-full max-w-7xl px-6 py-6 space-y-2">
        <h1 className="text-2xl font-bold text-zinc-950">{title}</h1>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
    </header>
  );
}
