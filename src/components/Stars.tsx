import { IconStar } from "./Icons";

export default function Stars({ label, count = 5 }: { label?: string; count?: number }) {
  return (
    <span className="stars" role="img" aria-label={label ?? `${count} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <IconStar key={i} className={i < count ? undefined : "off"} />
      ))}
    </span>
  );
}
