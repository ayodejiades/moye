"use client";

import { useState } from "react";
import { useMoyeStore } from "@/lib/moye-store";
import { HoneyDropIcon } from "@/components/ui/svg-icons";

/**
 * Save the hive as a picture (features.md B7).
 *
 * Drawn locally on a canvas and handed to the browser as a download. Nothing is
 * uploaded, there is no account, and the picture never leaves the device.
 */
export function HiveShareImage() {
  const { state } = useMoyeStore();
  const [status, setStatus] = useState<"idle" | "saved" | "failed">("idle");

  async function save() {
    setStatus("idle");
    try {
      const dataUrl = renderHiveImage(state);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `moye-hive-${state.activeProfileName.toLowerCase() || "moyin"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setStatus("saved");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        data-demo="save-hive-picture"
        onClick={save}
        className="btn-3d btn-3d-card text-base gap-2 self-start"
      >
        <HoneyDropIcon size={16} />
        <span>Save picture</span>
      </button>
      {status === "saved" && (
        <p className="text-sm text-[var(--fg-muted)]">Picture saved to this device.</p>
      )}
      {status === "failed" && (
        <p className="text-sm text-[var(--fg-muted)]">
          This browser would not save the picture. Everything else on this page still works.
        </p>
      )}
    </div>
  );
}

/**
 * Draws the hive card on a canvas: Moyin with whatever is equipped, the honey balance,
 * and the streak. Kept separate from the component so it can be reasoned about (and it
 * has no React in it).
 */
export function renderHiveImage(state: {
  activeProfileName: string;
  honeyBalance: number;
  streakDays: number;
  equippedHat: string | null;
  equippedScarf: string | null;
  ownedCosmetics: string[];
}): string {
  const size = 640;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas is not available");

  // Background and card, in the product's own tokens.
  ctx.fillStyle = "#FBF8FF";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, 40, 40, size - 80, size - 80, 32);
  ctx.fill();
  ctx.strokeStyle = "#D8CCE8";
  ctx.lineWidth = 4;
  roundRect(ctx, 40, 40, size - 80, size - 80, 32);
  ctx.stroke();

  // Moyin, drawn from the same shapes the mascot uses.
  const cx = size / 2;
  const cy = 250;
  ctx.fillStyle = "#2A1B4D";
  ctx.beginPath();
  ctx.ellipse(cx - 62, cy - 58, 30, 36, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 62, cy - 58, 30, 36, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#E88AA6";
  ctx.beginPath();
  ctx.ellipse(cx - 62, cy - 58, 18, 24, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 62, cy - 58, 18, 24, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#2A1B4D";
  ctx.beginPath();
  ctx.ellipse(cx, cy, 84, 78, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FFFDF7";
  ctx.beginPath();
  ctx.ellipse(cx, cy + 14, 60, 54, 0, 0, Math.PI * 2);
  ctx.fill();

  // Honey forehead stripe: a warm band down the middle of the white blaze, drawn before
  // the face so the face sits on top of it.
  ctx.fillStyle = "#FFFDF7";
  ctx.fillRect(cx - 20, cy - 72, 40, 96);
  ctx.fillStyle = "#F5A524";
  ctx.beginPath();
  ctx.moveTo(cx - 11, cy - 72);
  ctx.lineTo(cx + 11, cy - 72);
  ctx.lineTo(cx + 8, cy + 6);
  ctx.lineTo(cx - 8, cy + 6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#2A1B4D";
  ctx.beginPath();
  ctx.arc(cx - 22, cy + 6, 13, 0, Math.PI * 2);
  ctx.arc(cx + 22, cy + 6, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(cx - 17, cy + 1, 5, 0, Math.PI * 2);
  ctx.arc(cx + 27, cy + 1, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#E88AA6";
  ctx.beginPath();
  ctx.arc(cx - 44, cy + 34, 15, 0, Math.PI * 2);
  ctx.arc(cx + 44, cy + 34, 15, 0, Math.PI * 2);
  ctx.fill();

  if (state.equippedHat) {
    ctx.fillStyle = "#B36B00";
    ctx.beginPath();
    ctx.ellipse(cx, cy - 74, 46, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#7A4600";
    ctx.beginPath();
    ctx.arc(cx, cy - 84, 18, Math.PI, 0);
    ctx.fill();
  }
  if (state.equippedScarf) {
    ctx.fillStyle = "#12786B";
    ctx.fillRect(cx - 52, cy + 78, 104, 18);
  }

  // Text: what Moyin is called and the two numbers the app actually holds.
  ctx.fillStyle = "#2A1B4D";
  ctx.textAlign = "center";
  ctx.font = "bold 34px Lexend, sans-serif";
  const name = state.activeProfileName.trim() || "Moyin";
  ctx.fillText(`${name}'s hive`, cx, 420);

  ctx.font = "26px Lexend, sans-serif";
  ctx.fillStyle = "#594875";
  ctx.fillText(`${state.honeyBalance} honey  ${state.streakDays} day streak`, cx, 462);

  ctx.font = "20px Lexend, sans-serif";
  ctx.fillStyle = "#5B3A9E";
  ctx.fillText("moye", cx, 520);

  return canvas.toDataURL("image/png");
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
