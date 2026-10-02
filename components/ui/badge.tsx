import type { HTMLAttributes } from "react";

export function Badge({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--plum-100)] px-2 py-0.5 text-xs font-semibold text-[var(--plum-900)] ${className}`}
      {...props}
    />
  );
}
