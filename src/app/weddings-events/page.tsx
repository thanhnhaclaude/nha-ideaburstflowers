import type { Metadata } from "next";
import Img from "@/components/Img";
import { IconCheck } from "@/components/Icons";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Wedding & Event Florist — Kalispell, Whitefish & Flathead Lake",
  description: "Bespoke wedding flowers, corporate event florals and weekly office arrangements across Montana's Flathead Valley. Request a consultation with IdeaBurst Flowers.",
  alternates: { canonical: "/weddings-events/" },
};

const services = [
  {
    id: "weddings",
    title: "Weddings & elopements",
    text: "Bridal bouquets, boutonnières, ceremony arches and reception tablescapes — designed around your story, your palette and your venue.",
    image: "1523438885200-e635ba2c371e",
    items: ["Bridal & bridesmaid bouquets", "Ceremony arches & aisle florals", "Centerpieces & tablescapes", "Day-of setup & breakdown"],
  },
  {
    id: "corporate",
    title: "Corporate & weekly florals",
    text: "Lobby statements, reception desks and conference tables refreshed weekly. One invoice, no fuss, always fresh.",
    image: "1519225421980-715cb0215aed",
    items: ["Weekly lobby & reception florals", "Grand openings & launches", "Client gifting programs", "Net-30 corporate accounts"],
  },
  {
    id: "private",
    title: "Private celebrations",
    text: "Milestone birthdays, anniversaries, dinner parties and memorial gatherings — florals that make the room feel considered.",
    image: "1469371670807-013ccf25f16a",
    items: ["Dinner party tablescapes", "Milestone celebrations", "Memorial & sympathy tributes", "Holiday installations"],
  },
];

const steps = [
  { title: "Consultation", text: "A relaxed conversation — in our studio or by video — about your vision, venue, palette and budget." },
  { title: "Design proposal", text: "A mood board and detailed proposal with stem-by-stem recommendations. Refine it until it feels exactly right." },
  { title: "The day itself", text: "Our team delivers, installs and styles every arrangement, then returns to clear away when the celebration ends." },
];

export default function WeddingsPage() {
  return (
    <>
      <section className="image-hero">
        <Img id="1521543832500-49e69fb2bea2" alt="" ratio={0.6} sizes="100vw" priority crop="faces" />
        <div className="container stack">
          <span className="eyebrow">Weddings &amp; events</span>
          <h1 className="display" style={{ maxWidth: 960 }}>
            Florals that feel <em>entirely yours.</em>
          </h1>
          <p className="lede">From intimate elopements in Glacier to grand celebrations on Flathead Lake — bespoke design, flawless execution.</p>
          <div className="row mt-2">
            <a href="#inquire" className="btn btn-light">
              Request a consultation
            </a>
          </div>
        </div>
      </section>

      {services.map((s, i) => (
        <section key={s.id} id={s.id} className={`section${i % 2 ? " bg-paper" : ""}`}>
          <div className={`container split${i % 2 ? " reverse" : ""}`}>
            <div className="split-media reveal">
              <div className={`frame${i === 0 ? " arch" : ""}`}>
                <Img id={s.image} alt={s.title} ratio={1.25} sizes="(min-width: 960px) 45vw, calc(100vw - 32px)" />
              </div>
            </div>
            <div className="stack reveal">
              <span className="eyebrow">0{i + 1}</span>
              <h2 className="h2">{s.title}</h2>
              <p className="lede">{s.text}</p>
              <ul className="checklist" role="list">
                {s.items.map((t) => (
                  <li key={t}>
                    <IconCheck /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      <section className="section bg-moss">
        <div className="container">
          <div className="section-head">
            <div className="stack reveal">
              <span className="eyebrow">How we work</span>
              <h2 className="h2">
                Three steps to <em>your day in bloom</em>
              </h2>
            </div>
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

      <section className="section">
        <div className="container">
          <div className="mosaic">
            {[
              ["1519225421980-715cb0215aed", "Reception table lined with low floral arrangements"],
              ["1515934751635-c81c6bc9a2d8", "Wedding rings resting on blush roses"],
              ["1591886960571-74d43a9d4166", "A lush bouquet of garden roses and peonies"],
              ["1523438885200-e635ba2c371e", "A garden gazebo dressed with florals for a ceremony"],
              ["1582794543139-8ac9cb0f7b11", "Full pink garden roses"],
              ["1527061011665-3652c757a4d4", "A single blush peony"],
            ].map(([id, alt]) => (
              <figure key={id} className="reveal">
                <Img id={id} alt={alt} ratio={1} sizes="(min-width: 900px) 25vw, 50vw" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-paper" id="inquire">
        <div className="container split" style={{ alignItems: "start" }}>
          <div className="stack">
            <span className="eyebrow">Inquire</span>
            <h2 className="h2">
              Let&rsquo;s begin <em>planning</em>
            </h2>
            <p className="lede">Tell us a little about your event. We reply within one business day to schedule a complimentary consultation.</p>
            <p className="muted small">Popular summer dates book 6–12 months ahead. Weekly corporate florals can usually begin within a week.</p>
          </div>
          <InquiryForm kind="event" />
        </div>
      </section>
    </>
  );
}
