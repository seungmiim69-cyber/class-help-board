# 아이디어: "오늘 배운 한 줄" (TIL Board)

> 하루에 하나, 배운 것을 한 줄로 남기고 모두의 기록을 보는 초간단 웹앱

## 1. 한 줄 요약
이름과 한 줄 메모를 입력하면 Supabase에 저장되고, 최신순 목록으로 바로 보이는 웹앱. Vercel에 배포해 URL로 공유한다.

## 2. 왜 이 아이디어인가
- 화면 1개, 테이블 1개 → 첫 "만들기 → 저장 → 배포" 연습에 가장 작은 단위
- 입력 → 처리 → 판단 → 출력이 명확 (자동화 업무 정리 연습에 적합)
- 이후 확장(로그인, 좋아요, 태그)이 쉬움

## 3. 입력 → 처리 → 판단 → 출력
| 단계 | 내용 |
|---|---|
| 입력 | 닉네임(최대 20자), 내용(최대 140자) |
| 처리 | 공백 제거·길이 검증 후 Supabase `til_posts`에 insert |
| 판단 | 빈 값/길이 초과/연속 도배(같은 내용) 거부 |
| 출력 | 최신순 목록, 작성 시간, 성공/실패 메시지 |

## 4. MVP 기능 (v1)
1. 글 작성 폼
2. 최신순 목록 (최대 50개)
3. 삭제 없음 (익명 서비스 단순화)
4. 모바일 대응 반응형

## 5. 제외 (v2 이후)
로그인, 좋아요, 태그, 검색, 관리자 삭제

## 6. 기술 스택
- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres + RLS, `@supabase/supabase-js`)
- Vercel (GitHub 연동 자동 배포)

## 7. 데이터 모델
```sql
create table til_posts (
  id uuid primary key default gen_random_uuid(),
  nickname text not null check (char_length(nickname) between 1 and 20),
  content  text not null check (char_length(content)  between 1 and 140),
  created_at timestamptz not null default now()
);
alter table til_posts enable row level security;
create policy "anyone can read"   on til_posts for select using (true);
create policy "anyone can insert" on til_posts for insert with check (true);
```

## 8. 진행 로드맵 (그림의 흐름 대응)
1. 업무 칼같이 정리 → 이 문서
2. VS Code + Claude Code 설치
3. CLAUDE.md로 프로젝트 설계
4. Plan 모드로 기획안 승인
5. 코드 생성 + 에러 자기 수정 루프
6. 결과 확인 + 추가 지시로 개선
7. (선택) MCP(Supabase/Vercel) + Skills 설치
8. **배포 → 자동화** (GitHub push 시 Vercel 자동 배포)
