# 오늘 배운 한 줄 (TIL Board)

닉네임과 한 줄 메모를 남기면 Supabase에 저장되고 최신순(최대 50개)으로 보여 주는 웹앱입니다.

## 로컬 실행
1. Supabase 프로젝트 생성(리전: Seoul 권장) → SQL Editor에서 `supabase/schema.sql` 실행
2. Project Settings → API에서 URL·publishable key 복사
3. `.env.example`을 `.env.local`로 복사해 값 입력
4. 실행
   ```bash
   npm install
   npm run dev   # http://localhost:3000
   ```

## 배포 (Vercel)
1. GitHub 저장소에 push
2. Vercel → New Project → 저장소 Import
3. Environment Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (또는 기존 `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy. 이후 `main` push 시 자동 배포

## 스크립트
- `npm run dev` / `npm run build` / `npm run start` / `npm run lint`
