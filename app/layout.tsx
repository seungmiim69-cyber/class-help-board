import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "오늘 배운 한 줄 · TIL Board",
  description: "하루에 하나, 배운 것을 한 줄로 남기고 모두의 기록을 보는 TIL Board",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        {children}
      </body>
    </html>
  );
}
