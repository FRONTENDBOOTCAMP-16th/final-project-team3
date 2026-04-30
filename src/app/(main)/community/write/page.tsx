'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PostCategory } from '@/types/community';
import Image from 'next/image';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { supabase } from '@/lib/supabase';
import { createPost, uploadPostImage } from '@/services/communityService';
import { useAuth } from '@/hooks/useAuth';

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { user } = useAuth();
  const category: PostCategory =
    user?.role === 'manager'
      ? 'promo'
      : user?.role === 'admin'
        ? 'notice'
        : 'personal';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('로그인이 필요합니다.');

      let image_url: string | undefined;
      if (imageFile) {
        image_url = await uploadPostImage(imageFile);
      }

      await createPost({
        category,
        title,
        content,
        image_url,
        user_id: user.id,
      });
      router.push('/community');
    } catch (e) {
      console.error(e);
      alert('게시글 작성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="w-full flex items-center mb-6">
        <h1 className="text-lg font-semibold mx-auto">게시글 작성</h1>
      </div>

      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <p className="text-sm text-gray-500 mb-2">게시글 유형</p>
        <div className="py-2 px-3 rounded-lg text-sm font-medium bg-black text-white text-center">
          {user?.role === 'manager'
            ? '도장 홍보'
            : user?.role === 'admin'
              ? '공지'
              : '일반 게시글'}
        </div>
      </div>

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

      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <p className="text-sm text-gray-500 mb-2">이미지 (선택)</p>
        <label className="block cursor-pointer">
          {preview ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="preview"
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
            onChange={handleImageChange}
          />
        </label>
      </div>

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
          className="flex-1 py-3 rounded-xl bg-btn-basic border border-gray-300 text-black hover:bg-gray-200"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="flex-3 py-3 rounded-xl bg-black text-white text-sm font-medium cursor-pointer"
        >
          작성하기
        </button>
      </div>
    </div>
  );
}
