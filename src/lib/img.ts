// Unsplash CDN helper. Replace ids with your own photography by swapping
// `image` values in src/data/catalog.json for paths under /public/images.
const WIDTHS = [400, 480, 640, 720, 960, 1280, 1920];

export function imgUrl(id: string, w: number, h?: number, crop = "entropy") {
  if (id.startsWith("/")) return id;
  const q = new URLSearchParams({ auto: "format", fit: "crop", w: String(w), q: "75", crop });
  if (h) q.set("h", String(h));
  return `https://images.unsplash.com/photo-${id}?${q}`;
}

export function imgSrcSet(id: string, ratio?: number, crop?: string) {
  if (id.startsWith("/")) return undefined;
  return WIDTHS.map((w) => `${imgUrl(id, w, ratio ? Math.round(w * ratio) : undefined, crop)} ${w}w`).join(", ");
}
