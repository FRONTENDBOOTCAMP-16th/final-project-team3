'use client';

import { Eye, EyeOff, Trash2, RotateCcw } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface AdminPostActionsProps {
  id: string;
  title: string;
  status: 'published' | 'hidden';
  deleted_at: string | null;
}

export default function AdminPostActions({
  id,
  title,
  status,
  deleted_at,
}: AdminPostActionsProps) {
  const isDeleted = Boolean(deleted_at);

  const handleView = () => {
    window.open(ROUTES.COMMUNITY_DETAIL(id), '_blank');
  };

  const handleToggleHidden = () => {
    const next =
      status === 'hidden' ? '게시' : '숨김';

    const confirmed = window.confirm(
      `${title} 게시글을 ${next} 처리하시겠습니까?`
    );

    if (!confirmed) return;

    console.log('상태 변경:', id, status);
    // TODO: supabase update
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `${title} 게시글을 삭제하시겠습니까?`
    );

    if (!confirmed) return;

    console.log('삭제:', id);
    // TODO: deleted_at 업데이트
  };

  const handleRestore = () => {
    const confirmed = window.confirm(
      `${title} 게시글을 복구하시겠습니까?`
    );

    if (!confirmed) return;

    console.log('복구:', id);
    // TODO: deleted_at null 처리
  };

  const actionButtonClass =
    'p-2 rounded-md cursor-pointer text-zinc-500 transition-colors duration-200 hover:bg-gray-100';
  const actionIconClass =
    'transition-colors';

  return (
    <div className="flex gap-2">
      <button
        aria-label={`${title} 상세보기`}
        onClick={handleView}
        title="상세보기"
        className={actionButtonClass}
      >
        <Eye size={18} className={actionIconClass} />
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
            {status === 'hidden' ? (
              <Eye size={18} />
            ) : (
              <EyeOff size={18} />
            )}
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