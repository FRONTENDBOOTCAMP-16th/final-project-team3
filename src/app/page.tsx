import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* 로고 */}
      <div className="flex flex-col items-center mb-6 animate-fade-in">
        <div className="mb-4 relative">
          <Image src="/blackbelt.svg" alt="로고" width={170} height={170} />
        </div>

        {/* 타이틀 */}
        <h1
          className="text-4xl font-black tracking-tight text-black text-center leading-tight"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          블랙벨트
        </h1>
        <p
          className="text-lg font-light tracking-[0.3em] text-gray-500 mt-1"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          (Black-Belt)
        </p>
        <br />

        {/* 설명 텍스트 */}
        <p className="text-sm text-gray-600 text-center max-w-xl leading-relaxed">
          주짓수인들을 위한 올인원 네트워크, 블랙벨트
          <br />
          <br />
          블랙벨트(Black-Belt) 플랫폼은 주짓수 수련자와 도장을
          <br />
          하나의 공간에서 연결하는 커뮤니티 서비스입니다.
          <br />
          사용자는 기술 공유, 매칭 요청, 수련 경험을 기록할 수 있으며,
          <br />
          도장은 공지 및 홍보를 통해 수련자들과 직접 소통할 수 있는 커뮤니티
          플랫폼입니다.
        </p>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        <Link
          href="/community"
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-btn-focus text-black text-sm font-medium rounded-xl hover:bg-btn-focus hover:text-white transition-colors duration-200"
        >
          <Image src="/whitebelt.svg" alt="흰 벨트" width={35} height={35} />
          <span>커뮤니티</span>
        </Link>

        <Link
          href="/dojangs"
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-btn-focus text-black text-sm font-medium rounded-xl hover:bg-btn-focus hover:text-white transition-colors duration-200"
        >
          <Image src="/brownbelt.svg" alt="흰 벨트" width={35} height={35} />
          <span>도장 찾기</span>
        </Link>

        <Link
          href="/competitions"
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-btn-focus text-black text-sm font-medium rounded-xl hover:bg-btn-focus hover:text-white transition-colors duration-200"
        >
          <Image
            src="/blackbeltcompetiton.svg"
            alt="흰 벨트"
            width={35}
            height={35}
          />
          <span>대회 일정</span>
        </Link>

        <Link
          href="/login"
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-btn-focus text-black text-sm font-medium rounded-xl hover:bg-btn-focus hover:text-white transition-colors duration-200"
        >
          <span>로그인</span>
        </Link>
      </div>
    </main>
  );
}
