import type { ReactNode } from "react";

type StoryCardProps = {
  /** Small label above the heading. Plain text, never all caps. */
  eyebrow: string;
  title: string;
  body: ReactNode;
  icon: ReactNode;
  /** Accent used for the icon frame only. Never for text. */
  accent: "teal" | "plum" | "honey" | "rose";
  bullets: string[];
  cta: { label: string; href: string };
};

const ACCENT: Record<StoryCardProps["accent"], string> = {
  teal: "border-[var(--teal-500)]",
  plum: "border-[var(--plum-500)]",
  honey: "border-[var(--honey-500)]",
  rose: "border-[var(--rose-400)]",
};

export function StoryCard({ eyebrow, title, body, icon, accent, bullets, cta }: StoryCardProps) {
  return (
    <article className="w-full lg:w-80 lg:self-center text-left bg-white p-6 rounded-3xl border-2 border-[var(--border)] shadow-[0_8px_20px_rgba(42,27,77,0.06)] flex flex-col gap-4">
      <div
        className={`w-10 h-10 rounded-2xl bg-[var(--plum-100)] border-2 ${ACCENT[accent]} flex items-center justify-center text-[var(--plum-700)]`}
      >
        {icon}
      </div>
      <div>
        <span className="text-xs font-semibold text-[var(--plum-700)]">{eyebrow}</span>
        <h3 className="text-xl font-bold text-[var(--plum-900)]">{title}</h3>
      </div>
      <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{body}</p>
      <ul className="pt-2 border-t border-[var(--border)] flex flex-col gap-2">
        {bullets.map((b) => (
          <li key={b} className="flex items-center gap-2 text-sm font-semibold text-[var(--plum-900)]">
            <span aria-hidden="true" className="w-2 h-2 rounded-sm bg-[var(--plum-500)] shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <a
        href={cta.href}
        className="btn-3d btn-3d-plum text-base w-full mt-2 inline-flex no-underline"
      >
        {cta.label}
      </a>
    </article>
  );
}

type UnderTheHoodCardProps = {
  eyebrow: string;
  title: string;
  rows: { heading: string; body: string }[];
};

export function UnderTheHoodCard({ eyebrow, title, rows }: UnderTheHoodCardProps) {
  return (
    <div className="w-full lg:w-80 lg:self-center text-left bg-white p-6 rounded-3xl border-2 border-[var(--border)] shadow-[0_8px_20px_rgba(42,27,77,0.06)] flex flex-col gap-4">
      <div>
        <span className="text-xs font-semibold text-[var(--plum-700)]">{eyebrow}</span>
        <h3 className="text-xl font-bold text-[var(--plum-900)]">{title}</h3>
      </div>
      <div className="flex flex-col gap-3 text-sm">
        {rows.map((r) => (
          <div key={r.heading} className="p-3 rounded-2xl bg-[var(--paper)] border border-[var(--border)]">
            <h4 className="font-bold text-[var(--plum-900)]">{r.heading}</h4>
            <p className="text-[var(--fg-muted)] mt-1 leading-relaxed">{r.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
