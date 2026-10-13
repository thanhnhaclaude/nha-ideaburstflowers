"use client";

import { useCart } from "./CartProvider";
import { IconPlus } from "./Icons";

export default function QuickAdd({ id, name }: { id: string; name: string }) {
  const { add } = useCart();
  return (
    <button type="button" className="btn btn-light btn-sm btn-block" onClick={() => add(id)} aria-label={`Quick add ${name} to bag`} style={{ position: "relative", zIndex: 3 }}>
      <IconPlus /> Quick add
    </button>
  );
}
