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
    <header
      className="fixed top-0 left-50 right-0 z-50 flex justify-center"
      style={{
        background: '#1e1e1e',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <div className="w-full max-w-7xl px-6 py-6 space-y-2">
        <h1 className="text-2xl font-bold" style={{ color: 'rgba(255,255,255,0.92)' }}>{title}</h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{description}</p>
      </div>
    </header>
  );
}
