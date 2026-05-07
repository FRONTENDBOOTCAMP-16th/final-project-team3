'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import {
  getCompetition,
  updateCompetition,
  uploadCompetitionImage,
} from '@/services/competitionService';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { useQueryClient } from '@tanstack/react-query';
import CompetitionForm, {
  CompetitionFormValues,
} from '@/components/competition/CompetitionForm';

export default function CompetitionEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [initialValues, setInitialValues] =
    useState<Partial<CompetitionFormValues> | null>(null);

  useEffect(() => {
    if (
      !loading &&
      (!user || (user.role !== 'admin' && user.role !== 'manager'))
    ) {
      router.push('/competitions');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCompetition(id);
        setInitialValues({
          name: data.name ?? '',
          location: data.location ?? '',
          eventDate: data.event_data ?? '',
          applyDeadline: data.apply_deadline ?? '',
          applyUrl: data.apply_url ?? '',
          description: data.description ?? '',
          participants: data.participants ? String(data.participants) : '',
          preview: data.image_url ?? null,
        });
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [id]);

  if (loading || !initialValues) return <LoadingSpinner />;

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
      let image_url: string | undefined = values.preview ?? undefined;
      if (values.imageFile) {
        image_url = await uploadCompetitionImage(values.imageFile);
      }
      await updateCompetition(id, {
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
      router.push(`/competitions/${id}`);
    } catch {
      showErrorToast('대회 수정에 실패했습니다.');
    }
  };

  return (
    <CompetitionForm
      title="대회 수정"
      submitLabel="수정하기"
      initialValues={initialValues}
      onCancel={() => router.back()}
      onSubmit={handleSubmit}
    />
  );
}
