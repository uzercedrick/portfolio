import { Ubuntu_Mono, Zalando_Sans_Expanded } from "next/font/google";

export const mono = Ubuntu_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ubuntu-mono",
  display: "swap",
});

export const zalando = Zalando_Sans_Expanded({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-zalando-expanded",
  display: "swap",
  fallback: ["Arial Black", "Impact", "sans-serif"],
  adjustFontFallback: false,
});