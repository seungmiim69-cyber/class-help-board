@AGENTS.md

# 디지털 수업 실시간 도움 요청 보드 — 프로젝트 규칙

중학교 디지털 활용 수업에서 학생이 막힌 점(기기 오류·로그인·사용법)을 올리면 교사/튜터가 현황을 보고 해결 처리하는 웹앱. (TIL Board에서 개조)

## 스택
- Next.js 16 (App Router, `cacheComponents: true`) + TypeScript + Tailwind CSS v4
- Supabase (`@supabase/supabase-js`, anon key + RLS), 테이블 `help_requests` (`supabase/schema.sql`)
- Vercel 배포 (GitHub `main` push → 자동 배포)

## 구조
- `app/page.tsx` — 단일 화면 (요청 폼 + `<Suspense>`로 감싼 현황 보드 + 10초 자동 갱신)
- `app/actions.ts` — Server Actions `createHelpRequest`(검증 → 10분 내 중복 미해결 요청 거부 → insert), `resolveHelpRequest`(is_resolved=true)
- `lib/validate.ts` — 입력 검증 (학번·이름 ≤20자, 내용 ≤100자, 유형 4종 중 하나, trim 후 빈 값 거부)
- `lib/supabase.ts` — Supabase 클라이언트, `HelpRequest` 타입
- `components/HelpForm.tsx`(client), `components/HelpBoard.tsx`(server), `components/RequestCard.tsx`(client, 낙관적 해결 처리), `components/AutoRefresh.tsx`(client)

## 규칙
- 요청 시점 데이터는 `await connection()` 후 조회하고 `<Suspense>` 안에서 렌더 (cacheComponents 요구사항)
- 비밀키는 `.env.local`과 Vercel 환경변수에만 둔다. 커밋 금지
- 사용자에게 보이는 문구는 한국어, 밝은 톤 UI (교탁 큰 화면·태블릿 가독성)
- 범위 밖(로그인·삭제·검색 등)은 요청 전까지 추가하지 않는다

## 완료 기준
- `npm run lint`, `npm run build` 통과
- 요청 등록 → 미해결이 위, 해결 완료가 아래로 정렬되어 반영 / "대기 중 N건 / 해결 완료 M건" 표시
- "해결 완료" 버튼 → 즉시 상태 변경 / 검증 메시지(빈 값·길이 초과·유형 미선택·10분 내 동일 요청) 동작
- 모바일 폭(375px)에서 레이아웃 정상
