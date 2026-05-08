import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 純靜態輸出:build 完 out/ 目錄可直接丟 nginx
  output: "export",
  // 純 <img> 不依賴 Image Optimization,export 模式也能跑
  images: { unoptimized: true },
};

export default nextConfig;
