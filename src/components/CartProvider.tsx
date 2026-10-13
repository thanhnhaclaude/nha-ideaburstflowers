"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { addons as allAddons, getProduct } from "@/lib/catalog";

export type CartLine = { key: string; id: string; qty: number; addons: string[] };
export type DeliveryInfo = { zip: string; date: string; recipient: string; message: string; from: string; instructions: string };

type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  delivery: DeliveryInfo;
  ready: boolean;
  add: (id: string, qty?: number, addons?: string[]) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  setDelivery: (patch: Partial<DeliveryInfo>) => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toast: string | null;
};

const STORAGE_KEY = "ib-cart-v1";
const emptyDelivery: DeliveryInfo = { zip: "", date: "", recipient: "", message: "", from: "", instructions: "" };

const Ctx = createContext<CartCtx | null>(null);

export function lineUnitPrice(line: Pick<CartLine, "id" | "addons">) {
  const p = getProduct(line.id);
  if (!p) return 0;
  const extra = line.addons.reduce((s, a) => s + (allAddons.find((x) => x.id === a)?.price ?? 0), 0);
  return p.price + extra;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [delivery, setDeliveryState] = useState<DeliveryInfo>(emptyDelivery);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Hydrate from localStorage (per-viewer convenience; never authoritative).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setLines((parsed.lines ?? []).filter((l: CartLine) => getProduct(l.id)));
        setDeliveryState({ ...emptyDelivery, ...(parsed.delivery ?? {}) });
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines, delivery }));
    } catch {}
  }, [lines, delivery, ready]);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const add = useCallback(
    (id: string, qty = 1, addons: string[] = []) => {
      const sorted = [...addons].sort();
      const key = [id, ...sorted].join("|");
      setLines((prev) => {
        const hit = prev.find((l) => l.key === key);
        if (hit) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(20, l.qty + qty) } : l));
        return [...prev, { key, id, qty, addons: sorted }];
      });
      const p = getProduct(id);
      flash(`${p?.name ?? "Item"} added to your bag`);
      setDrawerOpen(true);
    },
    [flash]
  );

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(20, qty) } : l))));
  }, []);

  const remove = useCallback((key: string) => setLines((prev) => prev.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);
  const setDelivery = useCallback((patch: Partial<DeliveryInfo>) => setDeliveryState((d) => ({ ...d, ...patch })), []);

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const subtotal = lines.reduce((s, l) => s + lineUnitPrice(l) * l.qty, 0);
    return {
      lines,
      count,
      subtotal,
      delivery,
      ready,
      add,
      setQty,
      remove,
      clear,
      setDelivery,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      toast,
    };
  }, [lines, delivery, ready, add, setQty, remove, clear, setDelivery, drawerOpen, toast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
