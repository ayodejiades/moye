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

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--paper)] text-[var(--plum-900)] selection:bg-[var(--plum-100)]">
      {/* Duolingo-style Sticky Header */}
      <header className="sticky top-0 z-40 bg-[var(--paper)]/90 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-200">
              <MoyinMascot pose="cheer" size={32} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[var(--plum-900)] lowercase select-none">
              moye
            </span>
          </Link>

          <nav aria-label="Primary navigation" className="flex items-center gap-3 sm:gap-4 text-sm font-semibold text-[var(--fg-muted)]">
            <Link
              href="/proof"
              className="hover:text-[var(--plum-700)] transition-colors hidden sm:block"
            >
              How Moye Decides
            </Link>
            <Link
              href="/grownups"
              className="hover:text-[var(--plum-700)] transition-colors hidden sm:block"
            >
              For Teachers
            </Link>
            <Link
              href="/start?mode=signin"
              className="hover:text-[var(--plum-700)] transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/start"
              data-demo="start"
              className="btn-3d btn-3d-header btn-3d-plum text-sm font-semibold !py-2 !px-3"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:py-16 flex flex-col items-center justify-center text-center w-full">

        {/* Starburst background — spans full section, clipped by section overflow-hidden */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <rect width="800" height="600" fill="#F5F0FA" />
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
            const fills = ["#2A1B4D", "#0D7377", "#5B21B6", "#F59E0B"];
            return (
              <polygon
                key={i}
                points={`${cx},${cy} ${x1},${y1} ${x2},${y2}`}
                fill={fills[i % fills.length]}
                opacity={i % 2 === 0 ? 0.28 : 0.14}
              />
            );
          })}
        </svg>

        {/* Top Centered Punchy Typography */}
        <div className="max-w-3xl mx-auto px-6 flex flex-col items-center gap-4 relative z-10">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--plum-900)] leading-tight">
            Learn at your pace <br className="hidden sm:inline" />
            <span className="text-[var(--plum-700)]">with Moye</span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--fg-muted)] max-w-xl font-medium">
            Calm, bite-sized adaptive learning for neurodivergent &amp; neurotypical kids. Bayesian difficulty with zero anxiety.
          </p>

          {/* Chunky 3D CTA Button */}
          <div className="pt-2 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <Link
              href="/start"
              data-demo="start"
              className="btn-3d btn-3d-plum text-sm sm:text-base uppercase tracking-wider py-4 px-10 shadow-lg hover:brightness-105 active:scale-95 transition-all min-w-[220px]"
            >
              Get Started
            </Link>
            <Link
              href="/proof"
              className="btn-3d btn-3d-card text-sm sm:text-base uppercase tracking-wider py-4 px-8 hover:brightness-105 active:scale-95 transition-all"
            >
              How Moye Decides
            </Link>
          </div>
        </div>

        {/* Solid plum ground — full-bleed arc, ends flush with the section's side edges and bottom line */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-52 sm:h-64 bg-[var(--plum-900)] rounded-[50%_50%_0_0/100%_100%_0_0]" />

        {/* Mascot Scene — overflow-visible so Moyin's head clears the top */}
        <div className="relative w-full max-w-5xl mx-auto mt-4 sm:mt-6 h-[420px] sm:h-[480px] flex items-end justify-center select-none overflow-visible z-10">

          {/* Interactive Moyin */}
          <HeroMascotInteractive />
        </div>
      </section>

      {/* Duolingo-style Framework Strip */}
      <div className="border-y border-[var(--border)] bg-white py-3.5 px-6 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-nowrap whitespace-nowrap">
          <span className="text-xs font-bold tracking-normal text-[var(--fg-muted)] shrink-0">
            Supported Frameworks
          </span>
        <div className="flex items-center gap-2 sm:gap-2.5 text-xs font-bold text-[var(--plum-900)] shrink-0 flex-nowrap">
            <span className="bg-[var(--plum-100)] px-3 py-1.5 rounded-md border border-[var(--border)] inline-flex items-center gap-1.5 duo-card-hover cursor-default shrink-0">
              <svg width="18" height="13" viewBox="0 0 18 13" fill="none" className="rounded-xs overflow-hidden border border-black/10 inline-block shrink-0" aria-hidden="true">
                <rect width="6" height="13" fill="#008751"/>
                <rect x="6" width="6" height="13" fill="#FFFFFF"/>
                <rect x="12" width="6" height="13" fill="#008751"/>
              </svg>
              <span>Nigeria (UBE)</span>
            </span>
            <span className="bg-[var(--plum-100)] px-3 py-1.5 rounded-md border border-[var(--border)] inline-flex items-center gap-1.5 duo-card-hover cursor-default shrink-0">
              <svg width="18" height="13" viewBox="0 0 18 13" fill="none" className="rounded-xs overflow-hidden border border-black/10 inline-block shrink-0" aria-hidden="true">
                <rect width="18" height="13" fill="#012169"/>
                <path d="M0 0L18 13M18 0L0 13" stroke="#FFF" strokeWidth="2.5"/>
                <path d="M0 0L18 13M18 0L0 13" stroke="#C8102E" strokeWidth="1.2"/>
                <path d="M9 0V13M0 6.5H18" stroke="#FFF" strokeWidth="4.5"/>
                <path d="M9 0V13M0 6.5H18" stroke="#C8102E" strokeWidth="2.5"/>
              </svg>
              <span>England (NC)</span>
            </span>
            <span className="bg-[var(--plum-100)] px-3 py-1.5 rounded-md border border-[var(--border)] inline-flex items-center gap-1.5 duo-card-hover cursor-default shrink-0">
              <svg width="18" height="13" viewBox="0 0 18 13" fill="none" className="rounded-xs overflow-hidden border border-black/10 inline-block shrink-0" aria-hidden="true">
                <rect width="18" height="13" fill="#B22234"/>
                <rect y="2" width="18" height="1.8" fill="#FFF"/>
                <rect y="5.5" width="18" height="1.8" fill="#FFF"/>
                <rect y="9" width="18" height="1.8" fill="#FFF"/>
                <rect width="8" height="7" fill="#3C3B6E"/>
              </svg>
              <span>US (Common Core)</span>
            </span>
            <span className="bg-[var(--plum-100)] px-3 py-1.5 rounded-md border border-[var(--border)] inline-flex items-center gap-1.5 duo-card-hover cursor-default shrink-0">
              <svg width="18" height="13" viewBox="0 0 18 13" fill="none" className="rounded-xs overflow-hidden border border-black/10 inline-block shrink-0" aria-hidden="true">
                <rect width="18" height="4.33" fill="#FF9933"/>
                <rect y="4.33" width="18" height="4.34" fill="#FFFFFF"/>
                <rect y="8.67" width="18" height="4.33" fill="#138808"/>
                <circle cx="9" cy="6.5" r="1.5" fill="none" stroke="#000080" strokeWidth="0.8"/>
              </svg>
              <span>India (CBSE)</span>
            </span>
            <span className="bg-[var(--plum-100)] px-3 py-1.5 rounded-md border border-[var(--border)] inline-flex items-center gap-1.5 duo-card-hover cursor-default shrink-0">
              <svg width="18" height="13" viewBox="0 0 18 13" fill="none" className="rounded-xs overflow-hidden border border-black/10 inline-block shrink-0" aria-hidden="true">
                <rect width="18" height="13" fill="#00247D"/>
                <rect width="9" height="6.5" fill="#012169"/>
                <path d="M0 0L9 6.5M9 0L0 6.5" stroke="#FFF" strokeWidth="1.2"/>
                <path d="M0 0L9 6.5M9 0L0 6.5" stroke="#C8102E" strokeWidth="0.6"/>
                <path d="M4.5 0V6.5M0 3.25H9" stroke="#FFF" strokeWidth="2.2"/>
                <path d="M4.5 0V6.5M0 3.25H9" stroke="#C8102E" strokeWidth="1.2"/>
                <circle cx="4.5" cy="9.5" r="0.9" fill="#FFF"/>
                <circle cx="13.5" cy="3.5" r="0.6" fill="#FFF"/>
                <circle cx="15" cy="5.5" r="0.6" fill="#FFF"/>
                <circle cx="13.5" cy="8" r="0.6" fill="#FFF"/>
                <circle cx="12" cy="6" r="0.6" fill="#FFF"/>
              </svg>
              <span>Australia (AC)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Trust & Moat Summary Tiles - Funkified Duolingo Chunky 3D Style */}
      <section className="bg-white border-y border-[var(--border)] py-20 px-6 overflow-hidden relative">

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-bold text-[var(--plum-900)] tracking-tight">
              Built for honesty. Built for trust.
            </h2>
            <p className="text-base text-[var(--fg-muted)] font-medium">
              Every feature runs offline as a calm PWA, computes decisions deterministically, and never shames learning mistakes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {/* Card 1: 0 Countdown Timers */}
            <div className="p-7 rounded-[2rem] bg-white border-2 border-teal-200 shadow-[0_8px_0_#A7F3D0] duo-card-hover cursor-pointer group flex flex-col items-center justify-between text-center transition-all hover:border-teal-400">
              <div className="w-18 h-18 rounded-2xl bg-teal-50 border-2 border-teal-200 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 mb-3">
                <DuoLingotGem size={42} />
              </div>
              <div className="space-y-1">
                <div className="text-5xl font-bold text-teal-600 tracking-tight">0</div>
                <h3 className="text-lg font-bold text-[var(--plum-900)]">Zero Countdown Timers</h3>
              </div>
              <p className="text-xs text-[var(--fg-muted)] font-medium mt-3 leading-relaxed">
                No ticking clock, no buzzer jumpscare. Pure, unhurried focus where children take their time to think.
              </p>
            </div>

            {/* Card 2: 100% Deterministic Kernel */}
            <div className="p-7 rounded-[2rem] bg-white border-2 border-amber-300 shadow-[0_8px_0_#FDE68A] duo-card-hover cursor-pointer group flex flex-col items-center justify-between text-center transition-all hover:border-amber-500">
              <div className="w-18 h-18 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 mb-3">
                <DuoStreakFlame size={44} />
              </div>
              <div className="space-y-1">
                <div className="text-5xl font-bold text-amber-500 tracking-tight">100%</div>
                <h3 className="text-lg font-bold text-[var(--plum-900)]">Transparent Rules</h3>
              </div>
              <p className="text-xs text-[var(--fg-muted)] font-medium mt-3 leading-relaxed [text-wrap:pretty]">
                Code decides difficulty and rewards, verified in{" "}
                <Link
                  href="/proof"
                  className="font-bold underline decoration-amber-400 text-[var(--plum-900)] hover:text-amber-700"
                >
                  How Moye Decides
                </Link>
                . Never random, never hallucinated.
              </p>
            </div>

            {/* Card 3: 1 Encouraging Mascot */}
            <div className="p-7 rounded-[2rem] bg-white border-2 border-purple-200 shadow-[0_8px_0_#E9D5FF] duo-card-hover cursor-pointer group flex flex-col items-center justify-between text-center transition-all hover:border-purple-400">
              <div className="w-18 h-18 rounded-2xl bg-purple-50 border-2 border-purple-200 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 mb-3">
                <DuoGoldenTrophy size={42} />
              </div>
              <div className="space-y-1">
                <div className="text-5xl font-bold text-[var(--plum-700)] tracking-tight">1</div>
                <h3 className="text-lg font-bold text-[var(--plum-900)]">Encouraging Mascot</h3>
              </div>
              <p className="text-xs text-[var(--fg-muted)] font-medium mt-3 leading-relaxed">
                Moyin sits right beside your child through every problem: cheering success, warmly guiding retries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Duolingo Signature Feature Story Sections (Alternating 2-Column Rows) */}
      <section className="max-w-5xl mx-auto px-6 py-20 space-y-24">
        {/* Story Row 1: Zero Pressure */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex justify-center">
            <div className="p-8 bg-white rounded-3xl border-2 border-[var(--border)] shadow-sm duo-card-hover cursor-pointer group">
              <div className="transform group-hover:scale-105 transition-transform duration-300">
                <CalmFocusIllustration size={160} />
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--plum-900)] leading-tight">
              Calm, bite-sized lessons. Zero timer panic.
            </h2>
            <p className="text-base text-[var(--fg-muted)] leading-relaxed">
              Traditional apps rush kids with ticking countdown clocks and harsh buzzer alarms. Moye Focus Mode presents one gentle question at a time with big tap targets and zero guilt.
            </p>
          </div>
        </div>

        {/* Story Row 2: Adaptive Mastery */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1 flex justify-center">
            <div className="p-8 bg-white rounded-3xl border-2 border-[var(--border)] shadow-sm duo-card-hover cursor-pointer group">
              <div className="transform group-hover:scale-105 transition-transform duration-300">
                <AdaptiveMasteryIllustration size={160} />
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--plum-900)] leading-tight [text-wrap:balance]">
              Meets each child in their optimal challenge zone.
            </h2>
            <p className="text-base text-[var(--fg-muted)] leading-relaxed [text-wrap:pretty]">
              Code decides, models suggest. Our Bayesian Knowledge Tracing engine calculates learner mastery after each step to keep learners confident: gentle support when stuck, fresh challenges when thriving.
            </p>
          </div>
        </div>

        {/* Story Row 3: Stay Motivated (Moyin Mascot on Streak Pedestals) */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex justify-center">
            <div className="p-8 bg-white rounded-3xl border-2 border-[var(--border)] shadow-sm duo-card-hover cursor-pointer group">
              <div className="transform group-hover:scale-105 transition-transform duration-300">
                <DuoStayMotivatedIllustration size={160} />
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--plum-900)] leading-tight">
              Stay Motivated
            </h2>
            <p className="text-base text-[var(--fg-muted)] leading-relaxed">
              We make it easy to form a lifelong habit of calm learning with bite-sized streaks, warm Spark celebrations, and guilt-free rest tokens from Moyin.
            </p>
          </div>
        </div>

        {/* Story Row 4: Sweet Rewards & Hive Shop */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1 flex justify-center">
            <div className="p-8 bg-white rounded-3xl border-2 border-[var(--border)] shadow-sm duo-card-hover cursor-pointer group">
              <div className="transform group-hover:scale-105 transition-transform duration-300">
                <HoneyRewardsIllustration size={160} />
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--plum-900)] leading-tight">
              Earn honey drops for Moyin&apos;s cozy hive.
            </h2>
            <p className="text-base text-[var(--fg-muted)] leading-relaxed">
              Progress feels rewarding without manipulative scarcity. Unlock acorn caps, knitted scarves, and friendly pet bees. Soft daily caps make sure kids know when they are done for today.
            </p>
          </div>
        </div>

        {/* Story Row 5: Accessibility & Neurodiversity */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex justify-center">
            <div className="p-8 bg-white rounded-3xl border-2 border-[var(--border)] shadow-sm duo-card-hover cursor-pointer group">
              <div className="transform group-hover:scale-105 transition-transform duration-300">
                <NeurodiversityIllustration size={160} />
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--plum-900)] leading-tight">
              Designed for ADHD, dyslexia, and active minds.
            </h2>
            <p className="text-base text-[var(--fg-muted)] leading-relaxed">
              Research-backed dyslexic letter spacing, calm reduced-motion switches, high-contrast palette, and browser Web Speech narration on every question. Accessibility is the foundation, not an afterthought.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive App Showcase: Focus Mode, Adaptive Engine, Hive Cosmetics, Teacher Reports */}
      <InteractiveAppShowcase />

      {/* Bottom Hero Call to Action */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center flex flex-col items-center gap-6">
        <div className="duo-mascot-float cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-300">
          <MoyinMascot pose="idle" size={130} />
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--plum-900)]">
          Start learning with Moye today.
        </h2>
        <p className="text-base text-[var(--fg-muted)] max-w-lg">
          No credit card, no ads, no countdown stress. Join Moyin the honey badger for calm, adaptive learning that meets every child where they are.
        </p>
        <Link
          href="/start"
          data-demo="start"
          className="btn-3d btn-3d-plum text-lg uppercase tracking-wider py-4 px-10 hover:brightness-105 active:scale-95 transition-all"
        >
          Get Started
        </Link>
      </section>

      {/* Comprehensive Duolingo-style Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--paper)] py-12 px-6 text-xs text-[var(--fg-muted)]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="font-bold text-[var(--plum-900)] text-sm">Learning</span>
            <ul className="space-y-2">
              <li><Link href="/start" className="hover:underline">Focus Mode</Link></li>
              <li><Link href="/learn" className="hover:underline">Skill Graph Map</Link></li>
              <li><Link href="/hive" className="hover:underline">Moyin&apos;s Hive</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <span className="font-bold text-[var(--plum-900)] text-sm">Grown-ups</span>
            <ul className="space-y-2">
              <li><Link href="/grownups" className="hover:underline">Teacher Portal</Link></li>
              <li><Link href="/grownups" className="hover:underline">Weekly Reports</Link></li>
              <li><Link href="/proof" className="hover:underline">Transparency Suite</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <span className="font-bold text-[var(--plum-900)] text-sm">Curriculum</span>
            <ul className="space-y-2">
              <li><span className="text-[var(--fg-muted)]">Nigeria UBE (Universal Basic)</span></li>
              <li><span className="text-[var(--fg-muted)]">England National Curriculum</span></li>
              <li><span className="text-[var(--fg-muted)]">US Common Core</span></li>
            </ul>
          </div>
          <div className="space-y-3">
            <span className="font-bold text-[var(--plum-900)] text-sm">Transparency</span>
            <ul className="space-y-2">
              <li><span className="text-[var(--fg-muted)]">100% Deterministic Engine</span></li>
              <li><span className="text-[var(--fg-muted)]">Zero Countdown Timers</span></li>
              <li><Link href="/proof" className="hover:underline font-bold text-[var(--plum-700)]">How Moye Decides</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-[var(--border)] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold">Moye · Open, Free, and Calm Learning</span>
          <span>Made with care for every curious mind</span>
        </div>
      </footer>
    </div>
  );
}
