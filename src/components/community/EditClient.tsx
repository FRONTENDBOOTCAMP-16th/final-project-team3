'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import type { Post, PostCategory } from '@/types/community';
import { updatePost, uploadPostImage, uploadPostVideo } from '@/services/communityService';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import ImageUpload from '@/components/community/ImageUpload';
import VideoUpload from '@/components/community/VideoUpload';
import PostFormActions from '@/components/community/PostFormActions';
import { LimitedInput } from '../common/LimitedInput';
import { LimitedTextarea } from '../common/LimitedTextarea';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';
import ConfirmModal from '@/components/common/ConfirmModal';
import { buildPostUrl } from '@/lib/slug';

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
  const [videoPreview, setVideoPreview] = useState<string | null>(
    initialPost.video_url ?? null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [videoRemoved, setVideoRemoved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const isDirty =
    title !== initialPost.title ||
    content !== initialPost.content ||
    imageFile !== null ||
    imageRemoved ||
    videoFile !== null ||
    videoRemoved;

  useBeforeUnload(isDirty);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      showErrorToast('제목과 내용을 모두 입력해주세요.');
      return;
    }

    if (!isDirty) {
      showErrorToast('수정된 내용이 없습니다.');
      return;
    }

    setIsLoading(true);
    try {
      const image_url = imageFile
        ? await uploadPostImage(imageFile)
        : imageRemoved ? null : undefined;
      const video_url = videoFile
        ? await uploadPostVideo(videoFile)
        : videoRemoved ? null : undefined;

      await updatePost(id, { title, content, image_url, video_url });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      showSuccessToast('게시글이 수정되었습니다.', '✅');
      await new Promise((resolve) => setTimeout(resolve, 700));

      setTitle(title);
      setContent(content);
      setPreview(image_url ?? preview);
      setVideoPreview(video_url ?? videoPreview);
      setImageFile(null);
      setVideoFile(null);
      setIsLoading(false);
      router.refresh();
      router.push(buildPostUrl(title, id));
    } catch {
      showErrorToast('게시글 수정에 실패했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen" style={{ background: '#111' }}>
      <div className="w-full flex items-center mb-6">
        <h1 className="text-lg font-semibold mx-auto">게시글 수정</h1>
      </div>

      <div
        className="rounded-xl p-4 mb-4"
        style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>게시글 유형</p>
        <div
          aria-label={`게시글 유형: ${category === 'promo' ? '도장 홍보' : category === 'notice' ? '공지' : '일반 게시글'}`}
          className="py-2 px-3 rounded-lg text-sm font-medium text-white text-center"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          {category === 'promo'
            ? '도장 홍보'
            : category === 'notice'
              ? '공지'
              : '일반 게시글'}
        </div>
      </div>

      <div
        className="rounded-xl p-4 mb-4"
        style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <label
          htmlFor="post-title"
          className="text-sm mb-2 block"
          style={{ color: 'rgba(255,255,255,0.5)' }}
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
          setImageRemoved(false);
        }}
        onRemove={() => {
          setImageFile(null);
          setPreview(null);
          setImageRemoved(true);
        }}
      />

      <VideoUpload
        preview={videoPreview}
        onChange={(file, previewUrl) => {
          setVideoFile(file);
          setVideoPreview(previewUrl);
          setVideoRemoved(false);
        }}
        onRemove={() => {
          setVideoFile(null);
          setVideoPreview(null);
          setVideoRemoved(true);
        }}
      />

      <div
        className="rounded-xl p-4 mb-6"
        style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <label
          htmlFor="post-content"
          className="text-sm mb-2 block"
          style={{ color: 'rgba(255,255,255,0.5)' }}
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
        onCancel={() => {
          if (isDirty) {
            setCancelModalOpen(true);
          } else {
            showErrorToast('수정된 내용이 없습니다.');
            router.push(buildPostUrl(initialPost.title, id));
          }
        }}
        onSubmit={handleSubmit}
        submitLabel="수정하기"
        isLoading={isLoading}
      />

      <ConfirmModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={() => {
          setTitle(initialPost.title);
          setContent(initialPost.content);
          setPreview(initialPost.image_url ?? null);
          setVideoPreview(initialPost.video_url ?? null);
          setImageFile(null);
          setVideoFile(null);
          router.push(buildPostUrl(initialPost.title, id));
        }}
        title="수정 취소"
        description="수정 중인 내용이 있습니다. 정말 나가시겠습니까?"
      />
    </div>
  );
}
