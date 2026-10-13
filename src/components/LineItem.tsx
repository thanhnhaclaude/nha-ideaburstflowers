"use client";

import Link from "next/link";
import { addons as allAddons, getProduct } from "@/lib/catalog";
import { money } from "@/lib/format";
import { lineUnitPrice, useCart, type CartLine } from "./CartProvider";
import { IconMinus, IconPlus } from "./Icons";
import Img from "./Img";

export default function LineItem({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  const { setQty, remove } = useCart();
  const p = getProduct(line.id);
  if (!p) return null;
  const extras = line.addons.map((a) => allAddons.find((x) => x.id === a)?.name).filter(Boolean);

  return (
    <li className="line-item">
      <Link href={`/product/${p.id}/`} className="thumb" onClick={onNavigate} tabIndex={-1} aria-hidden="true">
        <Img id={p.image} alt="" sizes="88px" crop={p.imageCrop} />
      </Link>
      <div className="li-body">
        <div className="li-top">
          <Link href={`/product/${p.id}/`} className="li-name" onClick={onNavigate}>
            {p.name}
          </Link>
          <span className="small">{money(lineUnitPrice(line) * line.qty)}</span>
        </div>
        <span className="li-meta">SKU {p.sku}</span>
        {extras.length > 0 && <span className="li-meta">With: {extras.join(", ")}</span>}
        <div className="li-actions">
          <div className="qty sm" role="group" aria-label={`Quantity for ${p.name}`}>
            <button type="button" aria-label="Decrease quantity" onClick={() => setQty(line.key, line.qty - 1)}>
              <IconMinus />
            </button>
            <output aria-live="polite">{line.qty}</output>
            <button type="button" aria-label="Increase quantity" onClick={() => setQty(line.key, line.qty + 1)}>
              <IconPlus />
            </button>
          </div>
          <button type="button" className="remove-btn" onClick={() => remove(line.key)}>
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
