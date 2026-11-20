"use server";

import { revalidatePath } from "next/cache";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { validatePost } from "@/lib/validate";

export type PostFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000; // 10분

export async function createPost(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const result = validatePost(formData.get("nickname"), formData.get("content"));
  if (!result.ok) return { status: "error", message: result.error };

  if (!isSupabaseConfigured()) {
    return { status: "error", message: "서버에 Supabase 설정이 없습니다." };
  }

  const supabase = getSupabase();
  const { nickname, content } = result;

  // 도배 방지: 최근 10분 내 같은 닉네임 + 같은 내용이면 거부
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
  const { count, error: dupError } = await supabase
    .from("til_posts")
    .select("id", { count: "exact", head: true })
    .eq("nickname", nickname)
    .eq("content", content)
    .gte("created_at", since);

  if (dupError) {
    console.error(dupError);
    return { status: "error", message: "저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }
  if ((count ?? 0) > 0) {
    return { status: "error", message: "같은 내용을 방금 올렸어요. 다른 내용을 남겨 주세요." };
  }

  const { error } = await supabase.from("til_posts").insert({ nickname, content });
  if (error) {
    console.error(error);
    return { status: "error", message: "저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidatePath("/");
  return { status: "success", message: "저장됐어요!" };
}
