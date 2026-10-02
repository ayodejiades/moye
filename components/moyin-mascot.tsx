import React from "react";

export type MoyinPose = "idle" | "cheer" | "think" | "sleepy" | "body-double" | "smile";

export interface MoyinMascotProps {
  pose?: MoyinPose;
  className?: string;
  size?: number;
  cosmetic?: string | null;
  hat?: string | null;
  glasses?: string | null;
  scarf?: string | null;
  pet?: string | null;
}

export function MoyinMascot({
  pose = "idle",
  className = "",
  size = 120,
  cosmetic = null,
  hat = null,
  glasses = null,
  scarf = null,
  pet = null,
}: MoyinMascotProps) {
  const activeHat = hat ?? (cosmetic?.startsWith("hat-") ? cosmetic : null);
  const activeGlasses = glasses ?? (cosmetic?.startsWith("glasses-") ? cosmetic : null);
  const activeScarf = scarf ?? (cosmetic?.startsWith("scarf-") ? cosmetic : null);
  const activePet = pet ?? (cosmetic?.startsWith("pet-") ? cosmetic : null);
  return (
    <div
      className={`relative inline-flex items-center justify-center transition-transform duration-300 ${className}`}
      style={{ width: size, height: size }}
      aria-label={`Moyin the honey badger mascot (${pose} pose)`}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="overflow-visible"
      >
        {/* Shadow */}
        <ellipse cx="50" cy="92" rx="36" ry="7" fill="#EFE9FA" />

        {/* Badger Ears */}
        <ellipse cx="26" cy="32" rx="10" ry="12" fill="#2A1B4D" />
        <ellipse cx="26" cy="32" rx="6" ry="8" fill="#E88AA6" />
        <ellipse cx="74" cy="32" rx="10" ry="12" fill="#2A1B4D" />
        <ellipse cx="74" cy="32" rx="6" ry="8" fill="#E88AA6" />

        {/* Body */}
        <rect x="24" y="44" width="52" height="46" rx="24" fill="#2A1B4D" />

        {/* Honey Badger White & Honey Stripe */}
        <path
          d="M 38 24 Q 50 18 62 24 L 58 75 Q 50 78 42 75 Z"
          fill="#FFFDF7"
        />
        {/* Warm Honey Accent Stripe */}
        <path
          d="M 46 22 Q 50 20 54 22 L 53 72 Q 50 74 47 72 Z"
          fill="#F5A524"
        />

        {/* Head */}
        <circle cx="50" cy="42" r="28" fill="#2A1B4D" />
        <ellipse cx="50" cy="46" rx="20" ry="18" fill="#FFFDF7" />

        {/* Cheeks */}
        <circle cx="38" cy="52" r={pose === "smile" ? 4.8 : 4} fill="#E88AA6" opacity={pose === "smile" ? 0.8 : 0.6} />
        <circle cx="62" cy="52" r={pose === "smile" ? 4.8 : 4} fill="#E88AA6" opacity={pose === "smile" ? 0.8 : 0.6} />

        {/* Eyes according to pose */}
        {pose === "sleepy" ? (
          <>
            {/* Happy closed sleepy arcs */}
            <path d="M 39 44 Q 43 48 47 44" stroke="#2A1B4D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 53 44 Q 57 48 61 44" stroke="#2A1B4D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        ) : pose === "think" ? (
          <>
            {/* Thoughtful curved eyebrows (ONLY for when a kid needs help on a question) */}
            <path d="M 39 36 Q 43 33.5 47 35.5" stroke="#2A1B4D" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 53 34 Q 56.5 31.5 61 33.5" stroke="#2A1B4D" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Thoughtful glance upwards and slightly right */}
            <circle cx="44" cy="40.5" r="3.5" fill="#2A1B4D" />
            <circle cx="45.5" cy="39" r="1.3" fill="#FFF" />
            <circle cx="58" cy="40.5" r="3.5" fill="#2A1B4D" />
            <circle cx="59.5" cy="39" r="1.3" fill="#FFF" />
          </>
        ) : pose === "cheer" ? (
          <>
            {/* Wide sparkling eyes */}
            <circle cx="43" cy="43" r="4.5" fill="#2A1B4D" />
            <circle cx="45" cy="41" r="1.8" fill="#FFF" />
            <circle cx="57" cy="43" r="4.5" fill="#2A1B4D" />
            <circle cx="59" cy="41" r="1.8" fill="#FFF" />
          </>
        ) : pose === "smile" ? (
          <>
            {/* Friendly, joyful smiling open sparkle eyes */}
            <circle cx="43" cy="43.5" r="4.2" fill="#2A1B4D" />
            <circle cx="45" cy="41.5" r="1.6" fill="#FFF" />
            <circle cx="57" cy="43.5" r="4.2" fill="#2A1B4D" />
            <circle cx="59" cy="41.5" r="1.6" fill="#FFF" />
          </>
        ) : (
          <>
            {/* Calm, friendly open eyes */}
            <circle cx="43" cy="44" r="3.5" fill="#2A1B4D" />
            <circle cx="44.5" cy="42.5" r="1.2" fill="#FFF" />
            <circle cx="57" cy="44" r="3.5" fill="#2A1B4D" />
            <circle cx="58.5" cy="42.5" r="1.2" fill="#FFF" />
          </>
        )}

        {/* Snout & Nose */}
        <ellipse cx="50" cy="50" rx="3.5" ry="2.5" fill="#2A1B4D" />

        {/* Mouth */}
        {pose === "cheer" || pose === "smile" ? (
          <path d="M 46 52.5 Q 50 57.5 54 52.5" stroke="#2A1B4D" strokeWidth="2" fill="#E88AA6" strokeLinecap="round" />
        ) : pose === "sleepy" ? (
          <path d="M 47 52 Q 50 54 53 52" stroke="#2A1B4D" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        ) : pose === "think" ? (
          <path d="M 47 54 Q 50.5 55 53.5 52.5" stroke="#2A1B4D" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M 47 52.5 Q 50 56 53 52.5" stroke="#2A1B4D" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Paws / Hands */}
        {pose === "cheer" ? (
          <>
            <ellipse cx="26" cy="52" rx="6" ry="8" fill="#2A1B4D" transform="rotate(-30 26 52)" />
            <ellipse cx="74" cy="52" rx="6" ry="8" fill="#2A1B4D" transform="rotate(30 74 52)" />
          </>
        ) : pose === "smile" ? (
          <>
            <ellipse cx="32" cy="65" rx="6" ry="6.5" fill="#2A1B4D" transform="rotate(10 32 65)" />
            <ellipse cx="68" cy="65" rx="6" ry="6.5" fill="#2A1B4D" transform="rotate(-10 68 65)" />
          </>
        ) : pose === "think" ? (
          <>
            {/* Left Arm (resting across torso) */}
            <path d="M 28 60 Q 36 67 44 67 C 46 67 46 64 44 63 Q 36 62 30 56 Z" fill="#2A1B4D" />
            <ellipse cx="43" cy="65" rx="4.5" ry="3.5" fill="#2A1B4D" />

            {/* Right Arm (bent, reaching up to support chin) */}
            <path d="M 68 64 C 69 57 65 52 58 53 L 56 57 C 62 57 64 62 64 68 Z" fill="#2A1B4D" />
            {/* Paw resting under chin */}
            <ellipse cx="57" cy="54" rx="4.5" ry="4" fill="#2A1B4D" transform="rotate(-15 57 54)" />
            {/* Paw knuckles / fingers tapping chin */}
            <circle cx="53.5" cy="52" r="1.8" fill="#2A1B4D" />
            <circle cx="55.5" cy="50" r="1.8" fill="#2A1B4D" />
            <circle cx="58.5" cy="50.5" r="1.8" fill="#2A1B4D" />
            {/* Paw pad accent */}
            <ellipse cx="57.5" cy="54.5" rx="2.2" ry="1.6" fill="#E88AA6" opacity="0.6" transform="rotate(-15 57.5 54.5)" />

            {/* Floating Thought / Idea Trail */}
            <circle cx="73" cy="26" r="1.8" fill="#F5A524" opacity="0.85" />
            <circle cx="78" cy="19" r="2.5" fill="#F5A524" opacity="0.85" />
            <circle cx="85" cy="13" r="3.8" fill="#F5A524" opacity="0.85" />
            <path d="M 85 10.5 L 85 15.5 M 82.5 13 L 87.5 13" stroke="#FFFDF7" strokeWidth="1" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="34" cy="68" rx="6" ry="6" fill="#2A1B4D" />
            <ellipse cx="66" cy="68" rx="6" ry="6" fill="#2A1B4D" />
          </>
        )}

        {/* Cosmetics Overlays (SVG) */}
        {/* Glasses & Eyewear */}
        {activeGlasses === "glasses-reading" && (
          <g id="moyin-glasses-reading">
            {/* Frame drop shadow */}
            <ellipse cx="42.5" cy="45" rx="7" ry="6.5" fill="#150C28" opacity="0.18" />
            <ellipse cx="57.5" cy="45" rx="7" ry="6.5" fill="#150C28" opacity="0.18" />
            {/* Tortoiseshell / Amber Rims */}
            <circle cx="42.5" cy="43.5" r="7.5" fill="#FEF3C7" fillOpacity="0.25" stroke="#B45309" strokeWidth="1.8" />
            <circle cx="57.5" cy="43.5" r="7.5" fill="#FEF3C7" fillOpacity="0.25" stroke="#B45309" strokeWidth="1.8" />
            {/* Bridge */}
            <path d="M 49.5 43 Q 50 41.5 50.5 43" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            {/* Temples extending back to ears */}
            <path d="M 35 43.5 L 26 39 M 65 43.5 L 74 39" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
            {/* Lens Sheen / Glass reflection */}
            <path d="M 38 41 Q 41 38.5 44 40" stroke="#FFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
            <path d="M 53 41 Q 56 38.5 59 40" stroke="#FFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          </g>
        )}

        {activeGlasses === "glasses-star" && (
          <g id="moyin-glasses-star">
            {/* Center Bridge */}
            <line x1="47.5" y1="43.5" x2="52.5" y2="43.5" stroke="#5B3A9E" strokeWidth="2.2" strokeLinecap="round" />
            {/* Temples */}
            <line x1="36" y1="43.5" x2="27" y2="39" stroke="#5B3A9E" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="64" y1="43.5" x2="73" y2="39" stroke="#5B3A9E" strokeWidth="1.6" strokeLinecap="round" />
            {/* Left Star */}
            <polygon
              points="42.5,35 44.5,40.5 50.5,41 46,45 47.5,51 42.5,47.5 37.5,51 39,45 34.5,41 40.5,40.5"
              fill="#EFE9FA"
              fillOpacity="0.4"
              stroke="#5B3A9E"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Right Star */}
            <polygon
              points="57.5,35 59.5,40.5 65.5,41 61,45 62.5,51 57.5,47.5 52.5,51 54,45 49.5,41 55.5,40.5"
              fill="#EFE9FA"
              fillOpacity="0.4"
              stroke="#5B3A9E"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle cx="42.5" cy="43.5" r="1.5" fill="#F5A524" opacity="0.9" />
            <circle cx="57.5" cy="43.5" r="1.5" fill="#F5A524" opacity="0.9" />
          </g>
        )}

        {activeGlasses === "glasses-sunglasses" && (
          <g id="moyin-glasses-sunglasses">
            {/* Drop shadow */}
            <path d="M 32 42 Q 50 44 68 42 L 67 52 Q 50 54 33 52 Z" fill="#150C28" opacity="0.25" />
            {/* Dark Top Brow Bar */}
            <path d="M 32 40 L 68 40" stroke="#2A1B4D" strokeWidth="2.8" strokeLinecap="round" />
            {/* Left Lens */}
            <path
              d="M 33 41 C 33 41 33 49 42 49 C 48 49 48 41 48 41 Z"
              fill="#F5A524"
              stroke="#2A1B4D"
              strokeWidth="2"
            />
            <line x1="36" y1="42.5" x2="39" y2="47.5" stroke="#FFFDF7" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
            {/* Right Lens */}
            <path
              d="M 52 41 C 52 41 52 49 58 49 C 67 49 67 41 67 41 Z"
              fill="#F5A524"
              stroke="#2A1B4D"
              strokeWidth="2"
            />
            <line x1="55" y1="42.5" x2="58" y2="47.5" stroke="#FFFDF7" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
            {/* Temples */}
            <line x1="33" y1="40" x2="26" y2="37" stroke="#2A1B4D" strokeWidth="2" strokeLinecap="round" />
            <line x1="67" y1="40" x2="74" y2="37" stroke="#2A1B4D" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {activeGlasses === "glasses-aviator" && (
          <g id="moyin-glasses-aviator">
            {/* Double Brow Bar */}
            <line x1="33" y1="38" x2="67" y2="38" stroke="#F5A524" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M 47.5 41 Q 50 39.5 52.5 41" stroke="#F5A524" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            {/* Left Teardrop Rim */}
            <path
              d="M 34 39.5 C 34 39.5 33 49 42 49.5 C 48 49.5 48 39.5 48 39.5 Z"
              fill="#E0F2FE"
              fillOpacity="0.3"
              stroke="#D97706"
              strokeWidth="1.6"
            />
            <path d="M 37 41 L 40 46" stroke="#FFF" strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />
            {/* Right Teardrop Rim */}
            <path
              d="M 52 39.5 C 52 39.5 52 49.5 58 49.5 C 67 49 66 39.5 66 39.5 Z"
              fill="#E0F2FE"
              fillOpacity="0.3"
              stroke="#D97706"
              strokeWidth="1.6"
            />
            <path d="M 55 41 L 58 46" stroke="#FFF" strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />
            {/* Temples */}
            <line x1="34" y1="38.5" x2="26" y2="36" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="66" y1="38.5" x2="74" y2="36" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        )}

        {/* Hats */}
        {activeHat === "hat-acorn" && (
          <g id="moyin-hat-acorn">
            {/* Grounding drop shadow cast on forehead */}
            <path
              d="M 26 26 Q 50 31.5 74 26 Q 50 35 26 26 Z"
              fill="#150C28"
              opacity="0.32"
            />

            {/* Woody stem */}
            <path
              d="M 48.2 8 C 47.2 3.8 49.5 1.5 53.2 0.8 C 54.2 1.2 53.5 3.5 51.5 8 Z"
              fill="#542E11"
            />
            <circle cx="53.2" cy="1" r="1" fill="#78421A" />

            {/* Forest leaf sprig */}
            <path
              d="M 52.5 3 C 56.5 1.5 59.5 2.8 60 4.2 C 58 5.4 54.8 5 52 3.8 Z"
              fill="#4E8F3C"
            />
            <path
              d="M 52.5 3.2 Q 56.5 3.6 59.5 4.1"
              stroke="#2E5C20"
              strokeWidth="0.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Cap dome */}
            <path
              d="M 27.5 23.5 C 26 11.5 36 6.5 50 6.5 C 64 6.5 74 11.5 72.5 23.5 C 64 27.5 36 27.5 27.5 23.5 Z"
              fill="#8F5426"
              stroke="#522C0F"
              strokeWidth="0.8"
            />

            {/* Top highlight / volume curve */}
            <path
              d="M 31 19 C 32 11.5 39 8 50 8 C 58 8 64.5 10.5 66.5 16 C 58 13.5 41 14.5 31 19 Z"
              fill="#B3723B"
              opacity="0.75"
            />

            {/* Acorn cupule scales (Row 1) */}
            <path
              d="M 43 11.5 Q 46.5 9 50 11.5 Q 53.5 9 57 11.5"
              stroke="#5C300F"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 44 12.3 Q 46.5 10.3 49 12.3 M 51 12.3 Q 53.5 10.3 56 12.3"
              stroke="#C6894F"
              strokeWidth="0.75"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />

            {/* Acorn cupule scales (Row 2) */}
            <path
              d="M 36 16.5 Q 40.5 13.5 45 16.5 Q 50 13 55 16.5 Q 59.5 13.5 64 16.5"
              stroke="#5C300F"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 37.5 17.3 Q 40.5 14.8 43.5 17.3 M 46.5 17.3 Q 50 14.3 53.5 17.3 M 56.5 17.3 Q 59.5 14.8 62.5 17.3"
              stroke="#C6894F"
              strokeWidth="0.75"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />

            {/* Acorn cupule scales (Row 3) */}
            <path
              d="M 31 21.5 Q 35.5 18.5 40 21.5 Q 45 18 50 21.5 Q 55 18 60 21.5 Q 64.5 18.5 69 21.5"
              stroke="#5C300F"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 32.5 22.3 Q 35.5 19.8 38.5 22.3 M 41.5 22.3 Q 45 19.3 48.5 22.3 M 51.5 22.3 Q 55 19.3 58.5 22.3 M 61.5 22.3 Q 64.5 19.8 67.5 22.3"
              stroke="#C6894F"
              strokeWidth="0.75"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />

            {/* Cap lower rim lip */}
            <path
              d="M 26.5 22.5 Q 50 26.5 73.5 22.5 C 75.2 24.5 74.2 27.2 72 28.2 Q 50 32.2 28 28.2 C 25.8 27.2 24.8 24.5 26.5 22.5 Z"
              fill="#754117"
              stroke="#482309"
              strokeWidth="0.9"
              strokeLinejoin="round"
            />

            {/* Rim notch texture */}
            <path
              d="M 32 24.2 L 32 26.5 M 37.5 25.2 L 37.5 27.5 M 43.5 26 L 43.5 28.3 M 50 26.3 L 50 28.6 M 56.5 26 L 56.5 28.3 M 62.5 25.2 L 62.5 27.5 M 68 24.2 L 68 26.5"
              stroke="#482309"
              strokeWidth="0.85"
              strokeLinecap="round"
            />

            {/* Rim bevel highlight */}
            <path
              d="M 28.5 23.5 Q 50 27.3 71.5 23.5"
              stroke="#B8763C"
              strokeWidth="0.85"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
          </g>
        )}

        {activeHat === "hat-honey-crown" && (
          <g id="moyin-hat-honey-crown">
            {/* Grounding drop shadow */}
            <path d="M 31 24 Q 50 28 69 24 Q 50 32 31 24 Z" fill="#150C28" opacity="0.3" />
            <path
              d="M 31 23 Q 50 27 69 23 L 68 14 L 60 18 L 50 10 L 40 18 L 32 14 Z"
              fill="#F5A524"
              stroke="#B45309"
              strokeWidth="0.9"
              strokeLinejoin="round"
            />
            <path
              d="M 33 22 Q 50 25.5 67 22 L 66 16 L 60 19 L 50 12 L 40 19 L 34 16 Z"
              fill="#FBBF24"
              opacity="0.85"
            />
            <circle cx="32" cy="14" r="1.8" fill="#F59E0B" stroke="#92400E" strokeWidth="0.5" />
            <circle cx="50" cy="10" r="2.4" fill="#F59E0B" stroke="#92400E" strokeWidth="0.5" />
            <circle cx="68" cy="14" r="1.8" fill="#F59E0B" stroke="#92400E" strokeWidth="0.5" />
            <circle cx="31.4" cy="13.4" r="0.6" fill="#FFF" />
            <circle cx="49.2" cy="9.2" r="0.8" fill="#FFF" />
            <circle cx="67.4" cy="13.4" r="0.6" fill="#FFF" />
            <path
              d="M 33 23 Q 50 26.5 67 23"
              stroke="#D97706"
              strokeWidth="1.8"
              fill="none"
            />
          </g>
        )}

        {activeHat === "hat-safari" && (
          <g id="moyin-hat-safari">
            {/* Grounding drop shadow */}
            <path d="M 22 28 Q 50 34 78 28 Q 50 36 22 28 Z" fill="#150C28" opacity="0.3" />
            {/* Rounded Crown Dome */}
            <path d="M 32 24 C 32 10 40 6 50 6 C 60 6 68 10 68 24 Z" fill="#D4B07B" stroke="#8D6E3F" strokeWidth="0.9" />
            {/* Top Ventilation Ridge */}
            <path d="M 50 6 L 50 14" stroke="#8D6E3F" strokeWidth="1" strokeLinecap="round" />
            {/* Brown Leather Band */}
            <path d="M 32 23 Q 50 27 68 23" stroke="#542E11" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Brass Buckle */}
            <rect x="48" y="21.5" width="4" height="3" rx="0.5" fill="#F5A524" stroke="#8D6E3F" strokeWidth="0.4" />
            {/* Wide Protective Brim */}
            <path d="M 20 25 Q 50 31 80 25 C 82 28 80 30.5 76 31.5 Q 50 35 24 31.5 C 20 30.5 18 28 20 25 Z" fill="#BF9B63" stroke="#8D6E3F" strokeWidth="0.9" />
          </g>
        )}

        {activeHat === "hat-flower-wreath" && (
          <g id="moyin-hat-flower-wreath">
            {/* Woven Vine Arch */}
            <path d="M 26 26 Q 50 16 74 26" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 27 26.5 Q 50 18 73 26.5" stroke="#4CAF50" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            {/* Leaves */}
            <ellipse cx="34" cy="21" rx="2.5" ry="1.2" fill="#4CAF50" transform="rotate(-25 34 21)" />
            <ellipse cx="66" cy="21" rx="2.5" ry="1.2" fill="#4CAF50" transform="rotate(25 66 21)" />
            <ellipse cx="43" cy="18" rx="2.5" ry="1.2" fill="#4CAF50" transform="rotate(-15 43 18)" />
            <ellipse cx="57" cy="18" rx="2.5" ry="1.2" fill="#4CAF50" transform="rotate(15 57 18)" />
            {/* Flowers */}
            <circle cx="30" cy="24" r="3" fill="#E88AA6" />
            <circle cx="30" cy="24" r="1.2" fill="#FFFDF7" />
            <circle cx="40" cy="18" r="3.2" fill="#9D72FF" />
            <circle cx="40" cy="18" r="1.3" fill="#FFFDF7" />
            <circle cx="50" cy="16" r="3.8" fill="#F5A524" />
            <circle cx="50" cy="16" r="1.5" fill="#FFFDF7" />
            <circle cx="60" cy="18" r="3.2" fill="#9D72FF" />
            <circle cx="60" cy="18" r="1.3" fill="#FFFDF7" />
            <circle cx="70" cy="24" r="3" fill="#E88AA6" />
            <circle cx="70" cy="24" r="1.2" fill="#FFFDF7" />
          </g>
        )}

        {activeHat === "hat-cozy-beanie" && (
          <g id="moyin-hat-cozy-beanie">
            {/* Shadow */}
            <path d="M 28 26 Q 50 31 72 26 Q 50 34 28 26 Z" fill="#150C28" opacity="0.3" />
            {/* Fluffy Pom Pom */}
            <circle cx="50" cy="6" r="5" fill="#F5A524" stroke="#B36B00" strokeWidth="0.8" />
            <circle cx="48" cy="5" r="1.5" fill="#FFE8B5" />
            {/* Beanie Knit Dome */}
            <path d="M 30 25 C 30 11 38 8 50 8 C 62 8 70 11 70 25 Z" fill="#7C5CC4" stroke="#2A1B4D" strokeWidth="0.9" />
            {/* Knit rib vertical ridges */}
            <path d="M 43 10 Q 42 18 41 24 M 50 8 V 24 M 57 10 Q 58 18 59 24" stroke="#5B3A9E" strokeWidth="0.8" strokeLinecap="round" />
            {/* Folded Rib Cuff */}
            <path d="M 28 24 Q 50 28 72 24 C 73.5 26.5 72.5 29 70 29.5 Q 50 33 30 29.5 C 27.5 29 26.5 26.5 28 24 Z" fill="#5B3A9E" stroke="#2A1B4D" strokeWidth="0.9" />
            {/* Cuff rib ticks */}
            <path d="M 35 25.5 L 35 29 M 42 26 L 42 30 M 50 26.5 L 50 30.5 M 58 26 L 58 30 M 65 25.5 L 65 29" stroke="#7C5CC4" strokeWidth="0.8" strokeLinecap="round" />
          </g>
        )}

        {activeHat === "hat-star-wizard" && (
          <g id="moyin-hat-star-wizard">
            {/* Shadow */}
            <path d="M 24 26 Q 50 32 76 26 Q 50 35 24 26 Z" fill="#150C28" opacity="0.3" />
            {/* Wide brim */}
            <ellipse cx="50" cy="27" rx="24" ry="5" fill="#1E163B" stroke="#F5A524" strokeWidth="0.9" />
            {/* Pointed Conical Cap */}
            <path d="M 30 26 L 56 1 Q 52 14 68 25 Z" fill="#2A1B4D" stroke="#1E163B" strokeWidth="0.9" />
            {/* Gold Ribbon Band */}
            <path d="M 31 26 Q 50 29 69 25" stroke="#F5A524" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            {/* Gold Stars */}
            <polygon points="50,11 51,13.5 53.5,13.5 51.5,15 52.2,17.5 50,16 47.8,17.5 48.5,15 46.5,13.5 49,13.5" fill="#FBBF24" />
            <circle cx="43" cy="20" r="1.1" fill="#FFFDF7" />
            <circle cx="58" cy="18" r="1.1" fill="#FFFDF7" />
            <circle cx="53" cy="22" r="0.8" fill="#FBBF24" />
          </g>
        )}

        {activeScarf === "scarf-teal" && (
          <g id="moyin-scarf-teal">
            {/* Soft drop shadow under scarf onto chest */}
            <path
              d="M 28 66 Q 50 74 72 66 Q 50 78 28 66 Z"
              fill="#150C28"
              opacity="0.25"
            />

            {/* Back hanging tail of the scarf */}
            <path
              d="M 44 66 C 44 71 43 76 42 80 C 46 81 49 80.5 50 78 C 50.5 74 51 69 51 66 Z"
              fill="#0F766E"
              stroke="#042F2E"
              strokeWidth="0.8"
            />

            {/* Front hanging tail of the scarf */}
            <path
              d="M 50 65 C 52 70 54 76 55 82 C 50.5 83.2 46.5 82.5 45.5 78.5 C 46.5 74 48 69 50 65 Z"
              fill="#14B8A6"
              stroke="#042F2E"
              strokeWidth="0.8"
            />
            {/* Front tail knit ribbing / stripes */}
            <path
              d="M 48 71 L 52.5 72 M 47 75 L 53.5 76.5 M 46.5 79 L 54.5 80.5"
              stroke="#0F766E"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            {/* Front tail fringe tassels */}
            <path
              d="M 47 82.5 L 46.5 85.5 M 49.5 82.8 L 49.5 86 M 52 82.8 L 52.5 86 M 54.5 82.2 L 55.5 85.2"
              stroke="#0F766E"
              strokeWidth="0.9"
              strokeLinecap="round"
            />

            {/* Scarf main collar wrap around the neck */}
            <path
              d="M 28 60 Q 50 67 72 60 C 74.5 63 74 67.5 70 69.5 Q 50 75 30 69.5 C 26 67.5 25.5 63 28 60 Z"
              fill="#14B8A6"
              stroke="#042F2E"
              strokeWidth="0.9"
              strokeLinejoin="round"
            />

            {/* Scarf collar knit ribbing vertical ticks */}
            <path
              d="M 33 62 L 34 67 M 39 63.5 L 40 68.5 M 45 64.5 L 46 70 M 55 64.5 L 55 70 M 61 63.5 L 60 68.5 M 67 62 L 66 67"
              stroke="#0F766E"
              strokeWidth="0.85"
              strokeLinecap="round"
            />

            {/* Scarf collar top fold bevel highlight */}
            <path
              d="M 29.5 61 Q 50 67.5 70.5 61"
              stroke="#5EEAD4"
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />

            {/* Scarf cozy knot */}
            <ellipse
              cx="50"
              cy="66"
              rx="4.5"
              ry="3.2"
              fill="#0F766E"
              stroke="#042F2E"
              strokeWidth="0.8"
            />
            <ellipse
              cx="50"
              cy="65.5"
              rx="3.5"
              ry="2.2"
              fill="#14B8A6"
            />
          </g>
        )}

        {activeScarf === "scarf-honey-stripe" && (
          <g id="moyin-scarf-honey-stripe">
            {/* Soft drop shadow */}
            <path d="M 28 66 Q 50 74 72 66 Q 50 78 28 66 Z" fill="#150C28" opacity="0.25" />
            {/* Hanging tail */}
            <path d="M 48 65 C 50 70 52 76 53 82 C 48.5 83.2 44.5 82.5 43.5 78.5 C 44.5 74 46 69 48 65 Z" fill="#F5A524" stroke="#B36B00" strokeWidth="0.8" />
            {/* Cream stripes on tail */}
            <path d="M 45 71 L 50.5 72 M 44 75 L 51.5 76.5 M 43.5 79 L 52.5 80.5" stroke="#FFFDF7" strokeWidth="1.2" strokeLinecap="round" />
            {/* Tassels */}
            <path d="M 44 82.5 L 43.5 85.5 M 47 82.8 L 47 86 M 50 82.8 L 50.5 86" stroke="#B36B00" strokeWidth="0.9" strokeLinecap="round" />
            {/* Collar Wrap */}
            <path d="M 28 60 Q 50 67 72 60 C 74.5 63 74 67.5 70 69.5 Q 50 75 30 69.5 C 26 67.5 25.5 63 28 60 Z" fill="#F5A524" stroke="#B36B00" strokeWidth="0.9" />
            {/* Cream stripe across collar */}
            <path d="M 29.5 63 Q 50 69 70.5 63" stroke="#FFFDF7" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            {/* Knot */}
            <ellipse cx="48" cy="66" rx="4.5" ry="3.2" fill="#B36B00" />
            <ellipse cx="48" cy="65.5" rx="3.5" ry="2.2" fill="#F5A524" />
          </g>
        )}

        {activeScarf === "scarf-star-cape" && (
          <g id="moyin-scarf-star-cape">
            {/* Cape Shoulders & Back Flow */}
            <path d="M 24 58 C 20 66 18 78 18 84 C 28 87 40 86 50 85 C 60 86 72 87 82 84 C 82 78 80 66 76 58 C 66 63 34 63 24 58 Z" fill="#3E2769" stroke="#2A1B4D" strokeWidth="0.9" />
            {/* Golden Trim Border */}
            <path d="M 19 83 C 34 86 66 86 81 83" stroke="#F5A524" strokeWidth="1.4" strokeLinecap="round" fill="none" />
            {/* Golden Star Clasp at neck */}
            <polygon points="50,60 51.2,63 54.5,63 51.8,65 52.8,68 50,66.2 47.2,68 48.2,65 45.5,63 48.8,63" fill="#F5A524" stroke="#B36B00" strokeWidth="0.4" />
            {/* Twinkle stars */}
            <circle cx="28" cy="72" r="0.9" fill="#FFFDF7" />
            <circle cx="72" cy="72" r="0.9" fill="#FFFDF7" />
            <circle cx="50" cy="76" r="0.8" fill="#FBBF24" />
          </g>
        )}

        {activeScarf === "scarf-leaf-cowl" && (
          <g id="moyin-scarf-leaf-cowl">
            {/* Drop shadow */}
            <path d="M 28 66 Q 50 74 72 66 Q 50 78 28 66 Z" fill="#150C28" opacity="0.25" />
            {/* Green Cowl */}
            <path d="M 28 60 Q 50 67 72 60 C 74.5 63 74 67.5 70 69.5 Q 50 75 30 69.5 C 26 67.5 25.5 63 28 60 Z" fill="#2E7D32" stroke="#1B5E20" strokeWidth="0.9" />
            <path d="M 29.5 61 Q 50 67.5 70.5 61" stroke="#81C784" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.9" />
            {/* Clover Leaves Pin */}
            <circle cx="48" cy="65.5" r="2.2" fill="#81C784" stroke="#1B5E20" strokeWidth="0.4" />
            <circle cx="52" cy="65.5" r="2.2" fill="#81C784" stroke="#1B5E20" strokeWidth="0.4" />
            <circle cx="50" cy="63.5" r="2.2" fill="#81C784" stroke="#1B5E20" strokeWidth="0.4" />
            <path d="M 50 66 L 50 69" stroke="#1B5E20" strokeWidth="0.8" strokeLinecap="round" />
          </g>
        )}

        {activePet === "pet-bee" && (
          <g id="moyin-pet-bee">
            <path
              d="M 80 28 Q 85 22 83 17"
              stroke="#F5A524"
              strokeWidth="1"
              strokeDasharray="1.5 1.5"
              fill="none"
              opacity="0.7"
            />
            <ellipse cx="80" cy="15" rx="3.5" ry="2" fill="#E0F2FE" opacity="0.8" stroke="#7DD3FC" strokeWidth="0.5" transform="rotate(-25 80 15)" />
            <ellipse cx="83" cy="14" rx="3.5" ry="2" fill="#E0F2FE" opacity="0.8" stroke="#7DD3FC" strokeWidth="0.5" transform="rotate(25 83 14)" />
            <ellipse cx="82" cy="18" rx="4.5" ry="3.5" fill="#FBBF24" stroke="#2A1B4D" strokeWidth="0.6" />
            <path d="M 81 15 L 81 21 M 83.5 15 L 83.5 21" stroke="#2A1B4D" strokeWidth="1" strokeLinecap="round" />
            <circle cx="85" cy="17.5" r="0.6" fill="#2A1B4D" />
            <path d="M 77.5 18 L 76.5 18" stroke="#2A1B4D" strokeWidth="0.8" strokeLinecap="round" />
          </g>
        )}

        {activePet === "pet-ladybug" && (
          <g id="pet-ladybug">
            {/* Perched near Moyin's left ear */}
            <circle cx="20" cy="24" r="2" fill="#2A1B4D" />
            <path d="M 19 22 Q 18 20 17 20 M 21 22 Q 22 20 23 20" stroke="#2A1B4D" strokeWidth="0.6" strokeLinecap="round" />
            {/* Red Body */}
            <circle cx="20" cy="28" r="4.5" fill="#EF4444" stroke="#991B1B" strokeWidth="0.7" />
            <path d="M 20 23.5 L 20 32.5" stroke="#2A1B4D" strokeWidth="0.7" />
            {/* Spots */}
            <circle cx="18" cy="26.5" r="0.9" fill="#2A1B4D" />
            <circle cx="22" cy="26.5" r="0.9" fill="#2A1B4D" />
            <circle cx="18.5" cy="29.5" r="0.8" fill="#2A1B4D" />
            <circle cx="21.5" cy="29.5" r="0.8" fill="#2A1B4D" />
            <circle cx="18" cy="25" r="0.4" fill="#FFF" />
          </g>
        )}

        {activePet === "pet-firefly" && (
          <g id="pet-firefly">
            {/* Flight Trail */}
            <path d="M 78 28 Q 84 22 81 16" stroke="#F5A524" strokeWidth="0.8" strokeDasharray="1.2 1.2" fill="none" opacity="0.7" />
            {/* Glowing Halo */}
            <circle cx="81" cy="17" r="7" fill="#FEF08A" opacity="0.4" />
            <circle cx="81" cy="17" r="4.5" fill="#FDE047" opacity="0.6" />
            {/* Wings */}
            <ellipse cx="78" cy="13" rx="2.8" ry="1.6" fill="#E0F2FE" opacity="0.85" stroke="#7DD3FC" strokeWidth="0.4" transform="rotate(-30 78 13)" />
            <ellipse cx="84" cy="13" rx="2.8" ry="1.6" fill="#E0F2FE" opacity="0.85" stroke="#7DD3FC" strokeWidth="0.4" transform="rotate(30 84 13)" />
            {/* Body */}
            <circle cx="81" cy="13.5" r="1.5" fill="#2A1B4D" />
            <ellipse cx="81" cy="17" rx="2.5" ry="3.2" fill="#F59E0B" stroke="#B45309" strokeWidth="0.5" />
            <circle cx="81" cy="17.5" r="1.2" fill="#FFFBEB" />
          </g>
        )}

        {activePet === "pet-snail" && (
          <g id="pet-snail">
            {/* Snail resting on ground near right foot */}
            <path d="M 74 89 C 74 89 77 91 85 91 C 87 91 88.5 89.5 87.5 88 C 86.5 86.5 85 86.5 84 87.5" stroke="#2BB7A3" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            <path d="M 86 87 L 87 84 M 87.5 87 L 88.5 84.5" stroke="#2BB7A3" strokeWidth="0.8" strokeLinecap="round" />
            <circle cx="87" cy="83.5" r="0.7" fill="#12786B" />
            <circle cx="88.5" cy="84" r="0.7" fill="#12786B" />
            {/* Spiral Shell */}
            <circle cx="79" cy="85" r="4.8" fill="#F5A524" stroke="#B36B00" strokeWidth="0.9" />
            <path d="M 79 81.5 C 81 81.5 82.5 83 82.5 85 C 82.5 87 81 88.5 79 88.5 C 77.5 88.5 76.5 87.2 76.5 85.8 C 76.5 84.5 77.5 83.8 78.5 83.8" stroke="#B36B00" strokeWidth="0.8" strokeLinecap="round" fill="none" />
          </g>
        )}
      </svg>
    </div>
  );
}

export interface MoyinPeekingProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  pose?: "smile" | "cheer" | "think" | "sleepy";
  showPaws?: boolean;
}

/**
 * MoyinPeeking: Macro close-up of Moyin the honey badger cub peeking over an edge or card.
 * Features enlarged facial expression (sparkling eyes, badger ears, honey stripe, rosy cheeks)
 * and two adorable paws resting on the edge, cropping the lower body for a lively, focused composition.
 */
export function MoyinPeeking({
  className = "",
  width = 280,
  height = 200,
  pose = "smile",
  showPaws = true,
}: MoyinPeekingProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center transition-transform duration-300 ${className}`}
      style={{ width, height }}
      aria-label={`Moyin the honey badger cub peeking warmly (${pose} pose)`}
    >
      <svg
        viewBox="14 16 72 52"
        className="w-full h-full overflow-visible"
      >
        {/* Badger Ears */}
        <ellipse cx="26" cy="30" rx="10" ry="12" fill="#2A1B4D" />
        <ellipse cx="26" cy="30" rx="6" ry="8" fill="#E88AA6" />
        <ellipse cx="74" cy="30" rx="10" ry="12" fill="#2A1B4D" />
        <ellipse cx="74" cy="30" rx="6" ry="8" fill="#E88AA6" />

        {/* Head Base */}
        <circle cx="50" cy="42" r="28" fill="#2A1B4D" />

        {/* Honey Badger Cream Forehead & Facial Mask */}
        <ellipse cx="50" cy="46" rx="21" ry="18" fill="#FFFDF7" />

        {/* Outer White Badger Stripe */}
        <path
          d="M 40 14 Q 50 11 60 14 L 56 46 Q 50 49 44 46 Z"
          fill="#FFFDF7"
        />

        {/* Signature Warm Honey Forehead Stripe */}
        <path
          d="M 46 13 Q 50 11 54 13 L 53 43 Q 50 45 47 43 Z"
          fill="#F5A524"
        />

        {/* Rosy Blush Cheeks */}
        <circle cx="37" cy="51" r="5" fill="#E88AA6" opacity="0.8" />
        <circle cx="63" cy="51" r="5" fill="#E88AA6" opacity="0.8" />

        {/* Expressive Eyes According to Pose */}
        {pose === "sleepy" ? (
          <>
            <path d="M 39 44 Q 43 48 47 44" stroke="#2A1B4D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 53 44 Q 57 48 61 44" stroke="#2A1B4D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        ) : pose === "think" ? (
          <>
            {/* Thoughtful curved brows */}
            <path d="M 39 36 Q 43 33.5 47 35.5" stroke="#2A1B4D" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 53 34 Q 56.5 31.5 61 33.5" stroke="#2A1B4D" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="44" cy="40.5" r="3.8" fill="#2A1B4D" />
            <circle cx="45.5" cy="39" r="1.4" fill="#FFF" />
            <circle cx="58" cy="40.5" r="3.8" fill="#2A1B4D" />
            <circle cx="59.5" cy="39" r="1.4" fill="#FFF" />
          </>
        ) : (
          <>
            {/* Warm, sparkling friendly open eyes with dual catchlights */}
            <circle cx="43" cy="43.5" r="4.6" fill="#2A1B4D" />
            <circle cx="45" cy="41.3" r="1.8" fill="#FFF" />
            <circle cx="42" cy="45.2" r="0.9" fill="#FFF" />

            <circle cx="57" cy="43.5" r="4.6" fill="#2A1B4D" />
            <circle cx="59" cy="41.3" r="1.8" fill="#FFF" />
            <circle cx="56" cy="45.2" r="0.9" fill="#FFF" />
          </>
        )}

        {/* Snout & Nose */}
        <ellipse cx="50" cy="49.5" rx="3.6" ry="2.6" fill="#2A1B4D" />

        {/* Sweet Joyful Smile */}
        {pose === "sleepy" ? (
          <path d="M 47 52 Q 50 54 53 52" stroke="#2A1B4D" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        ) : pose === "think" ? (
          <path d="M 47 54 Q 50.5 55 53.5 52.5" stroke="#2A1B4D" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M 46 52.5 Q 50 57.5 54 52.5" stroke="#2A1B4D" strokeWidth="2.2" fill="#E88AA6" strokeLinecap="round" />
        )}

        {/* Paws Resting on the Edge */}
        {showPaws && (
          <g id="moyin-peeking-paws">
            {/* Left Paw */}
            <ellipse cx="32" cy="62" rx="7.5" ry="5.5" fill="#2A1B4D" />
            <circle cx="27" cy="60" r="2.2" fill="#3D2968" />
            <circle cx="32" cy="58.5" r="2.4" fill="#3D2968" />
            <circle cx="37" cy="60" r="2.2" fill="#3D2968" />
            <ellipse cx="32" cy="63" rx="4" ry="2.2" fill="#E88AA6" opacity="0.6" />

            {/* Right Paw */}
            <ellipse cx="68" cy="62" rx="7.5" ry="5.5" fill="#2A1B4D" />
            <circle cx="63" cy="60" r="2.2" fill="#3D2968" />
            <circle cx="68" cy="58.5" r="2.4" fill="#3D2968" />
            <circle cx="73" cy="60" r="2.2" fill="#3D2968" />
            <ellipse cx="68" cy="63" rx="4" ry="2.2" fill="#E88AA6" opacity="0.6" />
          </g>
        )}
      </svg>
    </div>
  );
}
