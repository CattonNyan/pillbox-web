# PillBox Web 전환 기획서

## 실행 범위

1. `/Users/gengmi/Desktop/MJU/pillbox-web/` 폴더 생성
2. `pillbox-web/PLANNING.md` 에 아래 기획서 전체 내용 저장

---

## Context

기존 PillBox Flutter 모바일 앱을 Next.js 15 기반 웹 애플리케이션으로 재구현.
백엔드(AWS Lambda FastAPI), 데이터베이스(MongoDB, Hasura/PostgreSQL), ML 추론 서버는 **기존 API를 그대로 재사용**.
프론트엔드만 Flutter → Next.js 15 + React 19로 교체.

---

## 기술 스택

| 분류 | 기술 | 선정 이유 |
|------|------|-----------|
| 프레임워크 | Next.js 15 (App Router) | 서버 컴포넌트, RSC 스트리밍, 최신 표준 |
| UI 라이브러리 | React 19 | 서버 액션, use() hook, form action |
| 언어 | TypeScript | 타입 안전성 |
| 스타일링 | Tailwind CSS v4 | 유틸리티 우선, 빠른 개발 |
| UI 컴포넌트 | shadcn/ui | Radix UI 기반 접근성 보장 |
| 상태관리 | Zustand | 경량, DevTools 지원 |
| 서버 상태 | TanStack Query v5 | 캐싱, 낙관적 업데이트, 자동 재조회 |
| 폼 | React Hook Form + Zod | 유효성 검사, 타입 안전 |
| 인증 | NextAuth.js v5 (Auth.js) | Cognito OAuth 지원, App Router 통합 |
| GraphQL 클라이언트 | urql v4 | 경량, SSR 지원, Next.js 친화적 |
| GraphQL 코드젠 | GraphQL Code Generator | 타입 안전 쿼리 자동 생성 |
| 날짜 처리 | date-fns v3 | 경량, 트리 쉐이킹 |
| 달력 | react-big-calendar | 복약 달력 뷰 |
| 이미지 업로드 | react-dropzone | 알약 이미지 업로드 |
| HTTP 클라이언트 | ky (fetch 래퍼) | 타입 안전, 인터셉터 |

---

## 프로젝트 구조

```
pillbox-web/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   └── login/                # 로그인 페이지
│   ├── (app)/                    # 인증 필요 레이아웃
│   │   ├── layout.tsx            # 공통 레이아웃 (헤더, 네비게이션)
│   │   ├── onboarding/
│   │   │   ├── profile/          # 신규 사용자 프로필 설정
│   │   │   └── preset-times/     # 복용 시간 초기 설정
│   │   ├── dashboard/            # 오늘의 복약 현황 (메인)
│   │   ├── pills/
│   │   │   ├── search/           # 의약품 검색
│   │   │   └── [itemSeq]/        # 의약품 상세 정보
│   │   ├── schedules/
│   │   │   └── new/              # 복약 일정 추가
│   │   └── calendar/             # 복약 달력
│   ├── api/
│   │   └── auth/[...nextauth]/   # NextAuth.js 핸들러
│   └── layout.tsx                # 루트 레이아웃
├── components/
│   ├── ui/                       # shadcn/ui 컴포넌트 (자동 생성)
│   ├── features/
│   │   ├── dashboard/            # DashboardCard, ScheduleItem, ProgressBar
│   │   ├── pills/                # PillCard, PillSearchBar, DrugInteractionAlert
│   │   ├── calendar/             # CalendarView, DayMarker
│   │   └── schedules/            # ScheduleForm, PillSelector, PresetTimePicker
│   └── layout/                   # Header, Sidebar, BottomNav (모바일)
├── lib/
│   ├── api/                      # REST API 클라이언트 (ky 래퍼)
│   │   ├── client.ts             # 인증 헤더 자동 주입
│   │   ├── users.ts              # 사용자 API
│   │   ├── pill-histories.ts     # 복약 이력 API
│   │   └── validation.ts         # 병용금기 검사 API
│   ├── graphql/
│   │   ├── client.ts             # urql 클라이언트 설정
│   │   └── queries/              # .graphql 파일 (기존 Flutter 쿼리 재사용)
│   └── generated/                # GraphQL 코드젠 출력
├── store/
│   ├── user-store.ts             # 사용자 프로필 (Zustand)
│   ├── schedule-store.ts         # 오늘의 복약 목록
│   └── pill-add-store.ts         # 약 추가 플로우 임시 상태
├── types/
│   └── index.ts                  # 공통 타입 (User, PillInfo, ScheduleData 등)
├── hooks/
│   ├── use-pill-histories.ts     # TanStack Query 훅
│   ├── use-validation.ts         # 병용금기 검사 훅
│   └── use-pill-search.ts        # GraphQL 검색 훅
└── auth.ts                       # NextAuth.js 설정 (Cognito provider)
```

---

## 페이지별 구현 명세

### 1. 로그인 (`/login`)
- Google OAuth → Cognito (NextAuth.js)
- 기존 API 토큰 헤더 방식과 동일하게 ID Token → Bearer 헤더 주입
- 세션에 `idToken` 저장, API 요청마다 자동 주입

### 2. 온보딩 - 프로필 설정 (`/onboarding/profile`)
- React Hook Form + Zod 유효성 검사
- 이름, 생년월일, 성별, 혈압, 당뇨, 임신 여부
- POST `/pillbox/users` 호출

### 3. 온보딩 - 시간 설정 (`/onboarding/preset-times`)
- 아침/점심/저녁/자기전 4개 시간 입력
- POST `/pillbox/users/preset_times` 호출

### 4. 대시보드 (`/dashboard`)
- **RSC**: 서버 컴포넌트로 초기 데이터 페치 (TanStack Query prefetch)
- 오늘 복약 목록 카드 UI
- 완료율 Progress Bar (shadcn/ui Progress)
- 복용 완료 체크 버튼 → 낙관적 업데이트 (TanStack Query)
- 반응형: 모바일 카드 리스트 / 데스크탑 2열 그리드

### 5. 의약품 검색 (`/pills/search`)
- 텍스트 검색: GraphQL `search_by_keyword` 쿼리 (urql)
- 이미지 검색: react-dropzone으로 이미지 업로드 → ML 추론 서버 호출 → 결과 목록 표시
- 검색 결과 → PillCard 클릭 → 상세 페이지

### 6. 의약품 상세 (`/pills/[itemSeq]`)
- GraphQL `pill_infomation` 쿼리로 기본 정보
- REST `getDetailHtml()` 응답을 `dangerouslySetInnerHTML`로 렌더링 (XSS 방지: DOMPurify 적용)
- 병용금기 알림 카드 (DrugInteractionAlert)
- "복약 일정에 추가" 버튼

### 7. 복약 일정 추가 (`/schedules/new`)
- 다단계 폼 (Step 1: 약 선택 → Step 2: 일정 설정)
- Zustand `pill-add-store`로 선택된 약 목록 관리
- POST `/pillbox/users/pill_histories` 호출
- 등록 전 POST `/pillbox/users/validation` 병용금기 사전 검사

### 8. 복약 달력 (`/calendar`)
- GET `/pillbox/users/pill_histories?ended_histories=true`
- react-big-calendar로 월별 뷰
- 날짜별 완료/미완료 마커 (녹색/빨간색)
- 날짜 클릭 시 해당 날짜 복약 목록 표시

---

## 재사용 가능한 기존 자산

| 기존 자산 | 위치 | 웹 전환 방법 |
|-----------|------|-------------|
| GraphQL 쿼리 4개 | `flutter_frontend/lib/graphql/*.graphql` | 그대로 복사 후 코드젠 |
| REST API 엔드포인트 | `Serverless/src/mangum/pillbox_mangum.py` | API 주소 재사용 |
| 데이터 모델 구조 | `flutter_frontend/lib/model/` | TypeScript 타입으로 변환 |
| Hasura GraphQL 스키마 | `codegen.yml` 엔드포인트 | 동일 엔드포인트 사용 |

---

## 추가 유틸리티 및 개발 도구

```bash
# 코드 품질
eslint + eslint-config-next
prettier
husky + lint-staged          # 커밋 전 자동 lint/format

# 타입 안전성
graphql-codegen              # GraphQL → TypeScript 타입 자동 생성
zod                          # 런타임 유효성 검사 + 타입 추론

# 테스트
vitest                       # 단위 테스트
@testing-library/react       # 컴포넌트 테스트
playwright                   # E2E 테스트

# 보안
DOMPurify                    # HTML 렌더링 XSS 방지 (약 상세 페이지)

# 개발 편의
next-safe-action             # 타입 안전 서버 액션
@tanstack/react-query-devtools  # 상태 디버깅
```

---

## 환경 변수 (`.env.local`)

```
# NextAuth.js
AUTH_SECRET=
AUTH_COGNITO_ID=
AUTH_COGNITO_SECRET=
AUTH_COGNITO_ISSUER=https://cognito-idp.ap-northeast-2.amazonaws.com/{USER_POOL_ID}

# API
NEXT_PUBLIC_API_BASE_URL=https://g1rj1dd4j1.execute-api.ap-northeast-2.amazonaws.com/dev
NEXT_PUBLIC_GRAPHQL_URL=http://64.110.79.49:8080/v1/graphql
NEXT_PUBLIC_ML_INFERENCE_URL=http://64.110.79.49:8081/inference
```

---

## 구현 우선순위

1. 인증 (NextAuth.js + Cognito) + API 클라이언트 기반 셋업
2. 온보딩 플로우 (프로필 + 시간 설정)
3. 대시보드 (핵심 기능)
4. 복약 일정 추가 + 병용금기 검사
5. 의약품 검색 (텍스트)
6. 의약품 상세 + HTML 렌더링
7. 복약 달력
8. 이미지 기반 검색 (AI)

---

## 검증 방법

1. `npm run dev` → 각 페이지 라우팅 확인
2. NextAuth 세션에서 ID Token 추출 → API 호출 성공 여부
3. GraphQL 쿼리 결과 → 의약품 검색 결과 표시
4. 복약 체크 → MongoDB 업데이트 → 달력 반영 확인
5. `npm run test` → 단위/컴포넌트 테스트
6. `npm run lint` → 코드 품질 검사
