import type { Metadata } from "next";
import CartView from "@/components/CartView";

export const metadata: Metadata = {
  title: "Your Bag & Delivery Details",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <section className="page-hero" style={{ paddingBottom: 40 }}>
        <div className="container stack">
          <span className="eyebrow">Checkout</span>
          <h1 className="h1">
            Your <em>bag</em>
          </h1>
        </div>
      </section>
      <section className="section-sm">
        <div className="container">
          <CartView />
        </div>
      </section>
    </>
  );
}
