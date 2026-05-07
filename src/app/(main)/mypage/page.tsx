'use client';

import { useState } from 'react';
import { useMyProfile } from '@/hooks/useMyPage';
import ProfileCard from '@/components/mypage/ProfileCard';
import PostList from '@/components/mypage/PostList';
import SettingsTab from '@/components/mypage/SettingsTab';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MyPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'posts' | 'settings'>('posts');
  const { data: profile, isLoading } = useMyProfile();

  useEffect(() => {
    if (!isLoading && !profile) {
      router.push('/login');
    }
  }, [isLoading, profile, router]);

  if (isLoading) return <LoadingSpinner />;
  if (!profile) return null;

  return (
    <div className="flex flex-col">
      {/* 헤더 */}
      <div className="flex flex-col gap-1 px-6 py-6 bg-white z-10 shadow-md">
        <h1 className="text-4xl font-bold text-text-primary">마이페이지</h1>
        <p className="text-sm text-text-secondary">내 프로필과 활동 내역</p>
      </div>

      <div className="flex gap-6 p-6">
        {/* 프로필 카드 */}
        <div className="w-96 shrink-0">
          <ProfileCard profile={profile} />
        </div>

        {/* 오른쪽 컨텐츠 */}
        <div className="flex-1 flex flex-col gap-4">
          {/* 탭 */}
          <div className="flex gap-2">
            <button
              onClick={() => setTab('posts')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm border cursor-pointer ${
                tab === 'posts'
                  ? 'bg-btn-focus text-btn-focus-text border-btn-focus'
                  : 'bg-bg-white text-text-secondary border-gray-100 hover:text-text-primary'
              }`}
            >
              게시글
            </button>
            <button
              onClick={() => setTab('settings')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm border cursor-pointer ${
                tab === 'settings'
                  ? 'bg-btn-focus text-btn-focus-text border-btn-focus'
                  : 'bg-bg-white text-text-secondary border-gray-100 hover:text-text-primary'
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
    </div>
  );
}
