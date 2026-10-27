import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BuyBox from "@/components/BuyBox";
import { IconPlus } from "@/components/Icons";
import Img from "@/components/Img";
import ProductCard from "@/components/ProductCard";
import { getCategory, getProduct, products, related, site } from "@/lib/catalog";
import { money } from "@/lib/format";
import { imgUrl } from "@/lib/img";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${money(p.price)}`,
    description: `${p.short} Hand-crafted in Kalispell, MT. Same-day delivery before 2 PM.`,
    alternates: { canonical: `/product/${p.id}/` },
    openGraph: { images: [{ url: imgUrl(p.image, 1200, 630, p.imageCrop), width: 1200, height: 630 }] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const cat = getCategory(p.category)!;
  const onSale = !!p.compareAt && p.compareAt > p.price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.sku,
    description: p.description,
    image: imgUrl(p.image, 1200, 1500, p.imageCrop),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${site.url}/product/${p.id}/`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container" style={{ paddingTop: 24 }}>
        <nav aria-label="Breadcrumb">
          <ol className="breadcrumb" role="list">
            <li>
              <Link href="/" prefetch={false}>Home</Link>
            </li>
            <li>
              <Link href={`/collections/${cat.slug}/`}>{cat.name}</Link>
            </li>
            <li aria-current="page">{p.name}</li>
          </ol>
        </nav>
      </div>

      <div className="container pdp">
        <div className="pdp-gallery">
          <figure>
            <Img id={p.image} crop={p.imageCrop} alt={`${p.name}: ${p.short}`} ratio={1.25} sizes="(min-width: 1000px) 55vw, calc(100vw - 32px)" priority />
          </figure>
          <figure>
            <Img id={p.image} crop="top" alt={`${p.name}, detail of the blooms`} ratio={1} sizes="(min-width: 1000px) 27vw, 50vw" />
          </figure>
          <figure>
            <Img id={p.image} crop="bottom" alt={`${p.name}, detail of the arrangement`} ratio={1} sizes="(min-width: 1000px) 27vw, 50vw" />
          </figure>
        </div>

        <div className="pdp-info">
          <div className="stack" style={{ gap: 12 }}>
            <span className="eyebrow no-rule">
              {cat.name} · SKU {p.sku}
            </span>
            <h1 className="h1" style={{ fontSize: "clamp(2.4rem, 1.8rem + 2vw, 3.5rem)" }}>
              {p.name}
            </h1>
            <p className="pdp-price">
              <span style={onSale ? { color: "var(--rose)" } : undefined}>{money(p.price)}</span>
              {onSale && (
                <>
                  <s>
                    <span className="sr-only">Was </span>
                    {money(p.compareAt!)}
                  </s>
                  <span className="save">Save {money(p.compareAt! - p.price)}</span>
                </>
              )}
            </p>
            <p className="lede" style={{ fontSize: "1.0625rem" }}>
              {p.description}
            </p>
          </div>

          <BuyBox product={p} />

          <div className="accordion">
            <details open>
              <summary>
                What&rsquo;s included <IconPlus />
              </summary>
              <div className="acc-body">
                <ul>
                  {p.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            </details>
            <details>
              <summary>
                Delivery &amp; timing <IconPlus />
              </summary>
              <div className="acc-body">
                <p>
                  Order before 2 PM Mountain Time for same-day delivery in Kalispell and most of the Flathead Valley. Free delivery within Kalispell city limits. You&rsquo;ll choose your delivery date and card
                  message at checkout.{" "}
                  <Link href="/delivery/" style={{ textDecoration: "underline" }}>
                    Delivery details
                  </Link>
                </p>
              </div>
            </details>
            <details>
              <summary>
                Freshness promise &amp; substitutions <IconPlus />
              </summary>
              <div className="acc-body">
                <p>
                  Every arrangement is guaranteed fresh for at least 3 days. We buy flowers each morning; if a bloom is unavailable we substitute one of equal or greater value in the same palette — and
                  you&rsquo;ll see it in your pre-delivery photo.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>

      <section className="section bg-paper">
        <div className="container">
          <div className="section-head">
            <div className="stack">
              <span className="eyebrow">You may also love</span>
              <h2 className="h2">
                More from <em>the studio</em>
              </h2>
            </div>
          </div>
          <div className="product-grid">
            {related(p).map((r, i) => (
              <ProductCard key={r.id} product={r} delay={i * 60} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
