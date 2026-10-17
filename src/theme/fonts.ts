/**
 * Fonts per client: swap these two imports (any Google Font works).
 * Default pairing from the Lovable editorial design: Fraunces (serif) + Inter (sans).
 * next/font requires literal options, so edit here rather than in site.config.
 * Keep the `variable` names — globals.css maps them to font-serif / font-sans.
 */
import { Fraunces, Inter } from "next/font/google";

export const headingFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

export const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
