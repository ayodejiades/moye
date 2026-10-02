import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Storyset & unDraw inspired SVG Iconography & Spot Illustrations
 * Tuned strictly to Moye's calm palette:
 * Plum (#2A1B4D, #5B3A9E, #7C5CC4, #EFE9FA)
 * Honey (#F5A524, #B36B00)
 * Teal (#2BB7A3, #12786B)
 * Rose (#E88AA6)
 */

// ==========================================
// 1. STORYSET / UNDRAW STYLE SPOT ILLUSTRATIONS
// ==========================================

/** Calm Focus / Zero Pressure Illustration (Storyset style) */
export function CalmFocusIllustration({ className = "", size = 48 }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Soft background aura circle */}
      <circle cx="32" cy="32" r="28" fill="#EFE9FA" />
      {/* Floating calm ring */}
      <circle cx="32" cy="32" r="23" stroke="#7C5CC4" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
      {/* Meditating character silhouette */}
      <path
        d="M26 44C26 39.5 28.5 37 32 37C35.5 37 38 39.5 38 44"
        stroke="#2A1B4D"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Folded legs / base */}
      <path
        d="M20 46C24 45 28 47 32 47C36 47 40 45 44 46"
        stroke="#5B3A9E"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Character Head */}
      <circle cx="32" cy="27" r="6" fill="#5B3A9E" />
      {/* Serene face lines */}
      <path d="M29 27.5Q30.5 29 32 27.5" stroke="#FFFDF7" strokeWidth="1" strokeLinecap="round" />
      <path d="M32 27.5Q33.5 29 35 27.5" stroke="#FFFDF7" strokeWidth="1" strokeLinecap="round" />
      {/* Calming energy / leaf / sparkle float */}
      <path
        d="M44 20C44 20 45.5 24 42 25C38.5 26 40 21 44 20Z"
        fill="#2BB7A3"
      />
      <circle cx="21" cy="22" r="2" fill="#F5A524" />
      <circle cx="43" cy="36" r="1.5" fill="#E88AA6" />
    </svg>
  );
}

/** Bayesian Adaptive Mastery / Target Illustration (Storyset style) */
export function AdaptiveMasteryIllustration({ className = "", size = 48 }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background shape */}
      <circle cx="32" cy="32" r="28" fill="#EFE9FA" />
      {/* Outer target ring */}
      <circle cx="32" cy="32" r="22" fill="#FFFFFF" stroke="#5B3A9E" strokeWidth="2.5" />
      {/* Mid target ring */}
      <circle cx="32" cy="32" r="14" fill="#EFE9FA" stroke="#7C5CC4" strokeWidth="2" />
      {/* Bullseye center */}
      <circle cx="32" cy="32" r="6" fill="#F5A524" stroke="#B36B00" strokeWidth="1.5" />
      {/* Arrow hitting the bullseye */}
      <path
        d="M48 16L34 30"
        stroke="#2A1B4D"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Arrow fletching */}
      <path
        d="M44 14L49 15L50 20"
        stroke="#2BB7A3"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Adaptive curve sparkles */}
      <path d="M16 22L18 20M17 19L19 21" stroke="#2BB7A3" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="18" cy="42" r="2.5" fill="#2BB7A3" />
    </svg>
  );
}

/** Stay Motivated / Spark Streak & Habit Milestones Illustration (Storyset style) */
export function DuoStayMotivatedIllustration({ className = "", size = 48 }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background Soft Aura Circle */}
      <circle cx="32" cy="32" r="28" fill="#FFF8EB" />

      {/* Stepping stone / habit milestone base */}
      <rect
        x="16"
        y="45"
        width="32"
        height="7"
        rx="3.5"
        fill="#FFFFFF"
        stroke="#5B3A9E"
        strokeWidth="2.2"
      />
      {/* 3 Progress dots / streak step milestones */}
      <circle cx="23" cy="48.5" r="1.5" fill="#2BB7A3" />
      <circle cx="32" cy="48.5" r="1.5" fill="#2BB7A3" />
      <circle cx="41" cy="48.5" r="1.5" fill="#F5A524" />

      {/* Central Warm Spark Flame */}
      <path
        d="M32 14C32 14 42 24 42 33C42 38.5 37.5 43 32 43C26.5 43 22 38.5 22 33C22 26 30 20.5 30 20.5C30 20.5 28.5 26 31.5 28.5C33 27 34 22 32 14Z"
        fill="#F5A524"
        stroke="#B36B00"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Inner Golden Core */}
      <path
        d="M32 27C32 27 36 31 36 35C36 37.2 34.2 39 32 39C29.8 39 28 37.2 28 35C28 31 32 27 32 27Z"
        fill="#FFE8B5"
      />

      {/* Core Specular Star */}
      <path
        d="M32 30L32.8 33L35 34L32.8 35L32 38L31.2 35L29 34L31.2 33Z"
        fill="#FFFFFF"
      />

      {/* Gentle Rest-Day Token Shield */}
      <path
        d="M46 19C46 19 50 20 50 23C50 27 46 29 46 29C46 29 42 27 42 23C42 20 46 19 46 19Z"
        fill="#2BB7A3"
        stroke="#12786B"
        strokeWidth="1.6"
      />
      <path
        d="M44.5 23.5L45.7 25L47.5 22.5"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Floating Sparkles & Spark Dots */}
      <circle cx="16" cy="24" r="2" fill="#F5A524" />
      <path d="M16 18V21M14.5 19.5H17.5" stroke="#F5A524" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="48" cy="39" r="1.5" fill="#E88AA6" />
      <circle cx="15" cy="38" r="1.5" fill="#2BB7A3" />
    </svg>
  );
}

/** Gentle Honey Rewards Illustration (Storyset style) */
export function HoneyRewardsIllustration({ className = "", size = 48 }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background shape */}
      <circle cx="32" cy="32" r="28" fill="#FFF8EB" />
      {/* Honeycomb hex backdrops */}
      <path
        d="M22 18L26 15.5L30 18L30 23L26 25.5L22 23Z"
        fill="#FFE8B5"
      />
      <path
        d="M40 18L44 15.5L48 18L48 23L44 25.5L40 23Z"
        fill="#FFE8B5"
      />
      {/* Honey Pot / Jar Body */}
      <path
        d="M21 28H43L46 45C46 48.5 41 51 32 51C23 51 18 48.5 18 45L21 28Z"
        fill="#F5A524"
        stroke="#B36B00"
        strokeWidth="2.5"
      />
      {/* Pot Rim */}
      <rect x="20" y="24" width="24" height="6" rx="3" fill="#FFE8B5" stroke="#B36B00" strokeWidth="2" />
      {/* Honey Dripping Front */}
      <path
        d="M24 30C24 30 26 36 29 36C32 36 31 32 34 32C37 32 37 37 40 37C42 37 43 30 43 30"
        fill="#FFE8B5"
      />
      {/* Jar Badge / Honey Drop symbol */}
      <path
        d="M32 39C32 39 29 42 29 44C29 45.6 30.3 47 32 47C33.7 47 35 45.6 35 44C35 42 32 39 32 39Z"
        fill="#FFFFFF"
      />
      {/* Floating Honey Drop */}
      <path
        d="M46 22C46 22 43 25.5 43 27.5C43 29.2 44.3 30.5 46 30.5C47.7 30.5 49 29.2 49 27.5C49 25.5 46 22 46 22Z"
        fill="#F5A524"
        stroke="#B36B00"
        strokeWidth="1.2"
      />
    </svg>
  );
}

/** Neurodiversity & Accessibility Illustration (Storyset style) */
export function NeurodiversityIllustration({ className = "", size = 48 }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="28" fill="#EFE9FA" />
      {/* Open book */}
      <path
        d="M16 42C21 40 26 41 32 44C38 41 43 40 48 42V25C43 23 38 24 32 27C26 24 21 23 16 25V42Z"
        fill="#FFFFFF"
        stroke="#5B3A9E"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Book center spine */}
      <path d="M32 27V44" stroke="#7C5CC4" strokeWidth="2" strokeLinecap="round" />
      {/* Reading lines */}
      <path d="M20 29H28M20 33H26M20 37H28" stroke="#D8CCE8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M36 29H44M36 33H42M36 37H44" stroke="#D8CCE8" strokeWidth="1.5" strokeLinecap="round" />
      {/* Sound / speech wave floating */}
      <path
        d="M26 18C28 16 36 16 38 18"
        stroke="#2BB7A3"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M23 15C27 12 37 12 41 15"
        stroke="#2BB7A3"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Sparkles */}
      <circle cx="48" cy="20" r="2" fill="#F5A524" />
      <circle cx="15" cy="21" r="1.5" fill="#E88AA6" />
    </svg>
  );
}

// ==========================================
// 2. STORYSET AVATARS FOR CHILDREN (ADA & CHIDI)
// ==========================================

/** Ada's Illustrated Avatar (Storyset style) */
export function AdaAvatar({ className = "", size = 32 }: IconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="19" fill="#EFE9FA" stroke="#D8CCE8" strokeWidth="1" />
      {/* Afro buns */}
      <circle cx="10" cy="12" r="6" fill="#2A1B4D" />
      <circle cx="30" cy="12" r="6" fill="#2A1B4D" />
      {/* Bun ties */}
      <ellipse cx="12" cy="14" rx="2" ry="3" fill="#F5A524" />
      <ellipse cx="28" cy="14" rx="2" ry="3" fill="#F5A524" />
      {/* Head */}
      <circle cx="20" cy="20" r="10" fill="#8D5524" />
      {/* Hair front curls */}
      <path d="M12 18Q16 13 20 13Q24 13 28 18" stroke="#2A1B4D" strokeWidth="3.5" strokeLinecap="round" />
      {/* Cheerful Eyes */}
      <circle cx="17" cy="19.5" r="1.3" fill="#2A1B4D" />
      <circle cx="23" cy="19.5" r="1.3" fill="#2A1B4D" />
      {/* Smile */}
      <path d="M18 23Q20 25 22 23" stroke="#2A1B4D" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Collar */}
      <path d="M14 36C14 31 16 29 20 29C24 29 26 31 26 36" fill="#5B3A9E" />
    </svg>
  );
}

/** Chidi's Illustrated Avatar (Storyset style) */
export function ChidiAvatar({ className = "", size = 32 }: IconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="19" fill="#EFE9FA" stroke="#D8CCE8" strokeWidth="1" />
      {/* Hair fade */}
      <path d="M11 18C11 12 15 10 20 10C25 10 29 12 29 18" fill="#1C142E" />
      {/* Head */}
      <circle cx="20" cy="20" r="9.5" fill="#593116" />
      {/* Hair top trim */}
      <path d="M12 16Q20 13 28 16" stroke="#1C142E" strokeWidth="2.5" strokeLinecap="round" />
      {/* Friendly Eyes */}
      <circle cx="17.5" cy="19.5" r="1.3" fill="#1C142E" />
      <circle cx="22.5" cy="19.5" r="1.3" fill="#1C142E" />
      {/* Warm Smile */}
      <path d="M18 23.5Q20 25.5 22 23.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Collar */}
      <path d="M13 36C13 30 16 29 20 29C24 29 27 30 27 36" fill="#2BB7A3" />
    </svg>
  );
}

// ==========================================
// 3. THEME SVGS (DINOSAURS, FOOTBALL, SPACE)
// ==========================================

/** Dinosaurs Theme Icon (Storyset style friendly Dino) */
export function DinosaurIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="15" fill="#EFE9FA" />
      {/* Dino tail & body */}
      <path
        d="M7 23C10 24 15 24 18 21C21 18 22 13 22 10L27 10C27 14 26 16 24 18C23 20 24 23 25 24H21C18 24 17 26 14 26C11 26 8 25 7 23Z"
        fill="#2BB7A3"
      />
      {/* Head */}
      <path
        d="M17 10C17 7 19 6 23 6C26 6 28 8 28 10C28 12 25 13 22 13H18L17 10Z"
        fill="#12786B"
      />
      {/* Eye */}
      <circle cx="23" cy="8" r="1" fill="#FFFFFF" />
      {/* Snout smile */}
      <path d="M25 11H23" stroke="#2A1B4D" strokeWidth="0.8" strokeLinecap="round" />
      {/* Back spines */}
      <path d="M16 14L14 12L15 16" fill="#F5A524" />
      <path d="M13 18L11 16L12 20" fill="#F5A524" />
      {/* Feet */}
      <rect x="13" y="24" width="3" height="4" rx="1.5" fill="#12786B" />
      <rect x="18" y="23" width="3" height="4" rx="1.5" fill="#12786B" />
    </svg>
  );
}

/** Football Theme Icon (Storyset style soccer ball) */
export function FootballIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="15" fill="#EFE9FA" />
      {/* Soccer Ball Base */}
      <circle cx="16" cy="16" r="12" fill="#FFFFFF" stroke="#2A1B4D" strokeWidth="2" />
      {/* Center pentagon */}
      <polygon points="16,11 20,14 18,19 14,19 12,14" fill="#5B3A9E" />
      {/* Connecting seam lines */}
      <path d="M16 11L16 6" stroke="#2A1B4D" strokeWidth="1.5" />
      <path d="M20 14L25 12" stroke="#2A1B4D" strokeWidth="1.5" />
      <path d="M18 19L22 24" stroke="#2A1B4D" strokeWidth="1.5" />
      <path d="M14 19L10 24" stroke="#2A1B4D" strokeWidth="1.5" />
      <path d="M12 14L7 12" stroke="#2A1B4D" strokeWidth="1.5" />
    </svg>
  );
}

/** Space Theme Icon (Storyset style friendly Rocket) */
export function RocketIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="15" fill="#EFE9FA" />
      {/* Rocket Main Body */}
      <path
        d="M16 5C19 9 21 14 21 20H11C11 14 13 9 16 5Z"
        fill="#FFFFFF"
        stroke="#5B3A9E"
        strokeWidth="2"
      />
      {/* Rocket Nose Tip */}
      <path d="M16 5C17.5 7.5 18.5 10 19 12H13C13.5 10 14.5 7.5 16 5Z" fill="#E88AA6" />
      {/* Porthole Window */}
      <circle cx="16" cy="15" r="2.5" fill="#2BB7A3" stroke="#2A1B4D" strokeWidth="1" />
      {/* Left Fin */}
      <path d="M11 17L7 21V22H11" fill="#7C5CC4" />
      {/* Right Fin */}
      <path d="M21 17L25 21V22H21" fill="#7C5CC4" />
      {/* Exhaust Flame */}
      <path d="M14 22L16 27L18 22" fill="#F5A524" />
      <path d="M15 22L16 25L17 22" fill="#FFFDF7" />
    </svg>
  );
}

// ==========================================
// 4. LEARNING PATH & LESSON ICONS
// ==========================================

/** Star Icon (Curriculum node 1) */
export function StarIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill="#F5A524"
        stroke="#B36B00"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Snack Coin Icon (Curriculum node 2) */
export function CoinIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.5" fill="#F5A524" stroke="#B36B00" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="7" stroke="#FFF8EB" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M12 7.5V16.5M9.5 9.5H14.5" stroke="#FFFDF7" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Place Value Bundle Box Icon (Curriculum node 3) */
export function BundleBoxIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z"
        fill="#EFE9FA"
        stroke="#5B3A9E"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 12L20 7.5M12 12V21M12 12L4 7.5" stroke="#7C5CC4" strokeWidth="1.5" />
      <path d="M12 7.5L16 9.75M8 9.75L12 12" stroke="#2BB7A3" strokeWidth="1.5" />
    </svg>
  );
}

/** 2D Geometry Shapes Icon (Curriculum node 4) */
export function DinoShapesIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Triangle */}
      <polygon points="7,4 12,12 2,12" fill="#2BB7A3" stroke="#12786B" strokeWidth="1.2" />
      {/* Square */}
      <rect x="13" y="11" width="8" height="8" rx="1.5" fill="#5B3A9E" stroke="#2A1B4D" strokeWidth="1.2" />
      {/* Circle */}
      <circle cx="17" cy="6" r="3.5" fill="#F5A524" stroke="#B36B00" strokeWidth="1.2" />
    </svg>
  );
}

/** Lock Icon */
export function LockIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="8" width="12" height="10" rx="3" fill="currentColor" opacity="0.8" />
      <path
        d="M7 8V6C7 4.34 8.34 3 10 3C11.66 3 13 4.34 13 6V8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="10" cy="13" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

// ==========================================
// 5. HONEY & STREAK REWARD SVGS
// ==========================================

/** Honey Drop Icon */
export function HoneyDropIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 3C12 3 6 10.5 6 15C6 18.3 8.7 21 12 21C15.3 21 18 18.3 18 15C18 10.5 12 3 12 3Z"
        fill="#F5A524"
        stroke="#B36B00"
        strokeWidth="1.8"
      />
      {/* Soft highlight reflection */}
      <path
        d="M9.5 13.5C9.5 12 10.5 10 12 8.5"
        stroke="#FFFDF7"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Honey Pot / Jar Icon */
export function HoneyJarIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Jar Body */}
      <path
        d="M8 13H24L26 25C26 27.5 22.5 29 16 29C9.5 29 6 27.5 6 25L8 13Z"
        fill="#F5A524"
        stroke="#B36B00"
        strokeWidth="1.8"
      />
      {/* Jar Rim */}
      <rect x="7" y="9" width="18" height="5" rx="2.5" fill="#FFE8B5" stroke="#B36B00" strokeWidth="1.5" />
      {/* Label Badge */}
      <circle cx="16" cy="21" r="4" fill="#FFFFFF" opacity="0.9" />
      <path
        d="M16 19C16 19 14.5 20.5 14.5 21.5C14.5 22.3 15.2 23 16 23C16.8 23 17.5 22.3 17.5 21.5C17.5 20.5 16 19 16 19Z"
        fill="#F5A524"
      />
    </svg>
  );
}

/** Spark / Streak Flame Icon */
export function SparkIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z"
        fill="#F5A524"
        stroke="#B36B00"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2" fill="#FFFDF7" />
    </svg>
  );
}

// ==========================================
// 6. HIVE SHOP COSMETIC ICONS
// ==========================================

/** Acorn Hat Cosmetic Icon */
export function AcornHatIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Woody Stem */}
      <path d="M15 4C14.2 2.2 15.5 1 17.5 0.8C18.2 1.2 17.8 2.5 16.5 4.5Z" fill="#542E11" />
      {/* Forest Leaf Sprig */}
      <path d="M17 2C19.5 1.2 21.5 2 22 3C20.5 3.8 18.5 3.5 16.5 2.6Z" fill="#4E8F3C" />
      <path d="M17 2.2Q19.5 2.5 21.5 2.9" stroke="#2E5C20" strokeWidth="0.5" strokeLinecap="round" />

      {/* Acorn Cap Dome */}
      <path
        d="M4 19C3 10 10 6 16 6C22 6 29 10 28 19C22 22 10 22 4 19Z"
        fill="#8F5426"
        stroke="#522C0F"
        strokeWidth="1"
      />
      {/* Cap Dome Highlight */}
      <path
        d="M6 16C7 10 11 7.5 16 7.5C20 7.5 24 9.5 25 14C20 12 12 13 6 16Z"
        fill="#B3723B"
        opacity="0.8"
      />

      {/* Cupule Scale Rows */}
      {/* Row 1 */}
      <path d="M12 10Q14 8 16 10Q18 8 20 10" stroke="#5C300F" strokeWidth="1" strokeLinecap="round" />
      {/* Row 2 */}
      <path d="M8 14Q11 11.5 14 14Q16 11 18 14Q21 11.5 24 14" stroke="#5C300F" strokeWidth="1" strokeLinecap="round" />
      {/* Row 3 */}
      <path d="M6 18Q9.5 15.5 13 18Q16 15 19 18Q22.5 15.5 26 18" stroke="#5C300F" strokeWidth="1" strokeLinecap="round" />

      {/* Warm Scale Highlights */}
      <path d="M12.5 10.7Q14 9.2 15.5 10.7M16.5 10.7Q18 9.2 19.5 10.7" stroke="#C6894F" strokeWidth="0.7" strokeLinecap="round" opacity="0.85" />
      <path d="M8.5 14.7Q11 12.7 13.5 14.7M14.5 14.7Q16 12.2 17.5 14.7M18.5 14.7Q21 12.7 23.5 14.7" stroke="#C6894F" strokeWidth="0.7" strokeLinecap="round" opacity="0.85" />

      {/* Rolled Cap Brim */}
      <path
        d="M3 18Q16 22 29 18C30.5 20 29.5 22.5 27.5 23.5Q16 27.5 4.5 23.5C2.5 22.5 1.5 20 3 18Z"
        fill="#754117"
        stroke="#482309"
        strokeWidth="1"
      />
      {/* Brim Notch Texture */}
      <path d="M7 20V22M11.5 21V23M16 21.5V23.5M20.5 21V23M25 20V22" stroke="#482309" strokeWidth="0.8" strokeLinecap="round" />
      {/* Brim Highlight */}
      <path d="M4.5 19Q16 22.5 27.5 19" stroke="#B8763C" strokeWidth="0.8" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

/** Honey Crown Cosmetic Icon */
export function HoneyCrownIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Crown base with honeycomb points */}
      <path
        d="M6 22L8 11L12 16L16 8L20 16L24 11L26 22H6Z"
        fill="#F5A524"
        stroke="#B36B00"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Crown headband band */}
      <rect x="6" y="21" width="20" height="4" rx="2" fill="#B36B00" />
      {/* Gems on tips */}
      <circle cx="8" cy="11" r="1.5" fill="#2BB7A3" />
      <circle cx="16" cy="8" r="1.8" fill="#FFFDF7" />
      <circle cx="24" cy="11" r="1.5" fill="#2BB7A3" />
    </svg>
  );
}

/** Cozy Scarf Cosmetic Icon */
export function ScarfIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Scarf Loop around neck */}
      <path
        d="M6 14C6 11 11 9 16 9C21 9 26 11 26 14C26 17 21 19 16 19C11 19 6 17 6 14Z"
        fill="#2BB7A3"
        stroke="#12786B"
        strokeWidth="1.8"
      />
      {/* Hanging Tails */}
      <path
        d="M18 17V26C18 26.5 19 27 20 27C21 27 22 26.5 22 26V17"
        fill="#12786B"
      />
      <path
        d="M13 17V24C13 24.5 14 25 15 25C16 25 17 24.5 17 24V17"
        fill="#2BB7A3"
      />
      {/* Knitted stripes */}
      <path d="M10 13L12 15M15 13L17 15M20 13L22 15" stroke="#EFE9FA" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/** Friendly Bee Cosmetic Icon */
export function BeeIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Wings */}
      <ellipse cx="12" cy="11" rx="4" ry="6" fill="#EFE9FA" stroke="#7C5CC4" strokeWidth="1.2" transform="rotate(-25 12 11)" />
      <ellipse cx="19" cy="10" rx="4" ry="6" fill="#EFE9FA" stroke="#7C5CC4" strokeWidth="1.2" transform="rotate(25 19 10)" />
      {/* Bee Oval Body */}
      <ellipse cx="16" cy="18" rx="8" ry="6" fill="#F5A524" stroke="#B36B00" strokeWidth="1.5" />
      {/* Stripes */}
      <path d="M14 12.5V23.5M18 12.5V23.5" stroke="#2A1B4D" strokeWidth="2.5" />
      {/* Eye & Stinger */}
      <circle cx="21" cy="17" r="1" fill="#2A1B4D" />
      <path d="M8 18L6 18" stroke="#2A1B4D" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Explorer Sun Hat Cosmetic Icon */
export function ExplorerHatIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Crown Dome */}
      <path
        d="M9 18C9 10 12 7 16 7C20 7 23 10 23 18Z"
        fill="#D4B07B"
        stroke="#8D6E3F"
        strokeWidth="1.2"
      />
      {/* Top Vent Ridge */}
      <path d="M16 7V12" stroke="#8D6E3F" strokeWidth="1" strokeLinecap="round" />
      {/* Hat Band */}
      <path d="M9 16H23" stroke="#542E11" strokeWidth="2.2" />
      <rect x="14.5" y="14.5" width="3" height="3" rx="0.5" fill="#F5A524" />
      {/* Wide Curved Brim */}
      <path
        d="M4 19Q16 23 28 19C29 20.5 28 22 25 22.5Q16 25 7 22.5C4 22 3 20.5 4 19Z"
        fill="#BF9B63"
        stroke="#8D6E3F"
        strokeWidth="1.2"
      />
    </svg>
  );
}

/** Wildflower Wreath Cosmetic Icon */
export function FlowerCrownIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Arching green vine */}
      <path
        d="M6 21Q16 11 26 21"
        stroke="#2E7D32"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 21Q16 13 25 21"
        stroke="#4CAF50"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Little green leaves */}
      <ellipse cx="10" cy="16" rx="2" ry="1" fill="#4CAF50" transform="rotate(-30 10 16)" />
      <ellipse cx="22" cy="16" rx="2" ry="1" fill="#4CAF50" transform="rotate(30 22 16)" />
      {/* Flower blooms */}
      <circle cx="8" cy="19" r="2.5" fill="#E88AA6" />
      <circle cx="8" cy="19" r="1" fill="#FFFDF7" />
      <circle cx="12" cy="15" r="2.5" fill="#9D72FF" />
      <circle cx="12" cy="15" r="1" fill="#FFFDF7" />
      <circle cx="16" cy="13" r="3" fill="#F5A524" />
      <circle cx="16" cy="13" r="1.2" fill="#FFFDF7" />
      <circle cx="20" cy="15" r="2.5" fill="#9D72FF" />
      <circle cx="20" cy="15" r="1" fill="#FFFDF7" />
      <circle cx="24" cy="19" r="2.5" fill="#E88AA6" />
      <circle cx="24" cy="19" r="1" fill="#FFFDF7" />
    </svg>
  );
}

/** Pom Pom Beanie Cosmetic Icon */
export function BeanieIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Fluffy Pom Pom */}
      <circle cx="16" cy="7" r="3.5" fill="#F5A524" stroke="#B36B00" strokeWidth="1" />
      <circle cx="14.5" cy="6" r="1" fill="#FFE8B5" />
      {/* Beanie Dome */}
      <path
        d="M8 20C8 12 11 9 16 9C21 9 24 12 24 20Z"
        fill="#7C5CC4"
        stroke="#2A1B4D"
        strokeWidth="1.2"
      />
      {/* Rib Knit Folded Cuff */}
      <rect x="7" y="19" width="18" height="5" rx="1.5" fill="#5B3A9E" stroke="#2A1B4D" strokeWidth="1.2" />
      <path d="M10 19V24M13 19V24M16 19V24M19 19V24M22 19V24" stroke="#7C5CC4" strokeWidth="1" />
    </svg>
  );
}

/** Starlight Wizard Hat Cosmetic Icon */
export function WizardHatIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Brim */}
      <ellipse cx="16" cy="23" rx="12" ry="3" fill="#1E163B" stroke="#F5A524" strokeWidth="1" />
      {/* Conical Crown */}
      <path
        d="M6 22L16 4L26 22Z"
        fill="#2A1B4D"
        stroke="#1E163B"
        strokeWidth="1.2"
      />
      {/* Gold Ribbon Band */}
      <path d="M7 21H25" stroke="#F5A524" strokeWidth="2" />
      {/* Golden Stars */}
      <path d="M16 10L16.6 12L18.5 12L17 13.2L17.5 15L16 14L14.5 15L15 13.2L13.5 12L15.4 12Z" fill="#FBBF24" />
      <circle cx="12" cy="17" r="0.8" fill="#FFFDF7" />
      <circle cx="20" cy="16" r="0.8" fill="#FFFDF7" />
    </svg>
  );
}

/** Golden Fleece Scarf Cosmetic Icon */
export function GoldenScarfIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Scarf Loop */}
      <path
        d="M6 14C6 11 11 9 16 9C21 9 26 11 26 14C26 17 21 19 16 19C11 19 6 17 6 14Z"
        fill="#F5A524"
        stroke="#B36B00"
        strokeWidth="1.8"
      />
      {/* Cream Stripes */}
      <path d="M9 13.5Q16 11 23 13.5" stroke="#FFFDF7" strokeWidth="1.5" strokeLinecap="round" />
      {/* Hanging Tail */}
      <path d="M16 17V26C16 26.5 17.5 27 19 27C20.5 27 22 26.5 22 26V17" fill="#F5A524" stroke="#B36B00" strokeWidth="1" />
      <path d="M17 21H21M17 24H21" stroke="#FFFDF7" strokeWidth="1" strokeLinecap="round" />
      {/* Fringes */}
      <path d="M17 27V29M19 27V29.5M21 27V29" stroke="#B36B00" strokeWidth="0.8" />
    </svg>
  );
}

/** Midnight Starlight Cape Cosmetic Icon */
export function StarCapeIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Cape Body */}
      <path
        d="M10 11C12 9 20 9 22 11L26 25C20 27 12 27 6 25Z"
        fill="#3E2769"
        stroke="#2A1B4D"
        strokeWidth="1.2"
      />
      {/* Golden Trim Border */}
      <path d="M7 24C12 26 20 26 25 24" stroke="#F5A524" strokeWidth="1.5" strokeLinecap="round" />
      {/* Golden Star Clasp */}
      <polygon points="16,8 17.2,11.5 20.5,11.5 17.8,13.5 18.8,17 16,15 13.2,17 14.2,13.5 11.5,11.5 14.8,11.5" fill="#F5A524" />
      {/* Sparkles on cape */}
      <circle cx="12" cy="18" r="0.8" fill="#FFFDF7" />
      <circle cx="20" cy="19" r="0.8" fill="#FFFDF7" />
      <circle cx="16" cy="21" r="0.6" fill="#FBBF24" />
    </svg>
  );
}

/** Clover Leaf Cowl Cosmetic Icon */
export function LeafCowlIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Woven Cowl Collar */}
      <ellipse cx="16" cy="16" rx="10" ry="6" fill="#2E7D32" stroke="#1B5E20" strokeWidth="1.5" />
      <ellipse cx="16" cy="15.5" rx="7.5" ry="4" fill="#388E3C" />
      {/* Clover leaves */}
      <circle cx="15" cy="15" r="2" fill="#81C784" />
      <circle cx="17" cy="15" r="2" fill="#81C784" />
      <circle cx="16" cy="13.5" r="2" fill="#81C784" />
      <path d="M16 16V19" stroke="#1B5E20" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/** Pip the Little Ladybug Cosmetic Icon */
export function LadybugIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Head & Antennae */}
      <circle cx="16" cy="10" r="3.5" fill="#2A1B4D" />
      <path d="M14 8Q13 5 11 5M18 8Q19 5 21 5" stroke="#2A1B4D" strokeWidth="1" strokeLinecap="round" />
      {/* Ladybug Wing Shell */}
      <circle cx="16" cy="18" r="8.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
      {/* Center Wing Split Line */}
      <path d="M16 10V26.5" stroke="#2A1B4D" strokeWidth="1.5" />
      {/* Polka Dots */}
      <circle cx="12" cy="15" r="1.5" fill="#2A1B4D" />
      <circle cx="20" cy="15" r="1.5" fill="#2A1B4D" />
      <circle cx="11.5" cy="20" r="1.3" fill="#2A1B4D" />
      <circle cx="20.5" cy="20" r="1.3" fill="#2A1B4D" />
      {/* Gloss Highlight */}
      <path d="M12 12Q14 11 16 11" stroke="#FFF" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

/** Lumi the Lantern Firefly Cosmetic Icon */
export function FireflyIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Soft Light Halo */}
      <circle cx="16" cy="21" r="8" fill="#FEF08A" opacity="0.6" />
      <circle cx="16" cy="21" r="5" fill="#FDE047" opacity="0.8" />
      {/* Translucent Wings */}
      <ellipse cx="12" cy="13" rx="3.5" ry="5.5" fill="#E0F2FE" stroke="#7DD3FC" strokeWidth="0.8" transform="rotate(-30 12 13)" />
      <ellipse cx="20" cy="13" rx="3.5" ry="5.5" fill="#E0F2FE" stroke="#7DD3FC" strokeWidth="0.8" transform="rotate(30 20 13)" />
      {/* Head */}
      <circle cx="16" cy="11" r="2.5" fill="#2A1B4D" />
      <path d="M15 9Q14 7 13 7M17 9Q18 7 19 7" stroke="#2A1B4D" strokeWidth="0.8" strokeLinecap="round" />
      {/* Thorax */}
      <circle cx="16" cy="15" r="2" fill="#4B3A6B" />
      {/* Glowing Abdomen */}
      <ellipse cx="16" cy="20" rx="3.5" ry="4.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
      <ellipse cx="16" cy="21" rx="2" ry="2.5" fill="#FFFBEB" />
    </svg>
  );
}

/** Shelly the Forest Snail Cosmetic Icon */
export function SnailIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Snail Body & Tail */}
      <path
        d="M7 23C7 23 11 24 23 24C26 24 28 22 27 20C26 18 24 18 23 19"
        stroke="#2BB7A3"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Eyestalks */}
      <path d="M25 19L26 14M27 19L28.5 15" stroke="#2BB7A3" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="26" cy="13.5" r="1" fill="#12786B" />
      <circle cx="28.5" cy="14.5" r="1" fill="#12786B" />
      {/* Snail Shell */}
      <circle cx="14" cy="17" r="7" fill="#F5A524" stroke="#B36B00" strokeWidth="1.5" />
      {/* Shell Spiral */}
      <path
        d="M14 12C16.8 12 19 14.2 19 17C19 19.8 16.8 22 14 22C11.8 22 10 20.2 10 18C10 16.3 11.3 15 13 15C14.1 15 15 15.9 15 17"
        stroke="#B36B00"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Honeycomb Lamp Decor Icon */
export function HoneycombLampIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Stand base */}
      <path d="M12 26H20M16 26V21" stroke="#542E11" strokeWidth="2" strokeLinecap="round" />
      {/* Soft Glow */}
      <circle cx="16" cy="14" r="9" fill="#FEF08A" opacity="0.5" />
      {/* Hexagonal Lamp Body */}
      <polygon
        points="16,6 22,9.5 22,17 16,20.5 10,17 10,9.5"
        fill="#F5A524"
        stroke="#B36B00"
        strokeWidth="1.5"
      />
      {/* Hexagon Inner Cell Pattern */}
      <polygon
        points="16,9 20,11.5 20,15.5 16,18 12,15.5 12,11.5"
        fill="#FFE8B5"
        stroke="#F5A524"
        strokeWidth="1"
      />
      <circle cx="16" cy="13.5" r="2" fill="#FFFDF7" />
    </svg>
  );
}

/** Plump Lavender Beanbag Decor Icon */
export function CushionNookIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Beanbag soft base */}
      <path
        d="M6 22C6 16 10 12 16 12C22 12 26 16 26 22C26 25 21 26 16 26C11 26 6 25 6 22Z"
        fill="#7C5CC4"
        stroke="#5B3A9E"
        strokeWidth="1.5"
      />
      {/* Fluffy top cushion fold */}
      <path
        d="M10 18C12 14 20 14 22 18"
        stroke="#EFE9FA"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Honey colored patch accent */}
      <rect x="14" y="20" width="4" height="3" rx="1" fill="#F5A524" />
    </svg>
  );
}

/** Little Forest Bookshelf Decor Icon */
export function BookshelfIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Wooden Shelf Frame */}
      <rect x="6" y="8" width="20" height="18" rx="2" fill="#D4B07B" stroke="#8D6E3F" strokeWidth="1.5" />
      <line x1="6" y1="18" x2="26" y2="18" stroke="#8D6E3F" strokeWidth="1.5" />
      {/* Books on top shelf */}
      <rect x="8" y="11" width="3" height="7" rx="0.5" fill="#5B3A9E" />
      <rect x="12" y="10" width="3.5" height="8" rx="0.5" fill="#2BB7A3" />
      <rect x="16.5" y="12" width="3" height="6" rx="0.5" fill="#F5A524" />
      <rect x="20.5" y="11" width="3" height="7" rx="0.5" fill="#E88AA6" />
      {/* Books on bottom shelf */}
      <rect x="9" y="20" width="4" height="4" rx="0.5" fill="#2BB7A3" />
      <rect x="14" y="19" width="3.5" height="5" rx="0.5" fill="#5B3A9E" />
      <rect x="18.5" y="20" width="4.5" height="4" rx="0.5" fill="#F5A524" />
    </svg>
  );
}

/** Futuristic Hologram Globe Decor Icon */
export function HologramGlobeIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Base pedestal */}
      <rect x="11" y="26" width="10" height="3" rx="1.5" fill="#7C5CC4" opacity="0.6" />
      <rect x="13" y="24" width="6" height="3" rx="1" fill="#5B3A9E" />
      {/* Globe sphere */}
      <circle cx="16" cy="14" r="9" fill="#2BB7A3" opacity="0.15" stroke="#2BB7A3" strokeWidth="1.2" />
      {/* Latitude lines */}
      <ellipse cx="16" cy="14" rx="9" ry="3.5" stroke="#2BB7A3" strokeWidth="0.8" opacity="0.5" />
      <ellipse cx="16" cy="14" rx="9" ry="7" stroke="#2BB7A3" strokeWidth="0.6" opacity="0.35" />
      {/* Longitude arc */}
      <ellipse cx="16" cy="14" rx="3.5" ry="9" stroke="#7C5CC4" strokeWidth="0.8" opacity="0.5" />
      {/* Orbital ring */}
      <ellipse cx="16" cy="14" rx="12" ry="4" stroke="#F5A524" strokeWidth="1" opacity="0.6" strokeDasharray="2 2" />
      {/* Bright dot highlights */}
      <circle cx="12" cy="11" r="1.2" fill="#2BB7A3" opacity="0.8" />
      <circle cx="20" cy="16" r="1" fill="#F5A524" opacity="0.7" />
      <circle cx="16" cy="8" r="0.8" fill="#7C5CC4" opacity="0.9" />
      {/* Projection beam from pedestal */}
      <path d="M14.5 24L12 21M17.5 24L20 21" stroke="#2BB7A3" strokeWidth="0.6" opacity="0.4" strokeLinecap="round" />
    </svg>
  );
}

/** Round Reading Specs Icon */
export function ReadingGlassesIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Bridge */}
      <path d="M13 16Q16 13.5 19 16" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
      {/* Left Lens & Rim */}
      <circle cx="9" cy="16" r="6" fill="#F0FDF4" stroke="#B45309" strokeWidth="2" />
      <path d="M7 13.5Q10 12.5 11.5 14" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
      {/* Right Lens & Rim */}
      <circle cx="23" cy="16" r="6" fill="#F0FDF4" stroke="#B45309" strokeWidth="2" />
      <path d="M21 13.5Q24 12.5 25.5 14" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
      {/* Temples */}
      <path d="M3 15L4 16M29 15L28 16" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Starlight Star Frames Icon */
export function StarGlassesIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Center Bridge */}
      <line x1="14" y1="16" x2="18" y2="16" stroke="#5B3A9E" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left Star Frame */}
      <polygon
        points="9,9.5 11,13.5 15.5,14 12,17 13.2,21.5 9,19 4.8,21.5 6,17 2.5,14 7,13.5"
        fill="#EFE9FA"
        stroke="#5B3A9E"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Right Star Frame */}
      <polygon
        points="23,9.5 25,13.5 29.5,14 26,17 27.2,21.5 23,19 18.8,21.5 20,17 16.5,14 21,13.5"
        fill="#EFE9FA"
        stroke="#5B3A9E"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="16" r="1.5" fill="#F5A524" />
      <circle cx="23" cy="16" r="1.5" fill="#F5A524" />
    </svg>
  );
}

/** Cool Honey Shades Icon */
export function SunglassesIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Dark Rim Frame Top Bar */}
      <path d="M3 13H29" stroke="#2A1B4D" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left Tinted Lens */}
      <path
        d="M4 14C4 14 4 20 10 20C14 20 14 14 14 14Z"
        fill="#F5A524"
        stroke="#2A1B4D"
        strokeWidth="2"
      />
      <line x1="6" y1="15" x2="8" y2="19" stroke="#FFFDF7" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      {/* Right Tinted Lens */}
      <path
        d="M18 14C18 14 18 20 22 20C28 20 28 14 28 14Z"
        fill="#F5A524"
        stroke="#2A1B4D"
        strokeWidth="2"
      />
      <line x1="20" y1="15" x2="22" y2="19" stroke="#FFFDF7" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      {/* Center Bridge */}
      <line x1="14" y1="15" x2="18" y2="15" stroke="#2A1B4D" strokeWidth="2" />
    </svg>
  );
}

/** Golden Aviator Frames Icon */
export function AviatorGlassesIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Double Brow Bar */}
      <line x1="5" y1="12" x2="27" y2="12" stroke="#F5A524" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13 14Q16 12.5 19 14" stroke="#F5A524" strokeWidth="1.8" strokeLinecap="round" />
      {/* Teardrop Left Lens */}
      <path
        d="M5 13C5 13 4 20 9 21C14 21 14 14 14 13Z"
        fill="#E0F2FE"
        stroke="#D97706"
        strokeWidth="1.6"
      />
      {/* Teardrop Right Lens */}
      <path
        d="M18 13C18 14 18 21 23 21C28 20 27 13 27 13Z"
        fill="#E0F2FE"
        stroke="#D97706"
        strokeWidth="1.6"
      />
      <path d="M7 15L9 19" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
      <path d="M20 15L22 19" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

// ==========================================
// 7. INTERFACE & PLAYER ACTION SVGS
// ==========================================

/** Target / Difficulty Aim Icon (Storyset style target with dart) */
export function TargetIcon({ className = "", size = 18 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Target outer circle */}
      <circle cx="11" cy="13" r="9" fill="#FFFDF7" stroke="#5B3A9E" strokeWidth="1.8" />
      {/* Target mid circle */}
      <circle cx="11" cy="13" r="6" fill="#EFE9FA" stroke="#7C5CC4" strokeWidth="1.5" />
      {/* Target bullseye */}
      <circle cx="11" cy="13" r="3" fill="#F5A524" stroke="#B36B00" strokeWidth="1" />
      {/* Little dart hitting bullseye */}
      <path d="M19 5L12 12" stroke="#2A1B4D" strokeWidth="2" strokeLinecap="round" />
      <path d="M16.5 4L20 5L19 8.5" stroke="#2BB7A3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Speaker / Audio Wave Icon (Web Speech read-aloud) */
export function SpeakerIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M11 5L6 9H3C2.45 9 2 9.45 2 10V14C2 14.55 2.45 15 3 15H6L11 19V5Z"
        fill="currentColor"
      />
      <path
        d="M15.5 8.5C16.8 9.8 17.5 11.5 17.5 13C17.5 14.5 16.8 16.2 15.5 17.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M19 6C20.8 7.8 22 10.3 22 13C22 15.7 20.8 18.2 19 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Gentle Lightbulb / Hint Icon */
export function LightbulbIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9 18H15M10 21H14M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V16C8 16.55 8.45 17 9 17H15C15.55 17 16 16.55 16 16V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2Z"
        fill="#F5A524"
        stroke="#B36B00"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 6V9M10 7.5L12 9L14 7.5" stroke="#FFFDF7" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Checkmark Icon (Teal / White) */
export function CheckIcon({ className = "", size = 18 }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4.5 10.5L8 14L15.5 6.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Retry / Not Yet Icon (Rose) */
export function RetryIcon({ className = "", size = 18 }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3.5 10C3.5 6.41 6.41 3.5 10 3.5C13.2 3.5 15.86 5.8 16.4 8.8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M16.5 10C16.5 13.59 13.59 16.5 10 16.5C6.8 16.5 4.14 14.2 3.6 11.2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <polyline points="18,5 16.5,9 12.5,7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Settings / Gear / Comfort Icon */
export function SettingsIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Sliders / controls symbol for calm accessible comfort */}
      <path d="M4 6H14M18 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="6" r="2.5" fill="currentColor" />
      <path d="M4 12H8M12 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="12" r="2.5" fill="currentColor" />
      <path d="M4 18H16M20 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="18" r="2.5" fill="currentColor" />
    </svg>
  );
}

/** Printer Icon (Grownups report) */
export function PrinterIcon({ className = "", size = 18 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 9V3H18V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M6 18H4C2.9 18 2 17.1 2 16V11C2 9.9 2.9 9 4 9H20C21.1 9 22 9.9 22 11V16C22 17.1 21.1 18 20 18H18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="6" y="14" width="12" height="7" rx="1" fill="#FFFFFF" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/** Close / X Icon */
export function CloseIcon({ className = "", size = 18 }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** Celebration / Party Popper Icon */
export function CelebrationIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Popper cone */}
      <path d="M3 21L7 11L13 17L3 21Z" fill="#F5A524" stroke="#B36B00" strokeWidth="1.5" />
      {/* Streamers */}
      <path d="M12 9Q16 7 15 3" stroke="#2BB7A3" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M15 12Q19 12 21 8" stroke="#E88AA6" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="18" cy="16" r="1.5" fill="#5B3A9E" />
      <circle cx="10" cy="5" r="1.5" fill="#F5A524" />
      <circle cx="21" cy="4" r="1.5" fill="#2BB7A3" />
    </svg>
  );
}

// ==========================================
// 6. DUOLINGO-INSPIRED GAMIFICATION VECTOR ASSETS
// ==========================================

/** Duolingo-style Lingot Gem / Calming Crystal */
export function DuoLingotGem({ className = "", size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 36"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Facet Top Left */}
      <path d="M16 2 L2 14 L16 18 Z" fill="#2BB7A3" />
      {/* Facet Top Right */}
      <path d="M16 2 L30 14 L16 18 Z" fill="#44D9C3" />
      {/* Facet Bottom Left */}
      <path d="M2 14 L16 34 L16 18 Z" fill="#12786B" />
      {/* Facet Bottom Right */}
      <path d="M30 14 L16 34 L16 18 Z" fill="#2BB7A3" />
      {/* Shine reflection */}
      <path d="M16 2 L19 14 L16 16 L13 14 Z" fill="#FFFFFF" opacity="0.6" />
    </svg>
  );
}

/** Duolingo-style Warm Spark Streak Flame */
export function DuoStreakFlame({ className = "", size = 32 }: IconProps) {
  return (
    <svg
      viewBox="0 0 36 44"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer Flame */}
      <path
        d="M18 2 C18 2 34 18 34 29 C34 37 27 43 18 43 C9 43 2 37 2 29 C2 19 15 11 15 11 C15 11 13 19 17 23 C19 21 21 14 18 2 Z"
        fill="#FF9600"
        stroke="#CC7700"
        strokeWidth="2.5"
      />
      {/* Inner Hot Core */}
      <path
        d="M18 22 C18 22 26 27 26 33 C26 37 22.5 40 18 40 C13.5 40 10 37 10 33 C10 27 18 22 18 22 Z"
        fill="#FFC800"
      />
      {/* Core Specular */}
      <circle cx="16" cy="31" r="2.5" fill="#FFFFFF" opacity="0.8" />
    </svg>
  );
}

/** Duolingo-style Chunky League Shield / Crest */
export function DuoLeagueShield({ className = "", size = 32 }: IconProps) {
  return (
    <svg
      viewBox="0 0 36 40"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 3D Drop Shadow Extrusion */}
      <path d="M5 6 L18 2 L31 6 L31 22 C31 31 18 38 18 38 C18 38 5 31 5 22 Z" fill="#2A1B4D" />
      {/* Shield Face */}
      <path d="M5 4 L18 0 L31 4 L31 20 C31 29 18 36 18 36 C18 36 5 29 5 20 Z" fill="#5B3A9E" stroke="#2A1B4D" strokeWidth="2" />
      {/* Inner Laurel Rim */}
      <path d="M9 7 L18 3 L27 7 L27 19 C27 26 18 32 18 32 C18 32 9 26 9 19 Z" fill="#7C5CC4" />
      {/* Golden Star Inset */}
      <path
        d="M18 10 L20.5 15.5 L26.5 16 L22 20 L23.5 26 L18 22.5 L12.5 26 L14 20 L9.5 16 L15.5 15.5 Z"
        fill="#F5A524"
        stroke="#B36B00"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Duolingo-style Golden Trophy */
export function DuoGoldenTrophy({ className = "", size = 32 }: IconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Base */}
      <rect x="12" y="32" width="16" height="6" rx="2" fill="#B36B00" />
      <rect x="10" y="30" width="20" height="4" rx="2" fill="#F5A524" stroke="#B36B00" strokeWidth="1.5" />
      <path d="M17 24 L23 24 L21 30 L19 30 Z" fill="#F5A524" stroke="#B36B00" strokeWidth="1.5" />
      {/* Cup Body */}
      <path d="M10 6 H30 V16 C30 22 25 25 20 25 C15 25 10 22 10 16 Z" fill="#FBBF24" stroke="#B36B00" strokeWidth="2" />
      {/* Handles */}
      <path d="M10 9 H5 C3.5 9 3 14 6 15 L10 15" stroke="#B36B00" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M30 9 H35 C36.5 9 37 14 34 15 L30 15" stroke="#B36B00" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Star relief */}
      <path d="M20 10 L21.5 13.5 L25 14 L22.5 16.5 L23.5 20 L20 18 L16.5 20 L17.5 16.5 L15 14 L18.5 13.5 Z" fill="#FFFFFF" opacity="0.8" />
    </svg>
  );
}

/** Reading Ruler / Line Focus Guide Icon */
export function ReadingRulerIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21.3 8.7 8.7 21.3c-.4.4-1 .4-1.4 0l-5.6-5.6c-.4-.4-.4-1 0-1.4L14.3 1.7c.4-.4 1-.4 1.4 0l5.6 5.6c.4.4.4 1 0 1.4Z" />
      <path d="m14.5 4.5 2 2" />
      <path d="m11.5 7.5 2 2" />
      <path d="m8.5 10.5 2 2" />
      <path d="m5.5 13.5 2 2" />
    </svg>
  );
}

