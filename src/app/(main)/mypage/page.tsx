'use client';

import { useState } from 'react';
import { useMyProfile } from '@/hooks/useMyPage';
import ProfileCard from '@/components/mypage/ProfileCard';
import PostList from '@/components/mypage/PostList';
import SettingsTab from '@/components/mypage/SettingsTab';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function MyPage() {
  const [tab, setTab] = useState<'posts' | 'settings'>('posts');
  const { data: profile, isLoading } = useMyProfile();

  if (isLoading) return <LoadingSpinner />;
  if (!profile) return null;

  return (
    <div className="flex gap-6 p-6">
      {/* 프로필 카드 (고정) */}
      <div className="w-56 shrink-0">
        <ProfileCard profile={profile} />
      </div>

      {/* 오른쪽 컨텐츠 */}
      <div className="flex-1 flex flex-col gap-4">
        {/* 탭 */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab('posts')}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
              tab === 'posts'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            게시글
          </button>
          <button
            onClick={() => setTab('settings')}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
              tab === 'settings'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            설정
          </button>
        </div>

        {/* 탭 컨텐츠 */}
        {tab === 'posts' ? (
          <PostList userId={profile.id} />
        ) : (
          <SettingsTab profile={profile} />
        )}
      </div>
    </div>
  );
}
