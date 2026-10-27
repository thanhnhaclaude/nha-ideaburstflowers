// Unsplash CDN helper. Replace ids with your own photography by swapping
// `image` values in src/data/catalog.json for paths under /public/images.
export function imgUrl(id: string, w: number, h?: number, crop = "entropy") {
  if (id.startsWith("/")) return id;
  const q = new URLSearchParams({ auto: "format", fit: "crop", w: String(w), q: "75", crop });
  if (h) q.set("h", String(h));
  return `https://images.unsplash.com/photo-${id}?${q}`;
}

