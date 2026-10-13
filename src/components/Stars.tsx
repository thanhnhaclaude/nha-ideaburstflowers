import { IconStar } from "./Icons";

export default function Stars({ label = "5 out of 5 stars" }: { label?: string }) {
  return (
    <span className="stars" role="img" aria-label={label}>
      {[0, 1, 2, 3, 4].map((i) => (
        <IconStar key={i} />
      ))}
    </span>
  );
}
