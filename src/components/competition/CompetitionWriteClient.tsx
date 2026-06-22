'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCompetition, uploadCompetitionImage } from '@/services/competitionService';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { useQueryClient } from '@tanstack/react-query';
import type { CompetitionFormValues } from '@/components/competition/CompetitionForm';
import CompetitionDetailCard from '@/components/competition/CompetitionDetailCard';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';
import { revalidateCompetitions } from '@/actions/competition/competitions';
import CompetitionFormBase from '@/components/competition/CompetitionFormBase';

const defaultValues: CompetitionFormValues = {
  name: '',
  location: '',
  eventDate: '',
  applyDeadline: '',
  applyUrl: '',
  description: '',
  participants: '',
  preview: null,
  imageFile: null,
};

export default function CompetitionWriteClient({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [values, setValues] = useState<CompetitionFormValues>(defaultValues);
  const [isLoading, setIsLoading] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const isDirty =
    values.name.trim() !== '' ||
    values.location.trim() !== '' ||
    values.eventDate !== '' ||
    values.applyDeadline !== '' ||
    values.applyUrl !== '' ||
    values.description.trim() !== '' ||
    values.participants !== '' ||
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
    setIsLoading(true);
    try {
      let image_url: string | undefined;
      if (values.imageFile) {
        image_url = await uploadCompetitionImage(values.imageFile);
      }
      await createCompetition({
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
        user_id: userId,
      });
      await revalidateCompetitions();
      showSuccessToast('대회일정이 추가되었습니다.', '🏆');
      await queryClient.invalidateQueries({ queryKey: ['competition'] });
      await new Promise((resolve) => setTimeout(resolve, 700));
      router.push('/competitions');
    } catch {
      showErrorToast('대회 추가에 실패했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <CompetitionFormBase
      pageTitle="대회 추가"
      values={values}
      onChange={setValues}
      tab={tab}
      onTabChange={setTab}
      showEmptyPreview={!values.name && !values.description}
      previewContent={
        <CompetitionDetailCard
          data={{
            name: values.name,
            image_url: values.preview,
            description: values.description,
            event_data: values.eventDate,
            location: values.location,
            apply_deadline: values.applyDeadline,
          }}
        />
      }
      onCancel={() => {
        if (isDirty) {
          setCancelModalOpen(true);
        } else {
          showErrorToast('작성된 내용이 없습니다.');
          router.push('/competitions');
        }
      }}
      onSubmit={handleSubmit}
      submitLabel="추가하기"
      isLoading={isLoading}
      cancelModalOpen={cancelModalOpen}
      onCancelModalClose={() => setCancelModalOpen(false)}
      onCancelConfirm={() => {
        setValues(defaultValues);
        setTab('write');
        router.push('/competitions');
      }}
      cancelModalTitle="작성 취소"
      cancelModalDescription="작성 중인 내용이 있습니다. 정말 나가시겠습니까?"
    />
  );
}
