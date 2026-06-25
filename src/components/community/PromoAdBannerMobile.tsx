'use client';

import Link from 'next/link';
import { useState, useRef, useCallback, useEffect } from 'react';
import { usePromoPosts } from '@/hooks/useCommunity';
import { buildPostUrl } from '@/lib/slug';

export default function PromoAdBannerMobile() {
  const { data: posts = [] } = usePromoPosts();
  const [activeGroup, setActiveGroup] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const totalGroups = Math.ceil(posts.length / 2);
  const groups = Array.from({ length: totalGroups }, (_, i) =>
    posts.slice(i * 2, (i + 1) * 2),
  );

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!scrollRef.current) return;
      const { scrollLeft, clientWidth } = scrollRef.current;
      if (clientWidth === 0) return;
      setActiveGroup(Math.round(scrollLeft / clientWidth));
    });
  }, []);

  const scrollToGroup = useCallback((i: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: i * scrollRef.current.clientWidth, behavior: 'smooth' });
  }, []);

  if (posts.length === 0) return null;

  return (
    <div className="lg:hidden mb-4">
      {/* 스크롤 컨테이너: 각 그룹이 뷰포트 전체 너비를 차지해 2개씩 페이지 전환 */}
      <div
        ref={scrollRef}
        role="region"
        aria-label="홍보 게시글 슬라이더"
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          paddingBottom: '4px',
        }}
        onScroll={handleScroll}
      >
        {groups.map((group, groupIdx) => (
          <div
            key={groupIdx}
            style={{
              flex: '0 0 100%',
              scrollSnapAlign: 'start',
              display: 'flex',
              gap: '12px',
            }}
          >
            {group.map((post) => (
              <Link
                key={post.id}
                href={buildPostUrl(post.title, post.id)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  textDecoration: 'none',
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-medium)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  transition: 'opacity 0.12s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
              >
                <p
                  style={{
                    fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: 'var(--color-text-disabled)', marginBottom: '2px',
                  }}
                >
                  홍보
                </p>
                {post.nickname && (
                  <p
                    style={{
                      fontSize: '10px', color: 'var(--color-text-hint)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                  >
                    {post.nickname}
                  </p>
                )}
                <p
                  style={{
                    fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-high)',
                    lineHeight: 1.35,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.title}
                </p>
                <p
                  style={{
                    fontSize: '10.5px', color: 'var(--color-text-disabled)', marginTop: '2px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}
                >
                  {post.content.slice(0, 35)}
                </p>
              </Link>
            ))}
            {/* 마지막 그룹 홀수인 경우 빈 슬롯으로 레이아웃 유지 */}
            {group.length < 2 && <div style={{ flex: 1, minWidth: 0 }} />}
          </div>
        ))}
      </div>

      {/* 점 인디케이터 */}
      {totalGroups > 1 && (
        <div
          className="flex items-center justify-center"
          style={{ gap: '5px', marginTop: '8px' }}
        >
          {groups.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToGroup(i)}
              aria-label={`${i + 1}번째 그룹으로 이동`}
              aria-current={i === activeGroup ? 'true' : undefined}
              style={{
                padding: '6px 4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: i === activeGroup ? '16px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i === activeGroup ? '#2563eb' : 'var(--color-text-disabled)',
                  transition: 'all 0.3s',
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
