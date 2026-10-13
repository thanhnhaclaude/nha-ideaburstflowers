import type { Metadata } from "next";
import Link from "next/link";
import { IconPlus } from "@/components/Icons";
import { faqs } from "@/data/content";
import { site } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about same-day delivery, freshness guarantee, card messages, substitutions, subscriptions and payment at IdeaBurst Flowers.",
  alternates: { canonical: "/faq/" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="page-hero">
        <div className="container stack">
          <span className="eyebrow">Help</span>
          <h1 className="h1">
            Questions, <em>answered</em>
          </h1>
          <p className="lede">
            Can&rsquo;t find what you need? Call {site.phone} anytime or <Link href="/contact/" style={{ textDecoration: "underline" }}>send us a message</Link>.
          </p>
        </div>
      </section>
      <section className="section-sm">
        <div className="container-narrow">
          <div className="accordion faq">
            {faqs.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>
                  {f.q} <IconPlus />
                </summary>
                <div className="acc-body">
                  <p>{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
