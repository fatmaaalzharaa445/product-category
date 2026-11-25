"use client";

import { useState } from "react";
import { ProductImage } from "./product-image";

export function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [selected, setSelected] = useState(0);
  const current = images[Math.min(selected, images.length - 1)] ?? "";

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface">
        <ProductImage
          key={current}
          src={current}
          alt={title}
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
          className="animate-fade-up p-6"
        />
      </div>
      {images.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1" aria-label="Product images">
          {images.map((src, index) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => setSelected(index)}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-pressed={index === selected}
                className={`relative block size-16 overflow-hidden rounded-lg border-2 bg-surface transition-colors sm:size-20 ${
                  index === selected ? "border-accent" : "border-border hover:border-muted"
                }`}
              >
                <ProductImage src={src} alt="" sizes="80px" className="p-1" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
