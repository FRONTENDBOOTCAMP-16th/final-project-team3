'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PostCategory } from '@/types/community';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { use } from 'react';
import {
  getPost,
  updatePost,
  uploadPostImage,
} from '@/services/communityService';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import ImageUpload from '@/components/community/ImageUpload';
import PostFormActions from '@/components/community/PostFormActions';

export default function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('personal');
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const load = async () => {
      try {
        const post = await getPost(id);
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category);
        if (post.image_url) setPreview(post.image_url);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      showErrorToast('제목과 내용을 모두 입력해주세요.');
      return;
    }
    try {
      let image_url: string | undefined;
      if (imageFile) {
        image_url = await uploadPostImage(imageFile);
      }
      await updatePost(id, { title, content, image_url });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      showSuccessToast('게시글이 수정되었습니다.', '✅');
      router.push(`/community/${id}`);
    } catch {
      showErrorToast('게시글 수정에 실패했습니다.');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="w-full flex items-center mb-6">
        <h1 className="text-lg font-semibold mx-auto">게시글 수정</h1>
      </div>

      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <p className="text-sm text-gray-500 mb-2">게시글 유형</p>
        <div className="py-2 px-3 rounded-lg text-sm font-medium bg-black text-white text-center">
          {category === 'promo'
            ? '도장 홍보'
            : category === 'notice'
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

      <ImageUpload
        preview={preview}
        onChange={(file, previewUrl) => {
          setImageFile(file);
          setPreview(previewUrl);
        }}
      />

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

      <PostFormActions
        onCancel={() => router.back()}
        onSubmit={handleSubmit}
        submitLabel="수정하기"
      />
    </div>
  );
}
