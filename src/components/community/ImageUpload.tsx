'use client';

import Image from 'next/image';
import { showErrorToast } from '@/lib/toast';

interface ImageUploadProps {
  preview: string | null;
  onChange: (_file: File, _previewUrl: string) => void;
  onRemove?: () => void;
  label?: string;
}

export default function ImageUpload({
  preview,
  onChange,
  onRemove,
  label = '이미지 (선택)',
}: ImageUploadProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      showErrorToast('파일 용량은 10MB를 초과할 수 없습니다.');
      e.target.value = '';
      return;
    }
    onChange(file, URL.createObjectURL(file));
  };

  return (
    <div
      className="rounded-xl p-4 mb-4"
      style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
    >
      <p className="text-sm mb-2" style={{ color: 'var(--color-text-tertiary)' }}>{label}</p>
      <label className="block cursor-pointer">
        {preview ? (
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image
              src={preview}
              alt="업로드한 이미지 미리보기"
              fill={true}
              className="object-cover"
            />
            {onRemove && (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
                aria-label="이미지 삭제"
                style={{
                  position: 'absolute', top: '8px', right: '8px',
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'var(--color-overlay)', border: '1px solid var(--color-border-strong)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--color-text-primary)', fontSize: '14px', lineHeight: 1,
                }}
              >
                ✕
              </button>
            )}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center h-32 rounded-lg border-2 border-dashed"
            style={{ background: 'var(--color-bg-tint)', borderColor: 'var(--color-border-medium)' }}
          >
            <span className="text-2xl mb-1" style={{ color: 'var(--color-text-hint)' }}>↑</span>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>클릭하여 이미지 업로드</p>
            <p className="text-xs" style={{ color: 'var(--color-text-hint)' }}>JPG, PNG, GIF (최대 10MB)</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          aria-label={label}
          onChange={handleChange}
        />
      </label>
      {!preview && (
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-hint)' }}>
          이미지를 선택하지 않으면 기본 이미지가 표시됩니다.
        </p>
      )}
    </div>
  );
}
