import Link from "next/link";
import { categories, site } from "@/lib/catalog";
import { IconMail, IconPhone, IconPin } from "./Icons";
import Logo from "./Logo";
import Newsletter from "./Newsletter";

const cols = [
  {
    title: "Shop",
    links: [{ href: "/shop/", label: "All Flowers" }, ...categories.slice(0, 5).map((c) => ({ href: `/collections/${c.slug}/`, label: c.name }))],
  },
  {
    title: "Services",
    links: [
      { href: "/subscriptions/", label: "Flower Subscriptions" },
      { href: "/weddings-events/", label: "Weddings & Events" },
      { href: "/weddings-events/#corporate", label: "Corporate Accounts" },
      { href: "/delivery/", label: "Delivery Area" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/faq/", label: "FAQ" },
      { href: "/reviews/write/", label: "Write a Review" },
      { href: "/delivery/", label: "How to Order" },
      { href: "/policies/returns/", label: "Freshness & Refunds" },
      { href: "/contact/", label: "Contact Us" },
    ],
  },
  {
    title: "Studio",
    links: [
      { href: "/about/", label: "Our Story" },
      { href: "/journal/", label: "Journal" },
      { href: "/policies/privacy/", label: "Privacy Policy" },
      { href: "/policies/terms/", label: "Terms of Service" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const socials = Object.entries(site.social).filter(([, url]) => url);
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <Newsletter />
            <div className="footer-contact small">
              <a className="row" href={`tel:${site.phoneHref}`}>
                <IconPhone width={16} height={16} /> 24/7 Hotline {site.phone}
              </a>
              <a className="row" href={`mailto:${site.email}`}>
                <IconMail width={16} height={16} /> {site.email}
              </a>
              <span className="row">
                <IconPin width={16} height={16} /> {site.address.street}, {site.address.city}, {site.address.region} {site.address.postal}
              </span>
              {socials.length > 0 && (
                <span className="row">
                  {socials.map(([name, url]) => (
                    <a key={name} href={url} target="_blank" rel="noopener noreferrer" style={{ textTransform: "capitalize", textDecoration: "underline", textUnderlineOffset: 3 }}>
                      {name}
                    </a>
                  ))}
                </span>
              )}
            </div>
          </div>
          <div className="footer-cols">
            {cols.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3>{col.title}</h3>
                <ul role="list">
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link href={l.href} prefetch={false}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {year} {site.legalName}. {site.registration}.
          </p>
          <div className="payment-icons" aria-label="Accepted payments">
            <span>VISA</span>
            <span>MC</span>
            <span>AMEX</span>
            <span>Apple Pay</span>
            <span>G Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
