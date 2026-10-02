import type { NextConfig } from "next";

// Baseline hardening headers. No CSP here on purpose: this app serves inline SVG
// through dangerouslySetInnerHTML and the Next.js dev overlay, and a hand-written
// policy that breaks the app is worse than none. Ship CSP with per-request nonces.
const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
