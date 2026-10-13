import Link from "next/link";
import { categories } from "@/lib/catalog";

export default function CollectionNav({ active }: { active?: string }) {
  return (
    <nav aria-label="Collections" className="chip-row">
      <Link href="/shop/" className="chip" aria-current={!active ? "page" : undefined}>
        All flowers
      </Link>
      {categories.map((c) => (
        <Link key={c.slug} href={`/collections/${c.slug}/`} className="chip" aria-current={active === c.slug ? "page" : undefined}>
          {c.name}
        </Link>
      ))}
    </nav>
  );
}
