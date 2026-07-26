"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const MONO_FONT = "'Ubuntu Sans Mono', monospace";
const DARK_GRAY = "rgba(245,246,252,0.55)";
const ICE_WHITE = "#F5F6FC";
const ACCENT = "#e63946";
const BG = "#14141A";
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = useCallback((e: React.MouseEvent, href: string, anchor: string) => {
    e.preventDefault();
    setMenuOpen(false);
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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const activeIndex = LINKS.findIndex((l) => l.anchor === activeSection);

  return (
    <>
      <style>{`
        .nav-desktop-row { display: flex; }
        .nav-mobile-trigger { display: none; }

        @media (max-width: 900px) {
          .nav-desktop-row { display: none !important; }
          .nav-mobile-trigger { display: flex !important; }
        }
      `}</style>

      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{
          position: "fixed",
          top: "clamp(20px, 4vw, 32px)",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 100,
          pointerEvents: "none",
        }}
      >
        {/* Desktop row — unchanged */}
        <div
          className="nav-desktop-row"
          style={{ alignItems: "center", gap: "36px", pointerEvents: "auto", whiteSpace: "nowrap" }}
        >
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

        {/* Mobile trigger — tech chip, fixed top-right */}
        <div
          className="nav-mobile-trigger"
          style={{
            position: "fixed",
            top: "clamp(18px, 4vw, 26px)",
            right: "clamp(20px, 5vw, 28px)",
            pointerEvents: "auto",
          }}
        >
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(20,20,26,0.7)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              border: `1px solid ${menuOpen ? ICE_WHITE : "rgba(245,246,252,0.2)"}`,
              borderRadius: "2px",
              padding: "9px 14px",
              cursor: "pointer",
              fontFamily: MONO_FONT,
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: ICE_WHITE,
              transition: "border-color 0.2s ease",
            }}
          >
            <span style={{ color: ACCENT }}>
              {activeIndex >= 0 ? String(activeIndex + 1).padStart(2, "0") : "00"}
            </span>
            <span style={{ position: "relative", width: "14px", height: "10px" }}>
              <span
                style={{
                  position: "absolute", left: 0, right: 0, height: "1px", background: ICE_WHITE,
                  top: menuOpen ? "50%" : "0",
                  transform: menuOpen ? "translateY(-50%) rotate(45deg)" : "none",
                  transition: "all 0.25s ease",
                }}
              />
              <span
                style={{
                  position: "absolute", left: 0, right: 0, height: "1px", background: ICE_WHITE,
                  top: "50%", transform: "translateY(-50%)",
                  opacity: menuOpen ? 0 : 1,
                  transition: "opacity 0.2s ease",
                }}
              />
              <span
                style={{
                  position: "absolute", left: 0, right: 0, height: "1px", background: ICE_WHITE,
                  bottom: menuOpen ? "50%" : "0",
                  transform: menuOpen ? "translateY(50%) rotate(-45deg)" : "none",
                  transition: "all 0.25s ease",
                }}
              />
            </span>
            <span>{menuOpen ? "CLOSE" : "MENU"}</span>
          </button>
        </div>
      </motion.nav>

      {/* Mobile full-screen panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 90,
              background: BG,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 clamp(28px, 8vw, 48px)",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(rgba(245,246,252,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(245,246,252,0.14) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                opacity: 0.5,
                pointerEvents: "none",
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 28, left: 28, width: 24, height: 24,
                borderTop: "1px solid rgba(245,246,252,0.3)",
                borderLeft: "1px solid rgba(245,246,252,0.3)",
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: 28, right: 28, width: 24, height: 24,
                borderBottom: "1px solid rgba(245,246,252,0.3)",
                borderRight: "1px solid rgba(245,246,252,0.3)",
              }}
            />

            <p
              style={{
                position: "relative",
                fontFamily: MONO_FONT,
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: DARK_GRAY,
                marginBottom: "clamp(28px, 6vw, 44px)",
              }}
            >
              NAVIGATION · <span style={{ color: ICE_WHITE }}>04</span>
            </p>

            <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "clamp(14px, 4vw, 22px)" }}>
              {LINKS.map((item, i) => {
                const isActive = activeSection === item.anchor;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.06 + i * 0.07, ease: EASE }}
                  >
                    <Link
                      href={`${item.href}#${item.anchor}`}
                      onClick={(e) => handleNavClick(e, item.href, item.anchor)}
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "18px",
                        textDecoration: "none",
                        paddingBottom: "clamp(14px, 4vw, 22px)",
                        borderBottom: "1px solid rgba(245,246,252,0.1)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: MONO_FONT,
                          fontSize: "12px",
                          letterSpacing: "0.1em",
                          color: isActive ? ACCENT : "rgba(245,246,252,0.35)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: "clamp(30px, 9vw, 44px)",
                          letterSpacing: "0.02em",
                          textTransform: "uppercase",
                          lineHeight: 1,
                          color: isActive ? ICE_WHITE : "rgba(245,246,252,0.7)",
                        }}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <p
              style={{
                position: "relative",
                marginTop: "clamp(36px, 8vw, 56px)",
                fontFamily: MONO_FONT,
                fontSize: "9px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(245,246,252,0.35)",
              }}
            >
              SYSTEM <span style={{ color: ICE_WHITE }}>ACTIVE</span> · BUILD V1.0 · 2026
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}