'use client';

import ImageUpload from '@/components/community/ImageUpload';

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
  values: CompetitionFormValues;
  onChange: (values: CompetitionFormValues) => void;
}

export default function CompetitionForm({
  values,
  onChange,
}: CompetitionFormProps) {
  const today = new Date().toISOString().split('T')[0];

  const update = (
    key: keyof CompetitionFormValues,
    value: string | File | null,
  ) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <>
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <p className="text-sm text-gray-500 mb-2">대회 제목</p>
        <input
          type="text"
          placeholder="예: 2026 서울 주짓수 챔피언십"
          value={values.name}
          onChange={(e) => update('name', e.target.value)}
          className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none"
        />
      </div>

      <ImageUpload
        preview={values.preview}
        label="대회 이미지 (선택)"
        onChange={(file, previewUrl) => {
          onChange({ ...values, imageFile: file, preview: previewUrl });
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
            value={values.eventDate}
            min={today}
            onChange={(e) => update('eventDate', e.target.value)}
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
            value={values.applyDeadline}
            min={today}
            onChange={(e) => update('applyDeadline', e.target.value)}
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
            value={values.location}
            onChange={(e) => update('location', e.target.value)}
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
            value={values.participants}
            onChange={(e) => update('participants', e.target.value)}
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
            value={values.applyUrl}
            onChange={(e) => update('applyUrl', e.target.value)}
            className="w-full bg-gray-50 rounded-lg pl-9 pr-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <p className="text-sm text-gray-500 mb-2">대회 설명</p>
        <textarea
          placeholder="대회에 대한 상세 설명을 입력하세요"
          value={values.description}
          onChange={(e) => update('description', e.target.value)}
          rows={6}
          className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none resize-none"
        />
      </div>
    </>
  );
}
