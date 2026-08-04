import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

// Pin Turbopack to /web/ — there's a stub package-lock.json at the repo root
// for Vercel framework detection, which Next.js otherwise infers as the
// workspace root and ends up watching the entire monorepo (OOMs the dev server).
const here = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  trailingSlash: true,
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: here,
  },
  // Markdown posts are read at runtime via fs.readdir; they aren't statically
  // imported so Next won't trace them. Force-include the whole content/ tree
  // so the deployment bundle ships with the posts.
  outputFileTracingIncludes: {
    "*": ["./content/**/*"],
  },
  experimental: {
    viewTransition: true,
  },
  async redirects() {
    return [
      { source: "/trackmyprop", destination: "https://trackmyprop.app", permanent: true },
      { source: "/trackmyprop/:path*", destination: "https://trackmyprop.app/:path*", permanent: true },
      { source: "/proptracker", destination: "/trackmyprop", permanent: true },
      { source: "/proptracker/:path*", destination: "/trackmyprop/:path*", permanent: true },

      { source: "/about", destination: "/", permanent: true },
      { source: "/about/page/:path*", destination: "/", permanent: true },
      { source: "/about/contact", destination: "/", permanent: true },
      { source: "/about/contact/:path*", destination: "/", permanent: true },
      { source: "/about/portfolio", destination: "/", permanent: true },
      { source: "/about/portfolio/:path*", destination: "/", permanent: true },
      { source: "/about/about", destination: "/", permanent: true },
      { source: "/about/resume", destination: "/resume", permanent: true },
      { source: "/about/resume/:path*", destination: "/resume", permanent: true },
      { source: "/portfolio", destination: "/", permanent: true },
      { source: "/portfolio/:path*", destination: "/", permanent: true },

      { source: "/tags", destination: "/posts", permanent: true },
      { source: "/tags/:path*", destination: "/posts", permanent: true },
      { source: "/categories", destination: "/posts", permanent: true },
      { source: "/categories/:path*", destination: "/posts", permanent: true },
      { source: "/series", destination: "/posts", permanent: true },
      { source: "/series/:path*", destination: "/posts", permanent: true },
      { source: "/topics", destination: "/posts", permanent: true },
      { source: "/topics/:path*", destination: "/posts", permanent: true },
      { source: "/authors", destination: "/", permanent: true },
      { source: "/authors/:path*", destination: "/", permanent: true },

      { source: "/page/:path*", destination: "/posts", permanent: true },
      { source: "/2022", destination: "/posts", permanent: true },
      { source: "/2022/:path*", destination: "/posts", permanent: true },
      { source: "/2023", destination: "/posts", permanent: true },
      { source: "/2023/:path*", destination: "/posts", permanent: true },
      { source: "/2024", destination: "/posts", permanent: true },
      { source: "/2024/:path*", destination: "/posts", permanent: true },

      { source: "/index.xml", destination: "/", permanent: true },
      { source: "/posts/index.xml", destination: "/posts", permanent: true },
    ];
  },
};

export default nextConfig;
