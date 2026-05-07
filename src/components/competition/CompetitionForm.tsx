// components/competition/CompetitionForm.tsx
'use client';

import { useState } from 'react';
import ImageUpload from '@/components/community/ImageUpload';
import PostFormActions from '@/components/community/PostFormActions';
import CompetitionDetailCard from '@/components/competition/CompetitionDetailCard';

export interface CompetitionFormValues {
  name: string;
  location: string;
  eventDate: string;
  applyDeadline: string;
  applyUrl: string;
  description: string;
  participants: string;
  preview: string | null;
  imageFile: File | null;
}

interface CompetitionFormProps {
  initialValues?: Partial<CompetitionFormValues>;
  onSubmit: (values: CompetitionFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
  title: string;
}

export default function CompetitionForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  title,
}: CompetitionFormProps) {
  const today = new Date().toISOString().split('T')[0];
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [name, setName] = useState(initialValues?.name ?? '');
  const [location, setLocation] = useState(initialValues?.location ?? '');
  const [eventDate, setEventDate] = useState(initialValues?.eventDate ?? '');
  const [applyDeadline, setApplyDeadline] = useState(
    initialValues?.applyDeadline ?? '',
  );
  const [applyUrl, setApplyUrl] = useState(initialValues?.applyUrl ?? '');
  const [description, setDescription] = useState(
    initialValues?.description ?? '',
  );
  const [participants, setParticipants] = useState(
    initialValues?.participants ?? '',
  );
  const [preview, setPreview] = useState<string | null>(
    initialValues?.preview ?? null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    await onSubmit({
      name,
      location,
      eventDate,
      applyDeadline,
      applyUrl,
      description,
      participants,
      preview,
      imageFile,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* 헤더 */}
      <div className="relative w-full flex items-center justify-center mb-6">
        <h1 className="text-lg font-semibold">{title}</h1>
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

          <ImageUpload
            preview={preview}
            label="대회 이미지 (선택)"
            onChange={(file, previewUrl) => {
              setImageFile(file);
              setPreview(previewUrl);
            }}
          />

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

      <PostFormActions
        onCancel={onCancel}
        onSubmit={handleSubmit}
        submitLabel={submitLabel}
      />
    </div>
  );
}
