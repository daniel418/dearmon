"use client";

export type FontKey = "mincho" | "gothic" | "tegaki";

export type FontOption = {
  key: FontKey;
  label: string;
  romaji: string;
  description: string;
  className: string;
};

export const FONT_OPTIONS: FontOption[] = [
  {
    key: "mincho",
    label: "明朝體",
    romaji: "Mincho",
    description: "沉靜文青、像舊書頁的氣息。",
    className: "font-serif",
  },
  {
    key: "gothic",
    label: "黑體",
    romaji: "Gothic",
    description: "乾淨清爽，現代日系雜誌感。",
    className: "font-sans",
  },
  {
    key: "tegaki",
    label: "手書き",
    romaji: "Tegaki",
    description: "像親筆寫下的，最溫柔的字。",
    className: "font-hand",
  },
];

type Props = {
  value: FontKey;
  onChange: (value: FontKey) => void;
};

export default function FontSelector({ value, onChange }: Props) {
  return (
    <section className="space-y-3">
      <Label index="03" title="選擇字型" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {FONT_OPTIONS.map((option) => {
          const active = option.key === value;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(option.key)}
              className={[
                "group flex flex-col gap-2 rounded-2xl border bg-surface p-4 text-left transition",
                active
                  ? "border-primary shadow-[0_0_0_4px_rgba(201,127,139,0.10)]"
                  : "border-border hover:border-primary/50",
              ].join(" ")}
              aria-pressed={active}
            >
              <div className="flex items-baseline justify-between">
                <span
                  className={`text-2xl text-foreground ${option.className}`}
                >
                  愛
                </span>
                <span className="text-[10px] tracking-[0.3em] text-muted">
                  {option.romaji.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm text-foreground">
                  {option.label}
                </span>
                {active && (
                  <span className="text-[10px] text-primary">已選</span>
                )}
              </div>
              <p className="text-[11px] leading-5 text-muted">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Label({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-serif text-xs tracking-[0.3em] text-primary">
        {index}
      </span>
      <h2 className="font-serif text-lg text-foreground">{title}</h2>
    </div>
  );
}
