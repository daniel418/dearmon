"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { toPng } from "html-to-image";
import { FONT_OPTIONS, type FontKey } from "./FontSelector";
import { getBackgroundSrc, type BackgroundKey } from "./BackgroundSelector";

type Props = {
  imageUrl: string | null;
  message: string;
  fontKey: FontKey;
  backgroundKey: BackgroundKey;
  generated: boolean;
};

const DEFAULT_MESSAGE = `親愛的媽媽，
這是你的卡片。`;

type Position = { x: number; y: number };

export default function PreviewCard({
  imageUrl,
  message,
  fontKey,
  backgroundKey,
  generated,
}: Props) {
  const backgroundSrc = getBackgroundSrc(backgroundKey);
  const cardRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    base: Position;
  }>({ active: false, startX: 0, startY: 0, base: { x: 50, y: 50 } });

  const [downloading, setDownloading] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });
  const [dragging, setDragging] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  // 已生成的卡片圖(blob: URL),顯示在下方作為視覺確認與備援儲存(長按)
  const [resultImage, setResultImage] = useState<string | null>(null);

  // resultImage 改變時釋放上一個 blob URL,組件卸載時也要清
  useEffect(() => {
    return () => {
      if (resultImage?.startsWith("blob:")) {
        URL.revokeObjectURL(resultImage);
      }
    };
  }, [resultImage]);

  // 換照片時重置位置與提示
  useEffect(() => {
    setPosition({ x: 50, y: 50 });
    setHintDismissed(false);
  }, [imageUrl]);

  const font =
    FONT_OPTIONS.find((option) => option.key === fontKey) ?? FONT_OPTIONS[0];

  const bodyText = (message?.trim() ? message : DEFAULT_MESSAGE).trim();

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!imageUrl) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      base: position,
    };
    setDragging(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active || !photoRef.current) return;
    const rect = photoRef.current.getBoundingClientRect();
    const dx = event.clientX - dragState.current.startX;
    const dy = event.clientY - dragState.current.startY;
    const nextX = clamp(dragState.current.base.x - (dx / rect.width) * 100);
    const nextY = clamp(dragState.current.base.y - (dy / rect.height) * 100);
    setPosition({ x: nextX, y: nextY });
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    setDragging(false);
    setHintDismissed(true);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      // 1. 顯式預載卡片實際會用到的字體 + 字元(觸發 fontsource unicode-range subset 載入)
      //    LINE in-app browser 等環境字體載入較 lazy,沒這步可能截到空白
      if (typeof document !== "undefined" && "fonts" in document) {
        const sampleText =
          bodyText + " HAPPY MOTHER'S DAY Dearmon 字型 明朝體 黑體 手書き";
        await Promise.all([
          document.fonts.load(`400 15px "Noto Sans JP"`, sampleText),
          document.fonts.load(`400 15px "Shippori Mincho"`, sampleText),
          document.fonts.load(`400 15px "Klee One"`, sampleText),
        ]).catch(() => {});
        await document.fonts.ready;
      }

      // 2. 等卡片裡所有 <img>(背景圖、上傳的照片)真的 load 完
      const imgs = Array.from(cardRef.current.querySelectorAll("img"));
      await Promise.all(
        imgs.map((img) => {
          if (img.complete && img.naturalWidth > 0) return Promise.resolve();
          return new Promise<void>((resolve) => {
            const done = () => resolve();
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
            // 安全網:5 秒沒載完也放行,免得卡死
            setTimeout(done, 5000);
          });
        }),
      );

      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#fffefb",
        skipFonts: true,
      });

      // dataUrl → Blob → blob URL(blob URL 在多數 WebView 表現比 data URL 友善)
      const blob = await (await fetch(dataUrl)).blob();
      const blobUrl = URL.createObjectURL(blob);
      setResultImage(blobUrl);

      const filename = `dearmon-${Date.now()}.png`;

      // 只有「觸控指標」(手機 / 平板)才走 Web Share — 桌機(滑鼠)直接下載比較直覺
      const isCoarsePointer =
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(pointer: coarse)").matches;

      if (isCoarsePointer) {
        const file = new File([blob], filename, { type: "image/png" });

        if (
          typeof navigator !== "undefined" &&
          typeof navigator.share === "function" &&
          typeof navigator.canShare === "function" &&
          navigator.canShare({ files: [file] })
        ) {
          try {
            await navigator.share({
              files: [file],
              title: "Dearmon 母親節卡片",
            });
            return;
          } catch (err) {
            if ((err as Error).name === "AbortError") return;
            console.warn("Web Share API 失敗,改用一般下載:", err);
          }
        }
      }

      // 桌機 / 不支援 share → 一般下載
      const link = document.createElement("a");
      link.download = filename;
      link.href = blobUrl;
      link.click();
    } catch (error) {
      const e = error as unknown;
      const ctor =
        (e as { constructor?: { name?: string } })?.constructor?.name ?? "?";
      console.error("下載失敗 type:", typeof e, "ctor:", ctor);
      console.error("下載失敗 toString:", String(e));
      if (e instanceof Error) {
        console.error("message:", e.message);
        console.error("stack:", e.stack);
      } else if (e instanceof Event) {
        const t = e.target as HTMLImageElement | null;
        console.error("Event target:", t?.tagName, "src:", t?.src);
      } else {
        console.error("raw:", e);
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <aside className="lg:sticky lg:top-12">
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-xs tracking-[0.3em] text-primary">
              05
            </span>
            <h2 className="font-serif text-lg text-foreground">即時預覽</h2>
          </div>
          <span className="text-[11px] text-muted">
            {generated ? "已生成" : "草稿中"}
          </span>
        </div>

        <article
          ref={cardRef}
          className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8 shadow-[0_30px_60px_-40px_rgba(46,38,32,0.25)]"
        >
          {backgroundSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={backgroundSrc}
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <CardOrnaments />
          )}

          <div className="relative">
            <Corner className="pointer-events-none absolute right-0 top-0 h-12 w-12 text-primary-soft" />

            <div className="mb-5 flex items-center gap-3 text-[11px] tracking-[0.4em] text-muted">
              <span className="block h-px w-8 bg-muted-soft" aria-hidden />
              HAPPY・MOTHER&rsquo;S DAY
            </div>

            <div
              ref={photoRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className={[
                "relative overflow-hidden rounded-2xl bg-surface-soft select-none",
                imageUrl
                  ? dragging
                    ? "cursor-grabbing"
                    : "cursor-grab"
                  : "",
              ].join(" ")}
            >
              {imageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="卡片照片"
                    draggable={false}
                    style={{ objectPosition: `${position.x}% ${position.y}%` }}
                    className="h-64 w-full object-cover sm:h-72"
                  />
                  {!dragging && !hintDismissed && !downloading && (
                    <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground/55 px-3 py-1 text-[10px] tracking-[0.3em] text-surface backdrop-blur-sm transition-opacity">
                      拖曳以調整位置
                    </span>
                  )}
                </>
              ) : (
                <div className="flex h-64 w-full items-center justify-center text-xs tracking-[0.3em] text-muted sm:h-72">
                  PHOTO PLACEHOLDER
                </div>
              )}
            </div>

            <p
              className={[
                "mt-6 whitespace-pre-line text-[15px] leading-9 text-foreground",
                font.className,
                // 有底圖時加半透明白底,確保文字可讀
                backgroundSrc
                  ? "rounded-2xl bg-surface/85 px-4 py-3 backdrop-blur-sm"
                  : "",
              ].join(" ")}
            >
              {bodyText}
            </p>

            <div className="mt-8 flex items-center justify-between border-t border-dashed border-border/80 pt-4 text-[11px] text-muted">
              <span className="font-serif tracking-widest">Dearmon</span>
              <span>
                字型 · <span className="text-foreground">{font.label}</span>
              </span>
            </div>
          </div>
        </article>

        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] leading-6 text-muted">
            {generated
              ? "卡片已備好，點右側下載一張可分享的版本。"
              : "這只是預覽 — 點擊「生成卡片」後即可下載。"}
          </p>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!generated || downloading}
            className={[
              "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[12px] tracking-widest transition",
              generated
                ? "border-primary text-primary hover:bg-primary hover:text-surface"
                : "border-muted-soft text-muted-soft cursor-not-allowed",
            ].join(" ")}
          >
            <DownloadIcon className="h-3.5 w-3.5" />
            {downloading ? "輸出中…" : "下載 PNG"}
          </button>
        </div>

        {resultImage && (
          <div className="space-y-2 rounded-2xl border border-primary/40 bg-surface-soft p-4">
            <p className="text-[12px] leading-6 text-foreground">
              卡片已生成。LINE 內請
              <strong className="text-primary">點下方圖片</strong>
              開大圖,在大圖上
              <strong className="text-primary">長按 → 儲存到相簿</strong>
              ;桌機右鍵也可另存。
            </p>
            <a
              href={resultImage}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resultImage}
                alt="生成的卡片(點擊放大,長按儲存)"
                className="w-full rounded-xl border border-border"
                style={{ WebkitTouchCallout: "default", userSelect: "auto" }}
              />
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

type Ornament = {
  type: "heart" | "carnation";
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: number;
  rotate?: number;
  tone: "primary" | "primary-soft" | "accent";
  opacity?: number;
};

const ORNAMENTS: Ornament[] = [
  { type: "carnation", top: "3%", left: "3%", size: 22, rotate: -18, tone: "primary-soft", opacity: 0.7 },
  { type: "heart", top: "8%", left: "30%", size: 10, rotate: 12, tone: "primary", opacity: 0.45 },
  { type: "heart", top: "2%", right: "32%", size: 8, rotate: -8, tone: "primary-soft", opacity: 0.7 },
  { type: "carnation", top: "44%", left: "1%", size: 16, rotate: 20, tone: "accent", opacity: 0.35 },
  { type: "heart", top: "47%", right: "2%", size: 12, rotate: -22, tone: "primary", opacity: 0.4 },
  { type: "heart", bottom: "26%", left: "4%", size: 9, rotate: 18, tone: "primary-soft", opacity: 0.6 },
  { type: "carnation", bottom: "6%", right: "5%", size: 24, rotate: 28, tone: "primary-soft", opacity: 0.65 },
  { type: "heart", bottom: "10%", left: "28%", size: 8, rotate: -10, tone: "primary", opacity: 0.4 },
  { type: "heart", bottom: "3%", right: "30%", size: 11, rotate: 14, tone: "primary-soft", opacity: 0.55 },
  { type: "carnation", top: "22%", right: "10%", size: 12, rotate: -32, tone: "accent", opacity: 0.3 },
];

function CardOrnaments() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {ORNAMENTS.map((ornament, index) => {
        const Shape = ornament.type === "heart" ? Heart : Carnation;
        const toneClass =
          ornament.tone === "primary"
            ? "text-primary"
            : ornament.tone === "accent"
            ? "text-accent"
            : "text-primary-soft";
        return (
          <span
            key={index}
            className={`absolute ${toneClass}`}
            style={{
              top: ornament.top,
              bottom: ornament.bottom,
              left: ornament.left,
              right: ornament.right,
              opacity: ornament.opacity ?? 0.5,
              transform: `rotate(${ornament.rotate ?? 0}deg)`,
            }}
          >
            <Shape size={ornament.size} />
          </span>
        );
      })}
    </div>
  );
}

function Heart({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 21s-7-4.35-9.33-9.18C1.18 8.4 3.4 4.5 7 4.5c2 0 3.6 1.1 5 2.8 1.4-1.7 3-2.8 5-2.8 3.6 0 5.82 3.9 4.33 7.32C19 16.65 12 21 12 21Z" />
    </svg>
  );
}

function Carnation({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden
    >
      {/* 花瓣層 */}
      <path
        opacity="0.85"
        d="M16 4c1.6 2.4 3.6 3.6 6 4-1.6 1.6-2.4 3.6-2 6 2.4-.4 4.4.4 6 2-2.4 1.6-3.2 3.6-2 6-2.4-.4-4.4.4-6 2-1.6-2.4-3.6-3.2-6-2 .4-2.4-.4-4.4-2-6 2.4-1.6 3.2-3.6 2-6 2.4.4 4.4-.4 4-6Z"
      />
      <path
        opacity="0.55"
        d="M16 9c1 1.5 2.4 2.4 4 2.6-1 1-1.6 2.4-1.2 3.8 1.6-.2 2.8.4 3.6 1.4-1.4 1-2 2.4-1.2 3.8-1.6-.2-2.8.4-3.6 1.4-1-1.5-2.4-2.2-3.8-1.4.4-1.6-.2-3-1.4-3.8 1.6-1 2-2.4 1.2-3.8 1.6.4 2.8-.4 2.4-3.8Z"
      />
      <circle cx="16" cy="16" r="1.6" opacity="0.8" />
    </svg>
  );
}

function Corner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      <path
        d="M32 6c4 8 12 12 22 12-10 4-16 12-22 22-6-10-12-18-22-22 10 0 18-4 22-12Z"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
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
      <path d="M12 4v12" />
      <path d="m7 11 5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  );
}
