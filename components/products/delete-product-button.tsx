"use client";

import { useId, useRef, useState } from "react";
import { deleteProduct } from "@/lib/api/products";
import { getErrorMessage } from "@/lib/api/errors";
import { isLocalId } from "@/lib/store/catalog-store";
import type { Product } from "@/lib/types";
import { buttonStyles } from "@/components/ui/styles";

interface DeleteProductButtonProps {
  product: Product;
  onDeleted: () => void;
}

export function DeleteProductButton({ product, onDeleted }: DeleteProductButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  function open() {
    setError(null);
    dialogRef.current?.showModal();
  }

  function close() {
    if (!pending) dialogRef.current?.close();
  }

  async function confirm() {
    setPending(true);
    setError(null);
    try {
      if (!isLocalId(product.id)) await deleteProduct(product.id);
      dialogRef.current?.close();
      onDeleted();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button type="button" onClick={open} className={buttonStyles.secondary}>
        <span aria-hidden="true">🗑</span> Delete
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={(event) => {
          if (pending) event.preventDefault();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-border bg-surface p-0 text-text shadow-2xl open:animate-fade-up"
      >
        <div className="p-6">
          <h2 id={titleId} className="text-lg font-semibold">
            Delete this product?
          </h2>
          <p id={descriptionId} className="mt-2 text-sm text-muted">
            <strong className="font-semibold text-text">{product.title}</strong> will be removed from the catalog.
            This can&apos;t be undone.
          </p>
          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={close} disabled={pending} className={buttonStyles.secondary} autoFocus>
              Cancel
            </button>
            <button type="button" onClick={confirm} disabled={pending} className={buttonStyles.danger}>
              {pending ? "Deleting…" : "Delete product"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
