import type { MetadataRoute } from "next";
import { articles } from "@/data/content";
import { categories, products, site } from "@/lib/catalog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "shop", "subscriptions", "weddings-events", "journal", "about", "contact", "delivery", "faq", "reviews/write", "policies/returns", "policies/privacy", "policies/terms"];
  return [
    ...pages.map((p) => ({ url: `${site.url}/${p ? p + "/" : ""}`, lastModified: now, priority: p ? 0.7 : 1 })),
    ...categories.map((c) => ({ url: `${site.url}/collections/${c.slug}/`, lastModified: now, priority: 0.8 })),
    ...products.map((p) => ({ url: `${site.url}/product/${p.id}/`, lastModified: now, priority: 0.8 })),
    ...articles.map((a) => ({ url: `${site.url}/journal/${a.slug}/`, lastModified: new Date(a.date), priority: 0.6 })),
  ];
}
