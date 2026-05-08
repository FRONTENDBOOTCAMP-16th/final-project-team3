'use client';

import { useState, useEffect } from 'react';
import {
  useMyProfile,
  useMyPostCount,
  useMyCommentCount,
} from '@/hooks/useMyPage';
import ProfileCard from '@/components/mypage/ProfileCard';
import PostList from '@/components/mypage/PostList';
import SettingsTab from '@/components/mypage/SettingsTab';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useSearchParams, useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

export default function MyPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab =
    (searchParams.get('tab') as 'posts' | 'settings') ?? 'posts';
  const [tab, setTab] = useState<'posts' | 'settings'>(initialTab);

  const { data: profile, isLoading } = useMyProfile();
  const authUser = useAuthStore((state) => state.user);
  const { data: postCount = 0 } = useMyPostCount();
  const { data: commentCount = 0 } = useMyCommentCount();

  const handleTabChange = (newTab: 'posts' | 'settings') => {
    setTab(newTab);
    router.replace(`/mypage?tab=${newTab}`);
  };

  useEffect(() => {
    if (!isLoading && !profile) {
      router.push('/login');
    }
  }, [isLoading, profile, authUser, router]);

  if (isLoading) return <LoadingSpinner />;
  if (!profile) return null;

  return (
    <main className="w-full min-h-screen">
      {/* 헤더 */}
      <div className="fixed top-0 left-50 right-0 z-10 bg-white shadow-sm flex justify-center">
        <div className="w-full max-w-7xl px-6 py-6">
          <h1 className="text-4xl font-bold text-text-primary">마이페이지</h1>
          <p className="text-sm text-text-secondary">내 프로필과 활동 내역</p>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="flex gap-6 p-6 pt-32">
        {/* 프로필 카드 */}
        <div className="w-96 shrink-0">
          <ProfileCard
            profile={profile}
            postCount={postCount}
            commentCount={commentCount}
          />
        </div>

        {/* 오른쪽 컨텐츠 */}
        <div className="flex-1 flex flex-col gap-4">
          {/* 탭 */}
          <div className="flex gap-2">
            <button
              onClick={() => handleTabChange('posts')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm border cursor-pointer ${
                tab === 'posts'
                  ? 'bg-btn-focus text-btn-focus-text border-btn-focus'
                  : 'bg-bg-white text-text-secondary border-gray-100 hover:text-text-primary'
              }`}
            >
              게시글
            </button>
            <button
              onClick={() => handleTabChange('settings')}
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
    </main>
  );
}
