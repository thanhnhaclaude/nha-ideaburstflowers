import Link from "next/link";
import Img from "@/components/Img";
import { IconArrow, IconCamera, IconCheck, IconClock, IconLeaf, IconTruck } from "@/components/Icons";
import ProductCard from "@/components/ProductCard";
import Stars from "@/components/Stars";
import ZipChecker from "@/components/ZipChecker";
import { articles, testimonials } from "@/data/content";
import { categories, getProduct, plans, productsIn, site } from "@/lib/catalog";
import { money } from "@/lib/format";

const bestSellerIds = ["grand-opening-v338", "orchid-tp003", "birthday-tp001", "blush-peony-cloud", "grand-opening-v268", "classic-red-roses", "orchid-tp002", "flathead-morning"];

const promises = [
  { icon: IconCamera, title: "A photo before delivery", text: "See your finished arrangement before it leaves the studio — no surprises, only delight." },
  { icon: IconClock, title: "On time, every time", text: "We confirm your delivery window after ordering and text you when the flowers arrive." },
  { icon: IconLeaf, title: "Fresh for 3+ days, guaranteed", text: "Blooms are bought fresh each morning and conditioned by hand. If they fade early, we replace them." },
  { icon: IconTruck, title: "Free delivery in Kalispell", text: "Same-day before 2 PM across Kalispell, with low flat rates throughout the Flathead Valley." },
];

const marquee = ["Hand-crafted in Kalispell", "Same-day delivery", "Photo before every delivery", "Fresh for 3+ days", "Weddings & events", "Weekly subscriptions"];

export default function Home() {
  const best = bestSellerIds.map(getProduct).filter((p) => !!p);
  const signature = plans.find((p) => p.featured)!;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Kalispell · Montana · Est. 2026</span>
            <h1 className="display">
              Flowers, composed <em>like poetry.</em>
            </h1>
            <p className="lede">
              Hand-crafted bouquets, orchids and statement arrangements — designed each morning in our Kalispell studio and delivered across the Flathead Valley, often within hours.
            </p>
            <div className="hero-actions">
              <Link href="/shop/" className="btn">
                Shop the collection <IconArrow />
              </Link>
              <Link href="/weddings-events/" className="btn btn-outline">
                Weddings &amp; events
              </Link>
            </div>
            <div className="hero-meta">
              <div>
                <strong>{site.stats.arrangements}</strong>
                <span>Arrangements delivered</span>
              </div>
              <div>
                <strong>2 PM</strong>
                <span>Same-day order cutoff</span>
              </div>
              <div>
                <strong>{site.stats.freshness}</strong>
                <span>Freshness guarantee</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-img-main">
              <Img id="1487530811176-3780de880c2d" alt="A florist holding a lush, freshly gathered bouquet of garden roses and wildflowers" ratio={1.25} sizes="(min-width: 960px) 45vw, 100vw" priority />
            </div>
            <div className="hero-img-small">
              <Img id="1567696153798-9111f9cd3d0d" alt="A wrapped bouquet being handed over at delivery" ratio={1.33} sizes="20vw" priority />
            </div>
            <div className="hero-badge" aria-hidden="true">
              <svg className="ring" viewBox="0 0 100 100">
                <defs>
                  <path id="circle" d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
                </defs>
                <text>
                  <textPath href="#circle">Hand-crafted · Delivered fresh · </textPath>
                </text>
              </svg>
              <span className="core">IB</span>
            </div>
            <div className="hero-card">
              <span className="ic">
                <IconCamera />
              </span>
              <span>
                <strong>See it before they do</strong>
                <span>A photo of every arrangement, before delivery.</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Marquee ---------- */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i} className="marquee-item">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* ---------- Shop by occasion ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="stack reveal">
              <span className="eyebrow">Shop by occasion</span>
              <h2 className="h2">
                For every moment <em>worth marking</em>
              </h2>
            </div>
            <Link href="/shop/" className="link reveal">
              View all flowers <IconArrow />
            </Link>
          </div>
          <div className="cat-grid">
            {categories.map((c, i) => (
              <Link key={c.slug} href={`/collections/${c.slug}/`} className="cat-tile reveal" style={{ ["--d" as string]: `${i * 60}ms` }}>
                <Img id={c.image} alt="" ratio={i === 0 ? 1.1 : 1} sizes={i === 0 ? "(min-width: 900px) 50vw, 50vw" : "(min-width: 900px) 25vw, 50vw"} />
                <div className="cat-tile-body">
                  <div>
                    <h3>{c.name}</h3>
                    <span className="count">{productsIn(c.slug).length} designs</span>
                  </div>
                  <span className="cat-arrow" aria-hidden="true">
                    <IconArrow />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Best sellers ---------- */}
      <section className="section bg-paper">
        <div className="container">
          <div className="section-head">
            <div className="stack reveal">
              <span className="eyebrow">Most loved</span>
              <h2 className="h2">
                The studio&rsquo;s <em>best sellers</em>
              </h2>
              <p className="lede">Our most-requested designs — each one hand-tied to order and photographed before it leaves.</p>
            </div>
            <Link href="/shop/" className="btn btn-outline reveal">
              Shop all <IconArrow />
            </Link>
          </div>
          <div className="product-grid">
            {best.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={(i % 4) * 70} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Promise ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="stack reveal">
              <span className="eyebrow">The IdeaBurst promise</span>
              <h2 className="h2">
                Thoughtful from <em>stem to doorstep</em>
              </h2>
            </div>
          </div>
          <div className="promise-grid">
            {promises.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="promise reveal" style={{ ["--d" as string]: `${i * 80}ms` }}>
                <span className="ic">
                  <Icon />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Weddings teaser ---------- */}
      <section className="section bg-paper">
        <div className="container split">
          <div className="split-media reveal">
            <div className="frame arch">
              <Img id="1521543832500-49e69fb2bea2" alt="A bride holding a romantic bouquet of red and blush roses" ratio={1.25} sizes="(min-width: 960px) 45vw, 100vw" />
            </div>
            <div className="inset">
              <Img id="1519225421980-715cb0215aed" alt="A long reception table dressed with low floral arrangements" ratio={1} sizes="20vw" />
            </div>
          </div>
          <div className="stack reveal">
            <span className="eyebrow">Weddings &amp; events</span>
            <h2 className="h2">
              Your day, <em>in bloom</em>
            </h2>
            <p className="lede">
              From an intimate elopement at Glacier to a two-hundred-guest celebration on Flathead Lake, our design team creates florals that feel entirely your own.
            </p>
            <ul className="checklist" role="list">
              {["Personal design consultation and mood board", "Bridal bouquets, ceremony arches and reception tablescapes", "Corporate events, galas and weekly office florals", "Full setup and breakdown on the day"].map((t) => (
                <li key={t}>
                  <IconCheck /> {t}
                </li>
              ))}
            </ul>
            <div className="row mt-2">
              <Link href="/weddings-events/" className="btn">
                Plan your event <IconArrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Subscriptions ---------- */}
      <section className="section bg-moss">
        <div className="container split reverse">
          <div className="split-media reveal">
            <div className="frame">
              <Img id="1468327768560-75b778cbb551" alt="Pink and white tulips against a soft blue sky" ratio={1.25} sizes="(min-width: 960px) 45vw, 100vw" />
            </div>
          </div>
          <div className="stack reveal">
            <span className="eyebrow">Flower subscriptions</span>
            <h2 className="h2">
              Fresh flowers, <em>on repeat</em>
            </h2>
            <p className="lede">
              A new seasonal arrangement delivered weekly, every two weeks, or monthly. Save up to 10%, never pay for local delivery, and pause or cancel anytime.
            </p>
            <ul className="checklist" role="list">
              <li>
                <IconCheck /> Designer&rsquo;s choice of the season&rsquo;s most beautiful stems
              </li>
              <li>
                <IconCheck /> Keepsake vase with your first Signature delivery
              </li>
              <li>
                <IconCheck /> Plans from {money(plans[0].price)} per delivery — Signature {money(signature.price)}
              </li>
            </ul>
            <div className="row mt-2">
              <Link href="/subscriptions/" className="btn btn-light">
                Start a subscription <IconArrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="stack reveal">
              <span className="eyebrow">Kind words</span>
              <h2 className="h2">
                Loved by the people <em>we deliver to</em>
              </h2>
            </div>
          </div>
          <div className="quote-grid">
            {testimonials.slice(0, 3).map((t, i) => (
              <figure key={t.name} className="quote-card reveal" style={{ ["--d" as string]: `${i * 80}ms` }}>
                <Stars />
                <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption>
                  <span className="avatar" aria-hidden="true">
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Journal ---------- */}
      <section className="section bg-paper">
        <div className="container">
          <div className="section-head">
            <div className="stack reveal">
              <span className="eyebrow">The Journal</span>
              <h2 className="h2">
                Notes from <em>the studio</em>
              </h2>
            </div>
            <Link href="/journal/" className="link reveal">
              Read the journal <IconArrow />
            </Link>
          </div>
          <div className="journal-grid cols-3">
            {articles.slice(0, 3).map((a, i) => (
              <article key={a.slug} className="j-card reveal" style={{ ["--d" as string]: `${i * 80}ms` }}>
                <div className="j-card-media">
                  <Img id={a.image} alt="" ratio={0.667} sizes="(min-width: 1100px) 33vw, (min-width: 768px) 50vw, 100vw" />
                </div>
                <div className="j-meta">
                  <span>{a.category}</span>
                  <span>{a.readMins} min read</span>
                </div>
                <h3>
                  <Link href={`/journal/${a.slug}/`}>{a.title}</Link>
                </h3>
                <p>{a.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ZIP checker ---------- */}
      <section className="section-sm">
        <div className="container zip-band">
          <div className="stack reveal">
            <span className="eyebrow">Delivery</span>
            <h2 className="h2">
              Do we deliver <em>to you?</em>
            </h2>
            <p className="lede">Free in Kalispell, same day before 2 PM. Flat rates throughout the Flathead Valley.</p>
          </div>
          <div className="reveal">
            <ZipChecker />
          </div>
        </div>
      </section>
    </>
  );
}
