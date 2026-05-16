'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  updateCompetition,
  uploadCompetitionImage,
} from '@/services/competitionService';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import PostFormActions from '@/components/community/PostFormActions';
import { useQueryClient } from '@tanstack/react-query';
import CompetitionForm, {
  CompetitionFormValues,
} from '@/components/competition/CompetitionForm';
import type { Competition } from '@/types/competition';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';
import ConfirmModal from '../common/ConfirmModal';
import { buildCompetitionUrl } from '@/lib/slug';
import {
  revalidateCompetitions,
  revalidateCompetition,
} from '@/actions/community/competitions';

interface CompetitionEditClientProps {
  competition: Competition;
}

export default function CompetitionEditClient({
  competition,
}: CompetitionEditClientProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const [values, setValues] = useState<CompetitionFormValues>({
    name: competition.name ?? '',
    location: competition.location ?? '',
    eventDate: competition.event_data ?? '',
    applyDeadline: competition.apply_deadline ?? '',
    applyUrl: competition.apply_url ?? '',
    description: competition.description ?? '',
    participants: competition.participants
      ? String(competition.participants)
      : '',
    preview: competition.image_url ?? null,
    imageFile: null,
  });

  const isDirty =
    values.name !== (competition.name ?? '') ||
    values.location !== (competition.location ?? '') ||
    values.eventDate !== (competition.event_data ?? '') ||
    values.applyDeadline !== (competition.apply_deadline ?? '') ||
    values.applyUrl !== (competition.apply_url ?? '') ||
    values.description !== (competition.description ?? '') ||
    values.participants !==
      (competition.participants ? String(competition.participants) : '') ||
    values.imageFile !== null;

  useBeforeUnload(isDirty);

  const handleSubmit = async () => {
    if (
      !values.name.trim() ||
      !values.location.trim() ||
      !values.eventDate ||
      !values.applyDeadline
    ) {
      showErrorToast('필수 항목을 모두 입력해주세요.');
      return;
    }
    if (!isDirty) {
      showErrorToast('수정된 내용이 없습니다.');
      return;
    }

    setIsLoading(true);
    try {
      let image_url: string | undefined = values.preview ?? undefined;
      if (values.imageFile) {
        image_url = await uploadCompetitionImage(values.imageFile);
      }
      await updateCompetition(competition.id, {
        name: values.name,
        location: values.location,
        event_data: values.eventDate,
        apply_deadline: values.applyDeadline,
        apply_url: values.applyUrl.startsWith('http')
          ? values.applyUrl
          : `https://${values.applyUrl}`,
        description: values.description,
        image_url,
        participants: values.participants ? Number(values.participants) : 0,
      });
      showSuccessToast('대회일정이 수정되었습니다.', '✅');
      await queryClient.invalidateQueries({ queryKey: ['competition'] });
      await new Promise((resolve) => setTimeout(resolve, 700));

      setValues({
        name: values.name,
        location: values.location,
        eventDate: values.eventDate,
        applyDeadline: values.applyDeadline,
        applyUrl: values.applyUrl,
        description: values.description,
        participants: values.participants,
        preview: image_url ?? values.preview,
        imageFile: null,
      });
      setIsLoading(false);
      await revalidateCompetitions();
      await revalidateCompetition(competition.id);
      router.push(buildCompetitionUrl(values.name, competition.id));
    } catch {
      showErrorToast('대회 수정에 실패했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6" aria-label="대회 수정">
      <div className="relative w-full flex items-center justify-center mb-6">
        <h1 className="text-lg font-semibold">대회 수정</h1>
      </div>
      <CompetitionForm values={values} onChange={setValues} />
      <PostFormActions
        onCancel={() => {
          if (isDirty) {
            setCancelModalOpen(true);
          } else {
            showErrorToast('수정된 내용이 없습니다.');
            router.push(buildCompetitionUrl(values.name, competition.id));
          }
        }}
        onSubmit={handleSubmit}
        submitLabel="수정하기"
        isLoading={isLoading}
      />

      <ConfirmModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={() => {
          setValues({
            name: competition.name ?? '',
            location: competition.location ?? '',
            eventDate: competition.event_data ?? '',
            applyDeadline: competition.apply_deadline ?? '',
            applyUrl: competition.apply_url ?? '',
            description: competition.description ?? '',
            participants: competition.participants
              ? String(competition.participants)
              : '',
            preview: competition.image_url ?? null,
            imageFile: null,
          });
          router.push(buildCompetitionUrl(competition.name, competition.id));
        }}
        title="수정 취소"
        description="수정 중인 내용이 있습니다. 정말 나가시겠습니까?"
      />
    </main>
  );
}
