// Copies the catalog into public/api so the PHP checkout endpoint can
// validate prices server-side. The browser never decides what a customer pays.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(readFileSync(join(root, "src/data/catalog.json"), "utf8"));
const site = JSON.parse(readFileSync(join(root, "src/data/site.json"), "utf8"));

const out = join(root, "public/api/catalog.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ ...catalog, site: { name: site.name, url: site.url } }));
console.log(`catalog synced -> public/api/catalog.json (${catalog.products.length} products)`);
