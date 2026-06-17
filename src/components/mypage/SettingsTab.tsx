'use client';

import { useMemo, useState } from 'react';
import { useUpdateMyProfile, useDeleteMyAccount } from '@/hooks/useMyPage';
import { Profile } from '@/types/user';
import { Pencil, User, Mail } from 'lucide-react';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { LimitedInput } from '@/components/common/LimitedInput';
import { LimitedTextarea } from '@/components/common/LimitedTextarea';
import { SPORTS } from '@/constants/sports';
import {
  MIN_NICKNAME_LENGTH,
  NICKNAME_MIN_LENGTH_MESSAGE,
} from '@/constants/user';

interface SettingsTabProps {
  profile: Profile;
}

const isAdmin = (role: string | null) => role === 'admin';

const getProfileSportValue = (beltLevel: Profile['belt_level']) =>
  beltLevel ?? '';

export default function SettingsTab({ profile }: SettingsTabProps) {
  const [nickname, setNickname] = useState(profile.nickname ?? '');
  const [bio, setBio] = useState(profile.bio ?? '');
  const [sportSlug, setSportSlug] = useState(
    getProfileSportValue(profile.belt_level),
  );
  const [formError, setFormError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const trimmedNickname = nickname.trim();
  const nicknameError = useMemo(() => {
    if (!isEditing) return '';
    if (trimmedNickname.length === 0) return '닉네임을 입력해주세요.';
    if (trimmedNickname.length < MIN_NICKNAME_LENGTH) {
      return NICKNAME_MIN_LENGTH_MESSAGE;
    }
    return '';
  }, [isEditing, trimmedNickname.length]);
  const hasNicknameWhitespace =
    isEditing && nickname.length > 0 && nickname !== trimmedNickname;
  const profileSportValue = getProfileSportValue(profile.belt_level);

  const isChanged =
    trimmedNickname !== (profile.nickname ?? '') ||
    bio !== (profile.bio ?? '') ||
    sportSlug !== profileSportValue;

  const router = useRouter();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateMyProfile();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteMyAccount();

  const deleteDescription = `${isAdmin(profile.role) ? '관리자 계정을 삭제하면' : '계정을 삭제하면'} 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.`;

  const handleStartEditing = () => {
    setNickname(profile.nickname ?? '');
    setBio(profile.bio ?? '');
    setSportSlug(getProfileSportValue(profile.belt_level));
    setFormError('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setNickname(profile.nickname ?? '');
    setBio(profile.bio ?? '');
    setSportSlug(getProfileSportValue(profile.belt_level));
    setFormError('');
    setIsEditing(false);
  };

  const handleOpenSaveConfirm = () => {
    setFormError('');
    if (nicknameError) {
      setFormError(nicknameError);
      return;
    }
    setShowSaveConfirm(true);
  };

  const handleUpdate = () => {
    updateProfile(
      {
        nickname: trimmedNickname,
        bio,
        avatar_url: profile.avatar_url ?? null,
        belt_level: isAdmin(profile.role)
          ? profile.belt_level
          : sportSlug || null,
      },
      {
        onSuccess: () => {
          showSuccessToast('프로필이 수정되었습니다.');
          setNickname(trimmedNickname);
          setFormError('');
          setIsEditing(false);
        },
        onError: (error) => {
          const message =
            error instanceof Error
              ? error.message
              : '수정에 실패했습니다. 다시 시도해주세요.';
          setFormError(message);
          showErrorToast(message);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-6 bg-bg-white rounded-2xl shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary">프로필 설정</h3>
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(true)}
                  className="px-4 py-2 bg-btn-basic text-btn-text rounded-lg text-sm font-bold hover:opacity-80 transition-all cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleOpenSaveConfirm}
                  disabled={isUpdating || !isChanged || Boolean(nicknameError)}
                  aria-busy={isUpdating}
                  className="flex items-center gap-2 px-4 py-2 bg-btn-focus text-btn-focus-text rounded-lg text-sm font-bold hover:opacity-80 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                  {isUpdating ? '저장 중...' : '저장'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartEditing}
                className="flex items-center gap-2 px-4 py-2 bg-btn-focus text-btn-focus-text rounded-lg text-sm font-bold hover:opacity-80 transition-all cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
                수정
              </button>
            )}
          </div>
          {isEditing && (
            <p className="text-xs text-btn-focus font-medium flex items-center gap-1">
              <Pencil className="w-3 h-3" />
              수정 모드입니다. 내용을 변경 후 저장하세요.
            </p>
          )}
        </div>

        <LimitedInput
          label="닉네임"
          value={nickname}
          onChange={(value) => {
            setNickname(value);
            setFormError('');
          }}
          maxLength={10}
          placeholder="닉네임을 입력하세요"
          disabled={!isEditing}
        />
        {isEditing && (
          <div className="-mt-3 min-h-5">
            {formError || nicknameError ? (
              <p className="text-sm text-danger" role="alert">
                {formError || nicknameError}
              </p>
            ) : hasNicknameWhitespace ? (
              <p className="text-sm text-text-secondary">
                닉네임 앞뒤 공백은 제거되어 저장됩니다.
              </p>
            ) : null}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-primary">이름</label>
          <div className="flex items-center gap-2 bg-input-bg rounded-xl px-4 py-3">
            <User className="w-4 h-4 text-text-secondary" />
            <input
              type="text"
              value={profile.name ?? ''}
              readOnly
              aria-readonly="true"
              className="flex-1 bg-transparent text-sm text-text-secondary outline-none cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-primary">
            이메일
          </label>
          <div className="flex items-center gap-2 bg-input-bg rounded-xl px-4 py-3">
            <Mail className="w-4 h-4 text-text-secondary" />
            <input
              type="email"
              value={profile.email_value ?? ''}
              readOnly
              aria-readonly="true"
              className="flex-1 bg-transparent text-sm text-text-secondary outline-none cursor-not-allowed"
            />
          </div>
        </div>

        {!isAdmin(profile.role) && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-primary">
              운동 종목
            </label>
            <div
              className={`relative flex items-center rounded-xl px-4 py-3 ${isEditing ? 'bg-input-bg border border-btn-focus' : 'bg-input-bg'}`}
            >
              <span className="mr-2 text-base shrink-0">
                {SPORTS.find((s) => s.slug === sportSlug)?.icon ?? '🏅'}
              </span>
              <select
                disabled={!isEditing}
                value={sportSlug}
                onChange={(e) => setSportSlug(e.target.value)}
                className="flex-1 bg-transparent text-sm text-input-text outline-none appearance-none cursor-pointer"
              >
                <option value="">운동 종목을 선택하세요</option>
                {SPORTS.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.icon} {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <LimitedTextarea
          label="소개"
          value={bio}
          onChange={setBio}
          maxLength={200}
          placeholder="소개를 입력하세요"
          rows={4}
          disabled={!isEditing}
        />
      </div>

      <div className="flex flex-col gap-3 p-6 bg-bg-white rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-danger" aria-hidden="true">
            ⚠️
          </span>
          <span className="text-base font-bold text-text-primary">
            {isAdmin(profile.role) ? '관리자 계정 삭제' : '회원 탈퇴'}
          </span>
        </div>
        <p className="text-sm text-text-secondary">{deleteDescription}</p>
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="w-fit bg-danger text-btn-focus-text px-10 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all cursor-pointer"
        >
          {isAdmin(profile.role) ? '관리자 계정 삭제하기' : '회원탈퇴하기'}
        </button>

        <Dialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>프로필을 저장하시겠습니까?</DialogTitle>
              <DialogDescription>변경된 내용이 저장됩니다.</DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowSaveConfirm(false)}
                className="flex-1 px-6 py-3 bg-btn-basic text-btn-text rounded-xl text-sm font-bold hover:opacity-90 transition-all cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  handleUpdate();
                  setShowSaveConfirm(false);
                }}
                className="flex-1 px-6 py-3 bg-btn-focus text-btn-focus-text rounded-xl text-sm font-bold hover:opacity-90 transition-all cursor-pointer"
              >
                저장
              </button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>수정을 취소하시겠습니까?</DialogTitle>
              <DialogDescription>
                변경된 내용이 저장되지 않습니다.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-6 py-3 bg-btn-basic text-btn-text rounded-xl text-sm font-bold hover:opacity-90 transition-all cursor-pointer"
              >
                아니요
              </button>
              <button
                type="button"
                onClick={() => {
                  handleCancel();
                  setShowCancelConfirm(false);
                }}
                className="flex-1 px-6 py-3 bg-danger text-btn-focus-text rounded-xl text-sm font-bold hover:opacity-90 transition-all cursor-pointer"
              >
                취소하기
              </button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isAdmin(profile.role)
                  ? '정말 관리자 계정을 삭제하시겠습니까?'
                  : '정말 탈퇴하시겠습니까?'}
              </DialogTitle>
              <DialogDescription>{deleteDescription}</DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 bg-btn-basic text-btn-text rounded-xl text-sm font-bold hover:opacity-90 transition-all cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() =>
                  deleteAccount(undefined, {
                    onSuccess: () => {
                      setShowDeleteConfirm(false);
                      setShowDeleteSuccess(true);
                    },
                    onError: () => {
                      showErrorToast(
                        '회원탈퇴에 실패했습니다. 다시 시도해주세요.',
                      );
                    },
                  })
                }
                disabled={isDeleting}
                aria-busy={isDeleting}
                className="flex-1 px-6 py-3 bg-danger text-btn-focus-text rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <span className="animate-pulse">
                    {isAdmin(profile.role) ? '삭제 중...' : '탈퇴 중...'}
                  </span>
                ) : (
                  '확인'
                )}
              </button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteSuccess} onOpenChange={setShowDeleteSuccess}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">
                탈퇴 완료되었습니다.
              </DialogTitle>
              <DialogDescription className="text-center">
                이용해주셔서 감사합니다.
              </DialogDescription>
            </DialogHeader>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="w-full mt-4 px-6 py-3 bg-btn-focus text-btn-focus-text rounded-xl text-sm font-bold hover:opacity-90 transition-all cursor-pointer"
            >
              확인
            </button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
