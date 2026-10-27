// Two deployment targets from one codebase:
//  - default (`npm run build`): Node.js server — Hostinger "Node.js Web App" deploys.
//    Checkout & forms run as Next.js route handlers (src/app/api/*/route.server.ts).
//  - STATIC_EXPORT=1 (`npm run build:static`): plain HTML in out/ + PHP endpoints from
//    hosting/static/ — any shared hosting via FTP (see .github/workflows/deploy.yml).
//    There, hosting/static/.htaccess provides the headers/redirects below.
const isStatic = process.env.STATIC_EXPORT === "1";
const CANONICAL_HOST = "ideaburstflowers.com";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isStatic
    ? { output: "export" }
    : {
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        },
        async redirects() {
          // www -> apex in a single hop (keep the trailing slash so trailingSlash doesn't add a second redirect).
          const www = [{ type: "host", value: `www.${CANONICAL_HOST}` }];
          return [
            { source: "/", has: www, destination: `https://${CANONICAL_HOST}/`, permanent: true },
            { source: "/:path+/", has: www, destination: `https://${CANONICAL_HOST}/:path+/`, permanent: true },
            { source: "/:path+", has: www, destination: `https://${CANONICAL_HOST}/:path+`, permanent: true },
          ];
        },
      }),
  // Route handlers use the `.server.ts` extension so the static export ignores them.
  pageExtensions: isStatic ? ["tsx", "ts"] : ["server.ts", "tsx", "ts"],
  // /shop/ -> /shop/index.html so Apache serves clean URLs without rewrites.
  trailingSlash: true,
  images: {
    // Phones get 480–720px files, desktops up to 1920px.
    deviceSizes: [400, 480, 640, 720, 960, 1280, 1920],
    ...(isStatic
      ? { loader: "custom", loaderFile: "./src/lib/img-loader.ts" }
      : {
          remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
          formats: ["image/avif", "image/webp"],
          // Unsplash photos never change for a given URL; keep optimized copies for a year.
          minimumCacheTTL: 31536000,
        }),
  },
  poweredByHeader: false,
};

export default nextConfig;
