'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PostCategory } from '@/types/community';
import { createPost, uploadPostImage } from '@/services/communityService';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import ImageUpload from '@/components/community/ImageUpload';
import PostFormActions from '@/components/community/PostFormActions';
import PostDetailCard from '@/components/community/PostDetailCard';
import { LimitedInput } from '../common/LimitedInput';
import { LimitedTextarea } from '../common/LimitedTextarea';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';
import ConfirmModal from '@/components/common/ConfirmModal';

export default function WriteClient() {
  const router = useRouter();
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { user } = useAuth();
  const [category, setCategory] = useState<PostCategory>('personal');
  const queryClient = useQueryClient();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const isDirty =
    title.trim() !== '' || content.trim() !== '' || imageFile !== null;

  useBeforeUnload(isDirty);

  const getFinalCategory = (): PostCategory =>
    user?.role === 'admin'
      ? 'notice'
      : user?.role === 'manager'
        ? category
        : 'personal';

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      showErrorToast('제목과 내용을 모두 입력해주세요.');
      return;
    }
    if (!user) return;

    setIsLoading(true);
    try {
      const image_url = imageFile
        ? await uploadPostImage(imageFile)
        : undefined;

      await createPost({
        category: getFinalCategory(),
        title,
        content,
        image_url,
        user_id: user.id,
      });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      showSuccessToast('게시글이 업로드되었습니다.', '📝');
      setTitle('');
      setContent('');
      setImageFile(null);
      setPreview(null);
      setCategory('personal');
      await new Promise((resolve) => setTimeout(resolve, 700));
      router.push('/community');
    } catch {
      showErrorToast('게시글 작성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="w-full flex items-center mb-6">
        <h1 className="text-lg font-semibold mx-auto">게시글 작성</h1>
      </div>

      <div role="tablist" className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          role="tab"
          aria-selected={tab === 'write'}
          onClick={() => setTab('write')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            tab === 'write' ? 'bg-white text-black shadow-sm' : 'text-gray-500'
          }`}
        >
          작성
        </button>
        <button
          role="tab"
          aria-selected={tab === 'preview'}
          onClick={() => setTab('preview')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            tab === 'preview'
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-500'
          }`}
        >
          미리보기
        </button>
      </div>

      {tab === 'write' && (
        <>
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">게시글 유형</p>
            {user?.role === 'manager' ? (
              <div className="flex gap-2">
                {(['personal', 'promo'] as PostCategory[]).map((type) => (
                  <button
                    key={type}
                    aria-pressed={category === type}
                    onClick={() => setCategory(type)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                      category === type
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {type === 'personal' ? '일반 게시글' : '도장 홍보'}
                  </button>
                ))}
              </div>
            ) : (
              <div
                aria-label={`게시글 유형: ${user?.role === 'admin' ? '공지' : '일반 게시글'}`}
                className="py-2 px-3 rounded-lg text-sm font-medium bg-black text-white text-center"
              >
                {user?.role === 'admin' ? '공지' : '일반 게시글'}
              </div>
            )}
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
        </>
      )}

      {tab === 'preview' &&
        (!title && !content ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 mb-6">
            <p className="text-sm">작성 탭에서 내용을 입력하면</p>
            <p className="text-sm">여기서 미리볼 수 있어요.</p>
          </div>
        ) : (
          <div className="mb-6">
            <PostDetailCard
              post={{
                nickname: user?.name ?? '알 수 없음',
                avatar_url: user?.image ?? null,
                category: getFinalCategory(),
                created_at: new Date().toISOString(),
                title,
                image_url: preview,
                content,
                likeCount: 0,
                commentCount: 0,
                view_count: 0,
              }}
            />
          </div>
        ))}

      <PostFormActions
        onCancel={() => {
          if (isDirty) {
            setCancelModalOpen(true);
          } else {
            showErrorToast('작성된 내용이 없습니다.');
            router.push('/community');
          }
        }}
        onSubmit={handleSubmit}
        submitLabel="작성하기"
        isLoading={isLoading}
      />
      <ConfirmModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={() => {
          setTitle('');
          setContent('');
          setImageFile(null);
          setPreview(null);
          setCategory('personal');
          setTab('write');
          router.push('/community');
        }}
        title="작성 취소"
        description="작성 중인 내용이 있습니다. 정말 나가시겠습니까?"
      />
    </div>
  );
}
