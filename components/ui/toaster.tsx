"use client";

import { dismissToast, useToasts } from "@/lib/store/toast-store";

export function Toaster() {
  const toasts = useToasts();
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-fade-up pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${
            toast.tone === "success"
              ? "border-success/30 bg-success-soft text-success"
              : "border-danger/30 bg-danger-soft text-danger"
          }`}
        >
          <span aria-hidden="true">{toast.tone === "success" ? "✓" : "!"}</span>
          <p className="flex-1 font-medium">{toast.message}</p>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="-m-1 rounded p-1 opacity-70 hover:opacity-100"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
