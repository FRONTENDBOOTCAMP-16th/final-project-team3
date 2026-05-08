'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';
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

interface CompetitionEditClientProps {
  competition: Competition;
}

export default function CompetitionEditClient({
  competition,
}: CompetitionEditClientProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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
      router.push(`/competitions/${competition.id}`);
    } catch {
      showErrorToast('대회 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <main className="max-w-2xl mx-auto p-6" aria-label="대회 수정">
      <div className="relative w-full flex items-center justify-center mb-6">
        <h1 className="text-lg font-semibold">대회 수정</h1>
      </div>
      <CompetitionForm values={values} onChange={setValues} />
      <PostFormActions
        onCancel={() => router.back()}
        onSubmit={handleSubmit}
        submitLabel="수정하기"
      />
    </main>
  );
}
