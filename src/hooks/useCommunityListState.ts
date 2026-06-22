import { useState, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

/**
 * CommunityClient, SportCommunityClient에서 공통으로 쓰이는 목록 상태.
 *
 * 스크롤 복원 useEffect는 이 훅에 포함하지 않는다.
 * filteredPosts가 이 훅의 출력(debouncedSearch)에 의존하므로
 * 훅 인자로 받으면 순환 참조가 발생하기 때문이다.
 * isScrollRestoredRef는 여기서 생성해서 반환하고,
 * 각 컴포넌트가 filteredPosts를 의존성으로 삼는 effect를 직접 선언한다.
 */
export function useCommunityListState() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const isScrollRestoredRef = useRef(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  return {
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    hoveredSlug,
    setHoveredSlug,
    isScrollRestoredRef,
  };
}
