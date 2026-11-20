import { Suspense } from "react";
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList";

function ListSkeleton() {
  return (
    <ul className="space-y-3" aria-busy="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="h-20 animate-pulse rounded-xl bg-zinc-200/60 dark:bg-zinc-800/60" />
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8 sm:py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">오늘 배운 한 줄</h1>
        <p className="mt-1 text-sm text-zinc-500">하루에 하나, 배운 것을 한 줄로 남겨요.</p>
      </header>

      <PostForm />

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-zinc-500">최근 기록 (최대 50개)</h2>
        <Suspense fallback={<ListSkeleton />}>
          <PostList />
        </Suspense>
      </section>
    </main>
  );
}
