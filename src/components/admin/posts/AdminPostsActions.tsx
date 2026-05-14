'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState, useTransition } from 'react';
import { Eye, EyeOff, Trash2, RotateCcw, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  deleteAdminPost,
  restoreAdminPost,
  toggleAdminPostVisibility,
} from '@/actions/admin/posts';
import ConfirmModal from '@/components/common/ConfirmModal';
import type { AdminPostStatus } from '@/components/admin/posts/types';
import { ROUTES } from '@/constants/routes';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

interface AdminPostActionsProps {
  id: string;
  title: string;
  status: AdminPostStatus;
  deleted_at: string | null;
}

type ConfirmAction = 'toggleHidden' | 'delete' | 'restore' | null;

export default function AdminPostActions({
  id,
  title,
  status,
  deleted_at,
}: AdminPostActionsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const isDeleted = Boolean(deleted_at);
  const canViewDetail = status !== 'hidden';
  const actionButtonClass =
    'inline-flex items-center justify-center rounded-md p-2 text-zinc-500 transition-colors duration-200 hover:bg-gray-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';
  const actionPlaceholderClass =
    'inline-flex h-[34px] w-[34px] items-center justify-center text-sm text-zinc-400';

  const handleView = () => {
    window.open(ROUTES.COMMUNITY_DETAIL(id), '_blank', 'noopener,noreferrer');
  };

  const executeToggleHidden = () => {
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
      queryClient.removeQueries({ queryKey: ['posts'] });
      router.refresh();
    });
  };

  const executeDelete = () => {
    startTransition(async () => {
      const result = await deleteAdminPost(id);

      if (!result.success) {
        showErrorToast(result.message);
        return;
      }

      showSuccessToast(result.message, '🗑️');
      queryClient.removeQueries({ queryKey: ['posts'] });
      router.refresh();
    });
  };

  const executeRestore = () => {
    startTransition(async () => {
      const result = await restoreAdminPost(id);

      if (!result.success) {
        showErrorToast(result.message);
        return;
      }

      showSuccessToast(result.message, '♻️');
      queryClient.removeQueries({ queryKey: ['posts'] });
      router.refresh();
    });
  };

  const confirmModalContent =
    confirmAction === 'toggleHidden'
      ? {
          title: status === 'hidden' ? '숨김 해제 확인' : '숨김 처리 확인',
          description:
            status === 'hidden'
              ? `${title} 게시글의 숨김을 해제하시겠습니까?`
              : `${title} 게시글을 숨김 처리하시겠습니까?`,
          confirmLabel: status === 'hidden' ? '숨김 해제' : '숨김 처리',
          confirmVariant: 'default' as const,
          onConfirm: executeToggleHidden,
        }
      : confirmAction === 'delete'
        ? {
            title: '게시글 삭제 확인',
            description: `${title} 게시글을 삭제하시겠습니까?`,
            confirmLabel: '삭제',
            confirmVariant: 'danger' as const,
            onConfirm: executeDelete,
          }
        : confirmAction === 'restore'
          ? {
              title: '게시글 복구 확인',
              description: `${title} 게시글을 복구하시겠습니까?`,
              confirmLabel: '복구',
              confirmVariant: 'success' as const,
              onConfirm: executeRestore,
            }
          : null;

  return (
    <>
      <div className="flex justify-center gap-2">
        {isDeleted ? (
          <button
            type="button"
            aria-label={`${title} 복구`}
            onClick={() => setConfirmAction('restore')}
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
              onClick={() => setConfirmAction('toggleHidden')}
              title={status === 'hidden' ? '숨김 해제' : '숨김'}
              className={actionButtonClass}
              disabled={isPending}
            >
              {status === 'hidden' ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>

            <button
              type="button"
              aria-label={`${title} 삭제`}
              onClick={() => setConfirmAction('delete')}
              title="삭제"
              className={actionButtonClass}
              disabled={isPending}
            >
              <Trash2 size={18} className="text-red-500" />
            </button>
          </>
        )}
      </div>

      {confirmModalContent ? (
        <ConfirmModal
          isOpen={Boolean(confirmModalContent)}
          onClose={() => setConfirmAction(null)}
          onConfirm={confirmModalContent.onConfirm}
          title={confirmModalContent.title}
          description={confirmModalContent.description}
          confirmLabel={confirmModalContent.confirmLabel}
          confirmVariant={confirmModalContent.confirmVariant}
          disabled={isPending}
        />
      ) : null}
    </>
  );
}
