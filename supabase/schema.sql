-- TIL Board schema: run once in Supabase SQL Editor
create table if not exists til_posts (
  id uuid primary key default gen_random_uuid(),
  nickname text not null check (char_length(nickname) between 1 and 20),
  content  text not null check (char_length(content)  between 1 and 140),
  created_at timestamptz not null default now()
);

create index if not exists til_posts_created_at_idx on til_posts (created_at desc);

alter table til_posts enable row level security;

drop policy if exists "anyone can read" on til_posts;
create policy "anyone can read"   on til_posts for select using (true);

drop policy if exists "anyone can insert" on til_posts;
create policy "anyone can insert" on til_posts for insert with check (true);

-- 최근 Supabase 프로젝트는 새 테이블에 anon 권한을 자동 부여하지 않음 → 명시적으로 부여
-- (RLS 정책이 실제 허용 범위를 제한: 읽기·쓰기만, 수정·삭제 불가)
grant select, insert on public.til_posts to anon, authenticated;
