'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import {
  createCompetition,
  uploadCompetitionImage,
} from '@/services/competitionService';

export default function CompetitionWritePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [applyDeadline, setApplyDeadline] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (
      !loading &&
      (!user || (user.role !== 'admin' && user.role !== 'manager'))
    ) {
      router.push('/competitions');
    }
  }, [user, loading, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !location.trim() || !eventDate || !applyDeadline) {
      alert('필수 항목을 모두 입력해주세요.');
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
        apply_url: applyUrl,
        description,
        image_url,
      });
      router.push('/competitions');
    } catch (e) {
      console.error(e);
      alert('대회 추가에 실패했습니다.');
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
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <p className="text-sm text-gray-500 mb-2">대회 이미지 (선택)</p>
        <label className="block cursor-pointer">
          {preview ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="preview"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <span className="text-3xl mb-2">↑</span>
              <p className="text-sm text-gray-500">클릭하여 이미지 업로드</p>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG, GIF (최대 10MB)
              </p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>

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

      {/* 버튼 */}
      <div className="flex gap-3">
        <button
          onClick={() => router.back()}
          className="flex-1 py-3 rounded-xl bg-btn-basic border border-gray-300 text-black hover:bg-gray-200 cursor-pointer"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="flex-3 py-3 rounded-xl bg-black text-white text-sm font-medium cursor-pointer"
        >
          추가하기
        </button>
      </div>
    </div>
  );
}
