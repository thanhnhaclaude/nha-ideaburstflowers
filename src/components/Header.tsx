"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/catalog";
import { useCart } from "./CartProvider";
import { IconBag, IconChevron, IconClose, IconMail, IconMenu, IconPhone, IconTruck } from "./Icons";
import Logo from "./Logo";
import { mainNav } from "./nav";

export default function Header() {
  const pathname = usePathname();
  const { count, openDrawer, ready } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen) closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      <div className="announce">
        <div className="container">
          <span className="hide-sm">
            <IconTruck width={16} height={16} /> Free same-day delivery in Kalispell
          </span>
          <span>
            Order by <strong>2 PM</strong> for same-day delivery<span className="hide-xs"> · <Link href="/delivery/">Check your ZIP</Link></span>
          </span>
          <a className="hide-sm" href={`tel:${site.phoneHref}`}>
            24/7 Hotline {site.phone}
          </a>
        </div>
      </div>

      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="container header-inner">
          <button
            ref={toggleRef}
            className="icon-btn menu-toggle"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <IconMenu />
          </button>

          <Logo />

          <nav className="nav-primary" aria-label="Primary">
            <ul role="list">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="nav-link" aria-current={isActive(item.href) ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <a className="header-phone" href={`tel:${site.phoneHref}`}>
              <IconPhone /> {site.phone}
            </a>
            <button className="icon-btn" onClick={openDrawer} aria-label={`Shopping bag, ${count} item${count === 1 ? "" : "s"}`}>
              <IconBag />
              {ready && count > 0 && (
                <span className="cart-count" aria-hidden="true">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`mobile-menu${menuOpen ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!menuOpen} inert={!menuOpen}>
        <div className="mobile-menu-top">
          <Logo onClick={() => setMenuOpen(false)} />
          <button ref={closeRef} className="icon-btn" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <IconClose />
          </button>
        </div>
        <nav aria-label="Mobile">
          <ul role="list">
            {[{ href: "/", label: "Home" }, ...mainNav, { href: "/contact/", label: "Contact" }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
                  {item.label} <IconChevron />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu-foot">
          <a className="row" href={`tel:${site.phoneHref}`}>
            <IconPhone width={18} height={18} /> {site.phone} · 24/7
          </a>
          <a className="row" href={`mailto:${site.email}`}>
            <IconMail width={18} height={18} /> {site.email}
          </a>
          <span className="small">
            {site.address.street}, {site.address.city}, {site.address.region} {site.address.postal}
          </span>
        </div>
      </div>
    </>
  );
}
