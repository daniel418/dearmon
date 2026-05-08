"use client";

export type BackgroundKey = "none" | "mother_baby" | "flower" | "happy_family";

export type BackgroundOption = {
  key: BackgroundKey;
  label: string;
  description: string;
  src?: string;
};

export const BACKGROUND_OPTIONS: BackgroundOption[] = [
  {
    key: "none",
    label: "無背景",
    description: "純粹米白卡片。",
  },
  {
    key: "mother_baby",
    label: "剪影母女",
    description: "淡紫剪影 + 春花蝶舞。",
    src: "/backgrounds/mother-baby.png",
  },
  {
    key: "flower",
    label: "粉緞花禮",
    description: "粉緞帶與康乃馨。",
    src: "/backgrounds/flower.png",
  },
  {
    key: "happy_family",
    label: "歡樂家庭",
    description: "暖粉卡通母子。",
    src: "/backgrounds/happy-family.jpg",
  },
];

export function getBackgroundSrc(key: BackgroundKey): string | null {
  return BACKGROUND_OPTIONS.find((o) => o.key === key)?.src ?? null;
}

type Props = {
  value: BackgroundKey;
  onChange: (value: BackgroundKey) => void;
};

export default function BackgroundSelector({ value, onChange }: Props) {
  return (
    <section className="space-y-3">
      <Label index="04" title="選擇背景" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {BACKGROUND_OPTIONS.map((option) => {
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
                {option.src ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={option.src}
                    alt={option.label}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] tracking-[0.3em] text-muted-soft">
                    PLAIN
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-sm text-foreground">
                  {option.label}
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
