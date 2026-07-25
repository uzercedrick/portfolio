"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

const MONO_FONT = "'Ubuntu Sans Mono', monospace";
const DARK_GRAY = "rgba(245,246,252,0.55)";
const ICE_WHITE = "#F5F6FC";
const ACCENT = "#e63946";

const LINKS = [
  { label: "ABOUT", href: "/", anchor: "about" },
  { label: "PROJECT", href: "/", anchor: "projects" },
  { label: "CONTACT", href: "/", anchor: "contact" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const getInitialState = () => {
    if (typeof window === "undefined" || pathname !== "/") return null;
    const scrollPos = window.scrollY + 160;
    if (scrollPos < window.innerHeight * 0.75) return null;
    let found = false;
    let result: string | null = null;
    [...LINKS].reverse().forEach(({ anchor }) => {
      if (found) return;
      const el = document.getElementById(anchor);
      if (!el) return;
      if (scrollPos >= el.offsetTop) {
        result = anchor;
        found = true;
      }
    });
    return result;
  };

  const [activeSection, setActiveSection] = useState<string | null>(getInitialState);

  const handleNavClick = useCallback((e: React.MouseEvent, href: string, anchor: string) => {
    e.preventDefault();
    const target = document.getElementById(anchor);
    if (pathname === "/" && target) {
      window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
    } else {
      router.push(`${href}#${anchor}`, { scroll: false });
    }
  }, [pathname, router]);

  const onScroll = useCallback(() => {
    if (pathname !== "/") return;
    const scrollPos = window.scrollY + 160;
    if (scrollPos < window.innerHeight * 0.75) {
      setActiveSection(null);
      return;
    }
    let found = false;
    [...LINKS].reverse().forEach(({ anchor }) => {
      if (found) return;
      const el = document.getElementById(anchor);
      if (!el) return;
      if (scrollPos >= el.offsetTop) {
        setActiveSection(anchor);
        found = true;
      }
    });
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: "clamp(20px, 4vw, 32px)",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "36px",
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "36px", pointerEvents: "auto", whiteSpace: "nowrap" }}>
        {LINKS.map((item, i) => (
          <Link
            key={item.label}
            href={`${item.href}#${item.anchor}`}
            onClick={(e) => handleNavClick(e, item.href, item.anchor)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: MONO_FONT,
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: activeSection === item.anchor ? ICE_WHITE : DARK_GRAY,
              textDecoration: "none",
              position: "relative",
              transition: "color 0.2s ease",
            }}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            <span>{item.label}</span>
            <span
              style={{
                position: "absolute",
                bottom: "-8px",
                left: "0",
                width: activeSection === item.anchor ? "100%" : "0",
                height: "1px",
                background: ACCENT,
                transition: "width 0.25s ease",
              }}
            />
          </Link>
        ))}
      </div>
    </motion.nav>
  );
}