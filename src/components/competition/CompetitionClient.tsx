'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import CompetitionCard from '@/components/competition/CompetitionCard';
import { useDebounce } from '@/hooks/useDebounce';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useCompetition } from '@/hooks/useCompetition';
import { useAuth } from '@/hooks/useAuth';
import { getStatus } from '@/utils/formatDate';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface Competition {
  id: string;
  name: string;
  location: string;
  event_data: string;
  apply_deadline: string;
  description: string;
  image_url: string;
  participants: number;
  apply_url: string;
  comment_count?: number;
}

interface CompetitionClientProps {
  initialCompetitions: Competition[];
}

const TABS = ['전체', '모집중', '마감임박', '모집완료'] as const;
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTH_KR = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

interface MiniCalendarProps {
  eventDates: Set<string>;
  selectedDate: string | null;
  // eslint-disable-next-line no-unused-vars
  onDateSelect: (date: string | null) => void;
}

function MiniCalendar({ eventDates, selectedDate, onDateSelect }: MiniCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const isToday = (d: number) => {
    const s = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return s === todayStr;
  };
  const hasEvent = (d: number) => {
    const s = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return eventDates.has(s);
  };
  const isSelected = (d: number) => {
    const s = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return s === selectedDate;
  };
  const handleDayClick = (d: number) => {
    const s = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    onDateSelect(s === selectedDate ? null : s);
  };

  return (
    /* outer shell */
    <div
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
        padding: '2px',
      }}
    >
      {/* inner core */}
      <div
        style={{
          background: '#1e1e1e',
          borderRadius: '18px',
          padding: '18px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#f0f0f0', letterSpacing: '-0.01em' }}>
            {viewYear} {MONTH_KR[viewMonth]}
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { icon: ChevronLeft, action: () => { if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); } else setViewMonth((m) => m - 1); } },
              { icon: ChevronRight, action: () => { if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); } else setViewMonth((m) => m + 1); } },
            ].map(({ icon: Icon, action }, i) => (
              <button
                key={i}
                type="button"
                onClick={action}
                style={{
                  width: '24px', height: '24px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '7px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#9ca3af',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={12} />
              </button>
            ))}
          </div>
        </div>

        {/* Weekday labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px', marginBottom: '4px' }}>
          {WEEKDAYS.map((w) => (
            <div key={w} style={{ fontSize: '9px', fontWeight: 600, color: '#b0b8c4', textAlign: 'center', padding: '3px 0' }}>
              {w}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px' }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const today_ = isToday(day);
            const event = hasEvent(day);
            const sel = isSelected(day);
            const highlighted = today_ || sel;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleDayClick(day)}
                style={{
                  fontSize: '10.5px',
                  textAlign: 'center',
                  padding: highlighted ? '0' : '5px 2px',
                  borderRadius: highlighted ? '50%' : '7px',
                  color: highlighted ? '#fff' : '#d1d5db',
                  background: sel ? '#2563eb' : today_ ? 'rgba(255,255,255,0.15)' : 'transparent',
                  width: highlighted ? '24px' : undefined,
                  height: highlighted ? '24px' : undefined,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: highlighted ? '1px auto' : undefined,
                  fontWeight: highlighted ? 700 : undefined,
                  position: 'relative',
                  cursor: 'pointer',
                  border: 'none',
                  fontFamily: 'inherit',
                  transition: 'background 0.15s',
                  boxShadow: sel ? '0 2px 8px rgba(37,99,235,0.35)' : 'none',
                }}
              >
                {day}
                {event && !highlighted && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '1px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '3px', height: '3px',
                      background: '#3b82f6',
                      borderRadius: '50%',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CompetitionClient({ initialCompetitions }: CompetitionClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? '전체';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useCompetition(initialCompetitions);

  const competitions = useMemo(
    () => data?.pages.flatMap((page) => page) ?? initialCompetitions,
    [data, initialCompetitions],
  );

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const filteredCompetitions = useMemo(
    () =>
      competitions
        .filter((c) => {
          const matchTab = activeTab === '전체' || getStatus(c.apply_deadline) === activeTab;
          const matchSearch = c.name.toLowerCase().includes(debouncedSearch.toLowerCase());
          return matchTab && matchSearch;
        })
        .sort((a, b) => {
          const sA = getStatus(a.apply_deadline);
          const sB = getStatus(b.apply_deadline);
          if (sA === '모집완료' && sB !== '모집완료') return 1;
          if (sA !== '모집완료' && sB === '모집완료') return -1;
          return new Date(a.apply_deadline).getTime() - new Date(b.apply_deadline).getTime();
        }),
    [competitions, activeTab, debouncedSearch],
  );

  const eventDates = useMemo(() => {
    const set = new Set<string>();
    competitions.forEach((c) => {
      if (c.apply_deadline) set.add(c.apply_deadline.slice(0, 10));
      if (c.event_data) set.add(c.event_data.slice(0, 10));
    });
    return set;
  }, [competitions]);

  const observerRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  });

  return (
    <div style={{ background: '#111', minHeight: '100vh' }}>
      {/* ── Hero ── */}
      <div
        style={{
          position: 'relative',
          height: 'clamp(200px, 30vw, 300px)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/bjj-2.webp"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', opacity: 0.38, filter: 'grayscale(10%)',
          }}
        />
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(17,17,17,0.95) 0%, rgba(17,17,17,0.4) 60%, rgba(17,17,17,0.2) 100%)',
          }}
        />
        {/* Watermark */}
        <div
          style={{
            position: 'absolute', bottom: '-10px', right: '-8px',
            fontSize: '100px', fontWeight: 800, lineHeight: 1,
            color: 'rgba(255,255,255,0.055)', letterSpacing: '-0.03em',
            userSelect: 'none', pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          COMPETITION
        </div>

        <div className="relative z-[2] px-4 pb-8 md:px-12 md:pb-10">
          <p
            style={{
              fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '14px',
            }}
          >
            COMPETITION
          </p>
          <h1
            className="text-[44px] md:text-[68px]"
            style={{
              fontWeight: 800, color: '#fff',
              lineHeight: 0.92, letterSpacing: '-0.04em',
            }}
          >
            대회 일정
          </h1>
        </div>
      </div>

      {/* ── Sticky tab bar ── */}
      <div
        className="sticky top-16 z-40 shrink-0"
        style={{
          background: '#111',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Row 1: 탭 */}
        <div
          role="tablist"
          className="flex items-center overflow-x-auto no-scrollbar px-4 lg:px-12"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => handleTabChange(tab)}
              style={{
                padding: '13px 0',
                marginRight: '28px',
                marginBottom: '-1px',
                fontSize: '13.5px',
                fontWeight: activeTab === tab ? 600 : 500,
                color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.6)',
                background: 'none',
                border: 'none',
                borderBottomStyle: 'solid',
                borderBottomWidth: '2px',
                borderBottomColor: activeTab === tab ? '#2563eb' : 'transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Row 2: 검색 + 일정추가 */}
        <div
          className="flex items-center gap-2 px-4 lg:px-12 py-2"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="flex items-center gap-2 flex-1 h-9"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '5px',
              padding: '0 12px',
            }}
          >
            <Search size={13} style={{ opacity: 0.3, flexShrink: 0 }} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="대회 검색..."
              aria-label="대회 검색"
              className="flex-1 min-w-0"
              style={{
                background: 'none', border: 'none', outline: 'none',
                fontFamily: 'inherit', fontSize: '13px', color: '#fff',
              }}
            />
          </div>
          {isAdmin && (
            <Link
              href="/competitions/write"
              className="shrink-0"
              style={{
                padding: '8px 18px', background: '#2563eb', color: '#fff',
                border: 'none', borderRadius: '5px', fontFamily: 'inherit',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                textDecoration: 'none', display: 'inline-block',
              }}
            >
              일정 추가
            </Link>
          )}
        </div>
      </div>

      {/* ── Content: list + calendar ── */}
      <div
        className="competition-content-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '24px',
          padding: '24px 16px',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        {/* Competition list */}
        <section aria-label="대회일정 목록">
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
              <LoadingSpinner label="대회 목록 불러오는 중" />
            </div>
          ) : filteredCompetitions.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredCompetitions.map((competition, index) => (
                <li key={competition.id}>
                  <CompetitionCard competition={competition} index={index} />
                </li>
              ))}
            </ul>
          ) : (
            <div
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '80px 0',
                color: 'rgba(255,255,255,0.6)', fontSize: '15px',
              }}
              aria-live="polite"
            >
              대회 일정이 없습니다
            </div>
          )}

          {hasNextPage && (
            <div ref={observerRef} style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div role="status" aria-live="polite">
                {isFetchingNextPage && (
                  <div
                    style={{
                      width: '24px', height: '24px',
                      border: '2px solid rgba(37,99,235,0.3)',
                      borderTopColor: '#2563eb',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </section>

        {/* Right: calendar sidebar (lg+에서만 표시) */}
        <aside className="hidden lg:flex" style={{ flexDirection: 'column', gap: '14px' }}>
          <MiniCalendar
            eventDates={eventDates}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />

          {/* Upcoming / date-filtered */}
          {competitions.length > 0 && (
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                padding: '2px',
              }}
            >
              <div
                style={{
                  background: '#1e1e1e',
                  borderRadius: '14px',
                  padding: '14px',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                <p
                  style={{
                    fontSize: '9px', fontWeight: 700, color: '#b0b8c4',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    marginBottom: '10px',
                  }}
                >
                  {selectedDate
                    ? `${parseInt(selectedDate.slice(5, 7))}월 ${parseInt(selectedDate.slice(8, 10))}일 대회`
                    : '이번 달 대회'}
                </p>
                {(selectedDate
                  ? competitions.filter((c) =>
                      c.event_data?.slice(0, 10) === selectedDate ||
                      c.apply_deadline?.slice(0, 10) === selectedDate
                    )
                  : filteredCompetitions
                ).slice(0, 4).length === 0 ? (
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '8px 0' }}>
                    해당 날짜의 대회가 없습니다
                  </p>
                ) : (selectedDate
                  ? competitions.filter((c) =>
                      c.event_data?.slice(0, 10) === selectedDate ||
                      c.apply_deadline?.slice(0, 10) === selectedDate
                    )
                  : filteredCompetitions
                ).slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '7px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div
                      style={{
                        width: '34px', height: '34px',
                        background: 'rgba(37,99,235,0.12)',
                        border: '1px solid rgba(37,99,235,0.2)',
                        borderRadius: '8px',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: '8px', fontWeight: 700, color: '#60a5fa', lineHeight: 1 }}>
                        {c.event_data?.slice(5, 7) ?? '--'}월
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                        {c.event_data?.slice(8, 10) ?? '--'}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: '11.5px', fontWeight: 600, color: '#f0f0f0',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}
                      >
                        {c.name}
                      </p>
                      <p style={{ fontSize: '10px', color: '#b0b8c4' }}>{c.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
