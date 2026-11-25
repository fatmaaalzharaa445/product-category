"use client";

import { useSyncExternalStore } from "react";
import type { Product, ProductInput } from "@/lib/types";
import { LOCAL_ID_START, isLocalId } from "@/lib/catalog/ids";
import { createStore } from "./create-store";

export { isLocalId };

export interface CatalogOverlay {
  ready: boolean;
  created: Product[];
  updated: Record<number, Product>;
  deleted: number[];
}

const STORAGE_KEY = "product-catalog:overlay:v1";
const SERVER_SNAPSHOT: CatalogOverlay = { ready: false, created: [], updated: {}, deleted: [] };

const store = createStore<CatalogOverlay>(SERVER_SNAPSHOT);

function load(): CatalogOverlay {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<Omit<CatalogOverlay, "ready">>;
      return { ready: true, created: saved.created ?? [], updated: saved.updated ?? {}, deleted: saved.deleted ?? [] };
    }
  } catch {
  }
  return { ...SERVER_SNAPSHOT, ready: true };
}

function ensureLoaded() {
  if (typeof window !== "undefined" && !store.getSnapshot().ready) {
    store.hydrate(load());
  }
}

function commit(updater: (prev: CatalogOverlay) => CatalogOverlay) {
  ensureLoaded();
  store.setState(updater);
  try {
    const { created, updated, deleted } = store.getSnapshot();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ created, updated, deleted }));
  } catch {
  }
}

function getClientSnapshot(): CatalogOverlay {
  ensureLoaded();
  return store.getSnapshot();
}

export function useCatalogOverlay(): CatalogOverlay {
  return useSyncExternalStore(store.subscribe, getClientSnapshot, () => SERVER_SNAPSHOT);
}

export function applyOverlay(products: Product[], overlay: CatalogOverlay): Product[] {
  const deleted = new Set(overlay.deleted);
  const merged = products.filter((p) => !deleted.has(p.id)).map((p) => overlay.updated[p.id] ?? p);
  return [...overlay.created, ...merged];
}

export function resolveProduct(id: number, fromApi: Product | null, overlay: CatalogOverlay): Product | null {
  if (overlay.deleted.includes(id)) return null;
  return overlay.updated[id] ?? overlay.created.find((p) => p.id === id) ?? fromApi;
}

export function nextLocalId(): number {
  ensureLoaded();
  const ids = store.getSnapshot().created.map((p) => p.id);
  return Math.max(LOCAL_ID_START - 1, ...ids) + 1;
}

export function mergeInput(base: Product, input: ProductInput): Product {
  return {
    ...base,
    ...input,
    brand: input.brand || undefined,
    thumbnail: input.thumbnail || base.thumbnail,
    images: input.thumbnail ? [input.thumbnail, ...base.images.filter((src) => src !== input.thumbnail)] : base.images,
  };
}

export const catalogActions = {
  add(product: Product) {
    commit((s) => ({ ...s, created: [product, ...s.created] }));
  },
  update(product: Product) {
    commit((s) =>
      isLocalId(product.id)
        ? { ...s, created: s.created.map((p) => (p.id === product.id ? product : p)) }
        : { ...s, updated: { ...s.updated, [product.id]: product } },
    );
  },
  remove(id: number) {
    commit((s) =>
      isLocalId(id)
        ? { ...s, created: s.created.filter((p) => p.id !== id) }
        : { ...s, deleted: [...s.deleted, id] },
    );
  },
  reset() {
    commit(() => ({ ...SERVER_SNAPSHOT, ready: true }));
  },
};
