import { connection } from "next/server";
import { getSupabase, isSupabaseConfigured, type HelpRequest } from "@/lib/supabase";
import RequestCard from "@/components/RequestCard";

const RESOLVED_LIMIT = 30;
const PENDING_LIMIT = 200;
const COLUMNS = "id, student_info, category, message, is_resolved, created_at";

function formatTime(iso: string, now: number): string {
  const date = new Date(iso);
  const clock = date.toLocaleTimeString("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "numeric",
    minute: "2-digit",
  });
  const diffSec = Math.floor((now - date.getTime()) / 1000);
  if (diffSec < 60) return `${clock} · 방금 전`;
  if (diffSec < 3600) return `${clock} · ${Math.floor(diffSec / 60)}분 전`;
  if (diffSec < 86400) return `${clock} · ${Math.floor(diffSec / 3600)}시간 전`;
  return date.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// connection() 이후, 요청 시점마다 호출됨
function currentTime(): number {
  return Date.now();
}

/** 오늘 0시(한국 시간)의 ISO 문자열 */
function startOfTodayKST(now: number): string {
  const kstDate = new Date(now + 9 * 3600 * 1000).toISOString().slice(0, 10);
  return new Date(`${kstDate}T00:00:00+09:00`).toISOString();
}

function Notice({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "error" }) {
  return (
    <p
      className={`rounded-2xl border-2 border-dashed p-8 text-center text-lg ${
        tone === "error" ? "border-red-300 bg-red-50 text-red-700" : "border-slate-300 text-slate-500"
      }`}
    >
      {children}
    </p>
  );
}

export default async function HelpBoard() {
  await connection();

  if (!isSupabaseConfigured()) {
    return (
      <Notice tone="error">
        Supabase 설정이 필요합니다. <code>.env.local</code>에 URL과 키를 입력하세요.
      </Notice>
    );
  }

  const now = currentTime();
  const supabase = getSupabase();
  const todayStart = startOfTodayKST(now);

  const [pendingRes, resolvedRes] = await Promise.all([
    // 미해결: 먼저 요청한 학생부터 (오래 기다린 순)
    supabase
      .from("help_requests")
      .select(COLUMNS, { count: "exact" })
      .eq("is_resolved", false)
      .order("created_at", { ascending: true })
      .limit(PENDING_LIMIT),
    // 해결 완료: 오늘 것만, 최근 처리된 순
    supabase
      .from("help_requests")
      .select(COLUMNS, { count: "exact" })
      .eq("is_resolved", true)
      .gte("created_at", todayStart)
      .order("created_at", { ascending: false })
      .limit(RESOLVED_LIMIT),
  ]);

  if (pendingRes.error || resolvedRes.error) {
    console.error(pendingRes.error ?? resolvedRes.error);
    return <Notice tone="error">요청 목록을 불러오지 못했어요. 잠시 후 새로 고침해 주세요.</Notice>;
  }

  const pending = (pendingRes.data ?? []) as HelpRequest[];
  const resolved = (resolvedRes.data ?? []) as HelpRequest[];
  const pendingCount = pendingRes.count ?? pending.length;
  const resolvedCount = resolvedRes.count ?? resolved.length;
  const requests = [...pending, ...resolved];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-lg font-bold shadow-sm sm:text-xl">
        <span className="flex items-center gap-2 text-orange-600">
          <span className="relative flex size-3">
            {pendingCount > 0 && (
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange-400 opacity-75" />
            )}
            <span className="relative inline-flex size-3 rounded-full bg-orange-500" />
          </span>
          대기 중 {pendingCount}건
        </span>
        <span className="text-slate-300" aria-hidden>
          /
        </span>
        <span className="text-emerald-600">해결 완료 {resolvedCount}건</span>
        <span className="ml-auto text-sm font-normal text-slate-400">해결 완료는 오늘 기준 · 10초마다 자동 갱신</span>
      </div>

      {requests.length === 0 ? (
        <Notice>아직 도움 요청이 없어요. 모두 잘하고 있네요! 👍</Notice>
      ) : (
        <ul className="space-y-3">
          {requests.map((r) => (
            <RequestCard key={r.id} request={r} displayTime={formatTime(r.created_at, now)} />
          ))}
        </ul>
      )}
    </div>
  );
}
