// app/privacy/page.tsx - what Moye stores, and what it does not (features.md D4).
//
// Every claim on this page is checked by tests/privacy.test.mjs, which greps the repo for
// analytics, cookies, remote storage and outbound requests. If someone adds tracking,
// that test fails and this page stops being true.
import Link from "next/link";
import { MoyinMascot } from "@/components/moyin-mascot";

export const metadata = {
  title: "Privacy: Moye",
  description: "What Moye stores on this device, and what it never sends anywhere.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--plum-900)]">
      <header className="border-b border-[var(--border)] bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
          <Link href="/" className="text-2xl font-bold lowercase tracking-tight min-h-11 inline-flex items-center">
            moye
          </Link>
          <Link href="/" data-demo="privacy-home" className="btn-3d btn-3d-card btn-3d-header">
            Back to the start
          </Link>
        </div>
      </header>

      <div className="flex-1 max-w-3xl mx-auto px-6 py-10 flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <MoyinMascot pose="smile" size={80} />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">What Moye keeps</h1>
            <p className="text-base text-[var(--fg-muted)] mt-1 text-pretty">
              The short version: everything stays on this device, and nothing is sent anywhere.
            </p>
          </div>
        </div>

        <section aria-labelledby="kept-heading" className="flex flex-col gap-3">
          <h2 id="kept-heading" className="text-xl font-bold">
            What Moye stores
          </h2>
          <p className="text-base text-[var(--fg-muted)] text-pretty">
            Four things, all saved in this browser on this device. Clearing your browser data removes
            all of them.
          </p>
          <ul className="flex flex-col gap-2">
            {[
              {
                what: "Learning progress",
                detail:
                  "Which questions were answered, what was learned, honey earned and levels finished. Stored as moye_global_state.",
              },
              {
                what: "Comfort settings",
                detail:
                  "Dyslexia spacing, text size, reading tint, Calm Motion, sound and voice speed. Stored as moye_a11y_settings.11y_settings.",
              },
              {
                what: "Your chosen language",
                detail: "English, Nigerian Pidgin or Yoruba for the words on screen. Stored as moye_ui_language.",
              },
              {
                what: "Your last energy check in",
                detail: "Whether you felt full of energy, okay or tired last time. Stored as moye_energy_checkin.",
              },
            ].map((item) => (
              <li key={item.what} className="p-4 rounded-xl bg-white border border-[var(--border)]">
                <span className="block font-bold text-[var(--plum-900)]">{item.what}</span>
                <span className="block text-sm text-[var(--fg-muted)] mt-1 text-pretty">{item.detail}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="never-heading" className="flex flex-col gap-3">
          <h2 id="never-heading" className="text-xl font-bold">
            What Moye never does
          </h2>
          <ul className="flex flex-col gap-2">
            {[
              "No account, no sign up, no email address and no password.",
              "No ads and no advertising trackers.",
              "No analytics service and no usage tracking.",
              "No cookies set by Moye.",
              "No requests to any third party server. Moye loads nothing from anywhere else, so it works with the network off.",
              "No sale or sharing of anything, because there is nothing to share.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2 text-base text-[var(--plum-900)]">
                <span
                  aria-hidden="true"
                  className="w-2 h-2 rounded-sm bg-[var(--teal-500)] mt-2 shrink-0"
                />
                <span className="text-pretty">{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="child-heading" className="flex flex-col gap-3">
          <h2 id="child-heading" className="text-xl font-bold">
            For grown ups
          </h2>
          <p className="text-base text-[var(--fg-muted)] text-pretty">
            Moye is designed for children. It does not ask for a name to build a profile of them,
            it does not use advertising or behavioural profiling, and it does not talk to any
            outside service. The optional Postgres connection in the repository is for developers
            running their own copy, and Moye does not need it.
          </p>
        </section>

        <section aria-labelledby="remove-heading" className="flex flex-col gap-3">
          <h2 id="remove-heading" className="text-xl font-bold">
            Removing everything
          </h2>
          <p className="text-base text-[var(--fg-muted)] text-pretty">
            Clearing this browser&apos;s site data for Moye removes all four items above, immediately
            and permanently. There is nothing held anywhere else, so there is nothing else to ask
            anyone to delete.
          </p>
        </section>

        <p className="text-sm text-[var(--fg-muted)]">
          Last reviewed with the code in this repository. If that code changes, the checks behind
          this page run again.
        </p>
      </div>
    </main>
  );
}
