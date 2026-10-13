import type { Metadata } from "next";
import { IconClock, IconMail, IconPhone, IconPin } from "@/components/Icons";
import InquiryForm from "@/components/InquiryForm";
import { site } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Contact Us — 24/7 Hotline",
  description: `Visit IdeaBurst Flowers at ${site.address.street}, Kalispell, MT, call our 24/7 hotline ${site.phone}, or send us a message.`,
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  const a = site.address;
  const mapQuery = encodeURIComponent(`${a.street}, ${a.city}, ${a.region} ${a.postal}`);
  return (
    <>
      <section className="page-hero">
        <div className="container stack">
          <span className="eyebrow">Contact</span>
          <h1 className="h1">
            We&rsquo;d love to <em>hear from you</em>
          </h1>
          <p className="lede">Questions about an order, a custom design, or a corporate account? A real person replies — usually within a few hours.</p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <span className="ic">
                <IconPhone />
              </span>
              <h2 className="h4">Call or text</h2>
              <a href={`tel:${site.phoneHref}`} className="h4" style={{ fontFamily: "var(--font-sans)", fontSize: "1.125rem", fontWeight: 500 }}>
                {site.phone}
              </a>
              <p className="muted small">24/7 hotline for orders and urgent deliveries.</p>
            </div>
            <div className="info-card">
              <span className="ic">
                <IconMail />
              </span>
              <h2 className="h4">Email</h2>
              <a href={`mailto:${site.email}`} style={{ fontWeight: 500, wordBreak: "break-all" }}>
                {site.email}
              </a>
              <p className="muted small">We reply within a few hours during studio hours.</p>
            </div>
            <div className="info-card">
              <span className="ic">
                <IconPin />
              </span>
              <h2 className="h4">Visit the studio</h2>
              <address style={{ fontStyle: "normal", fontWeight: 500 }}>
                {a.street}
                <br />
                {a.city}, {a.region} {a.postal}
              </address>
              <a className="muted small" href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                Get directions
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container split" style={{ alignItems: "start" }}>
          <div className="stack">
            <h2 className="h2">
              Send a <em>message</em>
            </h2>
            <div className="stack" style={{ gap: 12 }}>
              <p className="row" style={{ fontWeight: 600 }}>
                <IconClock width={20} height={20} /> Studio hours
              </p>
              {site.hours.map((h) => (
                <div key={h.days} className="summary-row" style={{ maxWidth: 380 }}>
                  <span className="muted">{h.days}</span>
                  <span>
                    {h.open} – {h.close}
                  </span>
                </div>
              ))}
            </div>
            <iframe
              className="map-frame mt-5"
              title="Map showing IdeaBurst Flowers in Kalispell, Montana"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            />
          </div>
          <InquiryForm kind="contact" />
        </div>
      </section>
    </>
  );
}
