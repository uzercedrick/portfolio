import type { Metadata, Viewport } from "next";
import { mono, zalando } from "./fonts";
import "./global.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14141A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${zalando.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}