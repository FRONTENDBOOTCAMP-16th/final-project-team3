'use client';
import Image from 'next/image';
import Link from 'next/link';
import { getDday, getStatus } from '@/utils/formatDate';
import { buildCompetitionUrl } from '@/lib/slug';

interface CompetitionCardProps {
  competition: {
    id: string;
    name: string;
    description: string;
    image_url: string;
    event_data: string;
    apply_deadline: string;
    location: string;
    participants: number;
    apply_url: string;
    comment_count?: number;
  };
  index?: number;
}

export default function CompetitionCard({
  competition,
  index,
}: CompetitionCardProps) {
  const actualStatus = getStatus(competition.apply_deadline);
  const dday = getDday(competition.apply_deadline);

  const statusColor =
    {
      모집중: 'bg-green-700',
      마감임박: 'bg-orange-600',
      모집완료: 'bg-gray-500',
    }[actualStatus] ?? 'bg-gray-500';

  const ddayColor =
    dday === 'D-DAY'
      ? 'text-danger'
      : dday.startsWith('D-')
        ? 'text-blue-700'
        : 'text-gray-600';

  return (
    <article
      className="rounded-lg overflow-hidden bg-bg-white border border-gray-200 flex flex-col h-full cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
      aria-label={`${competition.name} 대회`}
    >
      <Link
        href={buildCompetitionUrl(competition.name, competition.id)}
        className="flex flex-col flex-1"
        aria-label={`${competition.name} 대회 상세보기`}
      >
        <div className="relative shrink-0 h-50">
          {competition.image_url ? (
            <Image
              src={competition.image_url}
              alt={`${competition.name} 대회 이미지`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index === 0}
              className="object-cover"
            />
          ) : (
            <div
              className="w-full h-50 bg-gray-100 flex items-center justify-center"
              aria-label="이미지 없음"
            >
              <span className="text-gray-400 text-sm" aria-hidden="true">
                이미지 없음
              </span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3">
            <h2 className="font-bold text-white text-base line-clamp-1">
              {competition.name}
            </h2>
          </div>

          <span
            className={`absolute top-2 right-2 px-2 py-1 text-xs text-white rounded-full ${statusColor}`}
            aria-label={`모집 상태: ${actualStatus}`}
          >
            {actualStatus}
          </span>
        </div>

        <div className="p-4 flex flex-col gap-2 flex-1">
          <p className="text-sm text-gray-500 line-clamp-2">
            {competition.description}
          </p>

          <div className="flex-1" />

          <dl className="flex flex-col gap-1 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Image
                src="/calendar.svg"
                alt=""
                width={14}
                height={14}
                aria-hidden="true"
              />
              <dt className="sr-only">대회 날짜</dt>
              <dd>대회 {competition.event_data}</dd>
            </div>
            <div className="flex items-center gap-1">
              <Image
                src="/calendar.svg"
                alt=""
                width={14}
                height={14}
                aria-hidden="true"
              />
              <dt className="sr-only">신청 마감</dt>
              <dd className="flex items-center gap-1">
                신청마감 {competition.apply_deadline}
                {actualStatus !== '모집완료' && (
                  <span
                    className={`ml-1 font-bold ${ddayColor}`}
                    aria-label={`마감까지 ${dday}`}
                  >
                    {dday}
                  </span>
                )}
              </dd>
            </div>
            <div className="flex items-center gap-1">
              <Image
                src="/location.svg"
                alt=""
                width={14}
                height={14}
                aria-hidden="true"
              />
              <dt className="sr-only">위치</dt>
              <dd>{competition.location}</dd>
            </div>
            <div className="flex items-center gap-1">
              <Image
                src="/person.svg"
                alt=""
                width={14}
                height={14}
                aria-hidden="true"
              />
              <dt className="sr-only">모집 인원</dt>
              <dd>모집인원 {competition.participants}명</dd>
            </div>
          </dl>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <div className="border-t border-gray-200 mb-3" aria-hidden="true" />

        <a
          href={competition.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={
            actualStatus === '모집완료'
              ? `${competition.name} 모집 완료`
              : `${competition.name} 신청하기`
          }
          aria-disabled={actualStatus === '모집완료'}
          className={`w-full py-2 text-sm font-bold text-white text-center rounded-lg transition-all block
            ${
              actualStatus === '모집완료'
                ? 'bg-gray-400 cursor-not-allowed pointer-events-none'
                : 'bg-[#2c2c2c] hover:bg-black'
            }`}
        >
          {actualStatus === '모집완료' ? '모집 완료' : '신청하기'}
        </a>
      </div>
    </article>
  );
}
