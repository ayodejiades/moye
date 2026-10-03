import type { CSSProperties } from "react";
import Link from "next/link";
import { MoyinMascot } from "@/components/moyin-mascot";
import {
  CalmFocusIllustration,
  AdaptiveMasteryIllustration,
  HoneyRewardsIllustration,
  NeurodiversityIllustration,
  DuoLingotGem,
  DuoStreakFlame,
  DuoGoldenTrophy,
  DuoStayMotivatedIllustration,
} from "@/components/ui/svg-icons";
import { HeroMascotInteractive } from "@/components/hero-mascot-interactive";
import { InteractiveAppShowcase } from "@/components/interactive-showcase";
import { ComfortButton } from "@/components/comfort-button";
import { Reveal } from "@/components/reveal";
import { InViewFloat } from "@/components/inview-float";
import { DecisionPreview } from "@/components/decision-preview";

/** Stagger index for the hero entrance. Read by .hero-enter in app/globals.css. */
const step = (i: number) => ({ "--i": i }) as CSSProperties;

const FRAMEWORKS = [
  { name: "Nigeria (UBE)", flag: "ng" },
  { name: "England (NC)", flag: "uk" },
  { name: "US (Common Core)", flag: "us" },
  { name: "India (CBSE)", flag: "in" },
  { name: "Australia (AC)", flag: "au" },
] as const;

function FrameworkFlag({ flag }: { flag: (typeof FRAMEWORKS)[number]["flag"] }) {
  if (flag === "ng") {
    return (
      <svg width="18" height="13" viewBox="0 0 18 13" fill="none" className="inline-block shrink-0" aria-hidden="true">
        <rect width="6" height="13" fill="#008751" />
        <rect x="6" width="6" height="13" fill="#FFFFFF" />
        <rect x="12" width="6" height="13" fill="#008751" />
      </svg>
    );
  }
  if (flag === "uk") {
    return (
      <svg width="18" height="13" viewBox="0 0 18 13" fill="none" className="inline-block shrink-0" aria-hidden="true">
        <rect width="18" height="13" fill="#012169" />
        <path d="M0 0L18 13M18 0L0 13" stroke="#C8102E" strokeWidth="1.2" />
        <path d="M9 0V13M0 6.5H18" stroke="#C8102E" strokeWidth="2.5" />
      </svg>
    );
  }
  if (flag === "us") {
    return (
      <svg width="18" height="13" viewBox="0 0 18 13" fill="none" className="inline-block shrink-0" aria-hidden="true">
        <rect width="18" height="13" fill="#B22234" />
        <rect y="2" width="18" height="1.8" fill="#FFF" />
        <rect y="5.5" width="18" height="1.8" fill="#FFF" />
        <rect y="9" width="18" height="1.8" fill="#FFF" />
        <rect width="8" height="7" fill="#3C3B6E" />
      </svg>
    );
  }
  if (flag === "in") {
    return (
      <svg width="18" height="13" viewBox="0 0 18 13" fill="none" className="inline-block shrink-0" aria-hidden="true">
        <rect width="18" height="13" fill="#FF9933" />
        <rect y="4.33" width="18" height="4.34" fill="#FFFFFF" />
        <rect y="8.67" width="18" height="4.33" fill="#138808" />
        <circle cx="9" cy="6.5" r="1.5" fill="none" stroke="#000080" strokeWidth="0.8" />
      </svg>
    );
  }
  return (
    <svg width="18" height="13" viewBox="0 0 18 13" fill="none" className="inline-block shrink-0" aria-hidden="true">
      <rect width="18" height="13" fill="#00247D" />
      <rect width="9" height="6.5" fill="#012169" />
      <path d="M0 0L9 6.5M9 0L0 6.5" stroke="#C8102E" strokeWidth="0.6" />
      <path d="M4.5 0V6.5M0 3.25H9" stroke="#C8102E" strokeWidth="1.2" />
      <circle cx="4.5" cy="9.5" r="0.9" fill="#FFF" />
      <circle cx="13.5" cy="3.5" r="0.6" fill="#FFF" />
      <circle cx="15" cy="5.5" r="0.6" fill="#FFF" />
      <circle cx="13.5" cy="8" r="0.6" fill="#FFF" />
      <circle cx="12" cy="6" r="0.6" fill="#FFF" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--paper)] text-[var(--plum-900)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 inline-flex items-center justify-center min-h-11 min-w-11 focus:px-4 bg-[var(--plum-900)] text-white font-semibold text-base"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 bg-[var(--paper)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 min-h-11 shrink-0">
            <MoyinMascot pose="cheer" size={32} />
            <span className="text-2xl font-bold tracking-tight text-[var(--plum-900)] lowercase select-none">
              moye
            </span>
          </Link>

          <nav aria-label="Primary navigation" className="flex items-center gap-2 sm:gap-4 text-sm font-semibold text-[var(--fg-muted)]">
            <Link
              href="/proof"
              className="hidden sm:inline-flex sm:items-center min-h-11 hover:text-[var(--plum-700)] transition-colors"
            >
              How Moye Decides
            </Link>
            <Link
              href="/grownups"
              className="hidden sm:inline-flex sm:items-center min-h-11 hover:text-[var(--plum-700)] transition-colors"
            >
              For Teachers
            </Link>
            <Link
              href="/start?mode=signin"
              className="hidden sm:inline-flex sm:items-center min-h-11 hover:text-[var(--plum-700)] transition-colors"
            >
              Sign In
            </Link>
            <ComfortButton />
            <Link
              href="/start"
              data-demo="start-header"
              className="btn-3d btn-3d-header btn-3d-plum font-semibold"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-8 pb-16 sm:py-16 flex flex-col items-center justify-center text-center w-full">
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid slice"
          >
            <rect width="800" height="600" fill="var(--paper)" />
            {Array.from({ length: 24 }).map((_, i) => {
              const cx = 400;
              const cy = 700;
              const angleStep = 360 / 24;
              const halfAngle = angleStep / 2;
              const startAngle = ((i * angleStep - halfAngle - 90) * Math.PI) / 180;
              const endAngle = (((i + 1) * angleStep - halfAngle - 90) * Math.PI) / 180;
              const r = 1100;
              const x1 = cx + r * Math.cos(startAngle);
              const y1 = cy + r * Math.sin(startAngle);
              const x2 = cx + r * Math.cos(endAngle);
              const y2 = cy + r * Math.sin(endAngle);
              return i % 2 === 0 ? (
                <polygon key={i} points={`${cx},${cy} ${x1},${y1} ${x2},${y2}`} fill="var(--plum-100)" />
              ) : null;
            })}
          </svg>

          <div className="max-w-3xl mx-auto px-6 flex flex-col items-center gap-4 relative z-10">
            <h1
              style={step(0)}
              className="hero-enter text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--plum-900)] leading-tight"
            >
              Learn at your pace <br className="hidden sm:inline" />
              <span className="text-[var(--plum-700)]">with Moye</span>
            </h1>

            <p
              style={step(1)}
              className="hero-enter text-base sm:text-lg text-[var(--fg-muted)] max-w-xl font-medium"
            >
              Short, gentle lessons that adjust to each child. No timers and no shame. Moyin the honey badger sits
              beside them the whole way.
            </p>

            <div style={step(2)} className="hero-enter pt-2 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <Link
                href="/start"
                data-demo="start"
                className="btn-3d btn-3d-plum text-base min-w-[220px]"
              >
                Get Started
              </Link>
              <Link href="/proof" className="btn-3d btn-3d-card text-base">
                How Moye Decides
              </Link>
            </div>
          </div>

          {/* Solid plum ground: full bleed arc flush with the section edges */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-52 sm:h-64 bg-[var(--plum-900)] rounded-[50%_50%_0_0/100%_100%_0_0]" />

          {/* Mascot Scene: tall enough for the 560px mascot plus its card, and stacked
              below the copy so it can never cover or block the call to action. */}
          <div
            style={step(3)}
            className="hero-enter relative w-full max-w-5xl mx-auto mt-4 sm:mt-6 h-[440px] sm:h-[540px] md:h-[580px] flex items-end justify-center select-none overflow-visible z-0"
          >
            <HeroMascotInteractive />
          </div>
        </section>

        {/* Curriculum strip */}
        <Reveal>
          <div className="border-y border-[var(--border)] bg-white py-4 px-6 overflow-x-auto">
            <div className="max-w-7xl mx-auto flex items-center gap-4 whitespace-nowrap">
              <span className="text-xs font-bold text-[var(--fg-muted)] shrink-0">Aligned to</span>
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--plum-900)] shrink-0">
                {FRAMEWORKS.map((f) => (
                  <span
                    key={f.name}
                    className="bg-[var(--plum-100)] px-3 py-2 rounded-md border border-[var(--border)] inline-flex items-center gap-2 shrink-0"
                  >
                    <FrameworkFlag flag={f.flag} />
                    <span>{f.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Three plain truths about how Moye behaves */}
        <section className="bg-white border-y border-[var(--border)] py-20 px-6 overflow-hidden relative">
          <div className="max-w-5xl mx-auto relative z-10">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                <h2 className="text-3xl sm:text-5xl font-bold text-[var(--plum-900)] tracking-tight">
                  Built for honesty. Built for trust.
                </h2>
                <p className="text-base text-[var(--fg-muted)] font-medium">
                  Progress saves on this device. Difficulty and rewards come from plain code. And nothing here ever
                  shames a child for a wrong answer.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <Reveal index={0}>
                <article className="h-full p-8 rounded-3xl bg-white border-2 border-[var(--teal-500)] shadow-[0_8px_0_var(--teal-500)] flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--plum-100)] border-2 border-[var(--teal-500)] flex items-center justify-center mb-3">
                    <DuoLingotGem size={42} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-5xl font-bold text-[var(--teal-700)] tracking-tight">0</div>
                    <h3 className="text-lg font-bold text-[var(--plum-900)]">No Countdown Timers</h3>
                  </div>
                  <p className="text-sm text-[var(--fg-muted)] font-medium mt-3 leading-relaxed">
                    No ticking clock and no buzzer. Children take the time they need to think.
                  </p>
                </article>
              </Reveal>

              <Reveal index={1}>
                <article className="h-full p-8 rounded-3xl bg-white border-2 border-[var(--plum-500)] shadow-[0_8px_0_var(--plum-500)] flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--plum-100)] border-2 border-[var(--plum-500)] flex items-center justify-center mb-3">
                    <DuoStreakFlame size={42} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-5xl font-bold text-[var(--plum-700)] tracking-tight">Open</div>
                    <h3 className="text-lg font-bold text-[var(--plum-900)]">Rules you can read</h3>
                  </div>
                  <p className="text-sm text-[var(--fg-muted)] font-medium mt-3 leading-relaxed">
                    Difficulty, honey and streaks come from plain code, not a chatbot. See How Moye Decides.
                  </p>
                </article>
              </Reveal>

              <Reveal index={2}>
                <article className="h-full p-8 rounded-3xl bg-white border-2 border-[var(--rose-400)] shadow-[0_8px_0_var(--rose-400)] flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--plum-100)] border-2 border-[var(--rose-400)] flex items-center justify-center mb-3">
                    <DuoGoldenTrophy size={42} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-5xl font-bold text-[var(--plum-900)] tracking-tight">1</div>
                    <h3 className="text-lg font-bold text-[var(--plum-900)]">One Calm Mascot</h3>
                  </div>
                  <p className="text-sm text-[var(--fg-muted)] font-medium mt-3 leading-relaxed">
                    Moyin sits right beside your child through every problem, cheering the wins and guiding the
                    retries.
                  </p>
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Five stories, alternating two column rows */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <div className="space-y-24">
            <Reveal>
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 flex justify-center">
                  <div className="p-8 bg-white rounded-3xl border-2 border-[var(--border)]">
                    <CalmFocusIllustration size={160} />
                  </div>
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <h2 className="text-3xl sm:text-4xl font-bold text-[var(--plum-900)] leading-tight">
                    Short, calm lessons. No timer, no panic.
                  </h2>
                  <p className="text-base text-[var(--fg-muted)] leading-relaxed">
                    Many apps rush children with a clock and a buzzer. Moye shows one gentle question at a time, with
                    big tap targets and no guilt.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                <div className="flex-1 flex justify-center">
                  <div className="p-8 bg-white rounded-3xl border-2 border-[var(--border)]">
                    <AdaptiveMasteryIllustration size={160} />
                  </div>
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <h2 className="text-3xl sm:text-4xl font-bold text-[var(--plum-900)] leading-tight">
                    Meets each child where they are.
                  </h2>
                  <p className="text-base text-[var(--fg-muted)] leading-relaxed">
                    Plain code, not a chatbot, decides the difficulty. After every answer Moye checks what the child
                    has understood and picks the next question: gentle support when stuck, a fresh challenge when
                    thriving.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 flex justify-center">
                  <div className="p-8 bg-white rounded-3xl border-2 border-[var(--border)]">
                    <DuoStayMotivatedIllustration size={160} />
                  </div>
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <h2 className="text-3xl sm:text-4xl font-bold text-[var(--plum-900)] leading-tight">
                    Stay Motivated
                  </h2>
                  <p className="text-base text-[var(--fg-muted)] leading-relaxed">
                    Small daily streaks, warm celebrations, and rest tokens that never scold. A child can stop for
                    the day without losing anything.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                <div className="flex-1 flex justify-center">
                  <div className="p-8 bg-white rounded-3xl border-2 border-[var(--border)]">
                    <HoneyRewardsIllustration size={160} />
                  </div>
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <h2 className="text-3xl sm:text-4xl font-bold text-[var(--plum-900)] leading-tight">
                    Earn honey drops for Moyin&apos;s cozy hive.
                  </h2>
                  <p className="text-base text-[var(--fg-muted)] leading-relaxed">
                    Children earn honey only for finished focus work. They spend it on an acorn cap, a knitted scarf,
                    a honeycomb crown, or a friendly bee to keep Moyin company. A daily cap tells them when they are
                    done for today.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 flex justify-center">
                  <div className="p-8 bg-white rounded-3xl border-2 border-[var(--border)]">
                    <NeurodiversityIllustration size={160} />
                  </div>
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <h2 className="text-3xl sm:text-4xl font-bold text-[var(--plum-900)] leading-tight">
                    Designed for ADHD, dyslexia, and active minds.
                  </h2>
                  <p className="text-base text-[var(--fg-muted)] leading-relaxed">
                    Wider letter spacing with an OpenDyslexic option, a Calm Motion switch, tinted backgrounds, and
                    read aloud on every question. Built in from the first screen.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <Reveal>
          <InteractiveAppShowcase />
        </Reveal>

        {/* One real result from the model, recomputed on the page (features.md C4) */}
        <Reveal>
          <DecisionPreview />
        </Reveal>

        {/* Bottom Call to Action */}
        <section className="max-w-4xl mx-auto px-6 py-20 text-center flex flex-col items-center gap-6">
          <Reveal>
            <InViewFloat>
              <MoyinMascot pose="idle" size={130} />
            </InViewFloat>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--plum-900)] mt-6">
              Start learning with Moye today.
            </h2>
            <p className="text-base text-[var(--fg-muted)] max-w-lg mt-4">
              Free to use. No ads and no countdown stress. Join Moyin the honey badger for calm learning that meets
              every child where they are.
            </p>
            <Link
              href="/start"
              data-demo="start-footer"
              className="btn-3d btn-3d-plum text-base min-w-[220px] mt-4"
            >
              Get Started
            </Link>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--paper)] py-12 px-6 text-xs text-[var(--fg-muted)]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="space-y-2">
            <span className="font-bold text-[var(--plum-900)] text-sm block">Learning</span>
            <ul className="space-y-1">
              <li>
                <Link href="/start" className="inline-flex items-center min-h-11 hover:underline">
                  Focus Mode
                </Link>
              </li>
              <li>
                <Link href="/learn" className="inline-flex items-center min-h-11 hover:underline">
                  Skill Graph Map
                </Link>
              </li>
              <li>
                <Link href="/hive" className="inline-flex items-center min-h-11 hover:underline">
                  Moyin&apos;s Hive
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <span className="font-bold text-[var(--plum-900)] text-sm block">Grownups</span>
            <ul className="space-y-1">
              <li>
                <Link href="/grownups" className="inline-flex items-center min-h-11 hover:underline">
                  Teacher Portal
                </Link>
              </li>
              <li>
                <Link href="/grownups" className="inline-flex items-center min-h-11 hover:underline">
                  Weekly Reports
                </Link>
              </li>
              <li>
                <Link href="/proof" className="inline-flex items-center min-h-11 hover:underline">
                  How Moye Decides
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <span className="font-bold text-[var(--plum-900)] text-sm block">Curriculum</span>
            <ul className="space-y-1">
              <li>
                <span className="inline-flex items-center min-h-11">Nigeria UBE</span>
              </li>
              <li>
                <span className="inline-flex items-center min-h-11">England National Curriculum</span>
              </li>
              <li>
                <span className="inline-flex items-center min-h-11">US Common Core</span>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <span className="font-bold text-[var(--plum-900)] text-sm block">Transparency</span>
            <ul className="space-y-1">
              <li>
                <span className="inline-flex items-center min-h-11">Rules written in plain code</span>
              </li>
              <li>
                <span className="inline-flex items-center min-h-11">No Countdown Timers</span>
              </li>
              <li>
                <Link
                  href="/proof"
                  className="inline-flex items-center min-h-11 hover:underline font-bold text-[var(--plum-700)]"
                >
                  How Moye Decides
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-[var(--border)] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold">Moye. Open, free, and calm learning.</span>
          <span>Made with care for every curious mind</span>
        </div>
      </footer>
    </div>
  );
}
