"use client";

export type FrameKey = "none" | "corner_gold" | "crayon_hearts" | "washi_wreath";

export type FrameOption = {
  key: FrameKey;
  label: string;
  romaji: string;
  description: string;
};

export const FRAME_OPTIONS: FrameOption[] = [
  {
    key: "none",
    label: "無外框",
    romaji: "Plain",
    description: "純粹留白。",
  },
  {
    key: "corner_gold",
    label: "金線花圈",
    romaji: "Gold",
    description: "四角小束花圈，極細金線。",
  },
  {
    key: "crayon_hearts",
    label: "蠟筆愛心",
    romaji: "Crayon",
    description: "手繪蠟筆虛線＋散落愛心。",
  },
  {
    key: "washi_wreath",
    label: "和紙花環",
    romaji: "Washi",
    description: "和紙撕邊＋頂部康乃馨花環。",
  },
];

export function CardFrame({ frame }: { frame: FrameKey }) {
  if (frame === "none") return null;
  if (frame === "corner_gold") return <CornerGoldFrame />;
  if (frame === "crayon_hearts") return <CrayonHeartsFrame />;
  return <WashiWreathFrame />;
}

/* =====================================================
 * 框 1：四角小束花圈 + 極細金線
 * ===================================================== */
const GOLD = "#c9a96a";
const GOLD_SOFT = "#dcc28d";

function CornerGoldFrame() {
  return (
    <>
      {/* 四角極細金色 L 形 + 小花圈 */}
      <CornerGoldUnit className="absolute left-0 top-0" />
      <CornerGoldUnit className="absolute right-0 top-0 -scale-x-100" />
      <CornerGoldUnit className="absolute bottom-0 left-0 -scale-y-100" />
      <CornerGoldUnit className="absolute bottom-0 right-0 -scale-100" />
    </>
  );
}

function CornerGoldUnit({ className }: { className: string }) {
  return (
    <svg
      className={`pointer-events-none ${className} h-24 w-24`}
      viewBox="0 0 96 96"
      aria-hidden
    >
      {/* L 形雙線 */}
      <g
        fill="none"
        stroke={GOLD}
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.9"
      >
        <path d="M 14 60 L 14 14 L 60 14" />
        <path d="M 18 56 L 18 18 L 56 18" opacity="0.45" />
      </g>
      {/* 小花圈 */}
      <g transform="translate(20 20)">
        <circle
          cx="14"
          cy="14"
          r="13"
          fill="none"
          stroke={GOLD_SOFT}
          strokeWidth="0.6"
          opacity="0.7"
        />
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const cx = 14 + Math.cos(rad) * 13;
          const cy = 14 + Math.sin(rad) * 13;
          return (
            <g key={deg} transform={`translate(${cx} ${cy})`}>
              {deg % 120 === 0 ? (
                <MiniCarnation />
              ) : (
                <path
                  d="M-3.5 0 C -2 -2.5, 2 -2.5, 3.5 0 C 2 2.5, -2 2.5, -3.5 0 Z"
                  fill="#a8b89a"
                  opacity="0.7"
                  transform={`rotate(${deg})`}
                />
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function MiniCarnation() {
  return (
    <g>
      <circle r="3.6" fill="#f2d1cc" />
      <circle r="2.4" fill="#e6b3ae" />
      <circle r="1.2" fill="#c97f8b" />
    </g>
  );
}

/* =====================================================
 * 框 2：手繪蠟筆虛線 + 散落愛心
 * ===================================================== */
const CRAYON = "#d97a82";

function CrayonHeartsFrame() {
  return (
    <>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <filter id="crayon-rough" x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="1.6" />
          </filter>
        </defs>
        {/* 外圈 */}
        <rect
          x="2%"
          y="2%"
          width="96%"
          height="96%"
          rx="20"
          ry="20"
          fill="none"
          stroke={CRAYON}
          strokeWidth="1.6"
          strokeDasharray="6 5"
          strokeLinecap="round"
          opacity="0.85"
          filter="url(#crayon-rough)"
        />
        {/* 內圈：再淡一層蠟筆痕 */}
        <rect
          x="3%"
          y="3%"
          width="94%"
          height="94%"
          rx="18"
          ry="18"
          fill="none"
          stroke={CRAYON}
          strokeWidth="0.8"
          strokeDasharray="2 6"
          strokeLinecap="round"
          opacity="0.4"
          filter="url(#crayon-rough)"
        />
      </svg>

      {/* 散落愛心 */}
      <FloatHeart className="absolute left-5 top-5" size={9} rotate={-18} opacity={0.7} />
      <FloatHeart className="absolute left-1/3 top-3" size={7} rotate={12} opacity={0.55} />
      <FloatHeart className="absolute right-6 top-6" size={10} rotate={20} opacity={0.7} />
      <FloatHeart className="absolute right-1/4 top-10" size={6} rotate={-8} opacity={0.45} />
      <FloatHeart className="absolute left-3 top-1/2" size={8} rotate={28} opacity={0.6} />
      <FloatHeart className="absolute right-3 top-2/3" size={11} rotate={-22} opacity={0.7} />
      <FloatHeart className="absolute bottom-8 left-1/4" size={7} rotate={14} opacity={0.5} />
      <FloatHeart className="absolute bottom-5 right-1/3" size={9} rotate={-16} opacity={0.65} />
      <FloatHeart className="absolute bottom-4 left-6" size={11} rotate={24} opacity={0.7} />
      <FloatHeart className="absolute bottom-6 right-6" size={8} rotate={-30} opacity={0.55} />
    </>
  );
}

function FloatHeart({
  className,
  size,
  rotate = 0,
  opacity = 1,
}: {
  className: string;
  size: number;
  rotate?: number;
  opacity?: number;
}) {
  return (
    <svg
      className={`pointer-events-none ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ transform: `rotate(${rotate}deg)`, opacity }}
      aria-hidden
    >
      <path
        d="M12 21s-7-4.35-9.33-9.18C1.18 8.4 3.4 4.5 7 4.5c2 0 3.6 1.1 5 2.8 1.4-1.7 3-2.8 5-2.8 3.6 0 5.82 3.9 4.33 7.32C19 16.65 12 21 12 21Z"
        fill={CRAYON}
      />
    </svg>
  );
}

/* =====================================================
 * 框 3：和紙撕邊 + 頂部康乃馨花環
 * ===================================================== */
function WashiWreathFrame() {
  return (
    <>
      {/* 撕邊：以 turbulence 將矩形描邊扭曲，做出毛邊紙感 */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <filter id="washi-tear" x="-3%" y="-3%" width="106%" height="106%">
            <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="6" />
          </filter>
          <filter id="washi-fiber" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="2" />
            <feColorMatrix
              values="0 0 0 0 0.5
                      0 0 0 0 0.45
                      0 0 0 0 0.38
                      0 0 0 0.06 0"
            />
          </filter>
        </defs>
        {/* 紙纖維紋（極淡） */}
        <rect width="100%" height="100%" filter="url(#washi-fiber)" />
        {/* 毛邊：以淡棕做雙重描邊 */}
        <rect
          x="1.5%"
          y="1.5%"
          width="97%"
          height="97%"
          rx="22"
          ry="22"
          fill="none"
          stroke="#c7b9aa"
          strokeWidth="2"
          opacity="0.55"
          filter="url(#washi-tear)"
        />
        <rect
          x="2.5%"
          y="2.5%"
          width="95%"
          height="95%"
          rx="20"
          ry="20"
          fill="none"
          stroke="#e8dfd3"
          strokeWidth="1"
          opacity="0.7"
          filter="url(#washi-tear)"
        />
      </svg>

      {/* 頂部康乃馨花環 */}
      <svg
        className="pointer-events-none absolute left-1/2 top-2 h-20 w-[80%] -translate-x-1/2"
        viewBox="0 0 400 90"
        aria-hidden
      >
        {/* 花環骨幹 */}
        <path
          d="M40 70 C 100 12, 300 12, 360 70"
          stroke="#a8b89a"
          strokeWidth="1.4"
          opacity="0.7"
          fill="none"
        />
        <path
          d="M50 72 C 110 22, 290 22, 350 72"
          stroke="#a8b89a"
          strokeWidth="1"
          opacity="0.45"
          fill="none"
        />
        {/* 葉 */}
        {[
          [70, 50, -40],
          [110, 36, -25],
          [160, 24, -10],
          [240, 24, 10],
          [290, 36, 25],
          [330, 50, 40],
        ].map(([cx, cy, rot], i) => (
          <g key={`leaf-${i}`} transform={`translate(${cx} ${cy}) rotate(${rot})`}>
            <path
              d="M-12 0 C -7 -7, 7 -7, 12 0 C 7 7, -7 7, -12 0 Z"
              fill="#a8b89a"
              opacity="0.6"
            />
          </g>
        ))}
        {/* 康乃馨 */}
        {[
          { cx: 90, cy: 32, r: 9 },
          { cx: 140, cy: 22, r: 11 },
          { cx: 200, cy: 16, r: 13 },
          { cx: 260, cy: 22, r: 11 },
          { cx: 310, cy: 32, r: 9 },
        ].map((f, i) => (
          <g key={`flower-${i}`} transform={`translate(${f.cx} ${f.cy})`}>
            <circle r={f.r} fill="#f2d1cc" opacity="0.95" />
            <circle r={f.r * 0.7} fill="#e6b3ae" opacity="0.9" />
            <circle r={f.r * 0.4} fill="#c97f8b" />
            <path
              d={`M ${-f.r} 0 Q 0 ${-f.r} ${f.r} 0`}
              fill="none"
              stroke="#fff"
              strokeWidth="0.5"
              opacity="0.6"
            />
          </g>
        ))}
      </svg>
    </>
  );
}
