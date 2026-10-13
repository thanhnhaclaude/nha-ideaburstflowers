// Node.js build only (see next.config.mjs). Same URL as the PHP endpoint so the UI works on both targets.
import { createCheckout } from "@/server/checkout";
import { handler } from "@/server/http";

export const dynamic = "force-dynamic";
export const POST = handler(createCheckout);
