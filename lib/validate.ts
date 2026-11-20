export const NICKNAME_MAX = 20;
export const CONTENT_MAX = 140;

export type ValidationResult =
  | { ok: true; nickname: string; content: string }
  | { ok: false; error: string };

export function validatePost(
  rawNickname: unknown,
  rawContent: unknown,
): ValidationResult {
  const nickname = typeof rawNickname === "string" ? rawNickname.trim() : "";
  const content = typeof rawContent === "string" ? rawContent.trim() : "";

  if (!nickname) return { ok: false, error: "닉네임을 입력해 주세요." };
  if (!content) return { ok: false, error: "내용을 입력해 주세요." };
  if ([...nickname].length > NICKNAME_MAX)
    return { ok: false, error: `닉네임은 ${NICKNAME_MAX}자 이하로 입력해 주세요.` };
  if ([...content].length > CONTENT_MAX)
    return { ok: false, error: `내용은 ${CONTENT_MAX}자 이하로 입력해 주세요.` };

  return { ok: true, nickname, content };
}
