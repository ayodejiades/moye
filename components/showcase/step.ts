"use client";

import type { CSSProperties } from "react";

/** Stagger index shared by .pop-in in app/globals.css. */
export const step = (i: number) => ({ "--i": i }) as CSSProperties;
