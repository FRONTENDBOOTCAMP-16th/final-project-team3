'use client';

import { Eye, EyeOff, Trash2, RotateCcw, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { AdminPostStatus } from '@/components/admin/post/types';
import { ROUTES } from '@/constants/routes';
import { supabase } from '@/lib/supabase';

interface AdminPostActionsProps {
  id: string;
  title: string;
  status: AdminPostStatus;
  deleted_at: string | null;
}

interface PostMutationPayload {
  deleted_at?: string | null;
  status?: AdminPostStatus;
}

export default function AdminPostActions({
  id,
  title,
  status,
  deleted_at,
}: AdminPostActionsProps) {
  const router = useRouter();

  const isDeleted = Boolean(deleted_at);
  const actionButtonClass =
    'rounded-md p-2 text-zinc-500 transition-colors duration-200 hover:bg-gray-100 cursor-pointer';

  const handleView = () => {
    window.open(ROUTES.COMMUNITY_DETAIL(id), '_blank', 'noopener,noreferrer');
  };

  const updatePost = async (
    payload: PostMutationPayload,
    failureMessage: string,
  ) => {
    const { error } = await supabase.from('posts').update(payload).eq('id', id);

    if (error) {
      alert(failureMessage);
      return;
    }

    router.refresh();
  };

  const handleToggleHidden = async () => {
    const nextStatus = status === 'hidden' ? 'published' : 'hidden';

    await updatePost({ status: nextStatus }, '상태 변경에 실패했습니다.');
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`${title} 게시글을 삭제하시겠습니까?`);

    if (!confirmed) return;

    await updatePost(
      { deleted_at: new Date().toISOString() },
      '삭제에 실패했습니다.',
    );
  };

  const handleRestore = async () => {
    const confirmed = window.confirm(`${title} 게시글을 복구하시겠습니까?`);

    if (!confirmed) return;

    await updatePost(
      {
        deleted_at: null,
        status: 'published',
      },
      '복구에 실패했습니다.',
    );
  };

  return (
    <div className="flex justify-center gap-2">
      <button
        aria-label={`${title} 상세보기`}
        onClick={handleView}
        title="상세보기"
        className={actionButtonClass}
      >
        <FileText size={18} />
      </button>

      {isDeleted ? (
        <button
          aria-label={`${title} 복구`}
          onClick={handleRestore}
          title="복구"
          className={actionButtonClass}
        >
          <RotateCcw size={18} className="text-blue-500" />
        </button>
      ) : (
        <>
          <button
            aria-label={`${title} 숨김 토글`}
            onClick={handleToggleHidden}
            title={status === 'hidden' ? '숨김 해제' : '숨김'}
            className={actionButtonClass}
          >
            {status === 'hidden' ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>

          <button
            aria-label={`${title} 삭제`}
            onClick={handleDelete}
            title="삭제"
            className={actionButtonClass}
          >
            <Trash2 size={18} className="text-red-500" />
          </button>
        </>
      )}
    </div>
  );
}
