'use client';

import { useTransition } from 'react';
import { Eye, EyeOff, Trash2, RotateCcw, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  deleteAdminPost,
  restoreAdminPost,
  toggleAdminPostVisibility,
} from '@/actions/admin/posts';
import type { AdminPostStatus } from '@/components/admin/posts/types';
import { ROUTES } from '@/constants/routes';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

interface AdminPostActionsProps {
  id: string;
  title: string;
  status: AdminPostStatus;
  deleted_at: string | null;
}

export default function AdminPostActions({
  id,
  title,
  status,
  deleted_at,
}: AdminPostActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isDeleted = Boolean(deleted_at);
  const canViewDetail = status !== 'hidden';
  const actionButtonClass =
    'inline-flex items-center justify-center rounded-md p-2 text-zinc-500 transition-colors duration-200 hover:bg-gray-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';
  const actionPlaceholderClass =
    'inline-flex h-[34px] w-[34px] items-center justify-center text-sm text-zinc-400';

  const handleView = () => {
    window.open(ROUTES.COMMUNITY_DETAIL(id), '_blank', 'noopener,noreferrer');
  };

  const handleToggleHidden = () => {
    const confirmed = window.confirm(
      status === 'hidden'
        ? `${title} 게시글 숨김을 해제하시겠습니까?`
        : `${title} 게시글을 숨김 처리하시겠습니까?`,
    );

    if (!confirmed) return;

    startTransition(async () => {
      const result = await toggleAdminPostVisibility({
        postId: id,
        currentStatus: status,
      });

      if (!result.success) {
        showErrorToast(result.message);
        return;
      }

      showSuccessToast(result.message, status === 'hidden' ? '👀' : '🙈');
      router.refresh();
    });
  };

  const handleDelete = () => {
    const confirmed = window.confirm(`${title} 게시글을 삭제하시겠습니까?`);

    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteAdminPost(id);

      if (!result.success) {
        showErrorToast(result.message);
        return;
      }

      showSuccessToast(result.message, '🗑️');
      router.refresh();
    });
  };

  const handleRestore = () => {
    const confirmed = window.confirm(`${title} 게시글을 복구하시겠습니까?`);

    if (!confirmed) return;

    startTransition(async () => {
      const result = await restoreAdminPost(id);

      if (!result.success) {
        showErrorToast(result.message);
        return;
      }

      showSuccessToast(result.message, '♻️');
      router.refresh();
    });
  };

  return (
    <div className="flex justify-center gap-2">
      {isDeleted ? (
        <button
          type="button"
          aria-label={`${title} 복구`}
          onClick={handleRestore}
          title="복구"
          className={actionButtonClass}
          disabled={isPending}
        >
          <RotateCcw size={18} className="text-blue-500" />
        </button>
      ) : (
        <>
          {canViewDetail ? (
            <button
              type="button"
              aria-label={`${title} 상세보기`}
              onClick={handleView}
              title="상세보기"
              className={actionButtonClass}
              disabled={isPending}
            >
              <FileText size={18} />
            </button>
          ) : (
            <span className={actionPlaceholderClass}>-</span>
          )}

          <button
            type="button"
            aria-label={`${title} 숨김 토글`}
            onClick={handleToggleHidden}
            title={status === 'hidden' ? '숨김 해제' : '숨김'}
            className={actionButtonClass}
            disabled={isPending}
          >
            {status === 'hidden' ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>

          <button
            type="button"
            aria-label={`${title} 삭제`}
            onClick={handleDelete}
            title="삭제"
            className={actionButtonClass}
            disabled={isPending}
          >
            <Trash2 size={18} className="text-red-500" />
          </button>
        </>
      )}
    </div>
  );
}
