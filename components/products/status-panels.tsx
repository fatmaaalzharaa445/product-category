import Link from "next/link";
import { buttonStyles } from "@/components/ui/styles";

interface PanelProps {
  icon: string;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  tone?: "neutral" | "danger";
  role?: "alert" | "status";
}

export function StatusPanel({ icon, title, children, action, tone = "neutral", role }: PanelProps) {
  return (
    <div
      role={role}
      className={`animate-fade-up flex flex-col items-center rounded-2xl border border-dashed px-6 py-14 text-center ${
        tone === "danger" ? "border-danger/40 bg-danger-soft" : "border-border bg-surface"
      }`}
    >
      <span aria-hidden="true" className="mb-3 text-4xl">
        {icon}
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
      {children && <div className="mt-1 max-w-md text-sm text-muted">{children}</div>}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}

export function ErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <StatusPanel
      role="alert"
      tone="danger"
      icon="⚠️"
      title="We couldn't load the products"
      action={
        <button type="button" onClick={onRetry} className={buttonStyles.primary}>
          Try again
        </button>
      }
    >
      {message}
    </StatusPanel>
  );
}

export function ProductNotFound() {
  return (
    <StatusPanel
      icon="🔍"
      title="Product not found"
      action={
        <Link href="/products" className={buttonStyles.primary}>
          Back to catalog
        </Link>
      }
    >
      The product you&apos;re looking for doesn&apos;t exist or has been removed.
    </StatusPanel>
  );
}
