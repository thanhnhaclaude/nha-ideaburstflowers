import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectionNav from "@/components/CollectionNav";
import ShopGrid from "@/components/ShopGrid";
import { categories, getCategory, productsIn } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCategory((await params).slug);
  if (!c) return {};
  return {
    title: `${c.name} Flowers — Kalispell Delivery`,
    description: `${c.tagline} Same-day delivery in Kalispell and the Flathead Valley.`,
    alternates: { canonical: `/collections/${c.slug}/` },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) notFound();
  return (
    <>
      <section className="page-hero">
        <div className="container stack">
          <span className="eyebrow">Collection</span>
          <h1 className="h1">
            {c.name} <em>flowers</em>
          </h1>
          <p className="lede">{c.tagline}</p>
          <CollectionNav active={c.slug} />
        </div>
      </section>
      <section className="section-sm">
        <div className="container">
          <ShopGrid products={productsIn(c.slug)} />
        </div>
      </section>
    </>
  );
}
