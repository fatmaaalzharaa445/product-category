import Link from "next/link";

interface PageHeaderProps {
  title?: string;
  description?: string;
  back?: { href: string; label: string };
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, back, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 space-y-3 sm:mb-8">
      {back && (
        <Link
          href={back.href}
          className="inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-text"
        >
          <span aria-hidden="true">←</span> {back.label}
        </Link>
      )}
      {title && (
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            {description && <p className="mt-1 text-muted">{description}</p>}
          </div>
          {actions}
        </div>
      )}
    </div>
  );
}
