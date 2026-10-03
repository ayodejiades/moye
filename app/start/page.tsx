"use client";

import { ComfortButton } from "@/components/comfort-button";
import { PlacementQuiz, PlacementSummary } from "@/components/placement-quiz";
import { CONTENT_LENSES, CONTENT_LOCALES, LOCALE_BY_LENS } from "@/lib/content.generated";
import { LEVEL_SEQUENCE } from "@/lib/moye-store";
import { levelsToUnlock, type PlacementResult } from "@/lib/placement";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMoyeStore } from "@/lib/moye-store";
import { MoyinMascot } from "@/components/moyin-mascot";
import {
  DinosaurIcon,
  FootballIcon,
  RocketIcon,
  CheckIcon,
  AdaAvatar,
  ChidiAvatar,
  HoneyDropIcon,
  SparkIcon,
} from "@/components/ui/svg-icons";

/**
 * The curriculum lenses come from content/lenses/lenses.json via lib/content-data.ts, so
 * the onboarding list, the lesson player and the committed content cannot disagree.
 */
const CURRICULA = CONTENT_LENSES.map((lens) => {
  const locale = CONTENT_LOCALES.find((l) => l.id === LOCALE_BY_LENS[lens.id]);
  return {
    id: lens.id,
    name: lens.name,
    region: lens.region,
    country: locale?.country ?? lens.region,
    currency: locale?.currencySymbol ?? "",
  };
});

const THEMES = [
  { id: "dinosaurs", name: "Dinosaurs", Icon: DinosaurIcon },
  { id: "football", name: "Football", Icon: FootballIcon },
  { id: "space", name: "Space Journey", Icon: RocketIcon },
];

export default function StartPage() {
  const router = useRouter();
  const { state, signInProfile, createProfile, signInWithCredentials, saveState } = useMoyeStore();

  const [authMode, setAuthMode] = useState<"signup" | "signin">(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "signin") return "signin";
    }
    return "signup";
  });
  const [step, setStep] = useState<"details" | "theme" | "placement" | "placement-result">("details");
  const [name, setName] = useState("Anjola");
  const [selectedLens, setSelectedLens] = useState("ng-ube");
  const [selectedTheme, setSelectedTheme] = useState("dinosaurs");

  const [selectedProfileId, setSelectedProfileId] = useState("profile-ayodeji");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPasscode, setLoginPasscode] = useState("");
  const [loginRole, setLoginRole] = useState<"learner" | "teacher">("learner");
  const [placement, setPlacement] = useState<PlacementResult | null>(null);

  /** Skipping placement is a first class choice, not a failure: start at level one. */
  const handleStartLearning = (startingLevelId = "s1") => {
    createProfile({
      name,
      curriculum: selectedLens,
      theme: selectedTheme,
      role: "learner",
    });
    saveState({
      unlockedLevels: levelsToUnlock(startingLevelId, LEVEL_SEQUENCE),
      currentLevelId: startingLevelId,
    });
    router.push(`/lesson?level=${startingLevelId}`);
  };

  const handleSavedProfileSignIn = (profileId: string) => {
    setSelectedProfileId(profileId);
    signInProfile(profileId);
  };

  const handleContinueSavedProfile = () => {
    signInProfile(selectedProfileId);
    router.push("/learn");
  };

  const handleCredentialsSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = loginIdentifier.trim() || (loginRole === "teacher" ? "Teacher Mode" : "Anjola");
    signInWithCredentials(identifier, loginRole);
    if (loginRole === "teacher") {
      router.push("/grownups");
    } else {
      router.push("/learn");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--paper)] text-[var(--plum-900)] px-6 py-12">
      <div className="w-full max-w-lg flex justify-end mb-4">
        <ComfortButton />
      </div>
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border-2 border-[var(--border)] shadow-sm space-y-6">
        
        {/* Mascot & Heading */}
        <div className="flex flex-col items-center text-center">
          <MoyinMascot pose={authMode === "signin" ? "cheer" : "smile"} size={130} />
          <h1 className="text-2xl sm:text-3xl font-bold mt-3 [text-wrap:balance]">
            {authMode === "signin" ? "Welcome back to Moye" : "Welcome to Moye"}
          </h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1 [text-wrap:pretty]">
            {authMode === "signin"
              ? "Choose your learner profile or sign in with your credentials."
              : "Set up calm learning that meets you right where you are."}
          </p>
        </div>

        {/* Tab Switcher: Sign Up vs Sign In */}
        <div className="grid grid-cols-2 p-1 bg-[var(--paper)] border border-[var(--border)] rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setAuthMode("signup")}
            className={`py-2 px-3 text-sm font-semibold rounded-lg transition-all ${
              authMode === "signup"
                ? "bg-white text-[var(--plum-900)] border border-[var(--border)] shadow-xs"
                : "text-[var(--fg-muted)] hover:text-[var(--plum-900)]"
            }`}
          >
            Create Profile
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("signin")}
            className={`py-2 px-3 text-sm font-semibold rounded-lg transition-all ${
              authMode === "signin"
                ? "bg-white text-[var(--plum-900)] border border-[var(--border)] shadow-xs"
                : "text-[var(--fg-muted)] hover:text-[var(--plum-900)]"
            }`}
          >
            Sign In
          </button>
        </div>

        {/* ==================== SIGN UP FLOW ==================== */}
        {authMode === "signup" && (
          <div className="space-y-6">
            {step === "details" && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="child-name" className="block text-sm font-bold mb-2">
                    What is your name?
                  </label>
                  <input
                    id="child-name"
                    type="text"
                    data-demo="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border-2 border-[var(--border)] px-4 py-3 text-base font-bold outline-none focus:border-[var(--plum-700)] bg-[var(--paper)] text-[var(--plum-900)]"
                  />
                </div>

                <div data-demo="country">
                  <label className="block text-sm font-bold mb-2">
                    Where do you learn?
                  </label>
                  <div className="space-y-2">
                    {CURRICULA.map((cur) => (
                      <button
                        key={cur.id}
                        type="button"
                        data-demo={`lens-${cur.id}`}
                        onClick={() => {
                          setSelectedLens(cur.id);
                          setStep("theme");
                        }}
                        className={`w-full text-left p-3 rounded-xl font-bold text-sm border-2 transition-all flex items-center justify-between ${
                          selectedLens === cur.id
                            ? "border-[var(--plum-700)] bg-[var(--plum-100)] text-[var(--plum-900)] shadow-xs"
                            : "border-[var(--border)] bg-white text-[var(--fg-muted)] hover:bg-[var(--paper)]"
                        }`}
                      >
                        <div>
                          <div className="font-bold">{cur.name}</div>
                          <div className="text-xs font-normal opacity-80">{cur.region}</div>
                        </div>
                        {selectedLens === cur.id && <CheckIcon size={18} className="text-[var(--plum-700)]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("theme")}
                  className="btn-3d btn-3d-plum w-full text-base font-semibold py-2 px-3 flex items-center justify-center"
                >
                  Continue to Story Theme
                </button>
              </div>
            )}

            {/* Six questions to find a real starting point, skippable (features.md A2) */}
            {step === "placement" && (
              <PlacementQuiz
                themeId={selectedTheme}
                onSkip={() => handleStartLearning()}
                onFinish={(result) => {
                  setPlacement(result);
                  setStep("placement-result");
                }}
              />
            )}

            {step === "placement-result" && placement && (
              <PlacementSummary
                result={placement}
                onContinue={() => handleStartLearning(placement.startingLevelId)}
              />
            )}

            {step === "theme" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Pick your favourite story theme:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {THEMES.map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        data-demo={`theme-${th.id}`}
                        onClick={() => {
                          setSelectedTheme(th.id);
                          setStep("placement");
                        }}
                        className={`p-4 rounded-xl border-2 font-bold flex flex-col items-center gap-2 transition-all ${
                          selectedTheme === th.id
                            ? "border-[var(--plum-700)] bg-[var(--plum-100)] text-[var(--plum-900)] shadow-xs"
                            : "border-[var(--border)] bg-white text-[var(--fg-muted)] hover:bg-[var(--paper)]"
                        }`}
                      >
                        <th.Icon size={38} />
                        <span className="text-sm">{th.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="w-1/3 py-2 px-3 text-sm font-semibold rounded-xl border-2 border-[var(--border)] text-[var(--plum-900)] bg-white hover:bg-[var(--paper)]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartLearning()}
                    className="btn-3d btn-3d-plum flex-1 text-base font-semibold py-2 px-3 flex items-center justify-center"
                  >
                    Start Learning
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[var(--border)] flex items-center justify-center gap-1.5 text-xs sm:text-sm">
              <span className="text-[var(--fg-muted)]">Already have a profile?</span>
              <button
                type="button"
                onClick={() => setAuthMode("signin")}
                className="font-bold text-[var(--plum-700)] hover:text-[var(--plum-900)] underline decoration-[var(--plum-300)] underline-offset-4 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--plum-700)] rounded-xs"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* ==================== SIGN IN FLOW ==================== */}
        {authMode === "signin" && (
          <div className="space-y-6">
            
            {/* Quick Profile Switcher for Learners */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Choose a saved learner profile:
              </label>
              <div className="space-y-2">
                {state.profiles.map((p) => {
                  const isSelected = selectedProfileId === p.id;
                  const isAnjola = p.name.toLowerCase().includes("anjola") || p.name.toLowerCase().includes("ada");
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSavedProfileSignIn(p.id)}
                      className={`w-full text-left p-3 rounded-xl font-bold text-sm border-2 transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-[var(--plum-700)] bg-[var(--plum-100)] text-[var(--plum-900)] shadow-xs"
                          : "border-[var(--border)] bg-white text-[var(--fg-muted)] hover:bg-[var(--paper)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[var(--border)] flex items-center justify-center shrink-0">
                          {isAnjola ? <AdaAvatar size={28} /> : <ChidiAvatar size={28} />}
                        </div>
                        <div>
                          <div className="font-bold text-base text-[var(--plum-900)]">{p.name}</div>
                          <div className="text-xs font-normal opacity-80">
                            {p.curriculum === "ng-ube" ? "Nigeria Framework" : "Standard Framework"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1 text-[var(--honey-700)] font-semibold bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                          <HoneyDropIcon size={14} />
                          <span>{p.honeyBalance}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[var(--plum-700)] font-semibold bg-[var(--plum-100)] px-2 py-1 rounded-md border border-[var(--border)]">
                          <SparkIcon size={14} />
                          <span>{p.streakDays}d</span>
                        </span>
                        {isSelected && <CheckIcon size={18} className="text-[var(--plum-700)] ml-1" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleContinueSavedProfile}
                className="btn-3d btn-3d-plum w-full text-base font-semibold py-2 px-3 mt-3 flex items-center justify-center"
              >
                Continue as {state.profiles.find((p) => p.id === selectedProfileId)?.name || "Anjola"}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[var(--border)]"></div>
              <span className="shrink mx-3 text-xs font-bold text-[var(--fg-muted)]">
                or sign in with details
              </span>
              <div className="flex-grow border-t border-[var(--border)]"></div>
            </div>

            {/* Credentials / Guardian Sign In Form */}
            <form onSubmit={handleCredentialsSignIn} className="space-y-4">
              <div className="grid grid-cols-2 p-1 bg-[var(--paper)] border border-[var(--border)] rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setLoginRole("learner")}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                    loginRole === "learner"
                      ? "bg-white text-[var(--plum-900)] border border-[var(--border)] shadow-xs"
                      : "text-[var(--fg-muted)] hover:text-[var(--plum-900)]"
                  }`}
                >
                  Learner
                </button>
                <button
                  type="button"
                  onClick={() => setLoginRole("teacher")}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                    loginRole === "teacher"
                      ? "bg-white text-[var(--plum-900)] border border-[var(--border)] shadow-xs"
                      : "text-[var(--fg-muted)] hover:text-[var(--plum-900)]"
                  }`}
                >
                  Parent or Teacher
                </button>
              </div>

              <div>
                <label htmlFor="login-id" className="block text-xs font-bold mb-1">
                  {loginRole === "teacher" ? "Email address" : "Learner name"}
                </label>
                <input
                  id="login-id"
                  type={loginRole === "teacher" ? "email" : "text"}
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder={loginRole === "teacher" ? "teacher@school.org" : "Anjola"}
                  className="w-full rounded-xl border-2 border-[var(--border)] px-4 py-2 text-sm font-semibold outline-none focus:border-[var(--plum-700)] bg-[var(--paper)] text-[var(--plum-900)]"
                />
              </div>

              <div>
                <label htmlFor="login-pass" className="block text-xs font-bold mb-1 flex items-center justify-between">
                  <span>Secret pass code</span>
                  <span className="text-[10px] font-normal text-[var(--fg-muted)]">optional for learners</span>
                </label>
                <input
                  id="login-pass"
                  type="password"
                  value={loginPasscode}
                  onChange={(e) => setLoginPasscode(e.target.value)}
                  placeholder="Enter secret code"
                  className="w-full rounded-xl border-2 border-[var(--border)] px-4 py-2 text-sm font-semibold outline-none focus:border-[var(--plum-700)] bg-[var(--paper)] text-[var(--plum-900)]"
                />
              </div>

              <button
                type="submit"
                className="btn-3d btn-3d-plum w-full text-base font-semibold py-2 px-3 flex items-center justify-center"
              >
                Sign In to Moye
              </button>
            </form>

            <div className="pt-4 border-t border-[var(--border)] flex items-center justify-center gap-1.5 text-xs sm:text-sm">
              <span className="text-[var(--fg-muted)]">New to Moye?</span>
              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                className="font-bold text-[var(--plum-700)] hover:text-[var(--plum-900)] underline decoration-[var(--plum-300)] underline-offset-4 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--plum-700)] rounded-xs"
              >
                Create Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
