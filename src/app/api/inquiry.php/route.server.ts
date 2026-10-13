// Node.js build only (see next.config.mjs). Same URL as the PHP endpoint so the UI works on both targets.
import { handler } from "@/server/http";
import { sendInquiry } from "@/server/inquiry";

export const dynamic = "force-dynamic";
export const POST = handler(sendInquiry);
