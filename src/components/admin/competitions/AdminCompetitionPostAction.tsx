'use client';

import { RotateCcw, FileText } from 'lucide-react';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { restoreAdminCompetition } from '@/actions/admin/competitions';
import type { AdminCompetitionPublishStatus } from '@/components/admin/competitions/types';
import { ROUTES } from '@/constants/routes';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

interface AdminCompetitionPostActionProps {
  id: string;
  name: string;
  publishStatus: AdminCompetitionPublishStatus;
}

const actionButtonClass =
  'inline-flex items-center justify-center rounded-md p-2 text-zinc-500 transition-colors duration-200 hover:bg-gray-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';

export default function AdminCompetitionPostAction({
  id,
  name,
  publishStatus,
}: AdminCompetitionPostActionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (publishStatus === '게시중') {
    return (
      <a
        href={ROUTES.COMPETITIONS_DETAIL(id)}
        target="_blank"
        rel="noopener noreferrer"
        className={actionButtonClass}
        title="대회 게시글 보기"
        aria-label={`${name} 상세보기`}
      >
        <FileText className="size-4" />
      </a>
    );
  }

  const handleRestore = () => {
    const confirmed = window.confirm(`${name} 대회 게시글을 복구하시겠습니까?`);

    if (!confirmed) return;

    startTransition(async () => {
      const result = await restoreAdminCompetition(id);

      if (!result.success) {
        showErrorToast(result.message);
        return;
      }

      showSuccessToast(result.message, '♻️');
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleRestore}
      aria-label={`${name} 복구`}
      title="복구"
      className={actionButtonClass}
      disabled={isPending}
    >
      <RotateCcw size={18} className="text-blue-500" />
    </button>
  );
}
