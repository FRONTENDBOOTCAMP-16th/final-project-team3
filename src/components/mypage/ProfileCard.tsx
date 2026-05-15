import Image from 'next/image';
import { Profile, BeltLevel } from '@/types/user';

const BELT_COLORS: Record<BeltLevel, string> = {
  White: 'var(--color-belt-white)',
  Blue: 'var(--color-belt-blue)',
  Purple: 'var(--color-belt-purple)',
  Brown: 'var(--color-belt-brown)',
  Black: 'var(--color-belt-black)',
};

interface ProfileCardProps {
  profile: Profile;
  postCount?: number;
  commentCount?: number;
}

export default function ProfileCard({
  profile,
  postCount = 0,
  commentCount = 0,
}: ProfileCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-bg-white rounded-2xl shadow-sm">
      {/* 아바타 */}
      <div className="relative w-36 h-36">
        <Image
          src={profile.avatar_url ?? '/basic.svg'}
          alt={profile.nickname ?? '프로필'}
          fill
          className="rounded-full object-cover"
        />
      </div>

      {/* 닉네임 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary">
          {profile.nickname ?? '닉네임 없음'}
        </h2>
        {/* 벨트 - 관리자는 표시 안 함 */}
        {profile.belt_level && profile.role !== 'admin' && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-btn-basic rounded-full mt-1">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{
                backgroundColor: BELT_COLORS[profile.belt_level as BeltLevel],
              }}
            />
            <span className="text-sm text-btn-text">{profile.belt_level}</span>
          </div>
        )}
      </div>

      {/* 소개글 */}
      {profile.bio && (
        <p className="text-sm text-text-secondary text-center whitespace-pre-wrap">
          {profile.bio}
        </p>
      )}

      {/* 게시글 / 댓글 수 */}
      <div className="flex gap-12 pt-4 border-t border-border w-full justify-center">
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-bold text-text-primary">
            {postCount}
          </span>
          <span className="text-sm text-text-secondary">게시글</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-bold text-text-primary">
            {commentCount}
          </span>
          <span className="text-sm text-text-secondary">댓글</span>
        </div>
      </div>
    </div>
  );
}
