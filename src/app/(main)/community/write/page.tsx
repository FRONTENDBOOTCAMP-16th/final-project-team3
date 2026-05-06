'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PostCategory } from '@/types/community';
import Image from 'next/image';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { supabase } from '@/lib/supabase';
import { createPost, uploadPostImage } from '@/services/communityService';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import ImageUpload from '@/components/community/ImageUpload';

export default function WritePage() {
  const router = useRouter();
  const [tab, setTab] = useState<'write' | 'preview'>('write'); // ✅ 추가
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { user, loading } = useAuth();
  const [category, setCategory] = useState<PostCategory>('personal');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || isLoading) return <LoadingSpinner />;

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      showErrorToast('제목과 내용을 모두 입력해주세요.');
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
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      showSuccessToast('게시글이 업로드되었습니다.', '📝');
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

      {/* ✅ 탭 버튼 추가 */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setTab('write')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            tab === 'write' ? 'bg-white text-black shadow-sm' : 'text-gray-500'
          }`}
        >
          작성
        </button>
        <button
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

      {/* ✅ 작성 탭 */}
      {tab === 'write' && (
        <>
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">게시글 유형</p>
            {user?.role === 'manager' ? (
              <div className="flex gap-2">
                {(['personal', 'promo'] as PostCategory[]).map((type) => (
                  <button
                    key={type}
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
              <div className="py-2 px-3 rounded-lg text-sm font-medium bg-black text-white text-center">
                {user?.role === 'admin' ? '공지' : '일반 게시글'}
              </div>
            )}
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
        </>
      )}

      {/* ✅ 미리보기 탭 */}
      {tab === 'preview' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {!title && !content ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <p className="text-sm">작성 탭에서 내용을 입력하면</p>
              <p className="text-sm">여기서 미리볼 수 있어요.</p>
            </div>
          ) : (
            <>
              {/* 작성자 헤더 */}
              <div className="flex items-center gap-3 px-5 pt-5 pb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                  {user?.image && (
                    <Image
                      src={user.image}
                      alt="프로필"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  {/* ✅ 닉네임 + role 뱃지 추가 */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-gray-900">
                      {user?.name ?? '알 수 없음'}
                    </span>
                    {user?.role && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          category === 'promo'
                            ? 'bg-blue-50 text-blue-600'
                            : user?.role === 'admin'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {category === 'promo'
                          ? '도장'
                          : user?.role === 'admin'
                            ? '공지'
                            : '일반'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">방금 전</p>
                </div>
              </div>

              {/* 제목 */}
              <div className="px-5 pb-3">
                <h1 className="text-lg font-bold text-gray-900">{title}</h1>
              </div>

              {/* 이미지 */}
              {preview && (
                <div className="px-5 pb-4">
                  <div className="rounded-xl overflow-hidden">
                    <Image
                      src={preview}
                      alt="게시글 이미지"
                      width={800}
                      height={400}
                      className="w-full object-cover max-h-72"
                    />
                  </div>
                </div>
              )}

              {/* 본문 */}
              <div className="px-5 pb-5">
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {content}
                </p>
              </div>

              {/* 하단 바 */}
              <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-4">
                <span className="text-xs text-gray-400">좋아요 0</span>
                <span className="text-xs text-gray-400">댓글 0</span>
                <span className="text-xs text-gray-400">조회 0</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* 기존 하단 버튼 (그대로 유지) */}
      <div className="flex gap-3">
        <button
          onClick={() => router.back()}
          className="flex-1 py-3 rounded-xl bg-btn-basic border border-gray-300 text-black hover:bg-gray-200 cursor-pointer"
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
