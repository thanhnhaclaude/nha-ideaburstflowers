// Next.js 16 static export writes segment prefetch payloads as nested folders
// (e.g. shop/__next.shop/__PAGE__.txt) while the client router requests the
// flattened name (shop/__next.shop.__PAGE__.txt). Plain static hosts like
// Hostinger can't rewrite that, so we emit a flattened copy of each file.
import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const out = fileURLToPath(new URL("../out", import.meta.url));
let count = 0;

function files(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? files(p) : [p];
  });
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      for (const f of files(p)) {
        const flat = join(dir, `${name}.${relative(p, f).split(sep).join(".")}`);
        copyFileSync(f, flat);
        count++;
      }
    } else if (name !== "_next") {
      walk(p);
    }
  }
}

if (!existsSync(out)) {
  console.log("flatten-rsc: no out/ directory (not a static export) — skipped");
} else {
  walk(out);
  console.log(`flattened ${count} RSC segment payloads`);
}
