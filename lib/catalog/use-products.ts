"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api/products";
import { getErrorMessage } from "@/lib/api/errors";
import { applyOverlay, useCatalogOverlay } from "@/lib/store/catalog-store";
import type { Product } from "@/lib/types";

export type ProductsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; products: Product[] };

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: Product[] };

let cached: Promise<Product[]> | null = null;

function loadProducts(): Promise<Product[]> {
  cached ??= fetchProducts().catch((error: unknown) => {
    cached = null;
    throw error;
  });
  return cached;
}

export function useProducts(): ProductsState & { retry: () => void } {
  const overlay = useCatalogOverlay();
  const [state, setState] = useState<FetchState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    loadProducts().then(
      (data) => {
        if (active) setState({ status: "success", data });
      },
      (error: unknown) => {
        if (active) setState({ status: "error", message: getErrorMessage(error) });
      },
    );
    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  }, []);

  if (state.status === "error") return { ...state, retry };
  if (state.status === "loading" || !overlay.ready) return { status: "loading", retry };
  return { status: "success", products: applyOverlay(state.data, overlay), retry };
}
