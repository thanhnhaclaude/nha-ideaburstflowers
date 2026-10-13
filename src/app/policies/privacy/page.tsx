import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";
import { site } from "@/lib/catalog";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/policies/privacy/" } };

export default function PrivacyPolicy() {
  return (
    <PolicyPage title="Privacy Policy" updated="October 13, 2026">
      <p>
        {site.legalName} (&ldquo;IdeaBurst Flowers&rdquo;, &ldquo;we&rdquo;) respects your privacy. This policy explains what we collect when you visit {site.url.replace("https://", "")} or place an order, and how we
        use it.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Order details:</strong> your name, email, phone, billing information and the recipient&rsquo;s name, address and phone, plus your card message and delivery instructions.
        </li>
        <li>
          <strong>Payment information:</strong> processed securely by Stripe, Inc. We never see or store your full card number.
        </li>
        <li>
          <strong>Messages:</strong> details you submit through our contact, event inquiry or newsletter forms.
        </li>
        <li>
          <strong>Browser storage:</strong> your shopping bag is saved in your own browser (localStorage) so it survives a page refresh. It is not sent to us until you check out.
        </li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To design, deliver and confirm your order, including sending a photo before delivery.</li>
        <li>To respond to your inquiries and provide customer service.</li>
        <li>To send our newsletter, only if you subscribe. Every email includes an unsubscribe link.</li>
      </ul>
      <h2>Sharing</h2>
      <p>
        We do not sell your personal information. We share it only with service providers who help us operate — Stripe for payments, our web host, and, when you request delivery outside our area, a partner
        florist — and when required by law.
      </p>
      <h2>Retention &amp; your rights</h2>
      <p>We keep order records as required for tax and accounting purposes. You may request access to, correction of, or deletion of your personal information at any time by contacting us.</p>
      <h2>Children</h2>
      <p>Our site is not directed to children under 13, and we do not knowingly collect their information.</p>
      <h2>Contact</h2>
      <p>
        {site.legalName}, {site.address.street}, {site.address.city}, {site.address.region} {site.address.postal} · <a href={`mailto:${site.email}`}>{site.email}</a> · {site.phone}
      </p>
    </PolicyPage>
  );
}
