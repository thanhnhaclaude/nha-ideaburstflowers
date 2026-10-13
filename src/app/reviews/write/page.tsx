import type { Metadata } from "next";
import { IconCheck } from "@/components/Icons";
import ReviewForm from "@/components/ReviewForm";
import { site } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Write a Review",
  description: "Tell us about your IdeaBurst Flowers order. Every review is read by our studio team.",
  alternates: { canonical: "/reviews/write/" },
};

export default function WriteReviewPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container stack">
          <span className="eyebrow">Reviews</span>
          <h1 className="h1">
            How did we <em>do?</em>
          </h1>
          <p className="lede">Your honest words help neighbors across the Flathead Valley choose with confidence — and help our designers keep getting better.</p>
        </div>
      </section>
      <section className="section-sm">
        <div className="container split" style={{ alignItems: "start" }}>
          <div className="stack">
            <h2 className="h3">Our review promise</h2>
            <ul className="checklist" role="list">
              <li>
                <IconCheck /> We publish reviews word-for-word — we never edit their meaning.</li>
              <li>
                <IconCheck /> We show positive and critical reviews alike.</li>
              <li>
                <IconCheck /> We never pay for or reward reviews.</li>
              <li>
                <IconCheck /> Your email and full name stay private.</li>
            </ul>
            <p className="muted small">
              Had a problem with an order? Please call {site.phone} first — we&rsquo;ll make it right under our freshness guarantee.
            </p>
          </div>
          <ReviewForm />
        </div>
      </section>
    </>
  );
}
