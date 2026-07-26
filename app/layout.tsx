import type { Metadata, Viewport } from "next";
import { mono, zalando } from "./fonts";
import "./global.css";

export const metadata: Metadata = {
  title: "JCN",
  description:
    "UX/UI Designer & Frontend Developer creating intuitive digital experiences informed by real technical know-how.",
  keywords: ["UX/UI Designer", "Portfolio", "Jhon Cedrick Nungay", "Frontend Developer"],
};

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