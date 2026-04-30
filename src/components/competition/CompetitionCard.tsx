'use client';
import Image from 'next/image';
import { getDday } from '@/utils/formatDate';

interface CompetitionCardProps {
  competition: {
    id: string;
    name: string;
    description: string;
    image_url: string;
    category: string;
    status: string;
    event_data: string;
    location: string;
    participants: number;
    apply_url: string;
  };
}

export default function CompetitionCard({ competition }: CompetitionCardProps) {
  const statusColor =
    {
      모집중: 'bg-green-500',
      마감임박: 'bg-orange-500',
      모집완료: 'bg-gray-400',
    }[competition.status] ?? 'bg-gray-400';
  const dday = getDday(competition.event_data);
  const ddayColor =
    dday === 'D-DAY'
      ? 'text-danger'
      : dday.startsWith('D-')
        ? 'text-blue-500'
        : 'text-gray-400';
  return (
    <div className="rounded-lg overflow-hidden bg-bg-white border border-gray-200 flex flex-col min-h cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      {/* 썸네일 + 배지 */}
      <div className="relative shrink-0">
        {competition.image_url ? (
          <Image
            src={competition.image_url}
            alt={competition.name}
            width={400}
            height={200}
            className="w-full h-50 object-cover"
          />
        ) : (
          <div className="w-full h-50 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">이미지 없음</span>
          </div>
        )}

        {/* 카테고리 배지 */}
        <span className="absolute bottom-10 left-2 px-2 py-1 text-xs text-white rounded-full bg-black/60">
          {competition.category}
        </span>

        {/* 제목 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3">
          <h2 className="font-bold text-white text-base line-clamp-1">
            {competition.name}
          </h2>
        </div>

        {/* 상태 배지 */}
        <span
          className={`absolute top-2 right-2 px-2 py-1 text-xs text-white rounded-full ${statusColor}`}
        >
          {competition.status}
        </span>
      </div>

      {/* 카드 내용 */}
      <div className="p-4 flex flex-col gap-2 flex-1 overflow-hidden">
        {/* 설명 */}
        <p className="text-sm text-gray-500 line-clamp-2">
          {competition.description}
        </p>

        <div className="flex-1" />

        {/* 날짜 + 장소 + 참가자 */}
        <div className="flex flex-col gap-1 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Image src="/calendar.svg" alt="날짜" width={14} height={14} />
            <span>{competition.event_data}</span>
            <div className="flex items-center gap-1">
              <Image src="/calendar.svg" alt="날짜" width={14} height={14} />
              <span>{competition.event_data}</span>
              {competition.status !== '모집완료' && (
                <span className={`ml-1 font-bold ${ddayColor}`}>{dday}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Image src="/location.svg" alt="위치" width={14} height={14} />
            <span>{competition.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Image src="/person.svg" alt="참가자" width={14} height={14} />
            <span>{competition.participants}명 참가 예정</span>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-100" />

        {/* 신청하기 버튼 */}

        <a
          href={competition.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full py-2 text-sm font-bold text-white text-center rounded-lg transition-all
            ${
              competition.status === '모집완료'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#2c2c2c] hover:bg-black'
            }`}
          onClick={(e) =>
            competition.status === '모집완료' && e.preventDefault()
          }
        >
          {competition.status === '모집완료' ? '모집 완료' : '신청하기'}
        </a>
      </div>
    </div>
  );
}
