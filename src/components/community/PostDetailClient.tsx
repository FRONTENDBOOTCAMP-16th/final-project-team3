'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  deletePost,
  deleteComment,
  updateComment,
} from '@/services/communityService';
import { reportPost, ReportReason } from '@/services/reportService';
import type { Post, Comment } from '@/types/community';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useLike } from '@/hooks/useLike';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import ReportModal from '@/components/community/ReportModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import PostDetailCard, {
  PostDetailCardData,
} from '@/components/community/PostDetailCard';
import {
  canManageContent,
  type ContentUserRole,
} from '@/lib/contentPermissions';
import { timeAgo } from '@/utils/timeAgo';
import { LimitedTextarea } from '../common/LimitedTextarea';

interface Props {
  id: string;
  initialPost: Post;
  initialComments: Comment[];
  userId: string | null;
  currentUserRole: ContentUserRole;
}

export default function PostDetailClient({
  id,
  initialPost,
  initialComments,
  userId,
  currentUserRole,
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { likeCount, isLiked, toggle } = useLike(id, user?.id ?? '');

  const [post] = useState<Post>(initialPost);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [comment, setComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

  useEffect(() => {
    const key = `viewed-post-${id}`;
    if (sessionStorage.getItem(key)) return;

    const incrementView = async () => {
      try {
        const res = await fetch(`/api/posts/${id}/view`, { method: 'POST' });
        if (res.ok) {
          sessionStorage.setItem(key, 'true');
        }
      } catch {}
    };

    incrementView();
  }, [id]);

  const canManagePost = canManageContent({
    currentUserId: userId,
    authorUserId: post.user_id,
    currentUserRole,
    authorRole: post.role,
  });

  const handleCommentSubmit = async () => {
    if (!userId) {
      showErrorToast('로그인이 필요합니다.');
      return;
    }
    if (!comment.trim()) {
      showErrorToast('댓글을 입력해주세요.');
      return;
    }

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id, content: comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        showErrorToast(data.error ?? '댓글 작성에 실패했습니다.');
        return;
      }

      setComments((prev) => [
        ...prev,
        {
          ...data.comment,
          nickname: user?.name ?? '알 수 없음',
          avatar_url: user?.image ?? null,
        },
      ]);
      setComment('');
    } catch {
      showErrorToast('네트워크 오류가 발생했습니다.');
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(id);
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      showSuccessToast('게시글이 삭제되었습니다.', '🗑️');
      await new Promise((resolve) => setTimeout(resolve, 700));
      router.push('/community');
      router.refresh();
    } catch {
      showErrorToast('게시글 삭제에 실패했습니다.');
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editingContent.trim()) return;
    try {
      await updateComment(commentId, editingContent);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, content: editingContent } : c,
        ),
      );
      setEditingCommentId(null);
      setEditingContent('');
      showSuccessToast('댓글이 수정되었습니다.', '✅');
    } catch {
      showErrorToast('댓글 수정에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      showSuccessToast('댓글이 삭제되었습니다.', '🗑️');
    } catch {
      showErrorToast('댓글 삭제에 실패했습니다.');
    }
  };

  const handleReportSubmit = async (reason: ReportReason) => {
    if (!userId) {
      showErrorToast('로그인이 필요합니다.');
      return;
    }
    try {
      await reportPost(userId, id, reason);
      showSuccessToast('신고가 접수되었습니다.', '🚨');
      setReportModalOpen(false);
    } catch (e: unknown) {
      if (e instanceof Error && e.message === 'ALREADY_REPORTED') {
        showErrorToast('이미 신고한 게시물입니다.');
        setReportModalOpen(false);
      } else {
        showErrorToast('신고 처리 중 오류가 발생했습니다.');
      }
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = post.title ?? '';
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        showSuccessToast('링크가 복사되었습니다!', '🔗');
      } catch {
        showErrorToast('복사에 실패했습니다.');
      }
    }
  };

  const postDetailCardData: PostDetailCardData = {
    nickname: post.nickname ?? '알 수 없음',
    avatar_url: post.avatar_url,
    role: post.role,
    created_at: post.created_at,
    title: post.title,
    image_url: post.image_url,
    content: post.content,
    likeCount: likeCount ?? 0,
    commentCount: comments.length,
    view_count: post.view_count,
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <button
        onClick={() => router.push('/community')}
        aria-label="커뮤니티 목록으로 이동"
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

      <PostDetailCard
        post={postDetailCardData}
        isLiked={isLiked}
        onLike={() => {
          if (!userId) {
            showErrorToast('로그인이 필요합니다.');
            return;
          }
          toggle();
        }}
        headerActions={
          <>
            {canManagePost ? (
              <>
                <button
                  title="수정하기"
                  aria-label="게시글 수정"
                  onClick={() => router.push(`/community/${id}/edit`)}
                >
                  <Image src="/postEdit.svg" alt="" width={30} height={30} />
                </button>
                <button
                  title="삭제하기"
                  aria-label="게시글 삭제"
                  onClick={() => setDeletePostModalOpen(true)}
                >
                  <Image src="/postDelete.svg" alt="" width={32} height={32} />
                </button>
              </>
            ) : (
              <button
                title="신고하기"
                aria-label="게시글 신고"
                onClick={() => setReportModalOpen(true)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <Image src="/postReport.svg" alt="" width={27} height={27} />
              </button>
            )}
            <button
              title="공유하기"
              aria-label="게시글 공유"
              onClick={handleShare}
              className="w-8 h-8 flex items-center justify-center"
            >
              <Image src="/postShare.svg" alt="" width={18} height={18} />
            </button>
          </>
        }
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 pt-5 pb-3 flex items-center gap-2 border-b border-gray-100">
          <Image
            src="/postComment.svg"
            alt=""
            aria-hidden="true"
            width={16}
            height={16}
            className="opacity-40"
          />
          <h2 className="text-sm font-semibold text-gray-800">댓글</h2>
        </div>

        <div className="px-5 py-4">
          <div className="flex items-center gap-2">
            <label htmlFor="comment-input" className="sr-only">
              댓글 입력
            </label>
            <LimitedTextarea
              id="comment-input"
              value={comment}
              onChange={setComment}
              maxLength={300}
              allowNewline={false}
              rows={1}
              placeholder="댓글을 입력하세요..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
            />
            <button
              onClick={handleCommentSubmit}
              aria-label="댓글 전송"
              className="w-10 h-10 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <Image
                src="/postCommentSubmit.svg"
                alt=""
                aria-hidden="true"
                width={30}
                height={30}
              />
            </button>
          </div>
        </div>

        <div className="px-5 pb-5 space-y-4">
          {comments.map((c, index) => (
            <div key={c.id}>
              {index > 0 && <div className="border-t border-gray-50 mb-4" />}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                  {c.avatar_url && (
                    <Image
                      src={c.avatar_url}
                      alt={`${c.nickname} 프로필 이미지`}
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
                      <label
                        htmlFor={`edit-comment-${c.id}`}
                        className="sr-only"
                      >
                        댓글 수정 입력
                      </label>
                      <LimitedTextarea
                        id={`edit-comment-${c.id}`}
                        value={editingContent}
                        onChange={setEditingContent}
                        maxLength={300}
                        allowNewline={false}
                        rows={1}
                        className="flex-1"
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleEditComment(c.id)
                        }
                      />
                      <button
                        onClick={() => handleEditComment(c.id)}
                        aria-label="댓글 저장"
                        className="text-xs text-blue-500 font-medium"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        aria-label="댓글 수정 취소"
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
                        alt=""
                        aria-hidden="true"
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
                          aria-label={`${c.nickname}의 댓글 수정`}
                          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => setDeleteCommentId(c.id)}
                          aria-label={`${c.nickname}의 댓글 삭제`}
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

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />
      <ConfirmModal
        isOpen={deletePostModalOpen}
        onClose={() => setDeletePostModalOpen(false)}
        onConfirm={handleDeletePost}
        title="게시글 삭제"
        description="정말 삭제하시겠습니까? 삭제된 게시글은 복구할 수 없습니다."
      />
      <ConfirmModal
        isOpen={deleteCommentId !== null}
        onClose={() => setDeleteCommentId(null)}
        onConfirm={() => {
          if (deleteCommentId) handleDeleteComment(deleteCommentId);
        }}
        title="댓글 삭제"
        description="정말 삭제하시겠습니까? 삭제된 댓글은 복구할 수 없습니다."
      />
    </div>
  );
}
