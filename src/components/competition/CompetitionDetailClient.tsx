'use client';

import { useRouter } from 'next/navigation';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { useQueryClient } from '@tanstack/react-query';
import { getStatus } from '@/utils/formatDate';
import { handleShare } from '@/utils/share';
import type { Competition } from '@/types/competition';
import CompetitionDetailCard from '@/components/competition/CompetitionDetailCard';
import { deleteCompetition } from '@/services/competitionService';
import { useState } from 'react';
import ConfirmModal from '../common/ConfirmModal';
import { Pencil, Trash2, Share2 } from 'lucide-react';

interface CompetitionDetailClientProps {
  competition: Competition;
  userId: string | null;
}

export default function CompetitionDetailClient({
  competition,
  userId,
}: CompetitionDetailClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = competition;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const isOwner = userId === competition.user_id;
  const status = getStatus(competition.apply_deadline);

  const handleDeletePost = async () => {
    try {
      await deleteCompetition(id);
      showSuccessToast('대회일정이 삭제되었습니다.', '🗑️');
      await queryClient.invalidateQueries({ queryKey: ['competition'] });
      await new Promise((resolve) => setTimeout(resolve, 700));
      router.push('/competitions');
      router.refresh();
    } catch {
      showErrorToast('대회일정 삭제에 실패했습니다.');
    }
  };

  return (
    <main
      className="max-w-2xl mx-auto p-4 space-y-4"
      aria-label={`${competition.name} 대회 상세`}
    >
      <button
        onClick={() => router.push('/competitions')}
        aria-label="대회일정 목록으로 돌아가기"
        className="flex items-center gap-2 px-2.5 py-2 border-2 border-border bg-bg-white text-text-primary text-sm font-medium rounded-xl hover:bg-btn-focus hover:text-btn-focus-text transition-colors duration-200 cursor-pointer"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
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

      <CompetitionDetailCard
        data={{
          name: competition.name,
          image_url: competition.image_url,
          description: competition.description,
          event_data: competition.event_data,
          location: competition.location,
          apply_deadline: competition.apply_deadline,
          created_at: competition.created_at,
          view_count: competition.view_count,
          nickname: competition.nickname,
          avatar_url: competition.avatar_url,
          role: competition.role,
        }}
        headerActions={
          <>
            {isOwner && (
              <>
                <button
                  title="수정하기"
                  aria-label="대회 게시글 수정하기"
                  onClick={() => router.push(`/competitions/${id}/edit`)}
                  className="p-1 cursor-pointer"
                >
                  <Pencil
                    size={20}
                    className="text-text-secondary hover:text-text-primary"
                  />
                </button>
                <button
                  title="삭제하기"
                  aria-label="대회 게시글 삭제하기"
                  onClick={() => setDeleteModalOpen(true)}
                  className="p-1 cursor-pointer"
                >
                  <Trash2
                    size={20}
                    className="text-text-secondary hover:text-red-500"
                  />
                </button>
              </>
            )}
            <button
              title="공유하기"
              aria-label="대회 게시글 링크 공유하기"
              onClick={() => handleShare()}
              className="p-1 cursor-pointer"
            >
              <Share2
                size={18}
                className="text-text-secondary hover:text-text-primary"
              />
            </button>
          </>
        }
      />

      <a
        href={
          competition.apply_url?.startsWith('http')
            ? competition.apply_url
            : `https://${competition.apply_url}`
        }
        target="_blank"
        rel="noopener noreferrer"
        aria-label={
          status === '모집완료'
            ? `${competition.name} 모집 완료`
            : `${competition.name} 대회 신청하기`
        }
        aria-disabled={status === '모집완료'}
        className={`block w-full py-4 text-center text-sm font-bold rounded-2xl transition-all
          ${
            status === '모집완료'
              ? 'bg-state-basic-bg text-text-secondary cursor-not-allowed pointer-events-none'
              : 'bg-btn-focus text-btn-focus-text hover:opacity-80'
          }`}
      >
        {status === '모집완료' ? '모집 완료' : '대회 신청하기'}
      </a>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeletePost}
        title="대회 게시글 삭제"
        description="정말 삭제하시겠습니까? 삭제된 게시글은 복구할 수 없습니다."
      />
    </main>
  );
}
