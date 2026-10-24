import type { NextConfig } from "next";

// Headers de segurança aplicados a todas as rotas.
// Sem CSP de propósito: ela quebraria GTM, GA4 e Meta Pixel.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // Há um package-lock.json solto em C:\Users\User; fixa a raiz do workspace neste projeto.
  turbopack: { root: process.cwd() },
  async headers() {
    return [
      { source: "/(.*)", headers: SECURITY_HEADERS },
      // Mídia gerada pelo pipeline tem hash no nome (imagens) ou é versionada por deploy: cache longo.
      { source: "/media/img/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/media/video/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }] },
    ];
  },
  async redirects() {
    return [{ source: "/contato", destination: "/orcamento", permanent: true }];
  },
};

export default nextConfig;
