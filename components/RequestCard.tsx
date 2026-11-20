"use client";

import { useOptimistic, useState, useTransition } from "react";
import { resolveHelpRequest } from "@/app/actions";
import type { HelpRequest } from "@/lib/supabase";

const CATEGORY_STYLES: Record<string, string> = {
  "기기/와이파이 오류": "bg-rose-100 text-rose-800",
  "계정 로그인(@g.cnees.kr 등)": "bg-violet-100 text-violet-800",
  "사이트/도구 사용법": "bg-sky-100 text-sky-800",
  "기타 질문": "bg-slate-100 text-slate-700",
};

type Props = {
  request: HelpRequest;
  displayTime: string;
};

export default function RequestCard({ request, displayTime }: Props) {
  const [resolved, setOptimisticResolved] = useOptimistic(request.is_resolved);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleResolve() {
    setError("");
    startTransition(async () => {
      setOptimisticResolved(true);
      const result = await resolveHelpRequest(request.id);
      if (!result.ok) setError(result.message ?? "해결 처리에 실패했어요.");
    });
  }

  return (
    <li
      className={`flex flex-col gap-3 rounded-2xl border-2 p-4 transition sm:flex-row sm:items-center sm:gap-4 sm:p-5 ${
        resolved ? "border-slate-200 bg-slate-50 opacity-75" : "border-orange-200 bg-white shadow-sm"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {resolved ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
              ✓ 해결 완료
            </span>
          ) : (
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700">
              🙋 도움 필요
            </span>
          )}
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              CATEGORY_STYLES[request.category] ?? CATEGORY_STYLES["기타 질문"]
            }`}
          >
            {request.category}
          </span>
        </div>
        <div className="mb-1 flex flex-wrap items-baseline gap-x-2">
          <span className="text-lg font-bold text-slate-900">{request.student_info}</span>
          <time dateTime={request.created_at} className="text-sm text-slate-500">
            {displayTime}
          </time>
        </div>
        <p className="text-lg break-words text-slate-700">{request.message}</p>
        {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
      </div>

      {!resolved && (
        <button
          type="button"
          onClick={handleResolve}
          disabled={pending}
          className="shrink-0 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60 sm:self-center"
        >
          해결 완료
        </button>
      )}
    </li>
  );
}
