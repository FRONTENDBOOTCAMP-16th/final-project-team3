'use client';

import { useRef } from 'react';
import { showErrorToast } from '@/lib/toast';

interface VideoUploadProps {
  preview: string | null;
  onChange: (_file: File, _previewUrl: string) => void;
  onRemove?: () => void;
}

export default function VideoUpload({ preview, onChange, onRemove }: VideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      showErrorToast('동영상 용량은 50MB를 초과할 수 없습니다.');
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
      <p className="text-sm mb-2" style={{ color: 'var(--color-text-tertiary)' }}>동영상 (선택)</p>

      {preview ? (
        <div className="relative rounded-lg overflow-hidden">
          <video
            src={preview}
            controls
            className="w-full max-h-72 rounded-lg bg-black"
          />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label="동영상 삭제"
              style={{
                position: 'absolute', top: '8px', right: '8px',
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'var(--color-overlay)', border: '1px solid var(--color-border-strong)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--color-text-primary)', fontSize: '14px', lineHeight: '1',
              }}
            >
              ✕
            </button>
          )}
        </div>
      ) : (
        <label className="block cursor-pointer">
          <div
            className="flex flex-col items-center justify-center h-32 rounded-lg border-2 border-dashed"
            style={{ background: 'var(--color-bg-tint)', borderColor: 'var(--color-border-medium)' }}
          >
            <span className="text-2xl mb-1" style={{ color: 'var(--color-text-hint)' }}>▶</span>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>클릭하여 동영상 업로드</p>
            <p className="text-xs" style={{ color: 'var(--color-text-hint)' }}>MP4, MOV, WEBM (최대 50MB)</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            aria-label="동영상 업로드"
            onChange={handleChange}
          />
        </label>
      )}
    </div>
  );
}
