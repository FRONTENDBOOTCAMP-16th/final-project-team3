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
    <div role="form" aria-label="대회 정보 입력 폼">
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <label
          htmlFor="competition-name"
          className="text-sm text-gray-500 mb-2 block"
        >
          대회 제목{' '}
          <span aria-hidden="true" className="text-red-400">
            *
          </span>
          <span className="sr-only">(필수)</span>
        </label>
        <input
          id="competition-name"
          type="text"
          placeholder="예: 2026 서울 주짓수 챔피언십"
          value={values.name}
          onChange={(e) => update('name', e.target.value)}
          aria-required="true"
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
        <label
          htmlFor="event-date"
          className="text-sm text-gray-500 mb-2 block"
        >
          대회 날짜{' '}
          <span aria-hidden="true" className="text-red-400">
            *
          </span>
          <span className="sr-only">(필수)</span>
        </label>
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          >
            📅
          </span>
          <input
            id="event-date"
            type="date"
            value={values.eventDate}
            min={today}
            onChange={(e) => update('eventDate', e.target.value)}
            onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
            aria-required="true"
            className="w-full bg-gray-50 rounded-lg pl-9 pr-3 py-2 text-sm outline-none text-gray-700 cursor-pointer"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <label
          htmlFor="apply-deadline"
          className="text-sm text-gray-500 mb-2 block"
        >
          신청 마감 날짜{' '}
          <span aria-hidden="true" className="text-red-400">
            *
          </span>
          <span className="sr-only">(필수)</span>
        </label>
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          >
            📅
          </span>
          <input
            id="apply-deadline"
            type="date"
            value={values.applyDeadline}
            min={today}
            onChange={(e) => update('applyDeadline', e.target.value)}
            onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
            aria-required="true"
            className="w-full bg-gray-50 rounded-lg pl-9 pr-3 py-2 text-sm outline-none text-gray-700 cursor-pointer"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <label
          htmlFor="competition-location"
          className="text-sm text-gray-500 mb-2 block"
        >
          대회 장소{' '}
          <span aria-hidden="true" className="text-red-400">
            *
          </span>
          <span className="sr-only">(필수)</span>
        </label>
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          >
            📍
          </span>
          <input
            id="competition-location"
            type="text"
            placeholder="예: 잠실 체육관"
            value={values.location}
            onChange={(e) => update('location', e.target.value)}
            aria-required="true"
            className="w-full bg-gray-50 rounded-lg pl-9 pr-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <label
          htmlFor="competition-participants"
          className="text-sm text-gray-500 mb-2 block"
        >
          모집 인원
        </label>
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          >
            👥
          </span>
          <input
            id="competition-participants"
            type="number"
            placeholder="예: 100"
            value={values.participants}
            onChange={(e) => update('participants', e.target.value)}
            min={1}
            className="w-full bg-gray-50 rounded-lg pl-9 pr-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <label htmlFor="apply-url" className="text-sm text-gray-500 mb-2 block">
          참가 신청 링크
        </label>
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          >
            🔗
          </span>
          <input
            id="apply-url"
            type="url"
            placeholder="https://example.com/register"
            value={values.applyUrl}
            onChange={(e) => update('applyUrl', e.target.value)}
            className="w-full bg-gray-50 rounded-lg pl-9 pr-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <label
          htmlFor="competition-description"
          className="text-sm text-gray-500 mb-2 block"
        >
          대회 설명
        </label>
        <textarea
          id="competition-description"
          placeholder="대회에 대한 상세 설명을 입력하세요"
          value={values.description}
          onChange={(e) => update('description', e.target.value)}
          rows={6}
          className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none resize-none"
        />
      </div>
    </div>
  );
}
