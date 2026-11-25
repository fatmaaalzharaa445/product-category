"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import type { ProductInput } from "@/lib/types";
import {
  type ProductFormErrors,
  type ProductFormValues,
  validateProduct,
} from "@/lib/catalog/validation";
import { getErrorMessage } from "@/lib/api/errors";
import { formatCategory } from "@/lib/format";
import { buttonStyles, fieldStyles, labelStyles } from "@/components/ui/styles";

interface ProductFormProps {
  initialValues: ProductFormValues;
  categories: string[];
  submitLabel: string;
  pendingLabel: string;
  cancelHref: string;
  onSubmit: (input: ProductInput) => Promise<void>;
}

type FieldName = keyof ProductFormValues;

const FIELD_ORDER: FieldName[] = ["title", "category", "price", "rating", "stock", "brand", "thumbnail", "description"];

export function ProductForm({
  initialValues,
  categories,
  submitLabel,
  pendingLabel,
  cancelHref,
  onSubmit,
}: ProductFormProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  function update(name: FieldName, value: string) {
    const next = { ...values, [name]: value };
    setValues(next);
    if (attempted) {
      const result = validateProduct(next);
      setErrors(result.ok ? {} : result.errors);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setAttempted(true);
    setSubmitError(null);

    const result = validateProduct(values);
    if (!result.ok) {
      setErrors(result.errors);
      const firstInvalid = FIELD_ORDER.find((name) => result.errors[name]);
      if (firstInvalid) formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setErrors({});
    setPending(true);
    try {
      await onSubmit(result.data);
      setValues(initialValues);
      setAttempted(false);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  const fieldProps = (name: FieldName) => ({
    id: `${uid}-${name}`,
    name,
    value: values[name],
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(name, event.target.value),
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${uid}-${name}-error` : undefined,
    className: fieldStyles,
  });

  const field = (name: FieldName, label: string, control: React.ReactNode, options: { required?: boolean; hint?: string } = {}) => (
    <div>
      <label htmlFor={`${uid}-${name}`} className={labelStyles}>
        {label}
        {options.required ? (
          <span className="text-danger" aria-hidden="true">
            {" "}*
          </span>
        ) : (
          <span className="font-normal text-muted"> (optional)</span>
        )}
      </label>
      {control}
      {errors[name] ? (
        <p id={`${uid}-${name}-error`} className="mt-1.5 flex items-center gap-1 text-sm text-danger">
          <span aria-hidden="true">⚠</span> {errors[name]}
        </p>
      ) : (
        options.hint && <p className="mt-1.5 text-xs text-muted">{options.hint}</p>
      )}
    </div>
  );

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-busy={pending}
      className="space-y-6 rounded-2xl border border-border bg-surface p-5 sm:p-8"
    >
      <p className="text-sm text-muted">
        Fields marked <span className="text-danger">*</span> are required.
      </p>

      {submitError && (
        <div role="alert" className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
          <strong className="font-semibold">Couldn&apos;t save the product.</strong> {submitError}
        </div>
      )}

      <fieldset disabled={pending} className="grid gap-5 sm:grid-cols-2">
        <legend className="sr-only">Product details</legend>

        <div className="sm:col-span-2">
          {field("title", "Title", <input type="text" autoComplete="off" required {...fieldProps("title")} />, {
            required: true,
          })}
        </div>

        {field(
          "category",
          "Category",
          <>
            <input type="text" list={`${uid}-categories`} autoComplete="off" required {...fieldProps("category")} />
            <datalist id={`${uid}-categories`}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {formatCategory(category)}
                </option>
              ))}
            </datalist>
          </>,
          { required: true, hint: "Pick an existing category or type a new one." },
        )}

        {field("brand", "Brand", <input type="text" autoComplete="off" {...fieldProps("brand")} />)}

        {field(
          "price",
          "Price (USD)",
          <input type="number" inputMode="decimal" min="0.01" step="0.01" required {...fieldProps("price")} />,
          { required: true },
        )}

        {field(
          "rating",
          "Rating",
          <input type="number" inputMode="decimal" min="0" max="5" step="0.1" {...fieldProps("rating")} />,
          { hint: "Between 0 and 5." },
        )}

        {field("stock", "Stock", <input type="number" inputMode="numeric" min="0" step="1" {...fieldProps("stock")} />)}

        {field(
          "thumbnail",
          "Image URL",
          <input type="url" inputMode="url" placeholder="https://…" {...fieldProps("thumbnail")} />,
        )}

        <div className="sm:col-span-2">
          {field("description", "Description", <textarea rows={5} {...fieldProps("description")} />, {
            hint: "Up to 1000 characters.",
          })}
        </div>
      </fieldset>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <Link href={cancelHref} className={buttonStyles.secondary}>
          Cancel
        </Link>
        <button type="submit" disabled={pending} className={buttonStyles.primary}>
          {pending && (
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
          )}
          {pending ? pendingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
