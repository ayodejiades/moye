"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Wraps an element whose ambient float loop must stop while it is off screen.
 * .duo-mascot-float reads [data-inview="false"] and pauses itself (docs/SPEC.md section 4:
 * ambient loops pause while off screen, and at most two run at once on the landing page).
 */
export function InViewFloat({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} data-inview={inView ? "true" : "false"} className={`duo-mascot-float inline-block ${className}`}>
      {children}
    </span>
  );
}
