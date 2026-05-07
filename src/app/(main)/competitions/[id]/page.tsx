'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCompetition } from '@/services/competitionService';
import { supabase } from '@/lib/supabase';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import type { Competition } from '@/types/competition';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import CompetitionDetailCard from '@/components/competition/CompetitionDetailCard';
import { handleShare } from '@/utils/share';

export default function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const queryClient = useQueryClient();

  const [competition, setCompetition] = useState<Competition | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [
          competitionData,

          {
            data: { user },
          },
        ] = await Promise.all([getCompetition(id), supabase.auth.getUser()]);

        setCompetition(competitionData);

        setUserId(user?.id ?? null);

        // 조회수 증가
        await supabase
          .from('competition')
          .update({ view_count: (competitionData.view_count ?? 0) + 1 })
          .eq('id', id);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDeletePost = async () => {
    if (!confirm('대회 게시글을 삭제하시겠습니까?')) return;
    try {
      await supabase.from('competition').delete().eq('id', id);
      showSuccessToast('삭제되었습니다.', '🗑️');
      await queryClient.invalidateQueries({ queryKey: ['competition'] });
      router.push('/competitions');
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
  if (!competition)
    return (
      <div className="flex justify-center p-20 text-gray-400">
        게시글을 찾을 수 없습니다.
      </div>
    );

  const isOwner = userId === competition.user_id;
  const status = competition.apply_deadline
    ? competition.apply_deadline < new Date().toISOString().split('T')[0]
      ? '모집완료'
      : '모집중'
    : '모집중';

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* 뒤로가기 */}
      <button
        onClick={() => router.push('/competitions')}
        className="flex items-center gap-2 px-2.5 py-2 border-2 border-white bg-white text-black text-sm font-medium rounded-xl hover:bg-(--color-btn-focus) hover:text-white transition-colors duration-200 cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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

      {/* 게시글 카드 */}
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
                  onClick={() => router.push(`/competitions/${id}/edit`)}
                  className="cursor-pointer"
                >
                  <Image src="/postEdit.svg" alt="" width={30} height={30} />
                </button>
                <button
                  title="삭제하기"
                  onClick={handleDeletePost}
                  className="cursor-pointer"
                >
                  <Image src="/postDelete.svg" alt="" width={32} height={32} />
                </button>
              </>
            )}
            <button
              title="공유하기"
              onClick={() => {
                handleShare(competition.name);
              }}
              className="w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              <Image src="/postShare.svg" alt="" width={18} height={18} />
            </button>
          </>
        }
      />

      {/* 신청하기 버튼 */}

      <a
        href={
          competition.apply_url?.startsWith('http')
            ? competition.apply_url
            : `https://${competition.apply_url}`
        }
        target="_blank"
        rel="noopener noreferrer"
        className={`block w-full py-4 text-center text-sm font-bold text-white rounded-2xl transition-all
          ${
            status === '모집완료'
              ? 'bg-gray-400 cursor-not-allowed pointer-events-none'
              : 'bg-[#2c2c2c] hover:bg-black'
          }`}
      >
        {status === '모집완료' ? '모집 완료' : '대회 신청하기'}
      </a>
    </div>
  );
}
