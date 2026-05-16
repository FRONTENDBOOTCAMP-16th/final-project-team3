'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  useMyProfile,
  useMyPostCount,
  useMyCommentCount,
} from '@/hooks/useMyPage';
import ProfileCard from '@/components/mypage/ProfileCard';
import PostList from '@/components/mypage/PostList';
import SettingsTab from '@/components/mypage/SettingsTab';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import TabButton from '@/components/mypage/TabButton';

export type MyPageTab = 'posts' | 'settings';

export default function MyPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab = (searchParams.get('tab') as MyPageTab) ?? 'posts';
  const [tab, setTab] = useState<MyPageTab>(initialTab);

  const { data: profile, isLoading } = useMyProfile();
  const { data: postCount = 0 } = useMyPostCount();
  const { data: commentCount = 0 } = useMyCommentCount();

  const handleTabChange = (newTab: MyPageTab) => {
    setTab(newTab);
    router.replace(`/mypage?tab=${newTab}`);
  };

  useEffect(() => {
    if (!isLoading && !profile) {
      router.push('/login');
    }
  }, [isLoading, profile, router]);

  if (isLoading) return <LoadingSpinner />;
  if (!profile) return null;

  return (
    <main className="w-full min-h-screen">
      <header className="fixed top-0 left-50 right-0 z-10 bg-white shadow-sm flex justify-center">
        <div className="w-full max-w-7xl px-6 py-6">
          <h1 className="text-4xl font-bold text-text-primary">마이페이지</h1>
          <p className="text-sm text-text-secondary mt-2">
            내 프로필과 활동 내역
          </p>
        </div>
      </header>

      <div className="flex gap-6 p-6 pt-32">
        <aside className="w-96 shrink-0">
          <ProfileCard
            profile={profile}
            postCount={postCount}
            commentCount={commentCount}
          />
        </aside>

        <div className="flex-1 flex flex-col gap-4">
          <div role="tablist" className="flex gap-2">
            <TabButton
              label="게시글"
              isActive={tab === 'posts'}
              onClick={() => handleTabChange('posts')}
            />
            <TabButton
              label="설정"
              isActive={tab === 'settings'}
              onClick={() => handleTabChange('settings')}
            />
          </div>

          <div role="tabpanel">
            {tab === 'posts' ? (
              <PostList userId={profile.id} />
            ) : (
              <SettingsTab profile={profile} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
