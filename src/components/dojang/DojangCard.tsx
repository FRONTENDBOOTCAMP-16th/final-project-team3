interface KakaoPlace {
  id: string;
  place_name: string;
  address_name: string;
  phone: string;
  place_url: string;
  category_name: string;
  x: string;
  y: string;
}

interface DojangCardProps {
  dojang: KakaoPlace;
  isVerified: boolean;
  isSelected: boolean;
}

export default function DojangCard({
  dojang,
  isVerified,
  isSelected,
}: DojangCardProps) {
  return (
    <article
      className={`p-4 border rounded-lg bg-bg-white hover:shadow-md transition-all cursor-pointer
        ${isSelected ? 'border-btn-focus border-2 shadow-md' : 'border-border'}`}
      aria-label={`${dojang.place_name} 도장${isVerified ? ', 인증 도장' : ''}${isSelected ? ', 선택됨' : ''}`}
      aria-current={isSelected}
    >
      {/* 도장 이름 + 인증 배지 */}
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-base line-clamp-1">
          {dojang.place_name}
        </h3>
        {isVerified && (
          <span
            className="shrink-0 px-2 py-0.5 text-xs text-category-text bg-category-promo-bg rounded-full"
            aria-label="인증된 도장"
          >
            ✓ 인증
          </span>
        )}
      </div>

      {/* 주소 */}
      <address className="text-sm text-text-secondary mt-1 not-italic">
        {dojang.address_name}
      </address>

      {/* 전화번호 */}
      {dojang.phone && (
        <a
          href={'tel:' + dojang.phone}
          className="text-sm text-text-secondary mt-1 block hover:text-text-primary transition-colors"
          aria-label={'전화번호: ' + dojang.phone}
        >
          {dojang.phone}
        </a>
      )}

      {/* 상세보기 버튼 */}

      <a
        href={dojang.place_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={dojang.place_name + ' 상세보기 (새 탭에서 열림)'}
        className="mt-3 block w-full py-2 text-sm font-bold text-center rounded-lg bg-btn-focus hover:bg-btn-focus text-btn-focus-text transition-all"
      >
        상세보기
      </a>
    </article>
  );
}
