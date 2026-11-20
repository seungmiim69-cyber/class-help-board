-- 수업 도움 요청 보드 schema: Supabase SQL Editor에서 한 번 실행
create table if not exists help_requests (
  id uuid primary key default gen_random_uuid(),
  student_info text not null check (char_length(student_info) between 1 and 20),
  category     text not null check (category in (
    '기기/와이파이 오류',
    '계정 로그인(@g.cnees.kr 등)',
    '사이트/도구 사용법',
    '기타 질문'
  )),
  message      text not null check (char_length(message) between 1 and 100),
  is_resolved  boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists help_requests_status_idx
  on help_requests (is_resolved, created_at);

alter table help_requests enable row level security;

drop policy if exists "anyone can read" on help_requests;
create policy "anyone can read" on help_requests for select using (true);

-- 새 요청은 항상 '미해결' 상태로만 등록 가능
drop policy if exists "anyone can insert" on help_requests;
create policy "anyone can insert" on help_requests
  for insert with check (is_resolved = false);

-- '해결 완료' 처리만 허용 (다시 미해결로 되돌리기 불가)
drop policy if exists "anyone can resolve" on help_requests;
create policy "anyone can resolve" on help_requests
  for update using (true) with check (is_resolved = true);

-- 최근 Supabase 프로젝트는 새 테이블에 anon 권한을 자동 부여하지 않음 → 명시적으로 부여
-- update는 is_resolved 컬럼만 가능 (내용·이름 수정 불가), 삭제 불가
grant select, insert on public.help_requests to anon, authenticated;
grant update (is_resolved) on public.help_requests to anon, authenticated;
