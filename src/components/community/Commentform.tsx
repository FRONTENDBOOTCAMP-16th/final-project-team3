'use client';

import { useState, useTransition } from 'react';
import { ABUSE_CONFIG } from '@/lib/CommentAbuseGuard';

interface CommentFormProps {
  postId: string;
  onCommentPosted?: () => void;
}

type Status =
  | { type: 'idle' }
  | { type: 'error'; message: string }
  | { type: 'success' };

export function CommentForm({ postId, onCommentPosted }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<Status>({ type: 'idle' });
  const [isPending, startTransition] = useTransition();

  const charCount = content.trim().length;
  const isOverLimit = charCount > ABUSE_CONFIG.MAX_LENGTH;
  const canSubmit = !isPending && !isOverLimit && charCount >= 1;

  async function handleSubmit() {
    if (!canSubmit) return;

    startTransition(async () => {
      setStatus({ type: 'idle' });
      try {
        const res = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId, content }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus({ type: 'error', message: data.error });
          return;
        }

        setContent('');
        setStatus({ type: 'success' });
        onCommentPosted?.();
        setTimeout(() => setStatus({ type: 'idle' }), 2000);
      } catch {
        setStatus({ type: 'error', message: '네트워크 오류가 발생했습니다.' });
      }
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="댓글을 입력하세요... (Ctrl+Enter로 작성)"
          disabled={isPending}
          rows={3}
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:opacity-50 disabled:bg-gray-50"
        />
        <span
          className={`absolute bottom-2 right-3 text-xs
            ${isOverLimit ? 'text-red-500 font-medium' : 'text-gray-400'}`}
        >
          {charCount} / {ABUSE_CONFIG.MAX_LENGTH}
        </span>
      </div>

      {status.type === 'error' && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span>⚠️</span> {status.message}
        </p>
      )}
      {status.type === 'success' && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <span>✓</span> 댓글이 작성되었습니다.
        </p>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">Ctrl+Enter로 빠르게 작성</p>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium
                     hover:bg-blue-700 active:scale-95 transition-all
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isPending ? '작성 중...' : '작성'}
        </button>
      </div>
    </div>
  );
}
