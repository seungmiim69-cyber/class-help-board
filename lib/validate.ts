export const STUDENT_INFO_MAX = 20;
export const MESSAGE_MAX = 100;

export const CATEGORIES = [
  "기기/와이파이 오류",
  "계정 로그인(@g.cnees.kr 등)",
  "사이트/도구 사용법",
  "기타 질문",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function isCategory(value: unknown): value is Category {
  return typeof value === "string" && (CATEGORIES as readonly string[]).includes(value);
}

export type ValidationResult =
  | { ok: true; studentInfo: string; category: Category; message: string }
  | { ok: false; error: string };

export function validateHelpRequest(
  rawStudentInfo: unknown,
  rawCategory: unknown,
  rawMessage: unknown,
): ValidationResult {
  const studentInfo = typeof rawStudentInfo === "string" ? rawStudentInfo.trim() : "";
  const message = typeof rawMessage === "string" ? rawMessage.trim() : "";

  if (!studentInfo) return { ok: false, error: "학번·이름(또는 좌석)을 입력해 주세요." };
  if ([...studentInfo].length > STUDENT_INFO_MAX)
    return { ok: false, error: `학번·이름은 ${STUDENT_INFO_MAX}자 이내로 입력해 주세요.` };
  if (!isCategory(rawCategory)) return { ok: false, error: "문제 유형을 하나 골라 주세요." };
  if (!message) return { ok: false, error: "어떤 도움이 필요한지 내용을 적어 주세요." };
  if ([...message].length > MESSAGE_MAX)
    return { ok: false, error: `내용은 ${MESSAGE_MAX}자 이내로 짧게 적어 주세요.` };

  return { ok: true, studentInfo, category: rawCategory, message };
}
