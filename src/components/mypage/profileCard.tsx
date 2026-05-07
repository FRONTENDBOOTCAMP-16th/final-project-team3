import Image from 'next/image';
import { Profile } from '@/types/user';

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
      <div className="relative w-24 h-24">
        <Image
          src={profile.avatar_url ?? '/basic.svg'}
          alt={profile.nickname ?? '프로필'}
          fill
          className="rounded-full object-cover"
        />
      </div>

      {/* 닉네임 */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-text-primary">
          {profile.nickname ?? '이름 없음'}
        </h2>
        {profile.belt_level && (
          <span className="inline-block mt-1 px-3 py-1 bg-btn-basic rounded-full text-sm text-btn-text">
            {profile.belt_level}
          </span>
        )}
      </div>

      {/* 소개글 */}
      {profile.bio && (
        <p className="text-sm text-text-secondary text-center">{profile.bio}</p>
      )}

      {/* 게시글 / 댓글 수 */}
      <div className="flex gap-8 pt-2 border-t border-gray-100 w-full justify-center">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-text-primary">
            {postCount}
          </span>
          <span className="text-xs text-text-secondary">게시글</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-text-primary">
            {commentCount}
          </span>
          <span className="text-xs text-text-secondary">댓글</span>
        </div>
      </div>
    </div>
  );
}
