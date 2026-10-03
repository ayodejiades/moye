import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/lib/client-providers";
import { ServiceWorkerRegistrar } from "@/components/service-worker-registrar";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Moye: Calm Adaptive Learning with Moyin",
  description:
    "Short, gentle lessons that adjust to each child. No timers and no shame. Moyin the honey badger sits beside them the whole way.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Moye",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/moyin-192.png",
    apple: "/moyin-192.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lexend.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--paper)] text-[var(--plum-900)] selection:bg-[var(--plum-100)]">
        <ClientProviders>
          <ServiceWorkerRegistrar />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
