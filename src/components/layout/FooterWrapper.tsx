'use client';

// (main) 레이아웃 그룹 내 모든 라우트에 Footer를 노출.
// 현재 (main) 밖 라우트(/home 등)는 구조적으로 이 레이아웃을 타지 않으므로
// pathname 조건 없이 children을 그대로 렌더한다.
// 특정 (main) 하위 라우트에서 Footer를 숨겨야 할 경우 pathname 조건을 여기에 추가.
export default function FooterWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
