'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  parseEnumParam,
  parsePositiveIntParam,
  updateSearchParams,
} from '@/lib/urlSearchParams';
import { useDebounce } from '@/hooks/useDebounce';

type NavigationMode = 'push' | 'replace';

interface UseAdminTableQueryStateOptions<TFilter extends string> {
  filterParamName: string;
  defaultFilter: TFilter;
  validFilters: readonly TFilter[];
  defaultPage?: number;
  defaultSearch?: string;
  resetSearchOnFilterChange?: boolean;
  searchDebounceMs?: number;
  navigationMode?: {
    page?: NavigationMode;
    filter?: NavigationMode;
    search?: NavigationMode;
  };
}

interface SetFilterOptions {
  resetPage?: boolean;
}

export function useAdminTableQueryState<TFilter extends string>({
  filterParamName,
  defaultFilter,
  validFilters,
  defaultPage = 1,
  defaultSearch = '',
  resetSearchOnFilterChange = false,
  searchDebounceMs = 300,
  navigationMode,
}: UseAdminTableQueryStateOptions<TFilter>) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const pageParamState = useMemo(
    () => parsePositiveIntParam(searchParams.get('page'), defaultPage),
    [defaultPage, searchParams],
  );

  const currentPage = pageParamState.value;

  const appliedFilter = useMemo(
    () =>
      parseEnumParam(
        searchParams.get(filterParamName),
        validFilters,
        defaultFilter,
      ),
    [defaultFilter, filterParamName, searchParams, validFilters],
  );
  const [optimisticFilter, setOptimisticFilter] = useState(appliedFilter);
  const activeFilter = isPending ? optimisticFilter : appliedFilter;

  const appliedSearchQuery = useMemo(
    () => searchParams.get('search') ?? defaultSearch,
    [defaultSearch, searchParams],
  );

  const [searchInput, setSearchInput] = useState(appliedSearchQuery);

  useEffect(() => {
    setSearchInput(appliedSearchQuery);
  }, [appliedSearchQuery]);

  useEffect(() => {
    if (!isPending) {
      setOptimisticFilter(appliedFilter);
    }
  }, [appliedFilter, isPending]);

  const debouncedSearchInput = useDebounce(searchInput, searchDebounceMs);
  const currentQueryString = searchParams.toString();
  const currentUrl = currentQueryString
    ? `${pathname}?${currentQueryString}`
    : pathname;

  const navigateWithSearchParams = useCallback(
    (
      updates: Record<string, string | null | undefined>,
      mode: NavigationMode = 'replace',
    ) => {
      const nextSearchParams = updateSearchParams(searchParams, updates);
      const nextQueryString = nextSearchParams.toString();
      const nextUrl = nextQueryString
        ? `${pathname}?${nextQueryString}`
        : pathname;

      if (nextUrl === currentUrl) {
        return;
      }

      if (mode === 'push') {
        startTransition(() => {
          router.push(nextUrl, { scroll: false });
        });
        return;
      }

      startTransition(() => {
        router.replace(nextUrl, { scroll: false });
      });
    },
    [currentUrl, pathname, router, searchParams],
  );

  useEffect(() => {
    if (!pageParamState.shouldNormalize) {
      return;
    }

    navigateWithSearchParams(
      {
        page: pageParamState.normalizedValue,
      },
      'replace',
    );
  }, [navigateWithSearchParams, pageParamState]);

  useEffect(() => {
    if (debouncedSearchInput !== searchInput) {
      return;
    }

    const normalizedSearch =
      debouncedSearchInput.trim() === '' ? null : debouncedSearchInput.trim();

    if ((normalizedSearch ?? '') === appliedSearchQuery) {
      return;
    }

    navigateWithSearchParams(
      {
        search: normalizedSearch,
        page: null,
      },
      navigationMode?.search ?? 'replace',
    );
  }, [
    appliedSearchQuery,
    debouncedSearchInput,
    navigateWithSearchParams,
    navigationMode?.search,
    searchInput,
  ]);

  const setPage = useCallback(
    (page: number) => {
      const nextPage = Math.max(page, 1);

      navigateWithSearchParams(
        {
          page: nextPage <= 1 ? null : String(nextPage),
        },
        navigationMode?.page ?? 'push',
      );
    },
    [navigateWithSearchParams, navigationMode?.page],
  );

  const setFilter = useCallback(
    (nextFilter: TFilter, options?: SetFilterOptions) => {
      const shouldResetPage = options?.resetPage ?? true;
      const nextSearch =
        resetSearchOnFilterChange && searchInput.trim() !== ''
          ? null
          : undefined;

      setOptimisticFilter(nextFilter);
      navigateWithSearchParams(
        {
          [filterParamName]:
            nextFilter === defaultFilter ? null : String(nextFilter),
          ...(shouldResetPage ? { page: null } : {}),
          ...(resetSearchOnFilterChange ? { search: nextSearch } : {}),
        },
        navigationMode?.filter ?? 'push',
      );

      if (resetSearchOnFilterChange) {
        setSearchInput('');
      }
    },
    [
      defaultFilter,
      filterParamName,
      navigateWithSearchParams,
      navigationMode?.filter,
      resetSearchOnFilterChange,
      searchInput,
    ],
  );

  const commitSearch = useCallback(() => {
    if (isPending) {
      return;
    }

    const normalizedSearch =
      searchInput.trim() === '' ? null : searchInput.trim();

    navigateWithSearchParams(
      {
        search: normalizedSearch,
        page: null,
      },
      navigationMode?.search ?? 'replace',
    );
  }, [
    isPending,
    navigateWithSearchParams,
    navigationMode?.search,
    searchInput,
  ]);

  return {
    currentPage,
    activeFilter,
    searchQuery: searchInput,
    appliedSearchQuery,
    isPending,
    setPage,
    setFilter,
    setSearchQuery: setSearchInput,
    commitSearch,
  };
}
