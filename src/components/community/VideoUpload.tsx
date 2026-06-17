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
      style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>동영상 (선택)</p>

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
                background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff', fontSize: '14px', lineHeight: '1',
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
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.12)' }}
          >
            <span className="text-2xl mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>▶</span>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>클릭하여 동영상 업로드</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>MP4, MOV, WEBM (최대 50MB)</p>
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
