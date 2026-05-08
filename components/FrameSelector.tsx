"use client";

import { CardFrame, FRAME_OPTIONS, type FrameKey } from "./CardFrame";

type Props = {
  value: FrameKey;
  onChange: (value: FrameKey) => void;
};

export default function FrameSelector({ value, onChange }: Props) {
  return (
    <section className="space-y-3">
      <Label index="04" title="選擇外框" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {FRAME_OPTIONS.map((option) => {
          const active = option.key === value;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(option.key)}
              aria-pressed={active}
              className={[
                "group flex flex-col gap-2 rounded-2xl border bg-surface p-3 text-left transition",
                active
                  ? "border-primary shadow-[0_0_0_4px_rgba(201,127,139,0.10)]"
                  : "border-border hover:border-primary/50",
              ].join(" ")}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-soft">
                <CardFrame frame={option.key} />
                {option.key === "none" && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] tracking-[0.3em] text-muted-soft">
                    PLAIN
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-sm text-foreground">
                  {option.label}
                </span>
                <span className="text-[10px] tracking-[0.3em] text-muted">
                  {option.romaji.toUpperCase()}
                </span>
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
