'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createCompetition,
  uploadCompetitionImage,
} from '@/services/competitionService';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import PostFormActions from '@/components/community/PostFormActions';
import { useQueryClient } from '@tanstack/react-query';
import CompetitionForm, {
  CompetitionFormValues,
} from '@/components/competition/CompetitionForm';
import CompetitionDetailCard from '@/components/competition/CompetitionDetailCard';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';

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
    <div className="max-w-2xl mx-auto p-6">
      <div className="relative w-full flex items-center justify-center mb-6">
        <h1 className="text-lg font-semibold">대회 추가</h1>
      </div>

      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setTab('write')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            tab === 'write' ? 'bg-white text-black shadow-sm' : 'text-gray-500'
          }`}
        >
          작성
        </button>
        <button
          onClick={() => setTab('preview')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            tab === 'preview'
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-500'
          }`}
        >
          미리보기
        </button>
      </div>

      {tab === 'write' && (
        <CompetitionForm values={values} onChange={setValues} />
      )}

      {tab === 'preview' &&
        (!values.name && !values.description ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 mb-6">
            <p className="text-sm">작성 탭에서 내용을 입력하면</p>
            <p className="text-sm">여기서 미리볼 수 있어요.</p>
          </div>
        ) : (
          <div className="mb-6">
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
          </div>
        ))}

      <PostFormActions
        onCancel={() => router.back()}
        onSubmit={handleSubmit}
        submitLabel="추가하기"
        isLoading={isLoading}
      />
    </div>
  );
}
