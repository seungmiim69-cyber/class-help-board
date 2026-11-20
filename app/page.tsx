import { Suspense } from "react";
import HelpForm from "@/components/HelpForm";
import HelpBoard from "@/components/HelpBoard";
import AutoRefresh from "@/components/AutoRefresh";

function BoardSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true">
      <div className="h-16 animate-pulse rounded-2xl bg-slate-200/70" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200/70" />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          디지털 수업 실시간 도움 요청 보드
        </h1>
        <p className="mt-3 text-base text-slate-600 sm:text-lg">
          기기 오류나 사용법이 막힐 때 남겨주세요. 선생님과 디지털 튜터가 바로 찾아갑니다!
        </p>
      </header>

      <HelpForm />

      <section className="mt-10" aria-labelledby="board-title">
        <h2 id="board-title" className="mb-3 text-xl font-bold text-slate-800">
          📋 실시간 도움 요청 현황
        </h2>
        <AutoRefresh />
        <Suspense fallback={<BoardSkeleton />}>
          <HelpBoard />
        </Suspense>
      </section>
    </main>
  );
}
