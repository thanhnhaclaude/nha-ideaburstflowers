"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/catalog";
import ProductCard from "./ProductCard";

const sorts = {
  featured: { label: "Featured", fn: () => 0 },
  "price-asc": { label: "Price: low to high", fn: (a: Product, b: Product) => a.price - b.price },
  "price-desc": { label: "Price: high to low", fn: (a: Product, b: Product) => b.price - a.price },
  sale: { label: "On sale first", fn: (a: Product, b: Product) => Number(!!b.compareAt) - Number(!!a.compareAt) },
} as const;

type SortKey = keyof typeof sorts;

export default function ShopGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>("featured");
  const list = useMemo(() => [...products].sort(sorts[sort].fn), [products, sort]);

  return (
    <>
      <div className="toolbar" style={{ marginBottom: 32 }}>
        <p className="small muted" aria-live="polite">
          {list.length} {list.length === 1 ? "design" : "designs"}
        </p>
        <label className="row small">
          <span className="muted">Sort by</span>
          <select className="select" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            {Object.entries(sorts).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="product-grid">
        {list.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i < 4} delay={(i % 4) * 60} />
        ))}
      </div>
    </>
  );
}
