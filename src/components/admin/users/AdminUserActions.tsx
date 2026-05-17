'use client';

import { ExternalLink, FileText, Power, PowerOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { toggleAdminUserAccountStatus } from '@/actions/admin/users';
import AdminBadge from '@/components/admin/AdminBadge';
import ConfirmModal from '@/components/common/ConfirmModal';
import {
  ACCOUNT_STATUS_BADGE_VARIANT_MAP,
  DOJANG_APPROVAL_BADGE_VARIANT_MAP,
  USER_TYPE_BADGE_VARIANT_MAP,
} from '@/components/admin/users/constants';
import type { AdminUserRow } from '@/components/admin/users/types';
import { formatOptionalText } from '@/components/admin/users/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

interface AdminUserActionsProps {
  user: AdminUserRow;
}

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
}

const actionButtonClass =
  'inline-flex items-center justify-center rounded-md p-2 text-zinc-500 transition-colors duration-200 hover:bg-gray-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="grid grid-cols-[104px_minmax(0,1fr)] items-start gap-3 rounded-lg bg-zinc-50 px-4 py-3">
      <dt className="text-sm font-medium text-zinc-500">{label}</dt>
      <dd className="min-w-0 text-sm text-zinc-800 break-words">{value}</dd>
    </div>
  );
}

function UserAvatar({
  avatarUrl,
  nickname,
  sizeClassName,
}: {
  avatarUrl: string | null;
  nickname: string;
  sizeClassName: string;
}) {
  if (avatarUrl) {
    return (
      <div
        role="img"
        aria-label={`${nickname} 프로필 이미지`}
        className={`${sizeClassName} shrink-0 rounded-full bg-cover bg-center`}
        style={{ backgroundImage: `url(${avatarUrl})` }}
      />
    );
  }

  return (
    <div
      className={`${sizeClassName} flex shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-500`}
      aria-hidden="true"
    >
      {nickname.slice(0, 1)}
    </div>
  );
}

export default function AdminUserActions({ user }: AdminUserActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isActive = user.account_status === '활성';
  const nextAccountLabel = isActive ? '비활성' : '활성';

  const handleToggleAccountStatus = () => {
    startTransition(async () => {
      const result = await toggleAdminUserAccountStatus(user.id);

      if (!result.success) {
        showErrorToast(result.message);
        return;
      }

      showSuccessToast(result.message, isActive ? '🔒' : '🔓');
      router.refresh();
    });
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label={`${user.nickname} 상세 정보 보기`}
            title="상세보기"
            className={actionButtonClass}
            disabled={isPending}
          >
            <FileText size={18} />
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-2xl">
          <DialogHeader className="gap-4">
            <div className="flex items-center gap-4">
              <UserAvatar
                avatarUrl={user.avatar_url}
                nickname={user.nickname}
                sizeClassName="aspect-square w-[clamp(3.25rem,6vw,4rem)]"
              />

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle className="text-xl font-semibold text-zinc-900">
                    {user.nickname}
                  </DialogTitle>

                  <AdminBadge
                    label={user.user_type}
                    variant={USER_TYPE_BADGE_VARIANT_MAP[user.user_type]}
                  />

                  <AdminBadge
                    label={user.account_status}
                    variant={
                      ACCOUNT_STATUS_BADGE_VARIANT_MAP[user.account_status]
                    }
                  />
                </div>

                <DialogDescription className="text-sm text-zinc-500">
                  {user.email}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5">
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-zinc-900">기본 정보</h3>

              <dl className="space-y-2">
                <DetailItem label="이름" value={user.name} />
                <DetailItem label="이메일" value={user.email} />
                <DetailItem label="유형" value={user.user_type} />
                <DetailItem label="계정 상태" value={user.account_status} />
                <DetailItem label="가입일" value={user.joined_at} />
                <DetailItem
                  label="벨트"
                  value={formatOptionalText(user.belt_level)}
                />
                <DetailItem label="소개" value={formatOptionalText(user.bio)} />
              </dl>
            </section>

            {user.user_type === '도장' ? (
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-900">
                  도장 정보
                </h3>

                <dl className="space-y-2">
                  <DetailItem
                    label="도장 승인"
                    value={
                      user.dojang_approval_status ? (
                        <AdminBadge
                          label={user.dojang_approval_status}
                          variant={
                            DOJANG_APPROVAL_BADGE_VARIANT_MAP[
                              user.dojang_approval_status
                            ]
                          }
                        />
                      ) : (
                        '-'
                      )
                    }
                  />
                  <DetailItem
                    label="사업자등록번호"
                    value={formatOptionalText(user.business_number)}
                  />
                  <DetailItem
                    label="대표자명"
                    value={formatOptionalText(user.representative)}
                  />
                  <DetailItem
                    label="연락처"
                    value={formatOptionalText(user.phone_value)}
                  />
                  <DetailItem
                    label="주소"
                    value={formatOptionalText(user.address)}
                  />
                  <DetailItem
                    label="첨부 파일"
                    value={
                      user.business_file_url ? (
                        <a
                          href={user.business_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                        >
                          파일 보기
                          <ExternalLink className="size-4" />
                        </a>
                      ) : (
                        '-'
                      )
                    }
                  />
                </dl>
              </section>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <button
        type="button"
        onClick={() => setIsConfirmOpen(true)}
        aria-label={`${user.nickname} 계정 ${isActive ? '비활성화' : '활성화'}`}
        title={isActive ? '비활성화' : '활성화'}
        className={actionButtonClass}
        disabled={isPending}
      >
        {isActive ? (
          <PowerOff size={18} className="text-red-500" />
        ) : (
          <Power size={18} className="text-green-600" />
        )}
      </button>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleToggleAccountStatus}
        title="계정 상태 변경 확인"
        description={`${user.nickname} 계정을 ${nextAccountLabel} 상태로 변경하시겠습니까?`}
        confirmLabel={nextAccountLabel}
        confirmVariant={isActive ? 'warning' : 'success'}
        disabled={isPending}
      />
    </div>
  );
}
