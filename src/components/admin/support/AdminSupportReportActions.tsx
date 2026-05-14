'use client';

import { useQueryClient } from '@tanstack/react-query';
import { FileText, ShieldAlert } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { processAdminReport } from '@/actions/admin/reports';
import AdminBadge from '@/components/admin/AdminBadge';
import ConfirmModal from '@/components/common/ConfirmModal';
import {
  REPORT_ACTION_BADGE_VARIANT_MAP,
  REPORT_STATUS_BADGE_VARIANT_MAP,
} from '@/components/admin/support/constants';
import type { AdminReportRow } from '@/components/admin/support/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ROUTES } from '@/constants/routes';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

interface AdminSupportReportActionsProps {
  row: AdminReportRow;
}

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
}

type ConfirmReportAction = {
  actionType: 'hide_post' | 'delete_post' | 'none';
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant: 'default' | 'danger' | 'success' | 'warning';
} | null;

const actionButtonClass =
  'inline-flex items-center justify-center rounded-md p-2 text-zinc-500 transition-colors duration-200 hover:bg-gray-100 cursor-pointer';
const actionPlaceholderClass =
  'inline-flex h-[34px] w-[34px] items-center justify-center text-sm text-zinc-400';

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="grid grid-cols-[104px_minmax(0,1fr)] items-start gap-3 rounded-lg bg-zinc-50 px-4 py-3">
      <dt className="text-sm font-medium text-zinc-500">{label}</dt>
      <dd className="min-w-0 text-sm text-zinc-800 break-words">{value}</dd>
    </div>
  );
}

export default function AdminSupportReportActions({
  row,
}: AdminSupportReportActionsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isSubmitting, startTransition] = useTransition();
  const [confirmAction, setConfirmAction] = useState<ConfirmReportAction>(null);

  const isProcessPending =
    row.raw_status === 'pending' || row.raw_status === null;
  const canViewDetail =
    Boolean(row.post_id) && row.post_status_label === '게시중';

  const handleViewDetail = () => {
    if (!canViewDetail || !row.post_id) {
      showErrorToast('연결된 게시글 정보를 찾을 수 없습니다.');
      return;
    }

    window.open(
      ROUTES.COMMUNITY_DETAIL(row.post_id),
      '_blank',
      'noopener,noreferrer',
    );
  };

  const handleProcessReport = async (
    actionType: 'hide_post' | 'delete_post' | 'none',
  ) => {
    if (
      (actionType === 'hide_post' || actionType === 'delete_post') &&
      !row.post_id
    ) {
      showErrorToast('연결된 게시글 정보를 찾을 수 없습니다.');
      return;
    }

    startTransition(async () => {
      const result = await processAdminReport({
        reportId: row.id,
        postId: row.post_id,
        actionType,
      });

      if (!result.success) {
        showErrorToast(result.message);
        return;
      }

      const successIcon =
        actionType === 'hide_post'
          ? '🙈'
          : actionType === 'delete_post'
            ? '🗑️'
            : '✅';

      showSuccessToast(result.message, successIcon);
      setOpen(false);
      setConfirmAction(null);
      queryClient.removeQueries({ queryKey: ['posts'] });
      router.refresh();
    });
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {canViewDetail ? (
        <button
          type="button"
          onClick={handleViewDetail}
          aria-label={`${row.post_title} 상세보기`}
          title="상세보기"
          className={actionButtonClass}
          disabled={isSubmitting}
        >
          <FileText size={18} />
        </button>
      ) : (
        <span className={actionPlaceholderClass}>-</span>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label={`${row.post_title} ${isProcessPending ? '처리하기' : '처리내역'}`}
            title={isProcessPending ? '처리하기' : '처리내역'}
            className={actionButtonClass}
            disabled={isSubmitting}
          >
            <ShieldAlert
              size={18}
              className={isProcessPending ? 'text-red-500' : 'text-blue-500'}
            />
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-2xl">
          <DialogHeader className="gap-3">
            <DialogTitle className="text-xl font-semibold text-zinc-900">
              신고 상세
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500">
              신고 상태와 처리 결과를 확인하세요.
            </DialogDescription>
          </DialogHeader>

          <section className="space-y-3">
            <dl className="space-y-2">
              <DetailItem label="게시글 제목" value={row.post_title} />
              <DetailItem label="사유" value={row.reason} />
              <DetailItem label="신고자" value={row.reporter} />
              <DetailItem label="신고 날짜" value={row.reported_at} />
              <DetailItem
                label="처리 상태"
                value={
                  <AdminBadge
                    label={row.process_status}
                    variant={
                      REPORT_STATUS_BADGE_VARIANT_MAP[row.process_status]
                    }
                  />
                }
              />
              <DetailItem
                label="처리 결과"
                value={
                  row.action_result === '-' ? (
                    <span className="text-sm text-zinc-400">-</span>
                  ) : (
                    <AdminBadge
                      label={row.action_result}
                      variant={
                        REPORT_ACTION_BADGE_VARIANT_MAP[row.action_result]
                      }
                    />
                  )
                }
              />
              <DetailItem label="처리 날짜" value={row.handled_at} />
            </dl>
          </section>

          {isProcessPending ? (
            <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
              <button
                type="button"
                onClick={() =>
                  setConfirmAction({
                    actionType: 'none',
                    title: '문제없음 처리 확인',
                    description: `${row.post_title} 신고를 문제없음으로 처리하시겠습니까?`,
                    confirmLabel: '문제 없음 처리',
                    confirmVariant: 'default',
                  })
                }
                disabled={isSubmitting}
                className={`${actionButtonClass} h-9 border-zinc-200 bg-zinc-50 px-3 text-zinc-700 hover:bg-zinc-100`}
              >
                문제 없음 처리
              </button>
              <button
                type="button"
                onClick={() =>
                  setConfirmAction({
                    actionType: 'hide_post',
                    title: '게시글 숨김 처리 확인',
                    description: `${row.post_title} 게시글을 숨김 처리하시겠습니까?`,
                    confirmLabel: '게시글 숨김',
                    confirmVariant: 'warning',
                  })
                }
                disabled={isSubmitting}
                className={`${actionButtonClass} h-9 border-blue-200 bg-blue-50 px-3 text-blue-700 hover:bg-blue-100`}
              >
                게시글 숨김 처리
              </button>
              <button
                type="button"
                onClick={() =>
                  setConfirmAction({
                    actionType: 'delete_post',
                    title: '게시글 삭제 처리 확인',
                    description: `${row.post_title} 게시글을 삭제 처리하시겠습니까?`,
                    confirmLabel: '게시글 삭제',
                    confirmVariant: 'danger',
                  })
                }
                disabled={isSubmitting}
                className={`${actionButtonClass} h-9 border-red-200 bg-red-50 px-3 text-red-600 hover:bg-red-100`}
              >
                게시글 삭제 처리
              </button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {confirmAction ? (
        <ConfirmModal
          isOpen={Boolean(confirmAction)}
          onClose={() => setConfirmAction(null)}
          onConfirm={() => handleProcessReport(confirmAction.actionType)}
          title={confirmAction.title}
          description={confirmAction.description}
          confirmLabel={confirmAction.confirmLabel}
          confirmVariant={confirmAction.confirmVariant}
          disabled={isSubmitting}
        />
      ) : null}
    </div>
  );
}
