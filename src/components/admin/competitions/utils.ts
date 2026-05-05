import {
  COMPETITION_DEADLINE_WARNING_DAYS,
  UNKNOWN_COMPETITION_LOCATION,
} from './constants';
import type {
  AdminCompetitionFilterValue,
  AdminCompetitionRow,
  AdminCompetitionStatus,
  CompetitionQueryRow,
} from './types';

function parseDateOnly(dateText: string) {
  return new Date(`${dateText}T00:00:00`);
}

function getTodayStart() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
}

export function formatDate(dateText: string) {
  return dateText.slice(0, 10);
}

export function getCompetitionStatus(
  applyDeadline: string,
): AdminCompetitionStatus {
  const today = getTodayStart();
  const deadline = parseDateOnly(applyDeadline);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const remainingDays = Math.floor(
    (deadline.getTime() - today.getTime()) / millisecondsPerDay,
  );

  if (remainingDays < 0) {
    return '모집완료';
  }

  if (remainingDays <= COMPETITION_DEADLINE_WARNING_DAYS) {
    return '마감임박';
  }

  return '모집중';
}

export function mapCompetitionQueryRowToAdminCompetitionRow(
  competition: CompetitionQueryRow,
): AdminCompetitionRow {
  return {
    id: competition.id,
    name: competition.name,
    location: competition.location ?? UNKNOWN_COMPETITION_LOCATION,
    status: getCompetitionStatus(competition.apply_deadline),
    event_date: formatDate(competition.event_data),
    apply_deadline: formatDate(competition.apply_deadline),
    created_at: formatDate(competition.created_at),
    apply_url: competition.apply_url,
  };
}

export function mapCompetitionQueryRowsToAdminCompetitionRows(
  competitions: CompetitionQueryRow[],
) {
  return competitions.map(mapCompetitionQueryRowToAdminCompetitionRow);
}

export function matchesCompetitionFilter(
  competition: AdminCompetitionRow,
  activeFilter: AdminCompetitionFilterValue,
) {
  if (activeFilter === 'all') return true;

  return competition.status === activeFilter;
}

export function filterAdminCompetitions(
  competitions: AdminCompetitionRow[],
  activeFilter: AdminCompetitionFilterValue,
  searchQuery: string,
) {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  return competitions.filter((competition) => {
    const isFilterMatched = matchesCompetitionFilter(competition, activeFilter);

    const isSearchMatched =
      normalizedSearchQuery.length === 0 ||
      competition.name.toLowerCase().includes(normalizedSearchQuery);

    return isFilterMatched && isSearchMatched;
  });
}
