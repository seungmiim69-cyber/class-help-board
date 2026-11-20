import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "디지털 수업 실시간 도움 요청 보드",
  description: "기기 오류나 사용법이 막힐 때 남겨주세요. 선생님과 디지털 튜터가 바로 찾아갑니다!",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
