"use client";

import { useSyncExternalStore } from "react";
import { createStore } from "./create-store";

export interface Toast {
  id: number;
  message: string;
  tone: "success" | "error";
}

const EMPTY: Toast[] = [];
const store = createStore<Toast[]>(EMPTY);
let counter = 0;

export function useToasts(): Toast[] {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => EMPTY);
}

export function dismissToast(id: number) {
  store.setState((toasts) => toasts.filter((t) => t.id !== id));
}

export function showToast(message: string, tone: Toast["tone"] = "success") {
  const id = ++counter;
  store.setState((toasts) => [...toasts, { id, message, tone }]);
  window.setTimeout(() => dismissToast(id), 4500);
}
