'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import type { Post, PostCategory } from '@/types/community';
import { updatePost, uploadPostImage } from '@/services/communityService';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import ImageUpload from '@/components/community/ImageUpload';
import PostFormActions from '@/components/community/PostFormActions';
import { LimitedInput } from '../common/LimitedInput';
import { LimitedTextarea } from '../common/LimitedTextarea';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';

interface Props {
  id: string;
  initialPost: Post;
}

export default function EditClient({ id, initialPost }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(initialPost.title);
  const [content, setContent] = useState(initialPost.content);
  const [category] = useState<PostCategory>(initialPost.category);
  const [preview, setPreview] = useState<string | null>(
    initialPost.image_url ?? null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 초기값과 달라졌는지 체크
  const isDirty =
    title !== initialPost.title ||
    content !== initialPost.content ||
    imageFile !== null;

  useBeforeUnload(isDirty);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      showErrorToast('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const image_url = imageFile
        ? await uploadPostImage(imageFile)
        : undefined;
      await updatePost(id, { title, content, image_url });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      showSuccessToast('게시글이 수정되었습니다.', '✅');
      router.push(`/community/${id}`);
    } catch {
      showErrorToast('게시글 수정에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="w-full flex items-center mb-6">
        <h1 className="text-lg font-semibold mx-auto">게시글 수정</h1>
      </div>

      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <p className="text-sm text-gray-500 mb-2">게시글 유형</p>
        <div
          aria-label={`게시글 유형: ${category === 'promo' ? '도장 홍보' : category === 'notice' ? '공지' : '일반 게시글'}`}
          className="py-2 px-3 rounded-lg text-sm font-medium bg-black text-white text-center"
        >
          {category === 'promo'
            ? '도장 홍보'
            : category === 'notice'
              ? '공지'
              : '일반 게시글'}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <label
          htmlFor="post-title"
          className="text-sm text-gray-500 mb-2 block"
        >
          제목
        </label>
        <LimitedInput
          id="post-title"
          value={title}
          onChange={setTitle}
          maxLength={35}
          placeholder="제목을 입력하세요"
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
        <label
          htmlFor="post-content"
          className="text-sm text-gray-500 mb-2 block"
        >
          내용
        </label>
        <LimitedTextarea
          id="post-content"
          value={content}
          onChange={setContent}
          maxLength={5000}
          rows={8}
          placeholder="내용을 입력하세요"
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
