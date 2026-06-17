# PROJECT_STATUS.md — 블랙벨트 프로젝트 전체 현황

> 마지막 업데이트: 2026-06-17
> 현재 브랜치: `redesign/229-dark-bjj-theme`

---

## 1. 프로젝트 개요

### 목적
유도·주짓수·레슬링·복싱·태권도·MMA 등 모든 운동 종목 수련자·도장·코치를 하나의 공간에서 연결하는 올인원 스포츠 커뮤니티 플랫폼.
사용자는 기술 공유·수련 경험을 기록하고, 도장과 코치는 공지·홍보를 통해 직접 소통한다.

### 현재 상태
- **배포 완료** — 2026-05-20 Vercel 배포 완료, 운영 중
- **리디자인 PR 완료** — 이슈 #229 기반 UI 전면 리디자인 (`redesign/229-dark-bjj-theme`) PR 작성 완료

### 기술 스택

| 구분 | 기술 | 비고 |
|------|------|------|
| Frontend | Next.js (App Router), React 19, TypeScript | |
| 상태 관리 | Zustand, TanStack Query (React Query) | Zustand = UI 전역 상태, TQ = 서버 데이터 |
| 유효성 검사 | Zod | 폼 스키마 및 타입 동기화 |
| 스타일링 | Tailwind CSS v4 | |
| 백엔드/인증/스토리지 | Supabase | DB + Auth + Storage 통합 |
| 지도 API | Kakao Maps API (Places API) | 문서에는 네이버로 기재됐으나 실제는 카카오 |
| 토스트 알림 | react-hot-toast | `Toaster` 루트 레이아웃 마운트 |
| 배포 | Vercel | |

---

## 2. 폴더 구조 및 각 파일의 역할

```
src/
├── actions/                    # Server Actions (서버에서 직접 실행되는 mutation)
│   ├── admin/
│   │   ├── _shared.ts          # 관리자 공통 유틸
│   │   ├── competitions.ts     # 대회 관리 액션
│   │   ├── dojang.ts           # 도장 관리 액션
│   │   ├── posts.ts            # 게시글 관리 액션
│   │   ├── reports.ts          # 신고 처리 액션
│   │   └── users.ts            # 유저 제재 액션
│   └── competition/
│       └── competitions.ts     # 일반 대회 CRUD 액션
│
├── app/
│   ├── (admin)/                # 관리자 전용 라우트 그룹
│   │   └── admin/
│   │       ├── layout.tsx      # 관리자 레이아웃 (별도 사이드바)
│   │       ├── page.tsx        # 대시보드
│   │       ├── competitions/   # 대회 관리
│   │       ├── posts/          # 게시글 관리
│   │       ├── support/        # 고객 지원 (신고·도장 승인)
│   │       └── users/          # 유저 관리
│   │
│   ├── (auth)/                 # 인증 라우트 그룹 (사이드바 없음)
│   │   ├── find-password/      # 3단계 비밀번호 찾기 (Step1~3)
│   │   ├── login/              # 로그인
│   │   └── register/           # 회원가입 (일반/도장 분기)
│   │       └── components/     # BeltSelect, PasswordStrength 등 회원가입 전용 컴포넌트
│   │
│   ├── (main)/                 # 메인 서비스 라우트 그룹 (사이드바 있음)
│   │   ├── community/
│   │   │   ├── page.tsx        # 커뮤니티 목록 (Server Component)
│   │   │   ├── write/          # 게시글 작성
│   │   │   └── [slug]/
│   │   │       ├── page.tsx    # 게시글 상세
│   │   │       └── edit/       # 게시글 수정
│   │   ├── competitions/
│   │   │   ├── page.tsx        # 대회 목록
│   │   │   ├── write/          # 대회 등록 (관리자·도장 전용)
│   │   │   └── [slug]/
│   │   │       ├── page.tsx    # 대회 상세
│   │   │       └── edit/       # 대회 수정
│   │   ├── dojangs/page.tsx    # 도장 찾기 (Kakao Maps)
│   │   ├── mypage/page.tsx     # 마이페이지
│   │   └── layout.tsx          # 메인 레이아웃 (Sidebar 포함)
│   │
│   ├── api/                    # Route Handlers (API 엔드포인트)
│   │   ├── register/           # 일반 회원가입 (서버에서 Supabase Auth 처리)
│   │   ├── register-dojang/    # 도장 회원가입
│   │   ├── delete-account/     # 회원 탈퇴
│   │   ├── reset-password/     # 비밀번호 재설정
│   │   ├── check-nickname/     # 닉네임 중복 확인
│   │   ├── posts/              # 게시글 CRUD (revalidateTag 포함)
│   │   ├── comments/           # 댓글 CRUD
│   │   └── reports/            # 신고 접수
│   │
│   ├── home/page.tsx           # 서비스 소개 페이지 (랜딩)
│   ├── page.tsx                # 루트 → /community 리다이렉트
│   ├── layout.tsx              # 루트 레이아웃 (QueryClientProvider, Toaster)
│   ├── error.tsx               # 전역 에러 핸들러
│   ├── not-found.tsx           # 404 페이지
│   └── globals.css             # Tailwind 기반 전역 스타일
│
├── components/
│   ├── admin/                  # 관리자 전용 UI (DataTable, Pagination, Actions 등)
│   ├── common/                 # 범용 공용 컴포넌트
│   │   ├── ConfirmModal.tsx    # 삭제·탈퇴 확인 모달
│   │   ├── Field.tsx           # 라벨+인풋 래퍼
│   │   ├── SearchInput.tsx     # 검색 인풋 (디바운스 적용)
│   │   └── ...
│   ├── community/              # 커뮤니티 관련 (PostCard, WriteClient, CommentForm 등)
│   ├── competition/            # 대회 관련 (CompetitionCard, CompetitionForm 등)
│   ├── dojang/                 # 도장 찾기 (DojangClient - Kakao Maps 연동)
│   ├── layout/                 # Sidebar, PageHeader, LogoutButton
│   ├── mypage/                 # ProfileCard, PostList, SettingsTab
│   ├── error/                  # ErrorScreen, ErrorScreenActions
│   └── ui/                     # shadcn/ui 기반 기본 컴포넌트 (Button, Input, Dialog 등)
│
├── constants/
│   ├── belt.ts                 # 벨트 등급 목록 (White/Blue/Purple/Brown/Black)
│   ├── categoryMap.ts          # 게시글 카테고리 매핑
│   ├── routes.ts               # 라우트 상수
│   └── user.ts                 # 유저 역할 상수
│
├── hooks/
│   ├── useAuth.ts              # 로그인 유저 정보 + logout
│   ├── useCommunity.ts         # 커뮤니티 TanStack Query 훅
│   ├── useCompetition.ts       # 대회 TanStack Query 훅
│   ├── useMyPage.ts            # 마이페이지 TanStack Query 훅
│   ├── useInfiniteScroll.ts    # 무한 스크롤 IntersectionObserver
│   ├── useDebounce.ts          # 검색 디바운스 (0.5초)
│   ├── useLike.ts              # 좋아요 Optimistic Update
│   ├── useNicknameCheck.ts     # 닉네임 중복 확인
│   └── useUserRole.ts          # 현재 유저 역할 반환
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # 브라우저용 Supabase 클라이언트 (SSR)
│   │   ├── server.ts           # 서버 컴포넌트용 (cookies 사용)
│   │   └── public.ts           # 공개 데이터용 (cookies 없음, use cache 가능)
│   ├── auth.ts                 # 세션 확인 유틸
│   ├── slug.ts                 # URL slug 생성/파싱
│   ├── likes.ts                # 좋아요 Supabase 쿼리
│   ├── getCompetitions.ts      # 대회 목록 서버 조회 (use cache 적용)
│   ├── contentPermissions.ts   # 작성자/관리자 권한 확인
│   ├── CommentAbuseGuard.ts    # 댓글 도배 방지
│   ├── reportNotificationEmail.ts  # 신고 알림 이메일 발송
│   ├── toast.ts                # toast 헬퍼
│   └── queryClient.ts          # TanStack QueryClient 싱글턴
│
├── services/                   # Supabase 직접 호출 함수
│   ├── authService.ts          # 회원가입·로그인·파일 업로드
│   ├── communityService.ts     # 게시글·댓글 클라이언트 사이드 CRUD
│   ├── communityService.server.ts  # 게시글 서버 사이드 조회
│   ├── competitionService.ts   # 대회 클라이언트 사이드 CRUD
│   ├── competitionService.server.ts  # 대회 서버 사이드 조회
│   ├── userService.ts          # 프로필·마이페이지·회원탈퇴
│   └── reportService.ts        # 신고 접수
│
├── store/
│   └── authStore.ts            # Zustand 인증 상태 (user, loading)
│
├── types/
│   ├── Database.types.ts       # Supabase 자동 생성 DB 타입
│   ├── auth.ts / community.ts / competition.ts / dojang.ts / mypage.ts / user.ts
│   └── navermaps/index.d.ts    # 지도 타입 선언 (파일명은 naver이나 실제 Kakao 사용)
│
└── utils/
    ├── formatDate.ts           # 날짜 포맷
    ├── timeAgo.ts              # "N분 전" 포맷
    └── share.ts                # URL 클립보드 공유
```

---

## 3. 완료된 기능

### 인증
- [x] 이메일 회원가입 (일반 / 도장 2가지 경로)
- [x] 로그인 / 로그아웃
- [x] 3단계 비밀번호 찾기 (이메일 인증 → 재설정)
- [x] 닉네임 중복 확인 (API Route)
- [x] 사업자등록증 파일 업로드 (Storage `business-files`)

### 커뮤니티
- [x] 게시글 목록 조회 (무한 스크롤, 카테고리 필터)
- [x] 종목별 커뮤니티 `/community/sport/[slug]` — judo/bjj/wrestling/boxing/taekwondo/mma
- [x] 게시글 작성 / 수정 / 삭제 (Soft Delete)
- [x] 게시글 상세 (작성자 정보, 조회수 자동 증가)
- [x] 이미지 업로드 (Storage `post-images`, JPG/PNG, 1매 제한)
- [x] 동영상 업로드 (Storage `post-videos`, 최대 50MB)
- [x] 댓글 CRUD (Soft Delete)
- [x] 좋아요 (Optimistic Update)
- [x] 북마크/저장 (DB 기반, 마이페이지 "저장한 게시글" 탭 연동)
- [x] 게시글 신고 기능 + 알림 이메일 발송
- [x] 키워드 검색 (0.5초 디바운싱)
- [x] 게시글 URL 공유 (클립보드 복사)
- [x] 홍보 게시글 광고 사이드바 (`PromoAdSidebar`) — 4초 자동 슬라이드, 전 종목 공통 표시

### 대회 일정
- [x] 대회 목록 / 상세 조회
- [x] 대회 등록 / 수정 / 삭제 (관리자·도장 계정 전용, Soft Delete)
- [x] 대회 이미지 업로드 (Storage `competition-images`)

### 도장 찾기
- [x] Kakao Places API 연동 키워드 검색
- [x] 현재 위치 기반 주변 도장 검색
- [x] Kakao Maps 마커 표시 + 도장 카드 연동

### 인증
- [x] 비밀번호 인풋 눈 아이콘 (Eye/EyeOff 토글, 로그인·회원가입 공통)
- [x] 회원가입 시 벨트 선택 → **운동 종목 선택**으로 변경 (belt_level 컬럼 재활용)

### 마이페이지
- [x] 프로필 조회 / 수정 (닉네임, 아바타, 소개글, 운동 종목)
- [x] 내가 쓴 게시글 목록 (무한 스크롤)
- [x] 저장한 게시글 목록 (북마크, 무한 스크롤)
- [x] 프로필에 운동 종목 표시 (종목 컬러 바 + 아이콘)
- [x] 회원 탈퇴

### 관리자 대시보드
- [x] 유저 목록 (페이지네이션 10/20개)
- [x] 유저 게시글 작성 정지 / 계정 삭제
- [x] 게시글 관리 (삭제)
- [x] 대회 일정 수동 등록·관리
- [x] 신고 접수 목록 및 처리
- [x] 도장 계정 승인

### 공통 인프라
- [x] Supabase 클라이언트 3종 분리 (`client` / `server` / `public`)
- [x] `use cache` + `revalidateTag` 캐싱 전략 적용
- [x] 서버/클라이언트 서비스 파일 분리 (`*.server.ts`)
- [x] 에러 페이지 (전역 `error.tsx`, 404 `not-found.tsx`)
- [x] `.gitignore` — `.superpowers/`, `.claude/` 제외 처리

---

## 4. 현재 진행 중 / 남은 작업

### 진행 중
- [x] **UI 리디자인 완료** (이슈 #229, 브랜치 `redesign/229-dark-bjj-theme`)
  - 전체 다크 테마 (#111111 배경) 적용 완료
  - 커뮤니티: 히어로 섹션(320px) + 3열 레이아웃 (광고/게시글/스포츠 사이드바)
  - 마이페이지: 대형 프로필 + 4개 통계 박스 + 탭 (게시글/저장/설정)
  - 홈 랜딩 페이지, TopNav, Footer 신규 구현
  - 종목별 커뮤니티 히어로 이미지 per-sport objectPosition 적용

### 미구현 (후순위)
- [ ] `competitionService.ts`의 `getCompetitions()` 클라이언트 목록 조회 미구현 (현재 `lib/getCompetitions.ts`에서 서버 사이드로만 처리)
- [ ] 게시글 등록 전 미리보기 기능
- [ ] 좋아요 기반 인기글 정렬
- [ ] 실시간 댓글 업데이트

### 구현 제외 (확정)
- 소셜 로그인
- 1:1 실시간 채팅
- 모바일 앱 (웹 데스크탑 전용)

---

## 5. 중요 결정사항 및 컨벤션

### 아키텍처 결정

**서비스 파일 2종 분리**
서버 컴포넌트에서 `use cache`를 쓰려면 `cookies()`를 사용하는 브라우저 클라이언트를 가져올 수 없다.
이 때문에 `communityService.ts` (클라이언트용) 와 `communityService.server.ts` (서버용, `supabasePublic` 사용) 로 분리했다.

**API Route vs Server Action 혼용**
- `app/api/` — 외부에서 호출 가능해야 하는 엔드포인트 (회원가입·댓글·신고 등). `revalidateTag` 호출도 여기서 처리.
- `actions/` — 관리자 페이지 등 폼 기반 서버 사이드 mutation.

**Supabase 클라이언트 3종**
```
lib/supabase/client.ts   → 브라우저 (SSR, cookies 있음)
lib/supabase/server.ts   → 서버 컴포넌트 (cookies 있음, 인증 필요한 조회)
lib/supabase/public.ts   → 서버 컴포넌트 (cookies 없음, use cache 적용 가능)
```

**Slug 기반 URL**
게시글·대회 상세 URL은 숫자 ID 대신 `[slug]` 형식 사용. `lib/slug.ts`에서 변환 처리.

### 주의사항

- `competition` 테이블 날짜 컬럼명은 `event_date`가 **아니라** `event_data` (오타 아님, 수정 금지)
- 도장 찾기는 **Kakao Maps** 사용 (일부 문서·타입 파일에 naver로 기재돼 있으나 실제 구현은 카카오)
- Soft Delete 필수: 게시글·댓글·대회 삭제 시 `deleted_at` 업데이트, 조회 시 `deleted_at IS NULL` 필터 필수
- `getCompetitions()` 클라이언트 서비스 함수 미구현 상태 — 목록 조회는 `lib/getCompetitions.ts` (서버) 사용

### 커밋·브랜치 규칙

```
# 커밋 태그
[Feat] 기능 추가  [Fix] 버그 수정  [Design] UI 변경
[Refactor] 구조 개선  [Docs] 문서  [Style] 포맷  [Chore] 설정

# 브랜치
feat/{issue번호}-{기능명}
fix/{issue번호}-{내용}
redesign/{issue번호}-{내용}
```

### 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트·타입 | PascalCase | `PostCard`, `ButtonProps` |
| 함수·변수·훅 | camelCase | `fetchMyPosts`, `useAuth` |
| 상수 | UPPER_SNAKE_CASE | `MAX_FILE_SIZE` |
| Zustand 스토어 | `use` 접두사 | `authStore.ts` → `useAuthStore` |
| TanStack Query 훅 | `hooks/` 에서 커스텀 훅으로 감싸기 | `useCommunity.ts` |
| Zod 스키마 | `schemas/` 에 정의, `z.infer<>` 타입 동기화 | |

---

## 6. 환경 변수 (필수)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_KAKAO_MAP_KEY=       # Kakao Maps API 키
```
