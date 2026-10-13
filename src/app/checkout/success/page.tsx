import type { Metadata } from "next";
import Link from "next/link";
import { IconArrow, IconCamera, IconCheck, IconClock, IconMail } from "@/components/Icons";
import { site } from "@/lib/catalog";
import ClearCart from "./ClearCart";

export const metadata: Metadata = { title: "Thank You — Order Confirmed", robots: { index: false } };

export default function SuccessPage() {
  return (
    <section className="section">
      <ClearCart />
      <div className="container-narrow stack center">
        <span className="promise">
          <span className="ic" style={{ margin: "0 auto", background: "var(--sage)", borderColor: "var(--sage)" }}>
            <IconCheck />
          </span>
        </span>
        <span className="eyebrow no-rule">Order confirmed</span>
        <h1 className="h1">
          Thank you — <em>it&rsquo;s in good hands.</em>
        </h1>
        <p className="lede">A receipt is on its way to your inbox. Here&rsquo;s what happens next:</p>
        <ul className="checklist" role="list" style={{ textAlign: "left", maxWidth: 520 }}>
          <li>
            <IconMail /> We&rsquo;ll email to confirm your delivery window.
          </li>
          <li>
            <IconCamera /> You&rsquo;ll receive a photo of the finished arrangement before it leaves the studio.
          </li>
          <li>
            <IconClock /> Questions? Our 24/7 hotline is {site.phone}.
          </li>
        </ul>
        <div className="row mt-5" style={{ justifyContent: "center" }}>
          <Link href="/shop/" className="btn">
            Continue shopping <IconArrow />
          </Link>
          <Link href="/reviews/write/" className="btn btn-outline">
            Review us later
          </Link>
        </div>
      </div>
    </section>
  );
}
