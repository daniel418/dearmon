import type { Metadata } from "next";
import { Noto_Sans_JP, Shippori_Mincho, Klee_One } from "next/font/google";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori-mincho",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const kleeOne = Klee_One({
  variable: "--font-klee-one",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

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
    <html
      lang="zh-Hant"
      className={`${notoSansJp.variable} ${shipporiMincho.variable} ${kleeOne.variable} h-full antialiased`}
    >
      <body className="paper min-h-full flex flex-col text-foreground">
        {children}
      </body>
    </html>
  );
}
