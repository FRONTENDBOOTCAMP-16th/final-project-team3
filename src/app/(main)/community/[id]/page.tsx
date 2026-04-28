'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getPost,
  getComments,
  createComment,
  deletePost,
  deleteComment,
  incrementViewCount,
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
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

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
        await incrementViewCount(id);
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

  const handleEditComment = async (commentId: string) => {
    if (!editingContent.trim()) return;
    try {
      await supabase
        .from('comments')
        .update({ content: editingContent })
        .eq('id', commentId);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, content: editingContent } : c,
        ),
      );
      setEditingCommentId(null);
      setEditingContent('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;
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
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* 뒤로가기 */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 px-2.5 py-2 border-2 border-white bg-white text-black text-sm font-medium rounded-xl hover:bg-(--color-btn-focus) hover:text-white transition-colors duration-200 cursor-pointer"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        목록으로
      </button>

      {/* ── 게시글 카드 ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* 작성자 헤더 */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
              {post.avatar_url && (
                <Image
                  src={post.avatar_url}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-gray-900">
                  {post.nickname ?? '알 수 없음'}
                </span>
                {post.belt_level && (
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                    {post.belt_level}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                <Image
                  src="/postTime.svg"
                  alt="시간"
                  width={11}
                  height={11}
                  className="opacity-50"
                />
                {timeAgo(post.created_at)}
              </p>
            </div>
          </div>

          {/* 오너 액션 버튼 */}
          {isOwner && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => router.push(`/community/${id}/edit`)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 cursor-pointer"
                title="수정"
              >
                <Image src="/postEdit.svg" alt="수정" width={30} height={30} />
              </button>
              <button
                onClick={handleDeletePost}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors text-red-400 cursor-pointer"
                title="삭제"
              >
                <Image
                  src="/postDelete.svg"
                  alt="삭제"
                  width={32}
                  height={32}
                />
              </button>
            </div>
          )}
        </div>

        {/* 제목 */}
        <div className="px-5 pb-3">
          <h1 className="text-lg font-bold text-gray-900">{post.title}</h1>
        </div>

        {/* 이미지 */}
        {post.image_url && (
          <div className="px-5 pb-4">
            <div className="rounded-xl overflow-hidden">
              <Image
                src={post.image_url}
                alt="post"
                width={800}
                height={400}
                className="w-full object-cover max-h-72"
              />
            </div>
          </div>
        )}

        {/* 본문 */}
        <div className="px-5 pb-5">
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* 하단 액션 바 */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors cursor-pointer">
            <Image src="/like.svg" alt="좋아요" width={16} height={16} />
            <span>좋아요</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-500 transition-colors cursor-pointer">
            <Image src="/postComment.svg" alt="댓글" width={16} height={16} />
            <span>댓글 {comments.length}</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-500 transition-colors ml-auto cursor-pointer">
            <Image src="/postShare.svg" alt="공유" width={16} height={16} />
            <span>공유</span>
          </button>
        </div>
      </div>

      {/* ── 댓글 카드 ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 pt-5 pb-3 flex items-center gap-2 border-b border-gray-100">
          <Image
            src="/postComment.svg"
            alt="댓글"
            width={16}
            height={16}
            className="opacity-40"
          />
          <h2 className="text-sm font-semibold text-gray-800">
            댓글 {comments.length}
          </h2>
        </div>

        {/* 댓글 입력 */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="댓글을 입력하세요..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors placeholder:text-gray-400"
            />
            <button
              onClick={handleCommentSubmit}
              className="w-10 h-10 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <Image
                src="/postCommentSubmit.svg"
                alt="전송"
                width={30}
                height={30}
              />
            </button>
          </div>
        </div>

        {/* 댓글 목록 */}
        <div className="px-5 pb-5 space-y-4">
          {comments.map((c, index) => (
            <div key={c.id}>
              {index > 0 && <div className="border-t border-gray-50 mb-4" />}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 overflow-hidden">
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
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {c.nickname}
                    </span>
                    {c.belt_level && (
                      <span className="text-xs text-gray-400">
                        {c.belt_level}
                      </span>
                    )}
                  </div>
                  {editingCommentId === c.id ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleEditComment(c.id)
                        }
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-gray-400"
                        autoFocus
                      />
                      <button
                        onClick={() => handleEditComment(c.id)}
                        className="text-xs text-blue-500 font-medium"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="text-xs text-gray-400"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {c.content}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Image
                        src="/postTime.svg"
                        alt="시간"
                        width={11}
                        height={11}
                        className="opacity-50"
                      />
                      {timeAgo(c.created_at)}
                    </span>
                    {userId === c.user_id && (
                      <>
                        <button
                          onClick={() => {
                            setEditingCommentId(c.id);
                            setEditingContent(c.content);
                          }}
                          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-4">
              첫 번째 댓글을 남겨보세요!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
