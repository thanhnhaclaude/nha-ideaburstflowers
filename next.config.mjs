/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — runs on any Hostinger plan (Premium/Single included).
  output: "export",
  // /shop/ -> /shop/index.html so Apache serves clean URLs without rewrites.
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
