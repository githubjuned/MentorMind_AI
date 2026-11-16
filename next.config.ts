import type { NextConfig } from "next";

const isExport = process.env.NEXT_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isExport ? { output: "export", images: { unoptimized: true } } : {}),
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
};

export default nextConfig;
