/**
 * Fonts per client: swap these two imports (any Google Font works).
 * Pairings that suit each preset:
 *   coastal → Lora + Inter            modern → Montserrat + Inter
 *   luxury  → Playfair_Display + Lato
 * next/font requires literal options, so edit here rather than in site.config.
 */
import { Inter, Lora } from "next/font/google";

export const headingFont = Lora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
