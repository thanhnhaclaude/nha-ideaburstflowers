import type { Testimonial } from "@/data/content";
import Stars from "./Stars";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export default function ReviewCard({ review, delay = 0 }: { review: Testimonial; delay?: number }) {
  const rating = review.rating ?? 5;
  return (
    <figure className="quote-card reveal" style={{ ["--d" as string]: `${delay}ms` }}>
      <div className="quote-top">
        <Stars label={`${rating} out of 5 stars`} count={rating} />
        {review.source && <span className="quote-source">via {review.source}</span>}
      </div>
      <blockquote>&ldquo;{review.quote}&rdquo;</blockquote>
      <figcaption>
        {review.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="avatar avatar-photo" src={review.photo} alt="" width={56} height={56} loading="lazy" decoding="async" />
        ) : (
          <span className="avatar" aria-hidden="true">
            {initials(review.name)}
          </span>
        )}
        <span>
          <strong>{review.name}</strong>
          <span>
            {review.role}
            {review.occasion && ` · ${review.occasion}`}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
