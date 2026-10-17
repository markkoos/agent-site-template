import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Listing photos come from many MLS/CDN hosts, so the template uses plain <img>
  // tags (lazy-loaded, sized) instead of next/image. That keeps hosting portable
  // (Netlify, Cloudflare, Vercel) and avoids paying for image optimization.
  poweredByHeader: false,
  // Markdown in /content is read at runtime when pages revalidate — make sure
  // serverless bundles include it.
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
