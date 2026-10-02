import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/lib/client-providers";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Moye: Calm Adaptive Learning with Moyin",
  description: "A calm, adaptive Duolingo-style learning app designed for ADHD and dyslexia. No timers, no guilt, pure encouragement.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lexend.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--paper)] text-[var(--plum-900)] selection:bg-[var(--plum-100)]">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
