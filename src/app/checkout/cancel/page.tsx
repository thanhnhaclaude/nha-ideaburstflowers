import type { Metadata } from "next";
import Link from "next/link";
import { IconArrow } from "@/components/Icons";
import { site } from "@/lib/catalog";

export const metadata: Metadata = { title: "Checkout Cancelled", robots: { index: false } };

export default function CancelPage() {
  return (
    <section className="section">
      <div className="container-narrow stack center">
        <span className="eyebrow no-rule">Checkout cancelled</span>
        <h1 className="h1">
          No worries — <em>your bag is saved.</em>
        </h1>
        <p className="lede">
          Nothing was charged. Pick up right where you left off, or call us at {site.phone} and we&rsquo;ll take your order by phone.
        </p>
        <div className="row" style={{ justifyContent: "center" }}>
          <Link href="/cart/" className="btn">
            Return to bag <IconArrow />
          </Link>
          <Link href="/shop/" className="btn btn-outline">
            Keep browsing
          </Link>
        </div>
      </div>
    </section>
  );
}
