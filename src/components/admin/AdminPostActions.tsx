'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface AdminPostActionsProps {
  id: string;
  title: string;
}

export default function AdminPostActions({ id, title }: AdminPostActionsProps) {
  const handleView = () => {
    window.open(ROUTES.COMMUNITY_DETAIL(id), '_blank');
  };

  const handleEdit = () => {
    console.log('수정', id);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(`${title} 게시글을 삭제하시겠습니까?`);

    if (!confirmed) return;

    console.log('삭제할 게시글 id:', id);
  };

  const actionButtonClass =
    'p-2 rounded-md cursor-pointer text-zinc-500 transition-colors duration-200';
  const actionIconClass =
    'transition-colors hover:text-red-500';

  return (
    <div className="flex gap-3">
      <button
        type="button"
        aria-label={`${title} 상세보기`}
        onClick={handleView}
        className={actionButtonClass}
      >
        <Eye size={18} className={actionIconClass} />
      </button>

      <button
        type="button"
        aria-label={`${title} 수정`}
        onClick={handleEdit}
        className={actionButtonClass}
      >
        <Pencil size={18} className={actionIconClass} />
      </button>

      <button
        type="button"
        aria-label={`${title} 삭제`}
        onClick={handleDelete}
        className={actionButtonClass}
      >
        <Trash2 size={18} className={actionIconClass} />
      </button>
    </div>
  );
}
