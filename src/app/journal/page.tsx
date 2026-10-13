import type { Metadata } from "next";
import Link from "next/link";
import Img from "@/components/Img";
import { articles } from "@/data/content";

export const metadata: Metadata = {
  title: "The Journal — Flower Care, Meaning & Inspiration",
  description: "Flower care rituals, orchid guides, gifting etiquette and seasonal inspiration from the IdeaBurst Flowers studio in Kalispell, Montana.",
  alternates: { canonical: "/journal/" },
};

const fmt = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export default function JournalPage() {
  const [lead, ...rest] = articles;
  return (
    <>
      <section className="page-hero">
        <div className="container stack">
          <span className="eyebrow">The Journal</span>
          <h1 className="h1">
            Notes from <em>the studio</em>
          </h1>
          <p className="lede">Care rituals, flower meanings and seasonal inspiration — written by our designers.</p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <article className="j-card split" style={{ marginBottom: 80 }}>
            <div className="j-card-media" style={{ aspectRatio: "4 / 3" }}>
              <Img id={lead.image} alt="" ratio={0.75} sizes="(min-width: 960px) 50vw, 100vw" priority />
            </div>
            <div className="stack">
              <div className="j-meta">
                <span>{lead.category}</span>
                <time dateTime={lead.date}>{fmt(lead.date)}</time>
                <span>{lead.readMins} min read</span>
              </div>
              <h2 className="h2">
                <Link href={`/journal/${lead.slug}/`}>{lead.title}</Link>
              </h2>
              <p className="lede">{lead.excerpt}</p>
            </div>
          </article>
          <div className="journal-grid cols-3">
            {rest.map((a, i) => (
              <article key={a.slug} className="j-card reveal" style={{ ["--d" as string]: `${i * 80}ms` }}>
                <div className="j-card-media">
                  <Img id={a.image} alt="" ratio={0.667} sizes="(min-width: 1100px) 33vw, (min-width: 768px) 50vw, 100vw" />
                </div>
                <div className="j-meta">
                  <span>{a.category}</span>
                  <time dateTime={a.date}>{fmt(a.date)}</time>
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
    </>
  );
}
