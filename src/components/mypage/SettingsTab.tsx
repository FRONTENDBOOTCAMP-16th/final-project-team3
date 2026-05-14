'use client';

import { useState } from 'react';
import { useUpdateMyProfile, useDeleteMyAccount } from '@/hooks/useMyPage';
import { Profile, BeltLevel } from '@/types/user';
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
import { BELT_COLORS } from '@/utils/beltColors';

interface SettingsTabProps {
  profile: Profile;
}

const BELTS: BeltLevel[] = ['White', 'Blue', 'Purple', 'Brown', 'Black'];

export default function SettingsTab({ profile }: SettingsTabProps) {
  const [nickname, setNickname] = useState(profile.nickname ?? '');
  const [bio, setBio] = useState(profile.bio ?? '');
  const [beltLevel, setBeltLevel] = useState<BeltLevel>(
    profile.belt_level ?? 'White',
  );
  const [isEditing, setIsEditing] = useState(false);
  const isChanged =
    nickname !== (profile.nickname ?? '') ||
    bio !== (profile.bio ?? '') ||
    beltLevel !== (profile.belt_level ?? 'White');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const router = useRouter();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateMyProfile();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteMyAccount();
  const handleCancel = () => {
    setNickname(profile.nickname ?? '');
    setBio(profile.bio ?? '');
    setBeltLevel(profile.belt_level ?? 'White');
    setIsEditing(false);
  };
  const handleUpdate = () => {
    updateProfile(
      {
        nickname,
        bio,
        avatar_url: profile.avatar_url ?? null,
        belt_level: beltLevel,
      },
      {
        onSuccess: () => {
          showSuccessToast('프로필이 수정되었습니다.');
          setIsEditing(false);
        },
        onError: () => {
          showErrorToast('수정에 실패했습니다. 다시 시도해주세요.');
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
                  onClick={() => setShowCancelConfirm(true)}
                  className="px-4 py-2 bg-btn-basic text-btn-text rounded-lg text-sm font-bold hover:opacity-80 transition-all cursor-pointer"
                >
                  취소
                </button>
                <button
                  onClick={() => setShowSaveConfirm(true)}
                  disabled={isUpdating || !isChanged}
                  className="flex items-center gap-2 px-4 py-2 bg-btn-focus text-btn-focus-text rounded-lg text-sm font-bold hover:opacity-80 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                  {isUpdating ? '저장 중...' : '저장'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
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

        {/* 닉네임 */}
        <LimitedInput
          label="닉네임"
          value={nickname}
          onChange={setNickname}
          maxLength={10}
          placeholder="닉네임을 입력하세요"
          disabled={!isEditing}
        />

        {/* 이름 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-primary">이름</label>
          <div className="flex items-center gap-2 bg-input-bg rounded-xl px-4 py-3">
            <User className="w-4 h-4 text-text-secondary" />
            <input
              type="text"
              value={profile.name ?? ''}
              readOnly
              className="flex-1 bg-transparent text-sm text-text-secondary outline-none cursor-not-allowed"
            />
          </div>
        </div>

        {/* 이메일 */}
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
              className="flex-1 bg-transparent text-sm text-text-secondary outline-none cursor-not-allowed"
            />
          </div>
        </div>

        {/* 벨트 */}
        {profile.role !== 'admin' && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-primary">
              벨트
            </label>
            <div
              className={`relative flex items-center rounded-xl px-4 py-3 ${isEditing ? 'bg-bg-white border border-btn-focus' : 'bg-input-bg'}`}
            >
              <span
                className="w-3 h-3 rounded-full mr-2 shrink-0"
                style={{ backgroundColor: BELT_COLORS[beltLevel] }}
              />
              <select
                disabled={!isEditing}
                value={beltLevel}
                onChange={(e) => setBeltLevel(e.target.value as BeltLevel)}
                className="flex-1 bg-transparent text-sm text-input-text outline-none appearance-none cursor-pointer"
              >
                {BELTS.map((belt) => (
                  <option key={belt} value={belt}>
                    {belt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* 소개 */}
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
      {/* 회원 탈퇴 */}
      <div className="flex flex-col gap-3 p-6 bg-bg-white rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-danger">⚠️</span>
          <span className="text-base font-bold text-text-primary">
            {profile.role === 'admin' ? '관리자 계정 삭제' : '회원 탈퇴'}
          </span>
        </div>
        <p className="text-sm text-text-secondary">
          {profile.role === 'admin'
            ? '관리자 계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.'
            : '계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.'}
        </p>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-fit bg-danger text-btn-focus-text px-10 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all cursor-pointer"
        >
          {profile.role === 'admin' ? '관리자 계정 삭제하기' : '회원탈퇴하기'}
        </button>
        {/* 저장 확인 모달 */}
        <Dialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>프로필을 저장하시겠습니까?</DialogTitle>
              <DialogDescription>변경된 내용이 저장됩니다.</DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowSaveConfirm(false)}
                className="flex-1 px-6 py-3 bg-btn-basic text-btn-text rounded-xl text-sm font-bold hover:opacity-90 transition-all cursor-pointer"
              >
                취소
              </button>
              <button
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

        {/* 취소 확인 모달 */}
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
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-6 py-3 bg-btn-basic text-btn-text rounded-xl text-sm font-bold hover:opacity-90 transition-all cursor-pointer"
              >
                아니요
              </button>
              <button
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
        {/* 탈퇴 확인 Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {profile.role === 'admin'
                  ? '정말 관리자 계정을 삭제하시겠습니까?'
                  : '정말 탈퇴하시겠습니까?'}
              </DialogTitle>
              <DialogDescription>
                {profile.role === 'admin'
                  ? '관리자 계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.'
                  : '계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 bg-btn-basic text-btn-text rounded-xl text-sm font-bold hover:opacity-90 transition-all cursor-pointer"
              >
                취소
              </button>
              <button
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
                className="flex-1 px-6 py-3 bg-danger text-btn-focus-text rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <span className="animate-pulse">
                    {profile.role === 'admin' ? '삭제 중...' : '탈퇴 중...'}
                  </span>
                ) : (
                  '확인'
                )}
              </button>
            </div>
          </DialogContent>
        </Dialog>
        {/* 탈퇴 완료 모달 */}
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
