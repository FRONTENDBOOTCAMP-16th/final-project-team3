'use client';

import { Check, ExternalLink, RotateCcw, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import AdminBadge from '@/components/admin/AdminBadge';
import { DOJANG_STATUS_BADGE_VARIANT_MAP } from '@/components/admin/support/constants';
import type { AdminDojangVerificationRow } from '@/components/admin/support/types';
import { formatOptionalText } from '@/components/admin/support/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';

interface AdminSupportDojangActionsProps {
  row: AdminDojangVerificationRow;
}

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
}

const actionButtonClass =
  'inline-flex h-8 items-center justify-center gap-1 rounded-md border px-2 text-xs font-medium transition-colors duration-200 cursor-pointer';

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="grid grid-cols-[104px_minmax(0,1fr)] items-start gap-3 rounded-lg bg-zinc-50 px-4 py-3">
      <dt className="text-sm font-medium text-zinc-500">{label}</dt>
      <dd className="min-w-0 text-sm text-zinc-800 break-words">{value}</dd>
    </div>
  );
}

export default function AdminSupportDojangActions({
  row,
}: AdminSupportDojangActionsProps) {
  const router = useRouter();

  const updateDojangStatus = async (
    nextStatus: 'pending' | 'approved' | 'rejected',
    confirmationMessage: string,
    failureMessage: string,
  ) => {
    const confirmed = window.confirm(confirmationMessage);

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from('dojang')
      .update({ dojang_status: nextStatus })
      .eq('id', row.id);

    if (error) {
      alert(failureMessage);
      return;
    }

    router.refresh();
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className={`${actionButtonClass} border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100`}
          >
            상세보기
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-2xl">
          <DialogHeader className="gap-3">
            <DialogTitle className="text-xl font-semibold text-zinc-900">
              {row.dojang_name}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <AdminBadge
                label={row.status}
                variant={DOJANG_STATUS_BADGE_VARIANT_MAP[row.status]}
              />
              <span className="text-sm text-zinc-500">
                요청일 {row.requested_at}
              </span>
            </DialogDescription>
          </DialogHeader>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-900">도장 인증 정보</h3>

            <dl className="space-y-2">
              <DetailItem label="도장명" value={row.dojang_name} />
              <DetailItem label="대표자" value={row.representative} />
              <DetailItem label="연락처" value={row.phone} />
              <DetailItem label="이메일" value={row.email} />
              <DetailItem label="주소" value={row.address} />
              <DetailItem label="사업자등록번호" value={row.business_number} />
              <DetailItem label="요청 날짜" value={row.requested_at} />
              <DetailItem
                label="첨부 파일"
                value={
                  row.business_file_url ? (
                    <a
                      href={row.business_file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                    >
                      파일 보기
                      <ExternalLink className="size-4" />
                    </a>
                  ) : (
                    formatOptionalText(null)
                  )
                }
              />
            </dl>
          </section>
        </DialogContent>
      </Dialog>

      {row.raw_status === 'pending' ? (
        <>
          <button
            type="button"
            onClick={() =>
              updateDojangStatus(
                'approved',
                `${row.dojang_name} 인증 요청을 승인하시겠습니까?`,
                '도장 승인에 실패했습니다.',
              )
            }
            className={`${actionButtonClass} border-green-200 bg-green-50 text-green-700 hover:bg-green-100`}
          >
            <Check className="size-4" />
            승인
          </button>

          <button
            type="button"
            onClick={() =>
              updateDojangStatus(
                'rejected',
                `${row.dojang_name} 인증 요청을 거부하시겠습니까?`,
                '도장 거부 처리에 실패했습니다.',
              )
            }
            className={`${actionButtonClass} border-red-200 bg-red-50 text-red-600 hover:bg-red-100`}
          >
            <X className="size-4" />
            거부
          </button>
        </>
      ) : null}

      {row.raw_status === 'approved' ? (
        <>
          <button
            type="button"
            onClick={() =>
              updateDojangStatus(
                'pending',
                `${row.dojang_name} 인증 상태를 검토중으로 변경하시겠습니까?`,
                '승인 취소에 실패했습니다.',
              )
            }
            className={`${actionButtonClass} border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100`}
          >
            <RotateCcw className="size-4" />
            승인취소
          </button>

          <button
            type="button"
            onClick={() =>
              updateDojangStatus(
                'rejected',
                `${row.dojang_name} 인증 상태를 거부로 변경하시겠습니까?`,
                '도장 거부 처리에 실패했습니다.',
              )
            }
            className={`${actionButtonClass} border-red-200 bg-red-50 text-red-600 hover:bg-red-100`}
          >
            <X className="size-4" />
            거부
          </button>
        </>
      ) : null}

      {row.raw_status === 'rejected' ? (
        <>
          <button
            type="button"
            onClick={() =>
              updateDojangStatus(
                'pending',
                `${row.dojang_name} 인증 상태를 다시 검토중으로 변경하시겠습니까?`,
                '재검토 처리에 실패했습니다.',
              )
            }
            className={`${actionButtonClass} border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100`}
          >
            <RotateCcw className="size-4" />
            재검토
          </button>

          <button
            type="button"
            onClick={() =>
              updateDojangStatus(
                'approved',
                `${row.dojang_name} 인증 요청을 승인하시겠습니까?`,
                '도장 승인에 실패했습니다.',
              )
            }
            className={`${actionButtonClass} border-green-200 bg-green-50 text-green-700 hover:bg-green-100`}
          >
            <Check className="size-4" />
            승인
          </button>
        </>
      ) : null}
    </div>
  );
}
