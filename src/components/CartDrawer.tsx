"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { money } from "@/lib/format";
import { useCart } from "./CartProvider";
import { IconArrow, IconBag, IconCheck, IconClose, IconLock, IconTruck } from "./Icons";
import LineItem from "./LineItem";

export default function CartDrawer() {
  const { lines, subtotal, drawerOpen, closeDrawer, toast } = useCart();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => closeDrawer(), [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (drawerOpen) {
      lastFocus.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => closeRef.current?.focus());
    } else {
      document.body.style.overflow = "";
      lastFocus.current?.focus?.();
    }
    const onKey = (e: KeyboardEvent) => {
      if (!drawerOpen) return;
      if (e.key === "Escape") closeDrawer();
      // Simple focus trap.
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  return (
    <>
      <div className={`drawer-backdrop${drawerOpen ? " is-open" : ""}`} onClick={closeDrawer} aria-hidden="true" />
      <div
        ref={panelRef}
        className={`drawer${drawerOpen ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
      >
        <div className="drawer-head">
          <h2 id="drawer-title">Your Bag</h2>
          <button ref={closeRef} className="icon-btn" aria-label="Close bag" onClick={closeDrawer}>
            <IconClose />
          </button>
        </div>

        {lines.length > 0 && (
          <div className="free-ship">
            <span className="row">
              <IconTruck width={18} height={18} /> Free delivery within Kalispell city limits · same day before 2 PM
            </span>
          </div>
        )}

        <div className="drawer-body">
          {lines.length === 0 ? (
            <div className="empty-state">
              <IconBag />
              <p className="h4">Your bag is empty</p>
              <p className="muted small">Let&rsquo;s find something beautiful.</p>
              <Link href="/shop/" className="btn btn-outline btn-sm" onClick={closeDrawer}>
                Shop all flowers
              </Link>
            </div>
          ) : (
            <ul role="list">
              {lines.map((l) => (
                <LineItem key={l.key} line={l} onNavigate={closeDrawer} />
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="drawer-foot">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{money(subtotal)}</strong>
            </div>
            <p className="small muted">Delivery date, card message and recipient details on the next step.</p>
            <Link href="/cart/" className="btn btn-block" onClick={closeDrawer}>
              Continue to delivery <IconArrow />
            </Link>
            <p className="secure-note">
              <IconLock /> Secure checkout powered by Stripe
            </p>
          </div>
        )}
      </div>

      <div className={`toast${toast ? " is-on" : ""}`} role="status" aria-live="polite">
        {toast && (
          <>
            <IconCheck /> {toast}
          </>
        )}
      </div>
    </>
  );
}
