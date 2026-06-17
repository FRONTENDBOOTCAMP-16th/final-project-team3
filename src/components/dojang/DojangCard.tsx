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
  isSelected: boolean;
}

export default function DojangCard({ dojang, isSelected }: DojangCardProps) {
  return (
    <article
      className={`p-4 border rounded-xl bg-bg-white hover:shadow-xl transition-all cursor-pointer h-full flex flex-col
        ${isSelected ? 'border-btn-focus border-2 shadow-lg shadow-btn-focus/20' : 'border-white/[0.07] hover:border-white/[0.14]'}`}
      aria-label={`${dojang.place_name} 도장${isSelected ? ', 선택됨' : ''}`}
      aria-current={isSelected}
    >
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-base line-clamp-1">
          {dojang.place_name}
        </h3>
      </div>

      <address className="text-sm text-text-secondary mt-1 not-italic">
        {dojang.address_name}
      </address>

      {dojang.phone ? (
        <a
          href={'tel:' + dojang.phone}
          className="text-sm text-text-secondary mt-1 block hover:text-text-primary transition-colors"
          aria-label={'전화번호: ' + dojang.phone}
        >
          {dojang.phone}
        </a>
      ) : (
        <div className="mt-1 h-5" />
      )}

      <div className="flex-1" />

      <a
        href={dojang.place_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={dojang.place_name + ' 상세보기 (새 탭에서 열림)'}
        className="mt-3 block w-full py-2 text-sm font-bold text-white text-center rounded-lg bg-btn-focus hover:opacity-90 active:scale-[0.98] transition-all"
      >
        상세보기
      </a>
    </article>
  );
}
