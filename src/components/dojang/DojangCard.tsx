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
}

export default function DojangCard({ dojang, isVerified }: DojangCardProps) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-all cursor-pointer">
      {/* 도장 이름 + 인증 배지 */}
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-base line-clamp-1">
          {dojang.place_name}
        </h3>
        {isVerified && (
          <span className="shrink-0 px-2 py-0.5 text-xs text-white bg-[#155DFC] rounded-full">
            ✓ 인증
          </span>
        )}
      </div>

      {/* 주소 */}
      <p className="text-sm text-gray-500 mt-1">{dojang.address_name}</p>

      {/* 전화번호 */}
      {dojang.phone && (
        <p className="text-sm text-gray-400 mt-1">{dojang.phone}</p>
      )}

      {/* 상세보기 버튼 */}

      <a
        href={dojang.place_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block w-full py-2 text-sm font-bold text-white text-center rounded-lg bg-[#2c2c2c] hover:bg-black transition-all"
      >
        상세보기
      </a>
    </div>
  );
}
