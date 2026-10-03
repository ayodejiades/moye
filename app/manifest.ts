import type { MetadataRoute } from "next";

/**
 * Web app manifest (docs/SPEC.md section 5: installable, offline first).
 * Colours come from the tokens in app/globals.css so the installed app matches the site.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Moye: Calm Learning with Moyin",
    short_name: "Moye",
    description:
      "Short, gentle lessons that adjust to each child. No timers and no shame. Moyin the honey badger sits beside them the whole way.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FBF8FF",
    theme_color: "#2A1B4D",
    categories: ["education", "kids"],
    icons: [
      { src: "/moyin-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/moyin-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/moyin-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
