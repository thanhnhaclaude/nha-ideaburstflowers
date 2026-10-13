// Static build for FTP/shared hosting: next build (export) -> copy PHP endpoints,
// .htaccess and the price catalog into out/ -> flatten RSC payloads.
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = join(root, "out");

const res = spawnSync("npx", ["next", "build"], { cwd: root, stdio: "inherit", shell: true, env: { ...process.env, STATIC_EXPORT: "1" } });
if (res.status !== 0) process.exit(res.status ?? 1);

cpSync(join(root, "hosting/static"), out, { recursive: true });

// The PHP checkout validates prices against this copy of the catalog.
const catalog = JSON.parse(readFileSync(join(root, "src/data/catalog.json"), "utf8"));
const site = JSON.parse(readFileSync(join(root, "src/data/site.json"), "utf8"));
mkdirSync(join(out, "api"), { recursive: true });
writeFileSync(join(out, "api/catalog.json"), JSON.stringify({ ...catalog, site: { name: site.name, url: site.url } }));
console.log(`copied hosting/static + catalog (${catalog.products.length} products) into out/`);

await import("./flatten-rsc.mjs");
