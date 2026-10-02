"use client";

import { useAccessibility, type ReadingTint } from "@/lib/accessibility-context";
import { SUPPORTED_VOICE_LANGUAGES, speakMultilingualText } from "@/lib/multilingual-voice";
import { CloseIcon } from "@/components/ui/svg-icons";

export function AccessibilitySheet() {
  const {
    dyslexicFont,
    setDyslexicFont,
    fontChoice,
    setFontChoice,
    readingRuler,
    setReadingRuler,
    readingTint,
    setReadingTint,
    wordHighlight,
    setWordHighlight,
    reducedMotion,
    setReducedMotion,
    largeText,
    setLargeText,
    soundEnabled,
    setSoundEnabled,
    speechSpeed,
    setSpeechSpeed,
    narrationLanguage,
    setNarrationLanguage,
    panelOpen,
    setPanelOpen,
  } = useAccessibility();

  if (!panelOpen) return null;

  const tints: { id: ReadingTint; label: string; bgClass: string }[] = [
    { id: "cream", label: "Warm Cream", bgClass: "bg-[#FAF7EE] border-[#DFD3BF] text-[#22143D]" },
    { id: "peach", label: "Soft Peach", bgClass: "bg-[#FDF3EB] border-[#E8D3C3] text-[#22143D]" },
    { id: "mint", label: "Pale Mint", bgClass: "bg-[#EFF7F3] border-[#C8DFD4] text-[#22143D]" },
    { id: "sky", label: "Soft Sky", bgClass: "bg-[#EFF5FA] border-[#C8D7E8] text-[#22143D]" },
    { id: "none", label: "Default", bgClass: "bg-white border-zinc-300 text-zinc-800" },
  ];

  return (
    <div
      role="dialog"
      aria-label="Accessibility settings"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-4"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border-2 border-[var(--border)] text-[var(--plum-900)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div>
            <h2 className="text-xl font-bold">Accessibility &amp; Comfort</h2>
            <p className="text-xs text-[var(--fg-muted)] mt-0.5">Adjust typography, spacing, and visual calm</p>
          </div>
          <button
            type="button"
            onClick={() => setPanelOpen(false)}
            aria-label="Close accessibility settings"
            className="rounded-lg p-2 hover:bg-[var(--plum-100)] flex items-center justify-center border border-transparent hover:border-[var(--border)]"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="space-y-6 pt-6">
          {/* Primary Dyslexia Spacing & Geometry Toggle */}
          <div className="p-4 rounded-xl border-2 border-[var(--plum-500)]/30 bg-[var(--plum-100)]/40 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-base text-[var(--plum-900)]">Reading-Friendly Spacing</div>
                <div className="text-xs text-[var(--fg-muted)] leading-relaxed">
                  Enhanced letter spacing, word separation, and line height to prevent visual crowding
                </div>
              </div>
              <button
                type="button"
                data-demo="a11y-dyslexia"
                onClick={() => setDyslexicFont(!dyslexicFont)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors shrink-0 ${
                  dyslexicFont
                    ? "bg-[var(--teal-500)] text-white border-[var(--teal-700)] shadow-xs"
                    : "bg-zinc-100 text-zinc-700 border-zinc-300"
                }`}
              >
                {dyslexicFont ? "ON" : "OFF"}
              </button>
            </div>

            {/* Sub-controls when Dyslexia Mode is active */}
            {dyslexicFont && (
              <div className="pt-3 border-t border-[var(--border)] space-y-4">
                {/* Font Choice */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--fg-muted)] mb-2">
                    Dyslexia Font Face
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFontChoice("opendyslexic")}
                      className={`p-3 rounded-xl border text-left transition-colors ${
                        fontChoice === "opendyslexic"
                          ? "bg-white border-[var(--plum-700)] shadow-xs"
                          : "bg-white/60 border-zinc-200 hover:bg-white"
                      }`}
                    >
                      <div className="text-xs font-bold text-[var(--plum-900)]">OpenDyslexic</div>
                      <div className="text-[11px] text-[var(--fg-muted)]">Weighted bottom gravity</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFontChoice("lexend")}
                      className={`p-3 rounded-xl border text-left transition-colors ${
                        fontChoice === "lexend"
                          ? "bg-white border-[var(--plum-700)] shadow-xs"
                          : "bg-white/60 border-zinc-200 hover:bg-white"
                      }`}
                    >
                      <div className="text-xs font-bold text-[var(--plum-900)]">Lexend Calm</div>
                      <div className="text-[11px] text-[var(--fg-muted)]">Expanded letter counters</div>
                    </button>
                  </div>
                </div>

                {/* Anti-Glare Color Tint (Irlen relief) */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--fg-muted)] mb-2">
                    Anti-Glare Reading Tint (Visual Stress Relief)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tints.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setReadingTint(t.id)}
                        className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-all cursor-pointer ${t.bgClass} ${
                          readingTint === t.id
                            ? "ring-2 ring-[var(--plum-700)] font-semibold shadow-2xs"
                            : "opacity-80 hover:opacity-100 hover:border-[var(--plum-400)]"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reading Ruler Toggle */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="font-semibold text-sm">Reading Ruler (Line Guide)</div>
                    <div className="text-xs text-[var(--fg-muted)]">Visual guide bar to keep place while reading</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReadingRuler(!readingRuler)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                      readingRuler
                        ? "bg-[var(--teal-500)] text-white border-[var(--teal-700)]"
                        : "bg-zinc-100 text-zinc-700 border-zinc-300"
                    }`}
                  >
                    {readingRuler ? "ON" : "OFF"}
                  </button>
                </div>

                {/* Read-Aloud Word Tracking Toggle */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="font-semibold text-sm">Word Highlight on Speech</div>
                    <div className="text-xs text-[var(--fg-muted)]">Lights up each word as the voice speaks it</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWordHighlight(!wordHighlight)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                      wordHighlight
                        ? "bg-[var(--teal-500)] text-white border-[var(--teal-700)]"
                        : "bg-zinc-100 text-zinc-700 border-zinc-300"
                    }`}
                  >
                    {wordHighlight ? "ON" : "OFF"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reduced motion toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-base">Calm Motion</div>
              <div className="text-xs text-[var(--fg-muted)]">Turns off bouncing animations and transitions</div>
            </div>
            <button
              type="button"
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                reducedMotion
                  ? "bg-[var(--teal-500)] text-white border-[var(--teal-700)]"
                  : "bg-zinc-100 text-zinc-700 border-zinc-300"
              }`}
            >
              {reducedMotion ? "ON" : "OFF"}
            </button>
          </div>

          {/* Large text toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-base">Extra Large Text</div>
              <div className="text-xs text-[var(--fg-muted)]">Increases default text sizing</div>
            </div>
            <button
              type="button"
              onClick={() => setLargeText(!largeText)}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                largeText
                  ? "bg-[var(--teal-500)] text-white border-[var(--teal-700)]"
                  : "bg-zinc-100 text-zinc-700 border-zinc-300"
              }`}
            >
              {largeText ? "ON" : "OFF"}
            </button>
          </div>

          {/* Sound Feedback */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-base">Sound Feedback</div>
              <div className="text-xs text-[var(--fg-muted)]">Gentle encouragement chimes</div>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                soundEnabled
                  ? "bg-[var(--teal-500)] text-white border-[var(--teal-700)]"
                  : "bg-zinc-100 text-zinc-700 border-zinc-300"
              }`}
            >
              {soundEnabled ? "ON" : "OFF"}
            </button>
          </div>

          {/* Narration Language & Voice */}
          <div className="space-y-3 pt-3 border-t border-[var(--border)]">
            <div>
              <div className="font-semibold text-base text-[var(--plum-900)]">Narration Language and Voice</div>
              <div className="text-xs text-[var(--fg-muted)]">Moyin reads questions and clues in this language</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUPPORTED_VOICE_LANGUAGES.map((lang) => {
                const isActive = narrationLanguage === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => {
                      setNarrationLanguage(lang.id);
                      speakMultilingualText(lang.sampleGreeting, lang.id, speechSpeed);
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      isActive
                        ? "bg-white border-[var(--plum-700)] text-[var(--plum-900)] shadow-xs"
                        : "bg-[var(--paper)] border-[var(--border)] text-[var(--fg-muted)] hover:bg-white"
                    }`}
                  >
                    <div className="font-bold text-sm text-[var(--plum-900)] flex items-center justify-between">
                      <span>{lang.label}</span>
                      {isActive && <span className="text-xs text-[var(--plum-700)] font-semibold">Active</span>}
                    </div>
                    <div className="text-xs opacity-80 mt-1">{lang.nativeLabel}</div>
                    <div className="text-[11px] text-[var(--fg-muted)] mt-1">{lang.region}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-[var(--fg-muted)]">Tap any language to preview greeting</span>
              <button
                type="button"
                onClick={() => {
                  const current = SUPPORTED_VOICE_LANGUAGES.find((l) => l.id === narrationLanguage);
                  if (current) {
                    speakMultilingualText(current.sampleGreeting, current.id, speechSpeed);
                  }
                }}
                className="text-xs font-semibold text-[var(--plum-700)] hover:underline"
              >
                Listen Sample
              </button>
            </div>
          </div>

          {/* Speech Rate */}
          <div>
            <div className="flex justify-between text-sm font-semibold mb-1">
              <span>Read aloud speed</span>
              <span className="font-mono text-xs">{speechSpeed}x</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.25"
              step="0.05"
              value={speechSpeed}
              onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
              className="w-full accent-[var(--plum-700)] cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={() => setPanelOpen(false)}
            className="w-full btn-3d btn-3d-plum py-2 px-3 text-base"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
