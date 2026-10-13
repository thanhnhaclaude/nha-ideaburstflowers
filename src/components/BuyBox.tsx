"use client";

import { useState } from "react";
import { addons, type Product } from "@/lib/catalog";
import { money } from "@/lib/format";
import { useCart } from "./CartProvider";
import { IconBag, IconCamera, IconLeaf, IconMinus, IconPlus, IconTruck } from "./Icons";
import ZipChecker from "./ZipChecker";

export default function BuyBox({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [chosen, setChosen] = useState<string[]>([]);
  const extra = chosen.reduce((s, id) => s + (addons.find((a) => a.id === id)?.price ?? 0), 0);
  const total = (product.price + extra) * qty;

  const toggle = (id: string) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  return (
    <>
      <div className="pdp-block">
        <span className="label">Check delivery</span>
        <ZipChecker compact />
      </div>

      <div className="pdp-block" role="group" aria-labelledby="addons-label">
        <span className="label" id="addons-label">
          Make it extra special
        </span>
        <div className="addon-list">
          {addons.map((a) => (
            <label key={a.id} className="check">
              <input type="checkbox" checked={chosen.includes(a.id)} onChange={() => toggle(a.id)} />
              <span className="check-body">
                <span className="check-title">
                  <span>{a.name}</span>
                  <span>+{money(a.price)}</span>
                </span>
                <span className="check-desc">{a.description}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="pdp-block">
        <div className="buy-row">
          <div className="qty" role="group" aria-label="Quantity">
            <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              <IconMinus />
            </button>
            <output aria-live="polite">{qty}</output>
            <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(20, q + 1))}>
              <IconPlus />
            </button>
          </div>
          <button type="button" className="btn btn-rose" onClick={() => add(product.id, qty, chosen)}>
            <IconBag /> Add to bag · {money(total)}
          </button>
        </div>
        <div className="trust-row mt-2">
          <div>
            <IconTruck /> Same-day before 2 PM
          </div>
          <div>
            <IconCamera /> Photo before delivery
          </div>
          <div>
            <IconLeaf /> Fresh 3+ days, guaranteed
          </div>
        </div>
      </div>
    </>
  );
}
