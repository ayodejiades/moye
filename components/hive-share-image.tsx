"use client";

import { useState, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useMoyeStore } from "@/lib/moye-store";
import { MoyinMascot } from "@/components/moyin-mascot";
import {
  HoneyDropIcon,
  HoneycombLampIcon,
  HologramGlobeIcon,
  CushionNookIcon,
  BookshelfIcon,
} from "@/components/ui/svg-icons";

/**
 * Save the hive as a picture (features.md B7).
 *
 * The picture is made from the SAME components the hive page shows (the real Moyin with
 * whatever is equipped, and the real decor icons), so what you save is what you see. It is
 * drawn on this device and handed to the browser as a download. Nothing is uploaded.
 */
export function HiveShareImage() {
  const { state } = useMoyeStore();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "failed">("idle");

  async function save() {
    setStatus("saving");
    try {
      const blob = await renderHiveImage(state);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `moye-hive-${(state.activeProfileName || "moyin").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setStatus("saved");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        data-demo="save-hive-picture"
        onClick={save}
        disabled={status === "saving"}
        className="btn-3d btn-3d-card text-base gap-2"
      >
        <HoneyDropIcon size={16} />
        <span>{status === "saving" ? "Making picture" : "Save picture"}</span>
      </button>
      <p aria-live="polite" className="text-sm text-[var(--fg-muted)] min-h-6">
        {status === "saved" && "Picture saved to this device."}
        {status === "failed" && "This browser would not save the picture. Everything else on this page still works."}
      </p>
    </div>
  );
}

type HiveState = {
  activeProfileName: string;
  honeyBalance: number;
  streakDays: number;
  equippedHat: string | null;
  equippedGlasses: string | null;
  equippedScarf: string | null;
  equippedPet: string | null;
  equippedDecor: string | null;
};

const SIZE = 640; // logical pixels, drawn at 2x for a sharp picture

/** Turns a React icon into the markup of its <svg>, placed at x, y with a fixed size. */
function svgAt(node: ReactElement, x: number, y: number, w: number, h: number): string {
  const html = renderToStaticMarkup(node);
  const match = html.match(/<svg[\s\S]*<\/svg>/);
  if (!match) return "";
  let svg = match[0];
  // Replace the opening tag's own size so the picture decides the size, and add the namespace.
  svg = svg.replace(/^<svg([^>]*)>/, (_m, attrs: string) => {
    const clean = attrs.replace(/\s(width|height|class|style)="[^"]*"/g, "");
    return `<svg xmlns="http://www.w3.org/2000/svg"${clean} x="${x}" y="${y}" width="${w}" height="${h}" overflow="visible">`;
  });
  // A picture has no page around it: resolve colours that would have come from the page.
  const text = getComputedStyle(document.documentElement);
  svg = svg.replace(/var\((--[\w-]+)\)/g, (_m, name: string) => text.getPropertyValue(name).trim() || "#2A1B4D");
  svg = svg.replace(/currentColor/g, "#2A1B4D");
  return svg;
}

function decorMarkup(decor: string | null): string {
  switch (decor) {
    case "decor-honeycomb-lamp":
      return svgAt(<HoneycombLampIcon size={96} />, 70, 330, 96, 96);
    case "decor-cushion-pile":
      return svgAt(<CushionNookIcon size={96} />, 70, 330, 96, 96);
    case "decor-hologram-globe":
      return svgAt(<HologramGlobeIcon size={110} />, 460, 90, 110, 110);
    case "decor-bookshelf":
      return svgAt(<BookshelfIcon size={96} />, 474, 330, 96, 96);
    default:
      return "";
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("the picture could not be drawn"));
    img.src = src;
  });
}

/**
 * Draws the hive card: Moyin exactly as shown on the hive page (same component, same
 * equipped hat, glasses, scarf and pet), the room decor, the name, the honey and the streak.
 */
export async function renderHiveImage(state: HiveState): Promise<Blob> {
  const moyin = svgAt(
    <MoyinMascot
      pose="cheer"
      size={300}
      hat={state.equippedHat}
      glasses={state.equippedGlasses}
      scarf={state.equippedScarf}
      pet={state.equippedPet}
    />,
    170,
    110,
    300,
    300,
  );

  const scene = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">${decorMarkup(state.equippedDecor)}${moyin}</svg>`;
  const img = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(scene)}`);

  // Fonts used for the words must be ready, or the canvas silently draws a fallback.
  if (document.fonts?.ready) await document.fonts.ready;
  const family = getComputedStyle(document.body).fontFamily || "sans-serif";

  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE * scale;
  canvas.height = SIZE * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas is not available");
  ctx.scale(scale, scale);

  ctx.fillStyle = "#FBF8FF";
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, 24, 24, SIZE - 48, SIZE - 48, 32);
  ctx.fill();
  ctx.strokeStyle = "#D8CCE8";
  ctx.lineWidth = 4;
  roundRect(ctx, 24, 24, SIZE - 48, SIZE - 48, 32);
  ctx.stroke();

  ctx.drawImage(img, 0, 0, SIZE, SIZE);

  const name = state.activeProfileName.trim() || "Moyin";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#2A1B4D";
  ctx.font = `700 36px ${family}`;
  ctx.fillText(`${name}'s hive`, SIZE / 2, 470, SIZE - 120);

  ctx.fillStyle = "#594875";
  ctx.font = `500 26px ${family}`;
  ctx.fillText(`${state.honeyBalance} honey`, SIZE / 2 - 90, 520);
  ctx.fillText(`${state.streakDays} day streak`, SIZE / 2 + 90, 520);

  ctx.fillStyle = "#5B3A9E";
  ctx.font = `700 22px ${family}`;
  ctx.fillText("moye", SIZE / 2, 580);

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("the picture could not be saved"))), "image/png"),
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
