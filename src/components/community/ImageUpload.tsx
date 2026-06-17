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
      style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</p>
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
                  background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff', fontSize: '14px', lineHeight: 1,
                }}
              >
                ✕
              </button>
            )}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center h-32 rounded-lg border-2 border-dashed"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.12)' }}
          >
            <span className="text-2xl mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>↑</span>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>클릭하여 이미지 업로드</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>JPG, PNG, GIF (최대 10MB)</p>
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
        <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
          이미지를 선택하지 않으면 기본 이미지가 표시됩니다.
        </p>
      )}
    </div>
  );
}
