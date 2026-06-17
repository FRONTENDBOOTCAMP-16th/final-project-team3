@AGENTS.md

# Activio — Claude 참고 문서

모든 운동 종목(유도·주짓수·레슬링·복싱·태권도·MMA 등) 수련자·도장·코치를 연결하는 올인원 스포츠 커뮤니티 플랫폼.

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | Next.js (App Router), React, TypeScript |
| 상태 관리 | Zustand (전역), TanStack Query (서버), Zod (스키마) |
| 스타일링 | Tailwind CSS v4 |
| 백엔드 | Supabase (DB + Auth + Storage) |
| 외부 API | 네이버지도 API |
| 배포 | Vercel |

---

## 폴더 구조

```
src/
├── app/
│   ├── (auth)/          # 로그인·회원가입·비밀번호찾기
│   ├── (main)/          # 커뮤니티·대회일정·도장찾기·마이페이지·관리자
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── auth/
│   ├── common/
│   ├── community/
│   ├── competition/
│   ├── dojang/
│   └── ui/              # shadcn 기반 공용 컴포넌트
├── services/            # Supabase 호출 함수 모음
├── hooks/               # 커스텀 훅 (TanStack Query 래핑)
├── store/               # Zustand 스토어
├── types/
├── constants/
└── utils/
```

---

## 네이밍 규칙

- **컴포넌트·타입·인터페이스** → `PascalCase` (I/T 접두사 사용 지양)
- **함수·변수·훅** → `camelCase`
- **상수** → `UPPER_SNAKE_CASE`
- **Props 타입** → `컴포넌트명 + Props` (예: `ButtonProps`)
- **파일** → 페이지: `app/.../page.tsx` / 공용 컴포넌트: `components/common/Button.tsx`

---

## 상태 관리 패턴

- **Zustand** — 인증·모달 등 전역 UI 상태만. 파일명은 `use` 접두사 (`useAuthStore.ts`)
- **TanStack Query** — 서버 데이터 전담. 커스텀 훅으로 감싸서 사용 (`hooks/queries/useGyms.ts`), 페이지 직호출 금지
- **Zod** — 폼 스키마는 `schemas/` 에 정의, `z.infer<>` 로 TS 타입 동기화

---

## 캐싱 전략

공개 데이터는 `use cache` + `revalidateTag`, 인증 데이터는 캐싱 없이 매 요청 조회.

| 데이터 종류 | 클라이언트 | 캐싱 |
|------------|-----------|------|
| 커뮤니티 목록·대회·도장 | `supabasePublic` | `use cache` 적용 |
| 글 작성·마이페이지·인증 | `createSupabaseServerClient` (cookies) | 캐싱 없음 |

데이터 변경 시 → `revalidateTag('태그명')` 으로 즉시 무효화.

---

## DB 핵심 규칙

- 게시글·댓글·대회 삭제는 모두 **Soft Delete** (`deleted_at` 컬럼 업데이트, 실제 row 삭제 안 함)
- 조회 시 항상 `deleted_at IS NULL` 필터 필수
- 에러 발생 시 `throw error` → 호출부에서 `try/catch` 처리

---

## 서비스 파일 요약

### `authService.ts`
- `registerGeneral()` / `registerDojang()` — 내부 API Route 경유 (`/api/register`)
- `uploadBusinessFile(file)` — Storage `business-files` 버킷 업로드

### `userService.ts`
- `fetchMyProfile()` / `updateMyProfile()` — `profiles` 테이블
- `fetchMyPosts(page)` — 페이지당 10개, `profiles` + `comments(count)` 조인
- `deleteMyAccount()` — `/api/delete-account` 경유 후 `signOut`

### `communityService.ts`
- `getPosts(page?, pageSize?)` — 공지 목록, `deleted_at IS NULL` + `status = 'published'`
- `getSportPosts(sport, page?, pageSize?)` — 종목별 목록, `sport = slug` 필터
- `getPost(id)` — 단건, `React.cache` 래핑
- `getPromoPosts(limit?)` — 홍보 게시글 목록 (`category = 'promo'`), 광고 사이드바용
- `createPost / updatePost / deletePost` — CRUD (삭제는 Soft Delete)
- `getComments / createComment / updateComment / deleteComment`
- `uploadPostImage(file)` — Storage `post-images` 버킷
- `uploadPostVideo(file)` — Storage `post-videos` 버킷 (최대 50MB)
- `incrementViewCount(id)` — RPC `increment_view_count` (fire-and-forget)

### `bookmarkService.ts`
- `fetchMyBookmarks(page)` — 내가 저장한 게시글 목록 (페이지당 10개)
- `fetchMyBookmarkCount()` — 저장한 게시글 수

### `competitionService.ts`
- 테이블명: `competition` (단수)
- `createCompetition / getCompetition / updateCompetition / deleteCompetition`
- `uploadCompetitionImage(file)` — Storage `competition-images` 버킷
- ⚠️ `getCompetitions()` (목록 조회) 미구현 — 추가 필요
- ⚠️ 컬럼명 주의: `event_date` → `event_data` 로 변경됨

---

## 주요 테이블 컬럼

### `profiles`
`id` · `nickname` · `avatar_url` · `bio` · `belt_level` · `role` (`user`|`dojang`|`admin`) · `email_value` · `phone_value` · `name` · 도장 전용: `business_number` · `representative` · `contact` · `address` · `business_file_url`

- ⚠️ `belt_level` 컬럼은 현재 **운동 종목 slug** (`judo`|`bjj`|`wrestling`|`boxing`|`taekwondo`|`mma`)를 저장. DB 마이그레이션 없이 재활용 중. `BeltLevel` 타입 대신 `string | null` 사용.

### `posts`
`id` · `user_id` · `title` · `content` · `category` (`notice`|`promo`|`personal`) · `sport` (`judo`|`bjj`|`wrestling`|`boxing`|`taekwondo`|`mma`|NULL) · `image_url` · `video_url` · `view_count` · `report_count` · `status` · `deleted_at` · `created_at`

- `sport` 컬럼: 스포츠 커뮤니티 게시글에만 값이 있음. 공지(`notice`)는 NULL.
- 스포츠 커뮤니티 조회 시 `sport = 'slug'` 로 필터.
- `video_url`: 동영상 게시글에만 값이 있음. Storage `post-videos` 버킷 URL.
- `category = 'promo'`: 도장 홍보 게시글. 광고 사이드바(`PromoAdSidebar`)에 표시됨.

### `bookmarks`
`id` · `user_id` · `post_id` · `created_at`

- 복합 유니크 제약: `(user_id, post_id)`
- 게시글 북마크/저장 기능. `bookmarks` 테이블에서 직접 조회.

### `competition`
`id` · `name` · `location` · `event_data` · `apply_deadline` · `apply_url` · `description` · `image_url` · `user_id` · `participants` · `deleted_at` · `created_at`

---

## 커밋·브랜치 규칙

```
# 커밋
[Feat] 회원가입 유효성 검사 추가
[Fix] 헤더 active 오류 수정
[Design] 커뮤니티 카드 UI 수정
[Refactor] API 호출 공통 함수화
[Docs] README 업데이트
[Style] 코드 포맷 정리
[Chore] 환경변수 설정 변경

# 브랜치
feat/33-login-page
fix/44-header-active-bug
redesign/229-dark-bjj-theme
```

---

## 구현 제외 범위

- 소셜 로그인 (이메일 전용)
- 1:1 실시간 채팅
- 모바일 앱 (데스크탑 퍼스트, 웹만)
- 후순위: 게시글 미리보기, 실시간 댓글, 인기글 정렬

---

## 스포츠 커뮤니티 구조

- `/community` — 공지 전용 (admin만 글쓰기)
- `/community/sport/[slug]` — 종목별 커뮤니티 (로그인 유저 글쓰기 가능)
  - slug 목록: `judo` / `bjj` / `wrestling` / `boxing` / `taekwondo` / `mma`
  - 종목 상수: `src/constants/sports.ts` (`SPORTS`, `SportSlug`, `getSportBySlug`)
- 게시글의 `sport` 컬럼으로 종목 구분 (NULL = 공지/일반)
- 좌측 사이드바: `PromoAdSidebar` — `category='promo'` 게시글 최대 5개, 5개 초과 시 4초 자동 슬라이드
- 우측 사이드바: 스포츠 커뮤니티 네비게이션 (현재 종목 하이라이트)

---

## AI(Claude) 지침 및 주의사항

1. **컨텍스트 확인 우선**
   - 파일 경로·타입명·환경변수·라이브러리 사용법 등 문서에 명시되지 않은 내용이 필요하면 임의로 코드를 생성하지 말 것.
   - `src/types/`, `src/components/ui/` 등 관련 폴더를 먼저 조회해 이미 구현된 패턴을 확인한 후 그에 맞춰 작성할 것.

2. **미구현 및 오타 주의**
   - `competitionService.ts`의 `getCompetitions()`(목록 조회)는 **미구현** 상태. 임의로 호출하지 말고, 규칙에 맞게 구현하거나 구현을 먼저 제안할 것.
   - `competition` 테이블의 날짜 컬럼은 `event_date`가 아니라 **`event_data`**. 오타가 아니므로 수정하지 말 것.

3. **구현 제외 범위 준수**
   - 소셜 로그인·1:1 채팅·실시간 기능 등 위 제외 범위에 해당하는 코드는 요구사항에 있더라도 구현하지 않고 생략할 것.
