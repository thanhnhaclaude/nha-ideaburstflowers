import Link from "next/link";
import { getCategory, type Product } from "@/lib/catalog";
import { money } from "@/lib/format";
import Img from "./Img";
import QuickAdd from "./QuickAdd";

export default function ProductCard({ product, priority, delay = 0 }: { product: Product; priority?: boolean; delay?: number }) {
  const onSale = !!product.compareAt && product.compareAt > product.price;
  const pct = onSale ? Math.round((1 - product.price / product.compareAt!) * 100) : 0;
  return (
    <article className="p-card reveal" style={{ ["--d" as string]: `${delay}ms` }}>
      <div className="p-card-media">
        <div className="p-badges">
          {product.badge && <span className="p-badge">{product.badge}</span>}
          {onSale && <span className="p-badge sale">−{pct}%</span>}
        </div>
        <Img id={product.image} crop={product.imageCrop} alt={`${product.name} — ${product.short}`} priority={priority} sizes="(min-width: 1024px) 25vw, 50vw" />
        <div className="p-quick">
          <QuickAdd id={product.id} name={product.name} />
        </div>
      </div>
      <div className="p-card-body">
        <span className="p-card-cat">{getCategory(product.category)?.name}</span>
        <h3 className="p-card-title">
          <Link href={`/product/${product.id}/`}>{product.name}</Link>
        </h3>
        <p className="price">
          <span className={`now${onSale ? " on-sale" : ""}`}>{money(product.price)}</span>
          {onSale && (
            <s>
              <span className="sr-only">Was </span>
              {money(product.compareAt!)}
            </s>
          )}
        </p>
      </div>
    </article>
  );
}
