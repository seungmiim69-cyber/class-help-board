"use server";

import { revalidatePath } from "next/cache";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { validateHelpRequest } from "@/lib/validate";

export type HelpFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000; // 10분
const SAVE_ERROR = "요청을 보내지 못했어요. 잠시 후 다시 시도해 주세요.";

export async function createHelpRequest(
  _prev: HelpFormState,
  formData: FormData,
): Promise<HelpFormState> {
  const result = validateHelpRequest(
    formData.get("student_info"),
    formData.get("category"),
    formData.get("message"),
  );
  if (!result.ok) return { status: "error", message: result.error };

  if (!isSupabaseConfigured()) {
    return { status: "error", message: "서버에 Supabase 설정이 없습니다. 선생님께 알려 주세요." };
  }

  const supabase = getSupabase();
  const { studentInfo, category, message } = result;

  // 중복 방지: 10분 내 같은 학생이 같은 내용으로 올린 미해결 요청이 있으면 거부
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
  const { count, error: dupError } = await supabase
    .from("help_requests")
    .select("id", { count: "exact", head: true })
    .eq("student_info", studentInfo)
    .eq("message", message)
    .eq("is_resolved", false)
    .gte("created_at", since);

  if (dupError) {
    console.error(dupError);
    return { status: "error", message: SAVE_ERROR };
  }
  if ((count ?? 0) > 0) {
    return {
      status: "error",
      message: "같은 요청이 이미 접수되어 있어요. 선생님이 곧 찾아갈 테니 조금만 기다려 주세요.",
    };
  }

  const { error } = await supabase
    .from("help_requests")
    .insert({ student_info: studentInfo, category, message });
  if (error) {
    console.error(error);
    return { status: "error", message: SAVE_ERROR };
  }

  revalidatePath("/");
  return { status: "success", message: "도움 요청이 접수됐어요! 자리에서 손을 들고 기다려 주세요." };
}

export async function resolveHelpRequest(id: string): Promise<{ ok: boolean; message?: string }> {
  if (typeof id !== "string" || !id) return { ok: false, message: "잘못된 요청입니다." };
  if (!isSupabaseConfigured()) return { ok: false, message: "서버에 Supabase 설정이 없습니다." };

  const { error } = await getSupabase()
    .from("help_requests")
    .update({ is_resolved: true })
    .eq("id", id);

  if (error) {
    console.error(error);
    return { ok: false, message: "해결 처리에 실패했어요. 다시 눌러 주세요." };
  }

  revalidatePath("/");
  return { ok: true };
}
