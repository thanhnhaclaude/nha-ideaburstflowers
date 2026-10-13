"use client";

import { useEffect } from "react";
import { useCart } from "@/components/CartProvider";

export default function ClearCart() {
  const { clear, ready, setDelivery } = useCart();
  useEffect(() => {
    if (ready) {
      clear();
      setDelivery({ date: "", recipient: "", message: "", from: "", instructions: "" });
    }
  }, [ready, clear, setDelivery]);
  return null;
}
