// app/not-found.tsx - a dead link should still look like the product (features.md D3).
import Link from "next/link";
import { MoyinMascot } from "@/components/moyin-mascot";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[var(--paper)] text-[var(--plum-900)] px-6 py-12 text-center">
      <MoyinMascot pose="think" size={140} />

      <div className="max-w-md flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-[var(--plum-900)]">This page is not here</h1>
        <p className="text-base text-[var(--fg-muted)] text-pretty">
          The link may be old, or spelled differently. Moyin checked and could not find it either.
          Everything Moyin has already learned is safe on this device.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link href="/" data-demo="notfound-home" className="btn-3d btn-3d-plum text-base">
          Back to the start
        </Link>
        <Link href="/learn" data-demo="notfound-learn" className="btn-3d btn-3d-card text-base">
          See the learning path
        </Link>
      </div>
    </main>
  );
}
