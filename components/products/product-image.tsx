"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

const OPTIMIZED_HOST = "cdn.dummyjson.com";

function isOptimizable(src: string): boolean {
  try {
    return new URL(src).hostname === OPTIMIZED_HOST;
  } catch {
    return false;
  }
}

export function ProductImage({ src, alt, sizes, priority = false, className = "" }: ProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={alt ? `${alt} (image unavailable)` : "Image unavailable"}
        className="absolute inset-0 grid place-items-center bg-surface-muted text-4xl text-muted"
      >
        <span aria-hidden="true">🛍️</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={!isOptimizable(src)}
      onError={() => setFailedSrc(src)}
      className={`object-contain ${className}`}
    />
  );
}
