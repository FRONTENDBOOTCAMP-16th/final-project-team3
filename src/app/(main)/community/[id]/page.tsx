'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getPost,
  getComments,
  createComment,
  deletePost,
  deleteComment,
} from '@/services/communityService';
import { supabase } from '@/lib/supabase';
import type { Post, Comment } from '@/types/community';
import Image from 'next/image';
import LoadingSpinner from '@/components/common/LoadingSpinner';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  return `${Math.floor(hr / 24)}일 전`;
}

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [
          postData,
          commentsData,
          {
            data: { user },
          },
        ] = await Promise.all([
          getPost(id),
          getComments(id),
          supabase.auth.getUser(),
        ]);
        setPost(postData);
        setComments(commentsData);
        setUserId(user?.id ?? null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!comment.trim() || !userId) return;
    try {
      const newComment = await createComment({
        post_id: id,
        user_id: userId,
        content: comment,
      });
      setComments((prev) => [...prev, newComment]);
      setComment('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('게시글을 삭제하시겠습니까?')) return;
    try {
      await deletePost(id);
      router.push('/community');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <LoadingSpinner />
      </div>
    );
  if (!post)
    return (
      <div className="flex justify-center p-20 text-gray-400">
        게시글을 찾을 수 없습니다.
      </div>
    );

  const isOwner = userId === post.user_id;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 mb-4 block"
      >
        ← 목록으로
      </button>

      {/* 작성자 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden">
            {post.avatar_url && (
              <Image
                src={post.avatar_url}
                alt="avatar"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold">
                {post.nickname ?? '알 수 없음'}
              </span>
              {post.belt_level && (
                <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                  {post.belt_level}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">{timeAgo(post.created_at)}</p>
          </div>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/community/${id}/edit`)}
              className="text-sm text-gray-500"
            >
              ✏️
            </button>
            <button onClick={handleDeletePost} className="text-sm text-red-400">
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* 제목 */}
      <h1 className="text-xl font-bold mb-4">{post.title}</h1>

      {/* 이미지 */}
      {post.image_url && (
        <Image
          src={post.image_url}
          alt="post"
          width={800}
          height={400}
          className="w-full rounded-xl mb-4 object-cover max-h-72"
        />
      )}

      {/* 본문 */}
      <p className="text-sm text-gray-700 whitespace-pre-line mb-6">
        {post.content}
      </p>

      {/* 댓글 */}
      <div className="border-t pt-4">
        <h2 className="text-sm font-semibold mb-4">댓글 {comments.length}</h2>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="댓글을 입력하세요..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
            className="flex-1 bg-gray-50 rounded-xl px-4 py-2 text-sm outline-none"
          />
          <button
            onClick={handleCommentSubmit}
            className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm"
          >
            ➤
          </button>
        </div>

        {comments.map((c) => (
          <div key={c.id} className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-300 shrink-0 overflow-hidden">
              {c.avatar_url && (
                <Image
                  src={c.avatar_url}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-sm font-semibold">{c.nickname}</span>
                {c.belt_level && (
                  <span className="text-xs text-gray-400">{c.belt_level}</span>
                )}
              </div>
              <p className="text-sm text-gray-700">{c.content}</p>
              <div className="flex gap-3 mt-1">
                <span className="text-xs text-gray-400">
                  {timeAgo(c.created_at)}
                </span>
                {userId === c.user_id && (
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="text-xs text-red-400"
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
