import { useEffect, useState } from "react";
import { delivery, type Zone } from "./catalog";

export function findZone(zip: string): Zone | undefined {
  const z = zip.trim().slice(0, 5);
  return delivery.zones.find((zone) => zone.zips.includes(z));
}

/** Current date/hour in the shop's timezone (America/Denver). */
function shopNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: delivery.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return { date: `${get("year")}-${get("month")}-${get("day")}`, hour: Number(get("hour")) };
}

function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Earliest deliverable date (ISO) for a zone, honoring the same-day cutoff. */
export function earliestDate(zone?: Zone) {
  const now = shopNow();
  const sameDayOk = (zone?.sameDay ?? true) && now.hour < delivery.cutoffHour;
  return sameDayOk ? now.date : addDays(now.date, 1);
}

export const maxDate = () => addDays(shopNow().date, 90);
export const isSameDayOpen = () => shopNow().hour < delivery.cutoffHour;

export function prettyDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** True after hydration — date bounds depend on the viewer's clock, so render them client-side only. */
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
