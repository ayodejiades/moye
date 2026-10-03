"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Position inside a group of siblings, 0 to 5. Adds a 60ms stagger per step. */
  index?: number;
  className?: string;
};

/**
 * Fades and lifts its children in once, the first time they scroll into view.
 * Wrap a section or a card. Do not make the hover element itself the Reveal.
 * Content is visible with JavaScript off, with reduced motion on, and when already on screen.
 */
export function Reveal({ children, index = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const calm =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      root.classList.contains("reduced-motion-mode");
    if (calm || !("IntersectionObserver" in window)) {
      el.dataset.visible = "true";
      return;
    }
    root.dataset.motion = "on";
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      el.dataset.visible = "true"; // already on screen: no flash, no animation
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = "true";
            io.disconnect();
          }
        }
      },
      // Four values, each WITH a unit. A bare 0 throws a SyntaxError.
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal="" className={className} style={{ "--i": index } as CSSProperties}>
      {children}
    </div>
  );
}
