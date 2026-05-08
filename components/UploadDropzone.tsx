"use client";

import { useCallback, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";

type Props = {
  imageUrl: string | null;
  onChange: (url: string | null) => void;
};

const ACCEPT = "image/png,image/jpeg,image/webp";

export default function UploadDropzone({ imageUrl, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      onChange(url);
    },
    [onChange],
  );

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  const onSelect = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
  };

  return (
    <section className="space-y-3">
      <Label index="01" title="放上一張照片" hint="JPG / PNG / WebP" />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={[
          "group relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed bg-surface transition",
          dragOver
            ? "border-primary bg-primary-soft/30"
            : "border-muted-soft hover:border-primary/60 hover:bg-surface-soft",
        ].join(" ")}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="預覽圖"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <FlowerMark className="h-9 w-9 text-primary/80" />
            <p className="font-serif text-base text-foreground">
              將照片拖曳到這裡，或點擊上傳
            </p>
            <p className="text-xs leading-6 text-muted">
              建議使用直式或方型構圖，
              <br />
              讓媽媽的笑容成為主角。
            </p>
          </div>
        )}

        {imageUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="absolute right-3 top-3 rounded-full bg-surface/90 px-3 py-1 text-xs text-muted shadow-sm backdrop-blur transition hover:bg-surface hover:text-foreground"
          >
            重新選擇
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          onChange={onSelect}
          className="hidden"
        />
      </div>
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
      {hint && <span className="text-[11px] text-muted">{hint}</span>}
    </div>
  );
}

function FlowerMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      className={className}
      aria-hidden
    >
      <path d="M12 3c1.6 1.4 1.6 3.6 0 5-1.6-1.4-1.6-3.6 0-5Z" />
      <path d="M21 12c-1.4 1.6-3.6 1.6-5 0 1.4-1.6 3.6-1.6 5 0Z" />
      <path d="M12 21c-1.6-1.4-1.6-3.6 0-5 1.6 1.4 1.6 3.6 0 5Z" />
      <path d="M3 12c1.4-1.6 3.6-1.6 5 0-1.4 1.6-3.6 1.6-5 0Z" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
