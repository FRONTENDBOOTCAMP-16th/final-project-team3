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
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* 프로필 카드 */}
      <ProfileCard profile={profile} />

      {/* 탭 */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setTab('posts')}
          className={`flex-1 pb-3 text-sm font-bold transition-all cursor-pointer ${
            tab === 'posts'
              ? 'text-btn-focus border-b-2 border-btn-focus -mb-px'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          게시글
        </button>
        <button
          onClick={() => setTab('settings')}
          className={`flex-1 pb-3 text-sm font-bold transition-all cursor-pointer ${
            tab === 'settings'
              ? 'text-btn-focus border-b-2 border-btn-focus -mb-px'
              : 'text-gray-400 hover:text-gray-600'
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
  );
}
