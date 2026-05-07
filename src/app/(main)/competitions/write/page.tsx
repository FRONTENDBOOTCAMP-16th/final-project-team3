'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import {
  createCompetition,
  uploadCompetitionImage,
} from '@/services/competitionService';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { useQueryClient } from '@tanstack/react-query';
import CompetitionForm, {
  CompetitionFormValues,
} from '@/components/competition/CompetitionForm';

export default function CompetitionWritePage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (
      !loading &&
      (!user || (user.role !== 'admin' && user.role !== 'manager'))
    ) {
      router.push('/competitions');
    }
  }, [user, loading, router]);

  if (loading) return <LoadingSpinner />;

  const handleSubmit = async (values: CompetitionFormValues) => {
    if (
      !values.name.trim() ||
      !values.location.trim() ||
      !values.eventDate ||
      !values.applyDeadline
    ) {
      showErrorToast('필수 항목을 모두 입력해주세요.');
      return;
    }
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
        user_id: user?.id,
      });
      showSuccessToast('대회일정이 추가되었습니다.', '🏆');
      await queryClient.invalidateQueries({ queryKey: ['competition'] });
      router.push('/competitions');
    } catch {
      showErrorToast('대회 추가에 실패했습니다.');
    }
  };

  return (
    <CompetitionForm
      title="대회 추가"
      submitLabel="추가하기"
      onCancel={() => router.back()}
      onSubmit={handleSubmit}
    />
  );
}
