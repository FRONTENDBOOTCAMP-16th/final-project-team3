'use client';

import { useState } from 'react';
import { useUpdateMyProfile, useDeleteMyAccount } from '@/hooks/useMyPage';
import { Profile } from '@/types/user';
import { BeltLevel } from '@/types/user';

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
    <div className="flex flex-col gap-6 p-6 bg-white rounded-2xl shadow-sm">
      <h3 className="text-lg font-bold">프로필 설정</h3>

      {/* 닉네임 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">이름</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 이메일 (수정 불가) */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">이메일</label>
        <input
          type="email"
          value={profile.email_value ?? ''}
          readOnly
          className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-400 outline-none cursor-not-allowed"
        />
      </div>

      {/* 벨트 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">벨트</label>
        <select
          value={beltLevel}
          onChange={(e) => setBeltLevel(e.target.value as BeltLevel)}
          className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          {BELTS.map((belt) => (
            <option key={belt} value={belt}>
              {belt}
            </option>
          ))}
        </select>
      </div>

      {/* 소개 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">소개</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* 정보 수정 버튼 */}
      <button
        onClick={handleUpdate}
        disabled={isUpdating}
        className="w-full bg-btn-focus text-btn-focus-text py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
      >
        {isUpdating ? '저장 중...' : '정보 수정'}
      </button>

      {/* 회원 탈퇴 */}
      <div className="flex flex-col gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
        <div className="flex items-center gap-2">
          <span className="text-red-500 text-sm font-medium">⚠️ 회원 탈퇴</span>
        </div>
        <p className="text-xs text-red-400">
          계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
        </p>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full bg-red-500 text-white py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all"
          >
            회원탈퇴하기
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all"
            >
              취소
            </button>
            <button
              onClick={() => deleteAccount()}
              disabled={isDeleting}
              className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isDeleting ? '탈퇴 중...' : '확인'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
