"use client";

type Props = {
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
};

export default function GenerateButton({ disabled, loading, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        "group relative inline-flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 transition",
        "bg-primary text-surface shadow-[0_8px_24px_-12px_rgba(201,127,139,0.6)]",
        "hover:enabled:translate-y-[-1px] hover:enabled:shadow-[0_12px_28px_-12px_rgba(201,127,139,0.7)]",
        "active:enabled:translate-y-0",
        "disabled:cursor-not-allowed disabled:bg-muted-soft disabled:text-surface disabled:shadow-none",
      ].join(" ")}
    >
      <span className="font-serif text-base tracking-[0.3em]">
        {loading ? "生成中…" : "生成卡片"}
      </span>
      <Arrow
        className={[
          "h-4 w-4 transition",
          loading ? "animate-pulse" : "group-hover:translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
