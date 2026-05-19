# 🥋 블랙벨트 (Black-Belt)

> 주짓수 수련자와 도장, 코치를 하나의 공간에서 연결하는 커뮤니티 플랫폼

🔗 **배포 링크**: [https://final-project-team3.vercel.app/](https://final-project-team3.vercel.app/)

---

## 📌 프로젝트 소개

**블랙벨트(Black-Belt)** 는 주짓수 수련자, 도장, 코치를 하나의 공간에서 연결하는 커뮤니티 서비스입니다.
사용자는 기술 공유, 수련 경험 기록, 대회 일정 확인이 가능하며,
도장과 코치는 공지 및 홍보를 통해 수련자들과 직접 소통할 수 있습니다.

- **팀명**: 블랙벨트 (Black-Belt)
- **개발 기간**: 2026. 04. 16 ~ 2026. 05. 20
- **인원**: 4명

---

## 🛠 기술 스택

| 구분      | 기술                                      |
| --------- | ----------------------------------------- |
| Frontend  | Next.js 16, React 19, TypeScript          |
| 상태 관리 | Zustand, TanStack Query, Zod              |
| 스타일링  | Tailwind CSS, shadcn/ui                   |
| 인증 / DB | Supabase (Auth, PostgreSQL, Storage, RLS) |
| 지도 API  | 네이버 지도 API, 카카오 로컬 API          |
| 배포      | Vercel                                    |
| 협업 도구 | Git / GitHub, Notion, VS Code             |

---

## 🗄️ DB 스키마

```
profiles      — 유저 기본 정보 (id, nickname, avatar_url, bio, belt_level, role, name, email_value, account_status, created_at)
posts         — 게시글 (id, user_id → profiles, title, content, category, image_url, view_count, report_count, status, created_at, updated_at, deleted_at)
comments      — 댓글 (id, post_id → posts, user_id → profiles, content, dojang, created_at, deleted_at)
likes         — 좋아요 (id, post_id → posts, user_id → profiles, created_at)
reports       — 신고 (id, reporter_id → profiles, post_id → posts, reason, reports_status, handled_at, action_type, created_at)
competition   — 대회일정 (id, user_id → profiles, name, location, event_data, description, image_url, participants, apply_url, apply_deadline, view_count, created_at, deleted_at)
dojang        — 도장 (id, profile_id → profiles, business_number, representative, phone_value, addr, business_file_url, dojang_status, created_at, updated_at)
```

> 외래키는 모두 `profiles(id)` 참조 (PostgREST JOIN을 위해 `auth.users` 직접 참조 제거)
> `posts.user_id`는 `auth.users.id` 참조 (ERD 기준)

---

## 🔐 역할별 권한

| 기능                    | 일반 유저 | 매니저 (도장) | 어드민 |
| ----------------------- | :-------: | :-----------: | :----: |
| 게시글 조회             |    ✅     |      ✅       |   ✅   |
| 일반 게시글 작성        |    ✅     |      ✅       |   ✅   |
| 도장 홍보 게시글 작성   |    ❌     |      ✅       |   ✅   |
| 공지 게시글 작성        |    ❌     |      ❌       |   ✅   |
| 본인 게시글 수정/삭제   |    ✅     |      ✅       |   ✅   |
| 타인 게시글 삭제        |    ❌     |      ❌       |   ✅   |
| 댓글 작성               |    ✅     |      ✅       |   ✅   |
| 게시글 신고             |    ✅     |      ✅       |   ✅   |
| 대회일정 등록/수정/삭제 |    ❌     |      ❌       |   ✅   |
| 도장 등록 신청          |    ❌     |      ✅       |   ✅   |
| 관리자 페이지 접근      |    ❌     |      ❌       |   ✅   |
| 유저 정지 관리          |    ❌     |      ❌       |   ✅   |
| 도장 승인               |    ❌     |      ❌       |   ✅   |

---

## 📸 화면 구성

> 배포 링크: [https://final-project-team3.vercel.app/](https://final-project-team3.vercel.app/)

|                                                            커뮤니티 목록                                                            |                                                             게시글 상세                                                             |
| :---------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------: |
| <img width="1188" height="943" alt="Image" src="https://github.com/user-attachments/assets/ecca52d1-7bed-44a4-8dcf-132115e0555e" /> | <img width="1199" height="946" alt="Image" src="https://github.com/user-attachments/assets/794b7882-be1e-4eac-b595-df91b490c9d8" /> |

|                                                              도장 찾기                                                              |                                                              대회 일정                                                              |
| :---------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------: |
| <img width="1194" height="946" alt="Image" src="https://github.com/user-attachments/assets/b98a038d-26f8-418f-832d-6c92f2534219" /> | <img width="1198" height="949" alt="Image" src="https://github.com/user-attachments/assets/1738d19d-6bbb-43d3-9c6e-1c98978e68cd" /> |

---

### 1. 커뮤니티 게시판

- 게시글 CRUD (일반 / 도장 홍보 / 공지 카테고리)
- 작성 미리보기, 이미지 업로드 (Supabase Storage)
- 댓글 작성 / 수정 / 삭제, 게시글 좋아요
- **게시글 공유** (모바일: Web Share API / 데스크탑: Clipboard URL 복사)
- **게시글 신고** (신고 사유 선택 및 접수, 중복 신고 방지)
- 키워드 기반 실시간 검색 및 카테고리 필터링
- 무한 스크롤 (TanStack Query `useInfiniteQuery` 기반 실제 페이지네이션)
- Soft Delete 처리 (게시글 / 댓글)
- URL 쿼리 파라미터 기반 탭 상태 유지 (새로고침 시에도 탭 유지)

### 2. 도장 찾기

- 네이버 지도 API 연동 지도 렌더링
- 현재 위치 기반 반경 5km 내 주짓수 도장 자동 검색
- 카카오 로컬 API를 활용한 키워드 검색

### 3. 대회 일정

- 대회 목록 조회 및 상세 정보 확인
- 모집 상태 표시 (모집중 / 마감임박 / 모집완료)
- 대회 신청 링크 연동
- Soft Delete 처리
- URL 쿼리 파라미터 기반 탭 상태 유지
- 무한 스크롤 (TanStack Query `useInfiniteQuery` 기반 실제 페이지네이션)

### 4. 사용자 인증 및 권한 관리

- Supabase Auth 기반 이메일 회원가입 / 로그인
- **RBAC 권한 관리**: 일반 유저 / 매니저(도장) / 어드민 역할 구분
- 비밀번호 찾기 / 재설정
- 마이페이지: 프로필 관리, 벨트 등급 정보, 작성 글 조회

### 5. 관리자 시스템

- 유저 활동 모니터링 및 정지 관리
- 도장 등록 승인 시스템
- 대회 일정 등록 / 수정 / 삭제

---

## ⚡ 기술적 도전 및 트러블슈팅

### 1. Next.js 16 캐싱 전략 설계

**문제**: 매 요청마다 Supabase DB를 조회해 불필요한 부하 발생

**해결**: Next.js 16의 `use cache` 디렉티브와 `revalidateTag`를 활용한 캐싱 전략 수립
- 공개 데이터(커뮤니티 목록, 대회일정, 도장찾기) → `use cache` + `cacheTag` 적용
- 인증 필요 데이터 → 캐싱 없이 `Suspense` 스트리밍으로 처리
- 글 작성 / 수정 / 삭제 시 Route Handler에서 `revalidateTag`로 캐시 즉시 무효화

```typescript
async function getPosts(): Promise<Post[]> {
  'use cache';
  cacheTag('posts-list');
  cacheLife('minutes');
  // ...
}

// Route Handler에서 캐시 무효화
revalidateTag('posts-list');
```

### 2. `use cache` 내부 `cookies()` 접근 불가 문제

**문제**: `use cache` 스코프 안에서 `cookies()`를 호출하는 `createSupabaseServerClient` 사용 불가

**해결**: Supabase 클라이언트를 목적에 따라 3가지로 분리

| 파일 | 용도 |
|------|------|
| `supabase/client.ts` | 브라우저용 (클라이언트 컴포넌트) |
| `supabase/server.ts` | 서버용 (인증 필요, cookies 사용) |
| `supabase/public.ts` | 공개 데이터용 (캐싱 가능, cookies 불필요) |

### 3. 조회수 트리거 이슈 + Hydration 오류

**문제**:
- 조회수 증가 RPC 호출 시 `'You cannot change view count'` 에러 발생
- 이후 캐싱된 `view_count`와 실제 DB 값 불일치로 Hydration 에러 발생

**원인**: DB 트리거 `prevent_non_admin_post_system_update`에서 어드민이 아닌 경우 `view_count` 변경 차단. 트리거를 수정해 RPC로 조회수를 올릴 수 있게 됐지만, `'use cache'`로 캐싱된 값과 실시간 DB 값이 달라 Hydration 불일치 발생

**해결**:
- 트리거 함수에서 `view_count` 변경 차단 로직 제거 후 RPC 함수에 `SECURITY DEFINER` 적용
- 실시간 반영이 필요한 조회수는 캐싱 대상에서 제외, 목록 페이지에서 조회수 표시 제거

### 4. 수정 후 이전 데이터 잔류 (라우터 캐시 문제)

**문제**: 게시글/대회일정 수정 완료 후 상세 페이지로 이동하면 수정 전 데이터가 표시됨. 새로고침해야 최신 데이터 반영

**원인**:
- `revalidateTag`는 서버 캐시만 무효화하고, 브라우저 메모리의 라우터 캐시(Router Cache)는 별도로 동작
- `cacheLife` 없이 `'use cache'`만 쓰면 `revalidateTag`와 연동 안 됨
- `router.refresh()`를 `router.push()` 전에 호출해도 이동 대상 페이지엔 효과 없음

**해결**:

서버 전용 서비스 분리 및 `cacheLife` 추가

```typescript
// communityService.server.ts
import 'server-only';

export async function getPost(id: string): Promise<Post | null> {
  'use cache';
  cacheTag(`post-${id}`);
  cacheLife('minutes'); // revalidateTag 연동에 필수
}
```

수정 API에서 핀포인트 캐시 무효화

```typescript
revalidateTag('posts-list');
revalidateTag(`post-${id}`);
```

`next.config.ts`에 `staleTimes` 추가로 라우터 캐시 비활성화

```typescript
const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 0, // 동적 페이지 라우터 캐시 비활성화
      static: 30,
    },
  },
};
```

`router.refresh()` + `router.push()` 조합으로 PPR 정적 HTML 우회

```typescript
router.refresh();
router.push(buildPostUrl(title, id));
```

### 5. 댓글 어뷰징 방지 및 Race Condition

**문제**: 클라이언트에서 Supabase를 직접 호출하는 구조여서 쿨타임·중복·연속 차단이 브라우저 Console에서 fetch를 직접 날리면 전혀 동작하지 않음. `Promise.all`로 동시 요청 시 쿨타임 체크가 거의 동시에 실행되어 모두 통과하는 Race Condition 문제도 발생

**해결**:

1단계 → `/api/comments` Route Handler로 이전해 서버에서 쿨타임·중복·연속 작성 검사 후 INSERT

2단계 → DB 트리거(`check_comment_cooltime`)로 INSERT 자체를 막아 Race Condition 완전 차단

3단계 → 텍스트 정규화로 공백·대소문자·유니코드 invisible 문자 우회 차단

```typescript
function normalize(text: string): string {
  return text
    .replace(/[\u200B\u200C\uFEFF\u00AD]/g, '') // invisible 문자 제거
    .replace(/\s/g, '')
    .toLowerCase();
}
```

### 6. 관리자 테이블 클라이언트 페이지네이션 → 서버 페이지네이션 전환

**문제**: 전체 데이터를 한 번에 가져온 후 클라이언트에서 `slice`로 페이지네이션 처리. 데이터 증가 시 성능 저하, 검색·필터 상태가 `useState`에만 있어 새로고침 시 초기화됨

**원인**: 서버 요청 단계에서 `page` / `search` / `filter`가 반영되지 않아 URL이 현재 테이블 상태를 표현하지 못함

**해결**: URL 쿼리 파라미터로 상태 관리 + Supabase `.range()`로 서버 페이지네이션 전환

```typescript
const page = Number(searchParams.page ?? 1);
const status = searchParams.status ?? 'all';
const search = searchParams.search?.trim() ?? '';

const from = (page - 1) * PAGE_SIZE;
const to = from + PAGE_SIZE - 1;

let query = supabase.from('profiles').select('*');
if (status !== 'all') query = query.eq('role', status);
if (search) query = query.ilike('nickname', `%${search}%`);

const { data } = await query.range(from, to);
```

불필요한 전체 데이터 조회 제거, 새로고침 후에도 테이블 상태 유지, URL 공유 가능

### 7. 회원가입 페이지 재진입 시 이전 입력값 잔류

**문제**: 회원가입 페이지에 재진입하면 이전에 입력했던 값이 그대로 남아있음

**원인**: Next.js 클라이언트 내비게이션 특성상 컴포넌트가 언마운트되지 않고 상태가 메모리에 유지됨

**해결**: `react-hook-form`의 `reset()`을 `useEffect`에서 호출해 마운트 시 초기화

```typescript
useEffect(() => {
  reset();
  setServerError('');
  // eslint-disable-next-line react-hooks/set-state-in-effect
}, [reset]);
```

### 8. 도장 회원가입 파일 업로드 순서 문제

**문제**: 도장 회원가입 시 사업자등록증 파일 업로드 후 회원가입 API를 호출했을 때 `businessFileUrl`이 `undefined`인 상태로 `profiles` 테이블에 저장됨

**원인**: 파일 URL을 받아오기 전에 회원가입 API가 먼저 호출되는 비동기 순서 오류

```typescript
// 문제 코드 — URL 없이 API 먼저 호출됨
await registerDojang({ businessFileUrl }); // undefined 상태로 전달
businessFileUrl = await uploadBusinessFile(businessFile); // 나중에 실행
```

**해결**: 파일 업로드를 먼저 완료한 후 URL을 받아 API 호출하도록 순서 수정. `File` 객체는 브라우저 전용 타입이라 Zod 스키마 검증이 어려워 `onSubmit` 내부에서 직접 체크

```typescript
const onSubmit = async (data: DojangFormType) => {
  if (!businessFile) {
    setServerError('사업자등록증을 첨부해주세요.');
    return;
  }
  // 1. 파일 먼저 업로드 → URL 수령
  const businessFileUrl = await uploadBusinessFile(businessFile);
  // 2. URL 확보 후 회원가입 API 호출
  await registerDojang({ ...data, businessFileUrl });
};
```
---

## 🏗 아키텍처

```
클라이언트 컴포넌트
  → fetch('/api/posts')            → Route Handler → Supabase DB
  → fetch('/api/comments')                        → revalidateTag

서버 컴포넌트 (공개 데이터)
  → communityService.server.ts     → 'use cache' + cacheTag → Supabase DB
  → competitionService.server.ts   → revalidateTag로 핀포인트 무효화

서버 컴포넌트 (인증 필요)
  → createSupabaseServerClient (cookies)
  → Suspense 스트리밍

Server Action
  → revalidateCompetitions() / revalidateCompetition(id)
  → 클라이언트 캐시(TanStack Query) + 서버 캐시(revalidateTag) 이중 무효화
```

---

## 👨‍👩‍👧‍👦 팀원 소개

| 이름   | 역할                                                                                      | GitHub                                             |
| ------ | ----------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 사민재 | 환경설정, DB 구성, 커뮤니티, 대회일정, 도장찾기, 사이드바, 헤더, 캐싱 최적화, 접근성 개선 | [@smj123432-lab](https://github.com/smj123432-lab) |
| 문유정 | 피그마 목업 제작, 발표, 게시글, 공유, 댓글                                                | [@myj9713-dev](https://github.com/myj9713-dev)     |
| 이정론 | 관리자 페이지 (유저 관리, 도장 승인, 대회 일정)                                           | [@holymolyRon](https://github.com/holymolyRon)     |
| 이찬미 | 로그인, 아이디/비밀번호 찾기, 마이페이지                                                  | [@lcmbook55](https://github.com/lcmbook55)         |

---

## 🚀 로컬 실행 방법

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

### 환경변수 설정 (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_KAKAO_LOCAL_API_KEY=
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=
RESEND_API_KEY=
ADMIN_REPORT_EMAIL=
REPORT_EMAIL_FROM=
```

---

## 📂 폴더 구조

```
src/
├── app/                  # Next.js App Router (라우트 정의)
│   ├── (admin)/          # 관리자 페이지
│   ├── (auth)/           # 인증 페이지 (로그인, 회원가입, 비밀번호 찾기)
│   ├── (main)/           # 메인 페이지 (커뮤니티, 대회일정, 도장찾기, 마이페이지)
│   └── api/              # Route Handler (posts, comments, auth 등)
│
├── components/           # UI 컴포넌트
│   ├── admin/            # 관리자 전용 컴포넌트
│   ├── common/           # 공통 컴포넌트 (Modal, Spinner, SearchInput 등)
│   ├── community/        # 게시글 관련 컴포넌트
│   ├── competition/      # 대회일정 관련 컴포넌트
│   ├── dojang/           # 도장찾기 관련 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트 (Sidebar, Header 등)
│   └── ui/               # shadcn/ui 기본 컴포넌트
│
├── hooks/                # 커스텀 훅 (useAuth, useLike, useInfiniteScroll 등)
├── services/             # Supabase 데이터 접근 레이어
│   ├── communityService.server.ts   # 서버 전용 (use cache 적용)
│   └── communityService.ts          # 클라이언트용
├── lib/
│   └── supabase/         # Supabase 클라이언트 (client / server / public 분리)
├── actions/              # Server Actions (admin 작업, 캐시 무효화)
├── store/                # Zustand 전역 상태
├── types/                # TypeScript 타입 정의
└── utils/                # 유틸 함수 (formatDate, share, timeAgo 등)
```
