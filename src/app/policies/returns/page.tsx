import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";
import { site } from "@/lib/catalog";

export const metadata: Metadata = { title: "Freshness Guarantee & Refund Policy", alternates: { canonical: "/policies/returns/" } };

export default function ReturnsPolicy() {
  return (
    <PolicyPage title="Freshness Guarantee & Refunds" updated="October 13, 2026">
      <p>Flowers are perishable, so instead of returns we offer a simple promise: if you&rsquo;re not delighted, we&rsquo;ll make it right.</p>
      <h2>Our 3-day freshness guarantee</h2>
      <p>
        Every arrangement is guaranteed to stay fresh for at least three days from delivery when cared for as directed. If it doesn&rsquo;t, contact us within three days with a photo and we will send a
        replacement arrangement of equal value or issue a refund — your choice.
      </p>
      <h2>Order accuracy</h2>
      <p>We send a photo of every arrangement before delivery. If the delivered arrangement doesn&rsquo;t match the approved photo, or the quantity is incorrect, we&rsquo;ll redeliver or refund in full.</p>
      <h2>Late or missed deliveries</h2>
      <p>
        If we miss your confirmed delivery date for reasons within our control, we&rsquo;ll refund the delivery fee and offer a full refund or redelivery. We are not responsible for failed deliveries caused by an
        incorrect address supplied at checkout or a recipient who refuses delivery, but we&rsquo;ll always do our best to help.
      </p>
      <h2>Cancellations &amp; changes</h2>
      <ul>
        <li>Orders can be cancelled for a full refund up to 24 hours before the scheduled delivery date.</li>
        <li>Same-day orders can be changed or cancelled until design begins — call us as soon as possible.</li>
        <li>Event and wedding orders follow the terms in your signed proposal.</li>
      </ul>
      <h2>Subscriptions</h2>
      <p>Subscriptions can be paused, skipped or cancelled anytime by emailing or calling us at least 48 hours before your next delivery. Charges already processed for a delivery that has been designed are non-refundable.</p>
      <h2>How refunds are issued</h2>
      <p>Approved refunds are returned to the original payment method through Stripe and typically appear within 5–10 business days.</p>
      <h2>Contact</h2>
      <p>
        Call {site.phone} (24/7) or email <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </PolicyPage>
  );
}
