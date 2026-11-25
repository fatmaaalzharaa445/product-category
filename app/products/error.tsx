"use client";

import { useEffect } from "react";
import { getErrorMessage } from "@/lib/api/errors";
import { ErrorPanel } from "@/components/products/status-panels";

export default function ProductsError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-6">
      <ErrorPanel message={getErrorMessage(error)} onRetry={retry} />
    </div>
  );
}
