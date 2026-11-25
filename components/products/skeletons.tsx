const pulse = "animate-pulse rounded-md bg-surface-muted";

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface" aria-hidden="true">
      <div className={`aspect-square rounded-none ${pulse}`} />
      <div className="space-y-3 p-4">
        <div className={`h-3 w-1/3 ${pulse}`} />
        <div className={`h-4 w-5/6 ${pulse}`} />
        <div className="flex justify-between pt-2">
          <div className={`h-5 w-16 ${pulse}`} />
          <div className={`h-4 w-20 ${pulse}`} />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading products">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {Array.from({ length: count }, (_, i) => (
          <li key={i}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]" aria-hidden="true">
        <div className={`h-11 ${pulse}`} />
        <div className={`h-11 sm:w-44 ${pulse}`} />
        <div className={`h-11 sm:w-48 ${pulse}`} />
      </div>
      <ProductGridSkeleton />
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div role="status" aria-label="Loading product" className="grid gap-8 md:grid-cols-2">
      <div className={`aspect-square rounded-2xl ${pulse}`} />
      <div className="space-y-4" aria-hidden="true">
        <div className={`h-4 w-24 ${pulse}`} />
        <div className={`h-8 w-3/4 ${pulse}`} />
        <div className={`h-5 w-32 ${pulse}`} />
        <div className={`h-10 w-28 ${pulse}`} />
        <div className={`h-24 w-full ${pulse}`} />
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div role="status" aria-label="Loading form" className="space-y-5 rounded-2xl border border-border bg-surface p-6">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="space-y-2" aria-hidden="true">
          <div className={`h-4 w-24 ${pulse}`} />
          <div className={`h-11 w-full ${pulse}`} />
        </div>
      ))}
    </div>
  );
}
