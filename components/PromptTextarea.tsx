"use client";

import type { ChangeEvent } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
};

const PLACEHOLDER = `親愛的媽媽，

謝謝你總在我看不見的時候，
偷偷把世界裡最好的那一份留給我。

今年的康乃馨，我想親手送到你手裡。`;

export default function PromptTextarea({
  value,
  onChange,
  maxLength = 280,
}: Props) {
  const handle = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.target.value.slice(0, maxLength);
    onChange(next);
  };

  return (
    <section className="space-y-3">
      <Label
        index="02"
        title="想對媽媽說的話"
        hint={`${value.length} / ${maxLength}`}
      />

      <div className="rounded-2xl border border-border bg-surface p-5 transition focus-within:border-primary/60 focus-within:shadow-[0_0_0_4px_rgba(201,127,139,0.08)]">
        <textarea
          value={value}
          onChange={handle}
          maxLength={maxLength}
          rows={7}
          placeholder={PLACEHOLDER}
          className="block w-full resize-none border-0 bg-transparent font-serif text-[15px] leading-8 text-foreground placeholder:text-muted-soft focus:outline-none"
        />
      </div>

      <p className="text-[11px] leading-6 text-muted">
        提示：寫一句具體的小事，比一千個「謝謝媽媽」更動人。
      </p>
    </section>
  );
}

function Label({
  index,
  title,
  hint,
}: {
  index: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-xs tracking-[0.3em] text-primary">
          {index}
        </span>
        <h2 className="font-serif text-lg text-foreground">{title}</h2>
      </div>
      {hint && (
        <span className="font-serif text-[11px] tabular-nums text-muted">
          {hint}
        </span>
      )}
    </div>
  );
}
