// next/image loader for the static export (no image optimizer there):
// resize Unsplash URLs on their CDN, keeping the requested aspect ratio.
export default function unsplashLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("https://images.unsplash.com/")) return src;
  const url = new URL(src);
  const w = Number(url.searchParams.get("w")), h = Number(url.searchParams.get("h"));
  url.searchParams.set("w", String(width));
  if (w && h) url.searchParams.set("h", String(Math.round((width * h) / w)));
  url.searchParams.set("q", String(quality || 75));
  return url.toString();
}
