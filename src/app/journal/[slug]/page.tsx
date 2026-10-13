import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrow } from "@/components/Icons";
import Img from "@/components/Img";
import { articles } from "@/data/content";
import { site } from "@/lib/catalog";
import { imgUrl } from "@/lib/img";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => articles.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `/journal/${a.slug}/` },
    openGraph: { type: "article", publishedTime: a.date, images: [{ url: imgUrl(a.image, 1200, 630), width: 1200, height: 630 }] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();
  const more = articles.filter((x) => x.slug !== a.slug).slice(0, 2);
  const date = new Date(`${a.date}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.excerpt,
    datePublished: a.date,
    image: imgUrl(a.image, 1200, 800),
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="page-hero center" style={{ textAlign: "center", borderBottom: 0 }}>
        <div className="container stack center">
          <div className="j-meta" style={{ justifyContent: "center" }}>
            <Link href="/journal/">Journal</Link>
            <span>{a.category}</span>
            <time dateTime={a.date}>{date}</time>
            <span>{a.readMins} min read</span>
          </div>
          <h1 className="h1" style={{ maxWidth: 900 }}>
            {a.title}
          </h1>
          <p className="lede">{a.excerpt}</p>
        </div>
      </header>
      <div className="container" style={{ maxWidth: 1200 }}>
        <div style={{ aspectRatio: "16 / 9", overflow: "hidden", borderRadius: "var(--radius)", background: "var(--sage)" }}>
          <Img id={a.image} alt="" ratio={0.5625} sizes="(min-width: 1200px) 1200px, 100vw" priority />
        </div>
      </div>
      <div className="container-narrow section-sm">
        <div className="prose" style={{ marginInline: "auto" }}>
          {a.body.map((b, i) => (
            <div key={i}>
              {b.h && <h2>{b.h}</h2>}
              {b.p && <p style={b.h ? { marginTop: "0.75em" } : undefined}>{b.p}</p>}
              {b.list && (
                <ul style={{ marginTop: "0.75em" }}>
                  {b.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="row mt-7" style={{ justifyContent: "center" }}>
          <Link href="/shop/" className="btn">
            Shop the collection <IconArrow />
          </Link>
        </div>
      </div>
      <section className="section bg-paper">
        <div className="container">
          <h2 className="h3" style={{ marginBottom: 32 }}>
            Keep reading
          </h2>
          <div className="journal-grid">
            {more.map((m) => (
              <article key={m.slug} className="j-card">
                <div className="j-card-media">
                  <Img id={m.image} alt="" ratio={0.667} sizes="(min-width: 768px) 50vw, 100vw" />
                </div>
                <div className="j-meta">
                  <span>{m.category}</span>
                  <span>{m.readMins} min read</span>
                </div>
                <h3>
                  <Link href={`/journal/${m.slug}/`}>{m.title}</Link>
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
