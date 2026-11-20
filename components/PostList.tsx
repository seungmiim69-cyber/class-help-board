import { connection } from "next/server";
import { getSupabase, isSupabaseConfigured, type TilPost } from "@/lib/supabase";

const LIST_LIMIT = 50;

function withDisplayTime(posts: TilPost[]) {
  const now = Date.now();
  return posts.map((post) => ({ ...post, displayTime: formatTime(post.created_at, now) }));
}

function formatTime(iso: string, now: number): string {
  const diffSec = Math.floor((now - new Date(iso).getTime()) / 1000);
  if (diffSec < 60) return "방금 전";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}분 전`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}시간 전`;
  return new Date(iso).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Notice({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "error" }) {
  return (
    <p
      className={`rounded-xl border border-dashed p-6 text-center text-sm ${
        tone === "error"
          ? "border-red-300 text-red-600"
          : "border-zinc-300 text-zinc-500 dark:border-zinc-700"
      }`}
    >
      {children}
    </p>
  );
}

export default async function PostList() {
  await connection();

  if (!isSupabaseConfigured()) {
    return (
      <Notice tone="error">
        Supabase 설정이 필요합니다. <code>.env.local</code>에 URL과 anon key를 입력하세요.
      </Notice>
    );
  }

  const { data, error } = await getSupabase()
    .from("til_posts")
    .select("id, nickname, content, created_at")
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);

  if (error) {
    console.error(error);
    return <Notice tone="error">목록을 불러오지 못했습니다.</Notice>;
  }

  const posts = withDisplayTime((data ?? []) as TilPost[]);
  if (posts.length === 0) {
    return <Notice>아직 기록이 없어요. 첫 번째 한 줄을 남겨 보세요!</Notice>;
  }

  return (
    <ul className="space-y-3">
      {posts.map((post) => (
        <li
          key={post.id}
          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="mb-1 flex items-center gap-2 text-sm text-zinc-500">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{post.nickname}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.created_at}>{post.displayTime}</time>
          </div>
          <p className="break-words whitespace-pre-wrap">{post.content}</p>
        </li>
      ))}
    </ul>
  );
}
