import type { NextConfig } from "next";

// GitHub Pages serves the docs site as a static export. CI sets
// NEXT_OUTPUT=export in the Pages workflow; local dev and the standard
// npm run build produce the regular .next output unchanged.
const isExport = process.env.NEXT_OUTPUT === "export";

// Project pages are served from /<repo-name>; a user or organization
// page repo (<name>.github.io) is served from the root. The Pages
// workflow computes and passes NEXT_PUBLIC_BASE_PATH.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(basePath ? { basePath } : {}),
  ...(isExport ? { output: "export", images: { unoptimized: true } } : {}),
};

export default nextConfig;
