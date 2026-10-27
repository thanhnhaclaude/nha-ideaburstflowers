import Image from "next/image";
import { imgUrl } from "@/lib/img";

type Props = {
  id: string;
  alt: string;
  /** height / width, e.g. 1.25 for 4:5 */
  ratio?: number;
  sizes?: string;
  priority?: boolean;
  /** Load immediately but let the browser pick the priority (for images that are above the fold only on some screens). */
  eager?: boolean;
  crop?: string;
  className?: string;
};

/**
 * Responsive, CLS-safe image. Reserves space via width/height attributes.
 * Node build: served from our own domain through the Next.js image optimizer (AVIF/WebP).
 * Static build: src/lib/img-loader.ts points the srcset straight at the Unsplash CDN.
 */
export default function Img({ id, alt, ratio = 1.25, sizes = "(min-width: 1024px) 25vw, 50vw", priority, eager, crop, className }: Props) {
  return (
    <Image
      src={imgUrl(id, 1920, Math.round(1920 * ratio), crop)}
      sizes={sizes}
      width={960}
      height={Math.round(960 * ratio)}
      alt={alt}
      loading={priority || eager ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      className={className}
    />
  );
}
