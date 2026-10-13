import type { Metadata } from "next";
import CollectionNav from "@/components/CollectionNav";
import ShopGrid from "@/components/ShopGrid";
import { products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop All Flowers",
  description: "Shop luxury bouquets, orchids and grand opening arrangements from IdeaBurst Flowers in Kalispell, MT. Free same-day delivery in Kalispell.",
  alternates: { canonical: "/shop/" },
};

export default function ShopPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container stack">
          <span className="eyebrow">The collection</span>
          <h1 className="h1">
            Shop all <em>flowers</em>
          </h1>
          <p className="lede">Every design is hand-crafted to order in our Kalispell studio, photographed before it leaves, and guaranteed fresh for three days or more.</p>
          <CollectionNav />
        </div>
      </section>
      <section className="section-sm">
        <div className="container">
          <ShopGrid products={products} />
        </div>
      </section>
    </>
  );
}
