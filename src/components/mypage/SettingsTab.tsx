'use client';

import { useState } from 'react';
import { useUpdateMyProfile, useDeleteMyAccount } from '@/hooks/useMyPage';
import { Profile, BeltLevel } from '@/types/user';

interface SettingsTabProps {
  profile: Profile;
}

const BELTS: BeltLevel[] = ['White', 'Blue', 'Purple', 'Brown', 'Black'];

const BELT_COLORS: Record<BeltLevel, string> = {
  White: '#e8e8e8',
  Blue: '#2e6fdb',
  Purple: '#7c4ddb',
  Brown: '#8b5a2b',
  Black: '#1a1a1a',
};

export default function SettingsTab({ profile }: SettingsTabProps) {
  const [nickname, setNickname] = useState(profile.nickname ?? '');
  const [bio, setBio] = useState(profile.bio ?? '');
  const [beltLevel, setBeltLevel] = useState<BeltLevel>(
    profile.belt_level ?? 'White',
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { mutate: updateProfile, isPending: isUpdating } = useUpdateMyProfile();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteMyAccount();

  const handleUpdate = () => {
    updateProfile({
      nickname,
      bio,
      belt_level: beltLevel,
      avatar_url: profile.avatar_url ?? null,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 프로필 설정 */}
      <div className="flex flex-col gap-4 p-6 bg-bg-white rounded-2xl shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-text-primary">프로필 설정</h3>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex items-center gap-1 px-3 py-1.5 bg-btn-focus text-btn-focus-text rounded-lg text-sm font-bold hover:opacity-80 transition-all disabled:opacity-50 cursor-pointer"
          >
            ✏️ {isUpdating ? '저장 중...' : '수정'}
          </button>
        </div>

        {/* 이름 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-primary">이름</label>
          <div className="flex items-center gap-2 bg-input-bg rounded-xl px-4 py-3">
            <span className="text-text-secondary">👤</span>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="flex-1 bg-transparent text-sm text-input-text outline-none"
            />
          </div>
        </div>

        {/* 이메일 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-primary">
            이메일
          </label>
          <div className="flex items-center gap-2 bg-input-bg rounded-xl px-4 py-3">
            <span className="text-text-secondary">✉️</span>
            <input
              type="email"
              value={profile.email_value ?? ''}
              readOnly
              className="flex-1 bg-transparent text-sm text-text-secondary outline-none cursor-not-allowed"
            />
          </div>
        </div>

        {/* 벨트 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-primary">벨트</label>
          <div className="relative flex items-center bg-input-bg rounded-xl px-4 py-3">
            <span
              className="w-3 h-3 rounded-full mr-2 shrink-0"
              style={{ backgroundColor: BELT_COLORS[beltLevel] }}
            />
            <select
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

        {/* 소개 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-primary">소개</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full bg-input-bg rounded-xl px-4 py-3 text-sm text-input-text outline-none resize-none"
          />
        </div>
      </div>

      {/* 회원 탈퇴 */}
      <div className="flex flex-col gap-3 p-6 bg-bg-white rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-danger">⚠️</span>
          <span className="text-base font-bold text-text-primary">
            회원 탈퇴
          </span>
        </div>
        <p className="text-sm text-text-secondary">
          계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
        </p>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-fit bg-danger text-btn-focus-text px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all cursor-pointer"
          >
            회원탈퇴하기
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-6 py-2 bg-btn-basic text-btn-text rounded-full text-sm font-bold hover:opacity-90 transition-all cursor-pointer"
            >
              취소
            </button>
            <button
              onClick={() => deleteAccount()}
              disabled={isDeleting}
              className="px-6 py-2 bg-danger text-btn-focus-text rounded-full text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? '탈퇴 중...' : '확인'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
