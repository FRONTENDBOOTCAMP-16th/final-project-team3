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
import PostFormActions from '@/components/community/PostFormActions';
import { useQueryClient } from '@tanstack/react-query';
import CompetitionForm, {
  CompetitionFormValues,
} from '@/components/competition/CompetitionForm';

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

export default function CompetitionEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [values, setValues] = useState<CompetitionFormValues>(defaultValues);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

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
        setValues({
          name: data.name ?? '',
          location: data.location ?? '',
          eventDate: data.event_data ?? '',
          applyDeadline: data.apply_deadline ?? '',
          applyUrl: data.apply_url ?? '',
          description: data.description ?? '',
          participants: data.participants ? String(data.participants) : '',
          preview: data.image_url ?? null,
          imageFile: null,
        });
        setDataLoaded(true);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [id]);

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
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading || !dataLoaded) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="relative w-full flex items-center justify-center mb-6">
        <h1 className="text-lg font-semibold">대회 수정</h1>
      </div>

      <CompetitionForm values={values} onChange={setValues} />

      <PostFormActions
        onCancel={() => router.back()}
        onSubmit={handleSubmit}
        submitLabel="수정하기"
      />
    </div>
  );
}
