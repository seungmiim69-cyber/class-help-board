@AGENTS.md

# TIL Board — 프로젝트 규칙

하루에 하나, 배운 것을 한 줄로 남기는 웹앱. 상세 기획은 `IDEA.md`, 진행 절차는 `업무지침서.md` 참고.

## 스택
- Next.js 16 (App Router, `cacheComponents: true`) + TypeScript + Tailwind CSS v4
- Supabase (`@supabase/supabase-js`, anon key + RLS), 테이블 `til_posts` (`supabase/schema.sql`)
- Vercel 배포 (GitHub `main` push → 자동 배포)

## 구조
- `app/page.tsx` — 단일 화면 (폼 + `<Suspense>`로 감싼 목록)
- `app/actions.ts` — Server Action `createPost` (검증 → 도배 판단 → insert → `revalidatePath`)
- `lib/validate.ts` — 입력 검증 (닉네임 ≤20자, 내용 ≤140자, trim 후 빈 값 거부)
- `lib/supabase.ts` — Supabase 클라이언트
- `components/PostForm.tsx`(client), `components/PostList.tsx`(server)

## 규칙
- 요청 시점 데이터는 `await connection()` 후 조회하고 `<Suspense>` 안에서 렌더 (cacheComponents 요구사항)
- 비밀키는 `.env.local`과 Vercel 환경변수에만 둔다. 커밋 금지
- 사용자에게 보이는 문구는 한국어
- MVP 범위 밖(로그인·좋아요·태그·검색·삭제)은 요청 전까지 추가하지 않는다

## 완료 기준
- `npm run lint`, `npm run build` 통과
- 글 작성 → 목록 최신순 반영, 검증 메시지(빈 값/길이 초과/10분 내 동일 내용) 동작
- 모바일 폭(375px)에서 레이아웃 정상
