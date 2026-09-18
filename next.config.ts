import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  // Há um package-lock.json solto em C:\Users\User; fixa a raiz do workspace neste projeto.
  turbopack: { root: process.cwd() },
  async headers() {
    // Mídia gerada pelo pipeline tem hash no nome (imagens) ou é versionada por deploy: cache longo.
    return [
      { source: "/media/img/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/media/video/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }] },
    ];
  },
  async redirects() {
    return [{ source: "/contato", destination: "/orcamento", permanent: true }];
  },
};

export default createMDX({})(nextConfig);
