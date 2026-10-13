import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "@/components/PolicyPage";
import { site } from "@/lib/catalog";

export const metadata: Metadata = { title: "Terms of Service", alternates: { canonical: "/policies/terms/" } };

export default function Terms() {
  return (
    <PolicyPage title="Terms of Service" updated="October 13, 2026">
      <p>
        These terms govern purchases from {site.legalName}, a Montana limited liability company ({site.registration}). By placing an order you agree to them.
      </p>
      <h2>Products &amp; substitutions</h2>
      <p>
        Each arrangement is hand-crafted, so no two are identical. Photos are representative. When a flower or container is unavailable we may substitute items of equal or greater value in a similar style and
        color palette; you will see the final arrangement in your pre-delivery photo.
      </p>
      <h2>Pricing &amp; payment</h2>
      <p>Prices are in US dollars. Applicable sales tax and delivery fees are shown before payment. Payment is collected at checkout through Stripe.</p>
      <h2>Delivery</h2>
      <p>
        Same-day delivery is available for orders placed before 2:00 PM Mountain Time within eligible areas. Delivery windows are estimates and may be affected by weather, road conditions or events beyond our
        control. See our <Link href="/delivery/">delivery information</Link>.
      </p>
      <h2>Subscriptions</h2>
      <p>
        Subscriptions renew automatically at the chosen frequency until you cancel. You authorize us to charge your payment method each cycle. Cancel anytime by contacting us at least 48 hours before the next
        delivery.
      </p>
      <h2>Guarantee &amp; refunds</h2>
      <p>
        Our freshness guarantee and refund terms are described in our <Link href="/policies/returns/">Freshness &amp; Refunds policy</Link>.
      </p>
      <h2>Limitation of liability</h2>
      <p>To the extent permitted by law, our liability for any order is limited to the amount paid for that order.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the State of Montana.</p>
      <h2>Contact</h2>
      <p>
        <a href={`mailto:${site.email}`}>{site.email}</a> · {site.phone}
      </p>
    </PolicyPage>
  );
}
