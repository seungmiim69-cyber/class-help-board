import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type HelpRequest = {
  id: string;
  student_info: string;
  category: string;
  message: string;
  is_resolved: boolean;
  created_at: string;
};

let client: SupabaseClient | null = null;

// 새 대시보드는 publishable key, 기존 프로젝트는 anon key — 둘 중 하나만 있으면 됨
function getPublicKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && getPublicKey());
}

export function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = getPublicKey();
  if (!url || !key) {
    throw new Error(
      "Supabase 환경변수가 없습니다. .env.local에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY(또는 _ANON_KEY)를 입력하세요.",
    );
  }
  client ??= createClient(url, key, { auth: { persistSession: false } });
  return client;
}
