import Image from 'next/image';
import { getStatus, getDday } from '@/utils/formatDate';
import { timeAgo } from '@/utils/timeAgo';

export interface CompetitionDetailCardData {
  name: string;
  image_url?: string | null;
  description?: string | null;
  event_data: string;
  location: string;
  apply_deadline: string;
  participants?: number;
  created_at?: string;
  view_count?: number;
  commentCount?: number;
  nickname?: string | null;
  avatar_url?: string | null;
  role?: string | null;
}

interface CompetitionDetailCardProps {
  data: CompetitionDetailCardData;
  headerActions?: React.ReactNode;
}

export default function CompetitionDetailCard({
  data,
  headerActions,
}: CompetitionDetailCardProps) {
  const status = getStatus(data.apply_deadline);
  const dday = getDday(data.apply_deadline);

  const statusColor =
    {
      모집중: 'bg-green-500',
      마감임박: 'bg-orange-500',
      모집완료: 'bg-gray-400',
    }[status] ?? 'bg-gray-400';

  const ddayColor =
    dday === 'D-DAY'
      ? 'text-red-500'
      : dday.startsWith('D-')
        ? 'text-blue-500'
        : 'text-gray-400';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 상단: 프로필 + 버튼 */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
            <Image
              src={
                data.avatar_url?.startsWith('http')
                  ? data.avatar_url
                  : '/basic.svg'
              }
              alt="프로필"
              width={40}
              height={40}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">
                {data.nickname ?? '알 수 없음'}
              </span>
              {data.role && (
                <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                  {data.role}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">
              {data.created_at ? timeAgo(data.created_at) : '방금 전'}
            </span>
          </div>
        </div>
        {headerActions && (
          <div className="flex items-center gap-1">{headerActions}</div>
        )}
      </div>

      {/* 제목 */}
      <div className="px-5 pb-3">
        <h1 className="text-base font-bold text-gray-900">
          {data.name || '대회 제목'}
        </h1>
      </div>

      {/* 이미지 */}
      {data.image_url && (
        <div className="relative w-full aspect-video bg-gray-100">
          <Image
            src={data.image_url}
            alt={data.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* 날짜/장소/신청마감 요약 바 */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-y border-gray-100 text-center py-3 px-2">
        <div className="px-2">
          <p className="text-xs text-gray-400 mb-1">일시</p>
          <p className="text-xs font-medium text-gray-700">
            {data.event_data || '-'}
          </p>
        </div>
        <div className="px-2">
          <p className="text-xs text-gray-400 mb-1">장소</p>
          <p className="text-xs font-medium text-gray-700">
            {data.location || '-'}
          </p>
        </div>
        <div className="px-2">
          <p className="text-xs text-gray-400 mb-1">신청마감</p>
          <p className="text-xs font-medium text-gray-700">
            {data.apply_deadline || '-'}
          </p>
          {status !== '모집완료' && data.apply_deadline && (
            <p className={`text-xs font-bold ${ddayColor}`}>{dday}</p>
          )}
        </div>
      </div>

      {/* 본문 */}
      <div className="px-5 py-4">
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {data.description || '대회 설명이 여기에 표시됩니다.'}
        </p>
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-100 mx-5 mb-3" />
    </div>
  );
}
