'use client';

import Image from 'next/image';
import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import Postcard from '@/components/community/Postcard';
import PromoAdSidebar from '@/components/community/PromoAdSidebar';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useSportPosts } from '@/hooks/useCommunity';
import { useAuth } from '@/hooks/useAuth';
import { SPORTS } from '@/constants/sports';
import type { Post } from '@/types/community';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useCommunityListState } from '@/hooks/useCommunityListState';

interface SportCommunityClientProps {
  initialPosts: Post[];
  sport: { slug: string; name: string; icon: string; hero: string; heroPos: string; color: string };
}

export default function SportCommunityClient({ initialPosts, sport }: SportCommunityClientProps) {
  const { searchQuery, setSearchQuery, debouncedSearch, hoveredSlug, setHoveredSlug, isScrollRestoredRef } =
    useCommunityListState();
  const { user, loading } = useAuth();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSportPosts(sport.slug, initialPosts);

  const posts = useMemo(() => data.pages.flatMap((page) => page), [data]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      post.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [posts, debouncedSearch]);

  useEffect(() => {
    const lastPostId = sessionStorage.getItem('lastPostId');
    if (isScrollRestoredRef.current || !lastPostId) return;
    if (filteredPosts.length > 0) {
      const timer = setTimeout(() => {
        const el = document.getElementById(lastPostId);
        if (el) {
          el.scrollIntoView({ block: 'center', behavior: 'instant' });
          sessionStorage.removeItem('lastPostId');
          isScrollRestoredRef.current = true;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [filteredPosts]);

  const observerRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  });

  return (
    <section
      className="w-full min-h-screen"
      style={{ background: '#111' }}
      aria-label={`${sport.name} 커뮤니티`}
    >
      {/* ── Hero ── */}
      <div className="relative h-[320px] overflow-hidden flex items-end">
        <Image
          fill
          src={sport.hero}
          alt=""
          aria-hidden="true"
          style={{ objectFit: 'cover', objectPosition: sport.heroPos, opacity: 0.38, filter: 'grayscale(10%)' }}
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(17,17,17,0.96) 0%, rgba(17,17,17,0.45) 60%, rgba(17,17,17,0.2) 100%)' }}
        />
        <div className="relative z-10 px-6 pb-5 flex items-end gap-3">
          <span style={{ fontSize: '36px', lineHeight: 1 }}>{sport.icon}</span>
          <h1 className="font-extrabold text-white text-[38px] leading-none tracking-[-0.04em]">
            {sport.name}
          </h1>
        </div>
      </div>

      {/* ── 3-column layout ── */}
      <div className="max-w-[1200px] mx-auto px-4 py-6 flex gap-5 items-start">

        {/* ── Left sidebar: Promo Ad ── */}
        <aside
          className="hidden lg:flex flex-col shrink-0"
          style={{
            width: '220px',
            position: 'sticky',
            top: '80px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <PromoAdSidebar />
        </aside>

        {/* ── Center: search/write + posts ── */}
        <section className="flex-1 min-w-0">
          {/* Search + write */}
          <div
            className="flex items-center gap-3 mb-4"
            style={{
              position: 'sticky',
              top: '64px',
              zIndex: 10,
              background: '#111',
              padding: '10px 0',
              marginTop: '-10px',
            }}
          >
            <div
              className="flex items-center gap-2 flex-1 h-10"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '999px',
                padding: '0 16px',
              }}
            >
              <Search size={14} style={{ opacity: 0.4, flexShrink: 0 }} aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`${sport.name} 게시글 검색...`}
                aria-label="게시글 검색"
                className="flex-1 bg-transparent border-none outline-none text-white min-w-0"
                style={{ fontSize: '13.5px' }}
              />
            </div>

            {!loading && user && (
              <Link
                href={`/community/sport/${sport.slug}/write`}
                className="shrink-0 h-10 flex items-center rounded-full text-white text-[13px] font-semibold whitespace-nowrap"
                style={{ background: sport.color, padding: '0 20px', transition: 'opacity 0.15s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              >
                글쓰기
              </Link>
            )}
          </div>

          {/* Posts */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : filteredPosts.length > 0 ? (
            <div
              role="list"
              aria-label={`${sport.name} 게시글 목록`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  id={post.id}
                  role="listitem"
                  onClick={() => sessionStorage.setItem('lastPostId', post.id)}
                >
                  <Postcard
                    post={{
                      ...post,
                      nickname: post.nickname ?? '알 수 없음',
                      avatar_url: post.avatar_url ?? '',
                      image_url: post.image_url ?? null,
                      video_url: post.video_url ?? null,
                    }}
                    userId={user?.id ?? ''}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-32"
              aria-live="polite"
              style={{ color: 'rgba(255,255,255,0.38)' }}
            >
              <p style={{ fontSize: '32px', marginBottom: '12px' }}>{sport.icon}</p>
              <p style={{ fontSize: '15px' }}>{sport.name} 커뮤니티의 첫 글을 작성해보세요</p>
            </div>
          )}

          {hasNextPage && (
            <div ref={observerRef} className="h-16 flex items-center justify-center">
              <div role="status" aria-live="polite" aria-label={isFetchingNextPage ? '더 불러오는 중' : ''}>
                {isFetchingNextPage && (
                  <div
                    className="w-6 h-6 border-2 rounded-full animate-spin"
                    style={{ borderColor: sport.color, borderTopColor: 'transparent' }}
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>
          )}
        </section>

        {/* ── Right sidebar: other sports ── */}
        <aside
          className="hidden lg:flex flex-col shrink-0"
          style={{
            width: '260px',
            position: 'sticky',
            top: '80px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
            }}
          >
            스포츠 커뮤니티
          </div>

          <div style={{ padding: '6px 0' }}>
            {/* 공지 링크 */}
            <Link
              href="/community"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                background: hoveredSlug === '__community' ? 'rgba(255,255,255,0.04)' : 'transparent',
                borderLeft: `3px solid ${hoveredSlug === '__community' ? '#2563eb' : 'transparent'}`,
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={() => setHoveredSlug('__community')}
              onMouseLeave={() => setHoveredSlug(null)}
            >
              <div
                style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: 'rgba(37,99,235,0.15)', border: '1.5px solid rgba(37,99,235,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '17px', flexShrink: 0,
                }}
              >
                📢
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>공지</span>
            </Link>

            {SPORTS.map(({ slug, name, image, color }) => {
              const isActive = slug === sport.slug;
              if (isActive) {
                return (
                  <div
                    key={slug}
                    className="flex items-center gap-3"
                    style={{
                      padding: '10px 16px',
                      background: 'rgba(255,255,255,0.07)',
                      borderLeft: `3px solid ${color}`,
                    }}
                  >
                    <div
                      style={{
                        width: '34px', height: '34px', borderRadius: '50%',
                        background: color + '1a', border: `1.5px solid ${color}66`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Image src={image} alt={name} width={20} height={20} style={{ objectFit: 'contain' }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{name}</span>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, marginLeft: 'auto', flexShrink: 0 }} />
                  </div>
                );
              }
              return (
                <Link
                  key={slug}
                  href={`/community/sport/${slug}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 16px',
                    background: hoveredSlug === slug ? 'rgba(255,255,255,0.04)' : 'transparent',
                    borderLeft: `3px solid ${hoveredSlug === slug ? color : 'transparent'}`,
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={() => setHoveredSlug(slug)}
                  onMouseLeave={() => setHoveredSlug(null)}
                >
                  <div
                    style={{
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: color + '1a', border: `1.5px solid ${color}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Image src={image} alt={name} width={20} height={20} style={{ objectFit: 'contain' }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{name}</span>
                </Link>
              );
            })}
          </div>
        </aside>
      </div>

      <div style={{ paddingBottom: '64px' }} />
    </section>
  );
}
