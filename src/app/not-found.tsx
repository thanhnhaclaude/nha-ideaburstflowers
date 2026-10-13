import Link from "next/link";
import { IconArrow } from "@/components/Icons";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-narrow stack center" style={{ textAlign: "center" }}>
        <span className="eyebrow no-rule">404</span>
        <h1 className="h1">
          This page has <em>wilted.</em>
        </h1>
        <p className="lede">The page you&rsquo;re looking for may have moved. Let&rsquo;s get you back to something beautiful.</p>
        <div className="row" style={{ justifyContent: "center" }}>
          <Link href="/" className="btn">
            Back home <IconArrow />
          </Link>
          <Link href="/shop/" className="btn btn-outline">
            Shop flowers
          </Link>
        </div>
      </div>
    </section>
  );
}
