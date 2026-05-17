'use client';

import Image from 'next/image';
import { showErrorToast } from '@/lib/toast';

interface ImageUploadProps {
  preview: string | null;
  onChange: (file: File, previewUrl: string) => void;
  label?: string;
}

export default function ImageUpload({
  preview,
  onChange,
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
    <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      <label className="block cursor-pointer">
        {preview ? (
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image
              src={preview}
              alt="업로드한 이미지 미리보기"
              fill={true}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <span className="text-2xl mb-1">↑</span>
            <p className="text-sm text-gray-500">클릭하여 이미지 업로드</p>
            <p className="text-xs text-gray-400">JPG, PNG, GIF (최대 10MB)</p>
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
        <p className="text-xs text-gray-400 mt-2">
          이미지를 선택하지 않으면 기본 이미지가 표시됩니다.
        </p>
      )}
    </div>
  );
}
