'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Share2 } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { categoryMap } from '@/constants/categoryMap';
import { buildPostUrl } from '@/lib/slug';
import PostLikeButton from '@/components/community/PostLikeButton';
import BookmarkButton from '@/components/community/BookmarkButton';
import LoadingSpinner from '../common/LoadingSpinner';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    category: string;
    nickname: string;
    avatar_url?: string;
    image_url?: string | null;
    video_url?: string | null;
    created_at: string;
    comment_count: number;
  };
  userId: string;
}

export default function PostCard({ post, userId }: PostCardProps) {
  const categoryInfo = categoryMap[post.category] ?? categoryMap.personal;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const hasMedia = !!post.image_url || !!post.video_url;

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
    e.preventDefault();
    startTransition(() => {
      router.push(buildPostUrl(post.title, post.id));
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard?.writeText(
      window.location.origin + buildPostUrl(post.title, post.id),
    );
  };

  return (
    <article
      style={{
        background: '#161616',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#1c1c1c')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#161616')}
      aria-busy={isPending}
    >
      {isPending && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.55)' }}
        >
          <LoadingSpinner label="게시글 불러오는 중" />
        </div>
      )}

      {/* ── Content ── */}
      <Link
        href={buildPostUrl(post.title, post.id)}
        onClick={handleNavigate}
        aria-label={`${post.title} 게시글 상세보기`}
        className="block"
        style={{ padding: '14px 16px 0' }}
      >
        {/* Author row */}
        <div className="flex items-center gap-2 mb-2.5" style={{ flexWrap: 'wrap' }}>
          <div
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              overflow: 'hidden',
              flexShrink: 0,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {post.avatar_url ? (
              <Image src={post.avatar_url} alt={post.nickname} fill className="object-cover" />
            ) : (
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.75)' }}>
                {post.nickname?.[0]?.toUpperCase() ?? '?'}
              </span>
            )}
          </div>

          <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
            {post.nickname}
          </span>

          <span
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              color: '#60a5fa',
              background: 'rgba(59,130,246,0.1)',
              padding: '1.5px 8px',
              borderRadius: '999px',
            }}
          >
            {categoryInfo.label}
          </span>

          <time
            dateTime={post.created_at}
            style={{ marginLeft: 'auto', fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}
          >
            {formatDate(post.created_at)}
          </time>
        </div>

        {/* Title */}
        <h2
          className="line-clamp-2"
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#f5f5f5',
            lineHeight: 1.4,
            letterSpacing: '-0.01em',
            marginBottom: '6px',
          }}
        >
          {post.title}
        </h2>

        {/* Body */}
        {post.content && (
          <p
            className={hasMedia ? 'line-clamp-2' : 'line-clamp-3'}
            style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.65,
              marginBottom: hasMedia ? '10px' : '0',
            }}
          >
            {post.content}
          </p>
        )}

        {/* Media */}
        {post.video_url && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ borderRadius: '8px', overflow: 'hidden', marginTop: '2px', background: '#000' }}
          >
            <video
              src={post.video_url}
              controls
              preload="metadata"
              style={{ width: '100%', maxHeight: '320px', display: 'block' }}
            />
          </div>
        )}

        {!post.video_url && post.image_url && (
          <div
            style={{ borderRadius: '8px', overflow: 'hidden', maxHeight: '300px', position: 'relative', marginTop: '2px' }}
          >
            <Image
              src={post.image_url}
              alt={post.title}
              width={800}
              height={300}
              className="w-full object-cover"
              style={{ maxHeight: '300px', display: 'block' }}
            />
          </div>
        )}
      </Link>

      {/* ── Action bar ── */}
      <div
        className="flex items-center gap-0.5"
        style={{ padding: '4px 12px 8px 12px' }}
      >
        <ActionBtn onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <MessageSquare size={13} strokeWidth={2} />
          <span>{post.comment_count ?? 0} 댓글</span>
        </ActionBtn>

        <ActionBtn onClick={handleShare}>
          <Share2 size={13} strokeWidth={2} />
          <span>공유</span>
        </ActionBtn>

        <div
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <PostLikeButton postId={post.id} userId={userId || null} variant="card" />
        </div>

        <BookmarkButton postId={post.id} userId={userId || null} />
      </div>
    </article>
  );
}

/* ── tiny helper ── */
function ActionBtn({
  children,
  onClick,
  active,
  activeColor,
  style: extraStyle,
  ...rest
}: {
  children: React.ReactNode;
  onClick: (_e: React.MouseEvent<HTMLButtonElement>) => void;
  active?: boolean;
  activeColor?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '5px 9px',
        background: 'transparent',
        border: 'none',
        borderRadius: '999px',
        color: active && activeColor ? activeColor : 'rgba(255,255,255,0.55)',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background 0.15s, color 0.15s',
        fontFamily: 'inherit',
        ...extraStyle,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
        if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'transparent';
        (e.currentTarget as HTMLElement).style.color =
          active && activeColor ? activeColor : 'rgba(255,255,255,0.55)';
      }}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
