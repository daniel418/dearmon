import type { Metadata } from "next";

// 自託管字體(避免 build 時連 fonts.googleapis.com)
import "@fontsource/noto-sans-jp/300.css";
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/500.css";
import "@fontsource/noto-sans-jp/700.css";
import "@fontsource/shippori-mincho/400.css";
import "@fontsource/shippori-mincho/500.css";
import "@fontsource/shippori-mincho/600.css";
import "@fontsource/shippori-mincho/700.css";
import "@fontsource/klee-one/400.css";
import "@fontsource/klee-one/600.css";

import "./globals.css";

export const metadata: Metadata = {
  title: "Dearmon ｜ 寫一封信給媽媽",
  description: "用文字與字型，為母親節留下一張溫柔的卡片。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className="h-full antialiased">
      <body className="paper min-h-full flex flex-col text-foreground">
        {children}
      </body>
    </html>
  );
}
