import type { Metadata } from "next";
import Img from "@/components/Img";
import { IconCalendar, IconFlower, IconRepeat } from "@/components/Icons";
import SubscriptionBuilder from "@/components/SubscriptionBuilder";

export const metadata: Metadata = {
  title: "Flower Subscriptions — Weekly Fresh Flowers in Kalispell",
  description: "Seasonal flowers delivered weekly, every two weeks or monthly in Kalispell and the Flathead Valley. Save up to 10%. Pause or cancel anytime.",
  alternates: { canonical: "/subscriptions/" },
};

const how = [
  { icon: IconFlower, title: "Pick your size", text: "From a petite posy for the kitchen counter to a lavish Estate arrangement for the entryway." },
  { icon: IconRepeat, title: "Choose your rhythm", text: "Weekly, every two weeks or monthly. The more often, the more you save — up to 10%." },
  { icon: IconCalendar, title: "Enjoy, on repeat", text: "Each delivery features the season's best stems, designed fresh. Pause or skip anytime." },
];

export default function SubscriptionsPage() {
  return (
    <>
      <section className="image-hero" style={{ minHeight: "min(64vh, 620px)" }}>
        <Img id="1468327768560-75b778cbb551" alt="" ratio={0.6} sizes="100vw" priority />
        <div className="container stack" style={{ maxWidth: 1360 }}>
          <span className="eyebrow">Flower subscriptions</span>
          <h1 className="display" style={{ maxWidth: 900 }}>
            A standing date <em>with beauty.</em>
          </h1>
          <p className="lede">Seasonal arrangements delivered to your door — or someone you love — on a schedule that suits you.</p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="promise-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {how.map(({ icon: Icon, title, text }, i) => (
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

      <section className="section bg-paper" id="build">
        <div className="container">
          <SubscriptionBuilder />
        </div>
      </section>
    </>
  );
}
