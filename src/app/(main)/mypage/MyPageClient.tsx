'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  useMyProfile,
  useMyPostCount,
  useMyCommentCount,
  useMyLikeCount,
  useMyBookmarkCount,
} from '@/hooks/useMyPage';
import PostList from '@/components/mypage/PostList';
import BookmarkList from '@/components/mypage/BookmarkList';
import SettingsTab from '@/components/mypage/SettingsTab';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { getSportBySlug } from '@/constants/sports';

export type MyPageTab = 'posts' | 'bookmarks' | 'settings';

export default function MyPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab = (searchParams.get('tab') as MyPageTab) ?? 'posts';
  const [tab, setTab] = useState<MyPageTab>(initialTab);

  const { data: profile, isLoading } = useMyProfile();
  const { data: postCount = 0 } = useMyPostCount();
  const { data: commentCount = 0 } = useMyCommentCount();
  const { data: likeCount = 0 } = useMyLikeCount();
  const { data: bookmarkCount = 0 } = useMyBookmarkCount();

  const handleTabChange = (newTab: MyPageTab) => {
    setTab(newTab);
    router.replace(`/mypage?tab=${newTab}`);
  };

  useEffect(() => {
    if (!isLoading && !profile) {
      router.push('/login');
    }
  }, [isLoading, profile, router]);

  if (isLoading) return <LoadingSpinner className="min-h-screen" />;
  if (!profile) return null;

  const sport = getSportBySlug(profile.belt_level ?? '');

  const STATS = [
    { num: postCount, label: '게시글' },
    { num: commentCount, label: '댓글' },
    { num: likeCount, label: '좋아요' },
    { num: bookmarkCount, label: '저장' },
  ];

  return (
    <div className="w-full min-h-screen" style={{ background: 'var(--color-bg-page)' }}>
      {/* ── Profile hero ── */}
      <section
        aria-label="프로필"
        className="px-4 pt-10 pb-8 md:px-12 md:pt-14 md:pb-12"
        style={{ background: 'var(--color-bg-surface-alt)', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}
      >
        <div
          className="flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-11 mx-auto text-center md:text-left"
          style={{ maxWidth: '980px' }}
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="flex items-center justify-center overflow-hidden"
              style={{
                width: '108px',
                height: '108px',
                borderRadius: '50%',
                background: 'var(--color-bg-tint)',
                border: '2px solid var(--color-border-medium)',
              }}
            >
              <Image
                src={profile.avatar_url ?? '/basic.svg'}
                alt={`${profile.nickname ?? '프로필'} 아바타`}
                width={108}
                height={108}
                className="rounded-full object-cover w-full h-full"
              />
            </div>
            {/* Online dot */}
            <div
              className="absolute"
              style={{
                bottom: '5px',
                right: '5px',
                width: '20px',
                height: '20px',
                background: '#2563eb',
                borderRadius: '50%',
                border: '3px solid var(--color-bg-surface-alt)',
              }}
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1
              className="font-extrabold text-white text-[32px] md:text-[50px]"
              style={{
                letterSpacing: '-0.03em',
                lineHeight: 1,
                marginBottom: '14px',
              }}
            >
              {profile.nickname ?? '닉네임 없음'}
            </h1>
            {sport && (
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '36px',
                    height: '3px',
                    background: sport.color,
                    borderRadius: '2px',
                    flexShrink: 0,
                  }}
                />
                <span
                  className="font-bold"
                  style={{
                    fontSize: '11px',
                    color: 'var(--color-text-secondary)',
                    letterSpacing: '0.14em',
                  }}
                >
                  {sport.icon} {sport.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Stats grid ── */}
      <section
        aria-label="활동 통계"
        style={{ background: 'var(--color-bg-page)', flexShrink: 0 }}
      >
        <div
          className="grid grid-cols-2 md:grid-cols-4 mx-auto"
          style={{
            maxWidth: '980px',
            gap: '1px',
            background: 'var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          {STATS.map(({ num, label }) => (
            <div
              key={label}
              className="p-5 md:p-7"
              style={{ background: 'var(--color-bg-page)' }}
            >
              <div
                className="font-extrabold"
                style={{
                  fontSize: '44px',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  marginBottom: '5px',
                  color: 'var(--color-text-primary)',
                }}
              >
                {num}
              </div>
              <div
                style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)' }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tabs ── */}
      <div
        className="sticky top-16 z-40 flex-shrink-0"
        style={{
          background: 'var(--color-bg-page)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div
          role="tablist"
          className="flex mx-auto px-4 md:px-12"
          style={{ maxWidth: '980px', gap: '30px' }}
        >
          {([
            { key: 'posts', label: '내 게시글' },
            { key: 'bookmarks', label: '저장한 게시글' },
            { key: 'settings', label: '설정' },
          ] as { key: MyPageTab; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => handleTabChange(key)}
              className="cursor-pointer bg-transparent border-none font-inherit whitespace-nowrap transition-all duration-200"
              style={{
                padding: '15px 0',
                fontSize: '13.5px',
                fontWeight: tab === key ? 600 : 500,
                color: tab === key ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                borderBottom: `2px solid ${tab === key ? '#2563eb' : 'transparent'}`,
                marginBottom: '-1px',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div
        className="mx-auto px-4 md:px-12"
        style={{
          maxWidth: '980px',
        }}
        role="tabpanel"
      >
        {tab === 'posts' && <PostList />}
        {tab === 'bookmarks' && <BookmarkList />}
        {tab === 'settings' && (
          <div className="py-8">
            <SettingsTab profile={profile} />
          </div>
        )}
      </div>
    </div>
  );
}
