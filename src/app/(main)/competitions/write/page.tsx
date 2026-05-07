'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import {
  createCompetition,
  uploadCompetitionImage,
} from '@/services/competitionService';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import ImageUpload from '@/components/community/ImageUpload';
import PostFormActions from '@/components/community/PostFormActions';
import { useQueryClient } from '@tanstack/react-query';
import CompetitionDetailCard from '@/components/competition/CompetitionDetailCard';

export default function CompetitionWritePage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [applyDeadline, setApplyDeadline] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [participants, setParticipants] = useState('');

  useEffect(() => {
    if (
      !loading &&
      (!user || (user.role !== 'admin' && user.role !== 'manager'))
    ) {
      router.push('/competitions');
    }
  }, [user, loading, router]);

  const handleSubmit = async () => {
    if (!name.trim() || !location.trim() || !eventDate || !applyDeadline) {
      showErrorToast('필수 항목을 모두 입력해주세요.');
      return;
    }
    setIsLoading(true);
    try {
      let image_url: string | undefined;
      if (imageFile) {
        image_url = await uploadCompetitionImage(imageFile);
      }
      await createCompetition({
        name,
        location,
        event_data: eventDate,
        apply_deadline: applyDeadline,
        apply_url: applyUrl.startsWith('http')
          ? applyUrl
          : `https://${applyUrl}`,
        description,
        image_url,
        participants: participants ? Number(participants) : 0,
      });
      showSuccessToast('대회일정이 추가되었습니다.', '🏆');
      await queryClient.invalidateQueries({ queryKey: ['competition'] }); // 추가
      router.push('/competitions');
    } catch {
      showErrorToast('대회 추가에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* 헤더 */}
      <div className="relative w-full flex items-center justify-center mb-6">
        <h1 className="text-lg font-semibold">대회 추가</h1>
      </div>

      {/* 탭 */}
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

      {/* 작성 탭 */}
      {tab === 'write' && (
        <>
          {/* 대회 제목 */}
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">대회 제목</p>
            <input
              type="text"
              placeholder="예: 2026 서울 주짓수 챔피언십"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none"
            />
          </div>

          {/* 대회 이미지 */}
          <ImageUpload
            preview={preview}
            label="대회 이미지 (선택)"
            onChange={(file, previewUrl) => {
              setImageFile(file);
              setPreview(previewUrl);
            }}
          />

          {/* 대회 날짜 */}
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">대회 날짜</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                📅
              </span>
              <input
                type="date"
                value={eventDate}
                min={today}
                onChange={(e) => setEventDate(e.target.value)}
                onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                className="w-full bg-gray-50 rounded-lg pl-9 pr-3 py-2 text-sm outline-none text-gray-700 cursor-pointer"
              />
            </div>
          </div>

          {/* 신청 마감 날짜 */}
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">신청 마감 날짜</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                📅
              </span>
              <input
                type="date"
                value={applyDeadline}
                min={today}
                onChange={(e) => setApplyDeadline(e.target.value)}
                onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                className="w-full bg-gray-50 rounded-lg pl-9 pr-3 py-2 text-sm outline-none text-gray-700 cursor-pointer"
              />
            </div>
          </div>

          {/* 대회 장소 */}
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">대회 장소</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                📍
              </span>
              <input
                type="text"
                placeholder="예: 잠실 체육관"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-gray-50 rounded-lg pl-9 pr-3 py-2 text-sm outline-none"
              />
            </div>
          </div>
          {/* 모집 인원 */}
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">모집 인원</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                👥
              </span>
              <input
                type="number"
                placeholder="예: 100"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                className="w-full bg-gray-50 rounded-lg pl-9 pr-3 py-2 text-sm outline-none"
                min={1}
              />
            </div>
          </div>
          {/* 참가 신청 링크 */}
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">참가 신청 링크</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔗
              </span>
              <input
                type="url"
                placeholder="https://example.com/register"
                value={applyUrl}
                onChange={(e) => setApplyUrl(e.target.value)}
                className="w-full bg-gray-50 rounded-lg pl-9 pr-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          {/* 대회 설명 */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">대회 설명</p>
            <textarea
              placeholder="대회에 대한 상세 설명을 입력하세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none resize-none"
            />
          </div>
        </>
      )}

      {/* 미리보기 탭 */}
      {tab === 'preview' &&
        (!name && !description ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 mb-6">
            <p className="text-sm">작성 탭에서 내용을 입력하면</p>
            <p className="text-sm">여기서 미리볼 수 있어요.</p>
          </div>
        ) : (
          <div className="mb-6">
            <CompetitionDetailCard
              data={{
                name,
                image_url: preview,
                description,
                event_data: eventDate,
                location,
                apply_deadline: applyDeadline,
              }}
            />
          </div>
        ))}

      {/* 버튼 */}
      <PostFormActions
        onCancel={() => router.back()}
        onSubmit={handleSubmit}
        submitLabel="추가하기"
      />
    </div>
  );
}
