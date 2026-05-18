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
      className={`p-4 border rounded-lg bg-white hover:shadow-md transition-all cursor-pointer
        ${isSelected ? 'border-btn-focus border-2 shadow-md' : 'border-gray-200'}`}
      aria-label={`${dojang.place_name}${isSelected ? ', 선택됨' : ''}`}
      aria-current={isSelected}
    >
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-base line-clamp-1">
          {dojang.place_name}
        </h3>
      </div>

      <address className="text-sm text-gray-500 mt-1 not-italic">
        {dojang.address_name}
      </address>

      {dojang.phone && (
        <a
          href={'tel:' + dojang.phone}
          className="text-sm text-gray-400 mt-1 block hover:text-gray-600 transition-colors"
          aria-label={'전화번호: ' + dojang.phone}
        >
          {dojang.phone}
        </a>
      )}

      <a
        href={dojang.place_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={dojang.place_name + ' 상세보기 (새 탭에서 열림)'}
        className="mt-3 block w-full py-2 text-sm font-bold text-white text-center rounded-lg bg-[#2c2c2c] hover:bg-black transition-all"
      >
        상세보기
      </a>
    </article>
  );
}
