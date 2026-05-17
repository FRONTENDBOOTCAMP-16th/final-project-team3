import { parseEnumParam, parsePositiveIntParam } from '@/lib/urlSearchParams';

export const ADMIN_TABLE_PAGE_SIZE = 10;

export type AdminTableRouteSearchParams = Record<
  string,
  string | string[] | undefined
>;

export function getSingleSearchParam(
  value: string | string[] | undefined,
): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

interface ParseAdminTableServerQueryOptions<TFilter extends string> {
  searchParams: AdminTableRouteSearchParams;
  filterParamName: string;
  validFilters: readonly TFilter[];
  defaultFilter: TFilter;
  defaultPage?: number;
}

export function parseAdminTableServerQuery<TFilter extends string>({
  searchParams,
  filterParamName,
  validFilters,
  defaultFilter,
  defaultPage = 1,
}: ParseAdminTableServerQueryOptions<TFilter>) {
  const requestedPage = parsePositiveIntParam(
    getSingleSearchParam(searchParams.page),
    defaultPage,
  ).value;

  const activeFilter = parseEnumParam<TFilter>(
    getSingleSearchParam(searchParams[filterParamName]),
    validFilters,
    defaultFilter,
  );

  const normalizedSearchQuery =
    getSingleSearchParam(searchParams.search)?.trim() ?? '';

  return {
    requestedPage,
    activeFilter,
    normalizedSearchQuery,
  };
}

interface BuildAdminPaginationRangeOptions {
  requestedPage: number;
  totalCount: number;
  pageSize?: number;
}

export function buildAdminPaginationRange({
  requestedPage,
  totalCount,
  pageSize = ADMIN_TABLE_PAGE_SIZE,
}: BuildAdminPaginationRangeOptions) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = totalCount === 0 ? 1 : Math.min(requestedPage, totalPages);
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  return {
    currentPage,
    totalPages,
    from,
    to,
    pageSize,
  };
}
