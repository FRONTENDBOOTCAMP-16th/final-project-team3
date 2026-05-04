# 🥋 블랙벨트(Black-Belt) (Final-Project)

주짓수 수련자와 도장, 코치를 연결하는 커뮤니티 플랫폼 블랙벨트(Black-Belt)

🔗 **배포 링크:** []

---

## 📌 프로젝트 소개

- **프로젝트명:** 주짓수인들을 위한 올인원 네트워크, 블랙벨트
- **팀명:** 블랙벨트(Black-Belt)
- **개발 기간:** 2026. 04. 16 ~ 2026. 05. 20
- **소개:**  
  블랙벨트(Black-Belt) 플랫폼은 주짓수 수련자, 도장, 코치를 하나의 공간에서 연결하는 커뮤니티 서비스입니다.
  사용자는 기술 공유, 매칭 요청, 수련 경험을 기록할 수 있으며, 도장과 코치는 공지 및 홍보를 통해 수련자들과 직접 소통할 수 있는 커뮤니티 플랫폼입니다.

---

## 🛠 기술 스택

구분 기술

| Frontend   | React, next.JS, typescript    |
| ---------- | ----------------------------- |
| 상태 관리  | zustant, zod, tanstack, toast |
| 스타일링   | Tailwind css                  |
| API / 통신 | 네이버지도 api                |
| 배포       | vercel                        |
| Backend    | supabase                      |

**Tools**

- Git / GitHub
- Notion
- VS Code

---

## 🎯 주요 기능

### 1. 주짓수 커뮤니티 통합 게시판

- 게시글 CRUD: 일반/홍보/대회 일정 등 카테고리별 게시글 작성 및 관리
- 작성 미리보기: 게시글 등록 전 최종 레이아웃 및 내용 확인 기능
- 인터랙션: 실시간 댓글 시스템 및 게시글 좋아요(추천) 기능

### 2. 탐색 및 UI/UX

- 실시간 검색: 키워드 기반의 빠른 게시물 검색 및 리스트업
- 스마트 필터링: 전체, 도장 홍보, 일반 주제별 인덱싱 및 필터링 기능
- 무한 스크롤: 끊김 없는 콘텐츠 탐색을 위한 목록 무한 스크롤 구현

### 3. 사용자 인증 및 개인 서비스

- 보안 인증: JWT를 활용한 상태 검증 및 안전한 로그인/회원가입 시스템
- 권한 제어(RBAC): 일반 유저와 매니저(관리자) 권한 구분을 통한 접근 제어
- 마이페이지: 벨트 등급 정보를 포함한 프로필 관리 및 활동 내역(작성 글) 조회

### 4. 도장 위치 기반 서비스 및 관리자 시스템

- 지도 API: 카카오/구글 맵 연동을 통한 도장 위치 확인 및 페이지 이동
- 어드민 패널: 유저 활동 모니터링, 정지 관리 및 도장 등록 승인 시스템
- 대회 관리: 관리자 전용 폼을 이용한 대회 일정 업로드 및 목록 관리

---

## 👨‍👩‍👧‍👦 팀원 소개

| 이름   | 역할                                                                  | GitHub                             |
| ------ | --------------------------------------------------------------------- | ---------------------------------- |
| 사민재 | 환경설정, db 구성, 기획, 커뮤니티, 대회일정, 도장찾기, 사이드바, 헤더 | [https://github.com/smj123432-lab] |
| 문유정 | 피그마 목업 제작, 발표, 기획, 게시글, 공유, 댓글                      | [https://github.com/myj9713-dev]   |
| 이정론 | 기획, 관리자 페이지(유저, 도장, 일정)                                 | [https://github.com/holymolyRon]   |
| 이찬미 | 기획, 로그인, 아이디, 비밀번호 찾기, 마이페이지                       | [https://github.com/ruiwaa]        |

---

## 📂 폴더 구조

```
final-project-team3/
├── .vscode/
│ └── settings.json
├── public/
│ ├── file.svg
│ ├── globe.svg
│ ├── next.svg
│ ├── vercel.svg
│ └── window.svg
├── src/
│ ├── app/
│ │ ├── (auth)/
│ │ │ ├── find-id/
│ │ │ │ └── page.tsx
│ │ │ ├── find-password/
│ │ │ │ └── page.tsx
│ │ │ ├── login/
│ │ │ │ └── page.tsx
│ │ │ └── register/
│ │ │ └── page.tsx
│ │ ├── (main)/
│ │ │ ├── admin/
│ │ │ │ └── page.tsx
│ │ │ ├── community/
│ │ │ │ ├── [id]/
│ │ │ │ │ ├── edit/
│ │ │ │ │ │ └── page.tsx
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── write/
│ │ │ │ │ └── page.tsx
│ │ │ │ └── page.tsx
│ │ │ ├── competitions/
│ │ │ │ └── page.tsx
│ │ │ ├── dojangs/
│ │ │ │ └── page.tsx
│ │ │ ├── mypage/
│ │ │ │ └── page.tsx
│ │ │ └── service-info/
│ │ │ └── page.tsx
│ │ ├── favicon.ico
│ │ ├── globals.css
│ │ ├── layout.tsx
│ │ └── page.tsx
│ ├── components/
│ │ ├── auth/
│ │ ├── common/
│ │ ├── community/
│ │ ├── competition/
│ │ ├── dojang/
│ │ └── ui/
│ │ ├── button.tsx
│ │ ├── dialog.tsx
│ │ ├── dropdown-menu.tsx
│ │ ├── input.tsx
│ │ ├── label.tsx
│ │ ├── sonner.tsx
│ │ └── textarea.tsx
│ ├── constants/
│ ├── hooks/
│ ├── lib/
│ │ └── utils.ts
│ ├── services/
│ ├── store/
│ ├── types/
│ └── utils/
├── .gitignore
├── .prettierrc
├── bun.lock
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```
