interface StarRatingProps {
  rating: number;
  className?: string;
}

export function StarRating({ rating, className = "" }: StarRatingProps) {
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${className}`}>
      <span className="relative inline-block leading-none tracking-tight" aria-hidden="true">
        <span className="text-border">★★★★★</span>
        <span className="absolute inset-0 overflow-hidden text-star" style={{ width: `${percent}%` }}>
          ★★★★★
        </span>
      </span>
      <span className="text-muted">
        <span className="sr-only">Rated </span>
        {rating.toFixed(1)}
        <span className="sr-only"> out of 5</span>
      </span>
    </span>
  );
}
