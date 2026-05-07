import Image from 'next/image';
import { Profile } from '@/types/user';

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-2xl shadow-sm">
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
        <h2 className="text-xl font-bold">{profile.nickname ?? '이름 없음'}</h2>
        {/* 벨트 */}
        {profile.belt_level && (
          <span className="inline-block mt-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
            {profile.belt_level}
          </span>
        )}
      </div>

      {/* 소개글 */}
      {profile.bio && (
        <p className="text-sm text-gray-500 text-center">{profile.bio}</p>
      )}
    </div>
  );
}
