// app/loading.tsx - route-level loading state, so navigation never flashes a blank page
// (features.md D3). No spinner: a spinner is motion a child has to wait through, and it
// never stops under reduced motion. A calm, still card with the word "Loading" instead.
import { MoyinMascot } from "@/components/moyin-mascot";

export default function Loading() {
  return (
    <main
      role="status"
      aria-live="polite"
      className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--paper)] text-[var(--plum-900)] px-6 py-12 text-center"
    >
      <MoyinMascot pose="body-double" size={96} />
      <p className="text-base font-bold text-[var(--plum-900)]">Loading</p>
      <p className="text-sm text-[var(--fg-muted)]">One moment. Moyin is getting things ready.</p>
    </main>
  );
}
