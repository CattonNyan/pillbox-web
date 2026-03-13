# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**PillBox** - 의약품 안전 복용 관리 모바일 앱. 주요 기능: 의약품 검색, 복용 스케줄 관리, 병용금기 및 DUR 검사, AI 기반 알약 이미지 인식.

데이터 출처: 식품의약품안전처 공공 API

---

## 컴포넌트별 실행 명령어

### Flutter 프론트엔드 (`flutter_frontend/`)
```bash
flutter pub get                            # 의존성 설치
flutter pub run build_runner build         # Dart 코드 생성 (Freezed 모델)
npm run codegen                            # GraphQL 타입 코드 생성 (Artemis)
flutter run                                # 개발 서버 실행
flutter test                               # 테스트 실행
flutter build apk                          # Android 빌드
flutter build ios                          # iOS 빌드
```

### Serverless 백엔드 (`Serverless/`)
```bash
npm install                                # Node 의존성 설치
# Python 가상환경 (Python 3.10 필요)
pip install -r src/mangum/requirements.txt
serverless deploy                          # AWS Lambda 배포
```

### ML 추론 서버 (`ML/inference_server/`)
```bash
pip install -r requirements.txt
uvicorn app:app --reload                   # FastAPI 개발 서버 (포트 8000)
```

### 크롤러 (`Crawler/`)
```bash
python3.9 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# .env 파일에 API 키 설정 후 각 모듈 실행
```

---

## 아키텍처

```
Flutter (Riverpod + GraphQL)
    ↓  AWS Cognito 인증 (ID Token)
AWS API Gateway → Lambda (FastAPI + Mangum)
    ├→ MongoDB       : 사용자 데이터 (복용 이력, 프리셋 시간, 프로필)
    └→ Hasura GraphQL → PostgreSQL : 의약품 참조 데이터 (불변)

Crawler (Python async) → Hasura 뮤테이션 → PostgreSQL
ML 추론 서버 (ResNet50, 5087개 클래스) → Lambda 연동 (현재 stub)
```

### 두 가지 데이터베이스 역할 분리
- **MongoDB**: 사용자별 가변 상태 - 복용 이력, 타임스탬프, 프리셋 시간
- **PostgreSQL (Hasura)**: 불변 의약품 참조 데이터 - 의약품 정보, 병용금기, DUR 정보

### 인증 흐름
AWS Cognito 발급 ID 토큰을 Lambda Authorizer가 검증. 사용자 식별자는 `requestContext.authorizer.claims.sub` (Cognito sub).

### DUR 검사 로직 (`Serverless/src/mangum/pillbox_mangum.py`)
`taboo_case` 비트마스크(0x001~0x400)로 연령대·임신부·노인 금기 분류. POST `/pillbox/users/validation` 요청 시 현재 복용 중인 약과 신규 약 간 병용금기 및 DUR 조건을 Hasura에 병렬 쿼리.

### Flutter 상태 관리
Riverpod (hooks_riverpod) + Freezed 불변 모델. GraphQL 쿼리는 Artemis 코드젠으로 타입 안전하게 처리.

---

## 환경 변수 설정

### Serverless 백엔드 (`.env` 또는 `.env.yml`)
```
MONGODB_HOST
MONGODB_USERNAME
MONGODB_PASSWORD
MONGODB_AUTHSOURCE   # 기본값: "admin"
HASURA_ENDPOINT_URL
COGNITO_AUTHORIZER_ARN
```

### Crawler (`.env`)
식품의약품안전처 공공 API 키 필요.

### Flutter
Amplify CLI로 `amplifyconfiguration.dart` 생성 필요 (AWS Cognito, Pinpoint 설정 포함).

---

## 주요 파일 위치

| 파일 | 설명 |
|------|------|
| `Serverless/src/mangum/pillbox_mangum.py` | 핵심 FastAPI 백엔드 (943줄) |
| `Serverless/serverless.yml` | Lambda 배포 설정 |
| `flutter_frontend/lib/main.dart` | Flutter 앱 진입점 (Amplify 초기화, 라우팅) |
| `flutter_frontend/lib/service/` | REST·GraphQL 클라이언트, 비즈니스 로직 |
| `flutter_frontend/lib/model/` | Freezed 데이터 모델 |
| `flutter_frontend/codegen.yml` | GraphQL 코드젠 설정 |
| `ML/inference_server/app.py` | ResNet50 기반 추론 FastAPI |
| `Crawler/async_request_manager.py` | 최대 16개 동시 요청 비동기 매니저 |
| `docs/src/PillBoxDBSchema.md` | 데이터베이스 스키마 문서 |
