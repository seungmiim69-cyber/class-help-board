"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** 교탁 화면을 켜두기만 해도 새 요청이 보이도록 주기적으로 목록을 새로 고침 */
export default function AutoRefresh({ intervalMs = 10_000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null;
}
