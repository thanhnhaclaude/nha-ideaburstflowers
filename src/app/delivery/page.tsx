import type { Metadata } from "next";
import Link from "next/link";
import { IconArrow } from "@/components/Icons";
import ZipChecker from "@/components/ZipChecker";
import { delivery } from "@/lib/catalog";
import { money } from "@/lib/format";

export const metadata: Metadata = {
  title: "Delivery Area & How to Order — Kalispell & Flathead Valley",
  description: "Free same-day flower delivery in Kalispell, MT. Flat-rate delivery to Whitefish, Columbia Falls, Bigfork, Somers, Lakeside and the Glacier area. Order by 2 PM.",
  alternates: { canonical: "/delivery/" },
};

const towns: Record<string, string> = {
  "59901": "Kalispell", "59903": "Kalispell", "59904": "Kalispell",
  "59937": "Whitefish", "59912": "Columbia Falls", "59911": "Bigfork", "59932": "Somers", "59922": "Lakeside", "59920": "Kila",
  "59936": "West Glacier", "59919": "Hungry Horse", "59926": "Martin City", "59913": "Coram", "59925": "Marion", "59860": "Polson", "59929": "Proctor", "59916": "Essex",
};

const steps = [
  { title: "Choose your flowers", text: "Browse the collection, add any extras, and check that we deliver to the recipient's ZIP code." },
  { title: "Add delivery details", text: "Pick a date, write your card message, and pay securely with card, Apple Pay or Google Pay." },
  { title: "Approve & relax", text: "We confirm your delivery window, send a photo of the finished arrangement, and deliver it fresh." },
];

export default function DeliveryPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container zip-band">
          <div className="stack">
            <span className="eyebrow">Delivery</span>
            <h1 className="h1">
              Same-day, <em>by hand.</em>
            </h1>
            <p className="lede">Order before {delivery.cutoffHour - 12} PM Mountain Time for same-day delivery. Free throughout Kalispell; flat rates across the Flathead Valley.</p>
          </div>
          <ZipChecker />
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="info-grid">
            {delivery.zones.map((z) => (
              <div key={z.name} className="info-card">
                <span className="eyebrow no-rule">{z.sameDay ? "Same-day available" : "Next-day & scheduled"}</span>
                <h2 className="h3">{z.name}</h2>
                <p className="h4" style={{ fontFamily: "var(--font-sans)", fontSize: "1.25rem", fontWeight: 500 }}>
                  {z.fee === 0 ? "Free delivery" : `${money(z.fee)} flat rate`}
                </p>
                <p className="muted small">{z.zips.map((zip) => `${towns[zip] ?? ""} ${zip}`.trim()).join(" · ")}</p>
              </div>
            ))}
          </div>
          <p className="muted small mt-5">
            Outside our area? Call our 24/7 hotline — we can often arrange delivery anywhere in the US through a trusted partner florist.
          </p>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container">
          <div className="section-head">
            <div className="stack">
              <span className="eyebrow">How to order</span>
              <h2 className="h2">
                Three simple <em>steps</em>
              </h2>
            </div>
            <Link href="/shop/" className="btn">
              Start shopping <IconArrow />
            </Link>
          </div>
          <div className="steps">
            {steps.map((s) => (
              <div key={s.title} className="step reveal">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
