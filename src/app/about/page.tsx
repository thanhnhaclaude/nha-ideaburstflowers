import type { Metadata } from "next";
import Link from "next/link";
import Img from "@/components/Img";
import { IconArrow, IconCamera, IconHeart, IconLeaf, IconSparkle } from "@/components/Icons";
import { site } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Our Story — A Modern Florist in Kalispell, Montana",
  description: "IdeaBurst Flowers is a modern florist in Kalispell, Montana, devoted to beautiful, fresh arrangements and impeccable service — with over 10,000 arrangements delivered.",
  alternates: { canonical: "/about/" },
};

const values = [
  { icon: IconLeaf, title: "Fresh, always", text: "We buy flowers every morning and condition each stem by hand, so every arrangement is guaranteed to stay fresh for three days or more." },
  { icon: IconCamera, title: "Radical transparency", text: "You see a photo of your finished arrangement before it leaves the studio. What you approve is exactly what arrives." },
  { icon: IconSparkle, title: "Design with intention", text: "Every bouquet is composed — not assembled. Balance, texture and movement matter as much as the blooms themselves." },
  { icon: IconHeart, title: "Service that cares", text: "A real person answers our 24/7 hotline. We confirm every delivery time and follow up until the flowers are in the right hands." },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container split" style={{ alignItems: "end" }}>
          <div className="stack">
            <span className="eyebrow">Our story</span>
            <h1 className="display">
              Beauty, delivered <em>with care.</em>
            </h1>
          </div>
          <p className="lede">
            IdeaBurst Flowers began with a simple belief: that beautiful, fresh flowers — and the joy they carry — should be easy to send and impossible to forget. From our studio on South Main Street in
            Kalispell, we design for the Flathead Valley&rsquo;s biggest moments and its quiet, everyday ones.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="split-media reveal">
            <div className="frame">
              <Img id="1487070183336-b863922373d4" alt="Buckets of fresh flowers on display in a flower shop" ratio={1.25} sizes="(min-width: 960px) 45vw, 100vw" priority />
            </div>
            <div className="inset">
              <Img id="1558603668-6570496b66f8" alt="A bright, airy corner of the studio with plants and woven textures" ratio={1} sizes="20vw" />
            </div>
          </div>
          <div className="stack reveal">
            <span className="eyebrow">The studio</span>
            <h2 className="h2">
              Over ten thousand arrangements, <em>each one personal.</em>
            </h2>
            <div className="prose">
              <p>
                We&rsquo;ve composed more than 10,000 arrangements — for grand openings and graduations, first dates and fiftieth anniversaries, hospital rooms and boardrooms. Each began the same way:
                with a conversation about the person receiving it.
              </p>
              <p>
                Our designers select stems at their peak, pair them with care, and finish every piece by hand. Then we photograph it, share it with you, and deliver it — on time, in the quantity and design
                you chose, and fresh for days to come.
              </p>
              <p>That commitment to quality and service is the whole idea behind IdeaBurst: a sudden burst of beauty, arriving exactly when it matters.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-moss">
        <div className="container">
          <div className="stats">
            {[
              [site.stats.arrangements, "Arrangements delivered"],
              [site.stats.freshness, "Freshness guarantee"],
              ["7 days", "Open every day of the week"],
              ["24/7", "Hotline for urgent orders"],
            ].map(([n, l]) => (
              <div key={l} className="stat reveal">
                <strong>{n}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="stack reveal">
              <span className="eyebrow">What we believe</span>
              <h2 className="h2">
                Four promises, <em>every order</em>
              </h2>
            </div>
          </div>
          <div className="promise-grid">
            {values.map(({ icon: Icon, title, text }, i) => (
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

      <section className="section-sm bg-blush">
        <div className="container stack center" style={{ textAlign: "center" }}>
          <h2 className="h2">
            Come say hello at <em>1001 S Main St.</em>
          </h2>
          <p className="lede">Open Monday–Saturday 8 AM–9 PM and Sunday 8 AM–10 PM.</p>
          <div className="row" style={{ justifyContent: "center" }}>
            <Link href="/contact/" className="btn">
              Visit the studio <IconArrow />
            </Link>
            <Link href="/shop/" className="btn btn-outline">
              Shop online
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
