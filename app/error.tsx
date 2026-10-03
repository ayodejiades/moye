// app/error.tsx - a thrown error must not be a blank screen.
//
// Without this, any failure inside a server component or a fetch renders Next's default
// error page, which reads as a broken deploy to anyone who lands on it (features.md D3).
// The tone matters as much as the recovery: Moyin looks sleepy rather than alarmed, the
// copy says what is true, and there is one obvious way back.
"use client";

import Link from "next/link";
import { MoyinMascot } from "@/components/moyin-mascot";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[var(--paper)] text-[var(--plum-900)] px-6 py-12 text-center">
      <MoyinMascot pose="sleepy" size={140} />

      <div className="max-w-md flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-[var(--plum-900)]">Moyin lost his page for a moment</h1>
        <p className="text-base text-[var(--fg-muted)] text-pretty">
          Something did not load. Nothing you did was lost, and nothing was sent anywhere. Moyin is
          resting and will try again with you.
        </p>
        {/* The reference is here for a grown up helping, kept out of the way of a child. */}
        {error.digest && (
          <p className="font-mono text-xs text-[var(--fg-muted)]">Reference: {error.digest}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={reset}
          data-demo="error-retry"
          className="btn-3d btn-3d-plum text-base"
        >
          Try again
        </button>
        <Link href="/" data-demo="error-home" className="btn-3d btn-3d-card text-base">
          Back to the start
        </Link>
      </div>
    </main>
  );
}
