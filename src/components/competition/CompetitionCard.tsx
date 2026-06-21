'use client';

import Link from 'next/link';
import { getDday, getStatus } from '@/utils/formatDate';
import { buildCompetitionUrl } from '@/lib/slug';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../common/LoadingSpinner';

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

function parseDateParts(dateStr: string) {
  if (!dateStr) return { month: '—', day: '—' };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { month: dateStr.slice(0, 3), day: '' };
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = String(d.getDate());
  return { month, day };
}

export default function CompetitionCard({
  competition,
  index: _index,
}: CompetitionCardProps) {
  const actualStatus = getStatus(competition.apply_deadline);
  const dday = getDday(competition.apply_deadline);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { month, day } = parseDateParts(competition.event_data);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1)
      return;
    e.preventDefault();
    startTransition(() => {
      router.push(buildCompetitionUrl(competition.name, competition.id));
    });
  };

  const statusStyle =
    actualStatus === '모집중'
      ? { background: 'rgba(22,163,74,0.15)', color: '#4ade80' }
      : actualStatus === '마감임박'
        ? { background: 'rgba(234,88,12,0.15)', color: '#fb923c' }
        : { background: 'rgba(37,99,235,0.08)', color: '#60a5fa' };

  const ddayColor =
    dday === 'D-DAY'
      ? '#ef4444'
      : dday.startsWith('D-')
        ? '#60a5fa'
        : 'rgba(255,255,255,0.38)';

  return (
    <div>
      {/* outer shell */}
      <div
        className="relative cursor-pointer transition-all duration-[400ms]"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '18px',
          padding: '2px',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'rgba(29,78,216,0.2)';
          el.style.transform = 'translateX(3px)';
          el.style.boxShadow = '0 8px 30px rgba(29,78,216,0.1)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'rgba(255,255,255,0.07)';
          el.style.transform = 'translateX(0)';
          el.style.boxShadow = 'none';
        }}
        aria-busy={isPending}
      >
        {/* stretched link — 카드 전체를 클릭 가능하게 하되 신청하기 <a>와 중첩 방지 */}
        <Link
          href={buildCompetitionUrl(competition.name, competition.id)}
          className="absolute inset-0 z-0 rounded-[18px]"
          aria-label={`${competition.name} 대회 상세보기`}
          onClick={handleClick}
        />
        {isPending && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-[16px]"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            <LoadingSpinner label="대회 정보 불러오는 중" />
          </div>
        )}

        {/* inner core */}
        <div
          className="flex overflow-hidden"
          style={{
            background: '#1e1e1e',
            borderRadius: '16px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Date column */}
          <div
            className="flex flex-col items-center justify-center shrink-0"
            style={{
              width: '70px',
              padding: '16px 8px',
              borderRight: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span
              className="font-bold uppercase tracking-widest"
              style={{
                fontSize: '10px',
                color: '#60a5fa',
                letterSpacing: '0.1em',
              }}
            >
              {month}
            </span>
            <span
              className="font-extrabold leading-none"
              style={{
                fontSize: '30px',
                color: '#fff',
                letterSpacing: '-0.04em',
              }}
            >
              {day}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1" style={{ padding: '16px 18px' }}>
            <h2
              className="font-bold mb-1.5"
              style={{
                fontSize: '14.5px',
                color: '#fff',
                letterSpacing: '-0.01em',
              }}
            >
              {competition.name}
            </h2>

            <div className="flex gap-1.5 flex-wrap mb-1.5">
              <span
                className="font-semibold rounded-[6px]"
                style={{
                  fontSize: '10px',
                  padding: '3px 8px',
                  background: 'rgba(37,99,235,0.15)',
                  color: '#93c5fd',
                }}
              >
                {competition.location}
              </span>
              <span
                className="font-semibold rounded-[6px]"
                style={{
                  fontSize: '10px',
                  padding: '3px 8px',
                  background: 'rgba(22,163,74,0.15)',
                  color: '#86efac',
                }}
              >
                {competition.participants}명
              </span>
            </div>

            <p
              className="line-clamp-1"
              style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}
            >
              신청마감 {competition.apply_deadline}
              {actualStatus !== '모집완료' && (
                <span className="ml-2 font-bold" style={{ color: ddayColor }}>
                  {dday}
                </span>
              )}
            </p>
          </div>

          {/* Right: status + apply */}
          <div
            className="flex flex-col items-end justify-between shrink-0"
            style={{ padding: '16px' }}
          >
            <span
              className="font-bold rounded-full"
              style={{
                fontSize: '10px',
                padding: '4px 10px',
                ...statusStyle,
              }}
            >
              {actualStatus}
            </span>

            {actualStatus !== '모집완료' ? (
              <a
                href={competition.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${competition.name} 신청하기`}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 font-semibold text-white rounded-[8px] transition-all"
                style={{
                  fontSize: '11.5px',
                  padding: '7px 14px',
                  background: '#2563eb',
                  boxShadow: '0 4px 12px rgba(29,78,216,0.3)',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.boxShadow =
                    '0 6px 18px rgba(29,78,216,0.4)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.boxShadow =
                    '0 4px 12px rgba(29,78,216,0.3)')
                }
              >
                신청하기
              </a>
            ) : (
              <span
                className="font-semibold rounded-[8px]"
                style={{
                  fontSize: '11.5px',
                  padding: '7px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.55)',
                }}
              >
                모집 완료
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
