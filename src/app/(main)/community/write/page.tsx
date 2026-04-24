'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PostCategory } from '@/src/types/community';

export default function WritePage() {
  const router = useRouter();
  const [category, setCategory] = useState<PostCategory>('일반 게시글');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    // TODO: API 연동
    console.log({ category, title, content });
    router.push('/community');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <button onClick={() => router.back()} className="text-sm text-gray-500">
          ← 취소
        </button>
        <h1 className="text-lg font-semibold mx-auto">게시글 작성</h1>
      </div>

      {/* 게시글 유형 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <p className="text-sm text-gray-500 mb-2">게시글 유형</p>
        <div className="flex gap-2">
          {(['일반 게시글', '도장 홍보'] as PostCategory[]).map((type) => (
            <button
              key={type}
              onClick={() => setCategory(type)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === type
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 제목 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <p className="text-sm text-gray-500 mb-2">제목</p>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none"
        />
      </div>

      {/* 이미지 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <p className="text-sm text-gray-500 mb-2">이미지 (선택)</p>
        <label className="block cursor-pointer">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-full h-48 object-cover rounded-lg"
            />
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
            onChange={handleImageChange}
          />
        </label>
      </div>

      {/* 내용 */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <p className="text-sm text-gray-500 mb-2">내용</p>
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => router.back()}
          className="flex-1 py-3 rounded-xl border border-gray-300 text-sm text-gray-600"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="flex-[3] py-3 rounded-xl bg-black text-white text-sm font-medium"
        >
          작성하기
        </button>
      </div>
    </div>
  );
}
