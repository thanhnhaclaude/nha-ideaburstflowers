// Two deployment targets from one codebase:
//  - default (`npm run build`): Node.js server — Hostinger "Node.js Web App" deploys.
//    Checkout & forms run as Next.js route handlers (src/app/api/*/route.server.ts).
//  - STATIC_EXPORT=1 (`npm run build:static`): plain HTML in out/ + PHP endpoints from
//    hosting/static/ — any shared hosting via FTP (see .github/workflows/deploy.yml).
const isStatic = process.env.STATIC_EXPORT === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isStatic ? { output: "export" } : {}),
  // Route handlers use the `.server.ts` extension so the static export ignores them.
  pageExtensions: isStatic ? ["tsx", "ts"] : ["server.ts", "tsx", "ts"],
  // /shop/ -> /shop/index.html so Apache serves clean URLs without rewrites.
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
