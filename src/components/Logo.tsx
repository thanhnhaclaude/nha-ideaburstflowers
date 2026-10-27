import Link from "next/link";

export default function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" prefetch={false} className="logo" aria-label="IdeaBurst Flowers — home" onClick={onClick}>
      <span className="logo-mark">
        Idea<em>Burst</em>
      </span>
      <span className="logo-sub">Flowers · Montana</span>
    </Link>
  );
}
