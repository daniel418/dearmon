import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker 部署用:輸出獨立 server.js + 必要 node_modules
  output: "standalone",
};

export default nextConfig;
