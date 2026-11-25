const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60";

export const buttonStyles = {
  primary: `${buttonBase} bg-accent text-on-accent hover:bg-accent-hover`,
  secondary: `${buttonBase} border border-border bg-surface text-text hover:bg-surface-muted`,
  danger: `${buttonBase} bg-danger text-white hover:opacity-90 dark:text-bg`,
  ghost: `${buttonBase} text-muted hover:bg-surface-muted hover:text-text`,
} as const;

export const fieldStyles =
  "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-muted transition-colors hover:border-muted aria-[invalid=true]:border-danger";

export const labelStyles = "mb-1.5 block text-sm font-medium text-text";
