import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function HomeLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-8 pt-12 pb-6 sm:px-16 sm:pt-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="flex items-center gap-3 text-muted">
            <span className="block h-px w-10 bg-muted-soft" aria-hidden />
            <span className="text-xs tracking-[0.4em] uppercase">
              Mother&rsquo;s Day · 母の日
            </span>
          </div>
          <h1 className="font-serif text-4xl leading-tight text-foreground sm:text-5xl">
            寫一封，<span className="text-primary">給媽媽</span>的信。
          </h1>
          <p className="max-w-xl text-sm leading-7 text-muted sm:text-base">
            上傳一張照片，留下一段悄悄話，
            <br className="hidden sm:block" />
            用最溫柔的字型，為今年的母親節做一張只屬於你們的卡片。
          </p>
        </div>
      </header>

      <main className="flex-1 px-8 pb-20 sm:px-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {children}
        </div>
      </main>

      <footer className="border-t border-border/60 px-8 py-8 sm:px-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 text-xs text-muted sm:flex-row sm:items-center">
          <span className="font-serif tracking-widest">DearMOM</span>
          <span>© {new Date().getFullYear()} ｜ 願愛意如紙，常駐心間。</span>
        </div>
      </footer>
    </div>
  );
}
