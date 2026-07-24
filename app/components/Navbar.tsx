"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Clear separation: page path + anchor ID
const LINKS = [
  { label: "ABOUT", href: "/", anchor: "about" },
  { label: "PROJECT", href: "/", anchor: "projects" },
  { label: "CONTACT", href: "/", anchor: "contact" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isToggling, setIsToggling] = useState(false); // Fix: disable hover during toggle

  // ✅ Detect mobile viewport + auto-close menu when switching to desktop
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // 🔧 FIX: Close menu when switching to desktop (inside event handler = no ESLint error)
      if (!mobile) setOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ Perfect navigation logic: same-page scroll OR cross-page navigate
  const handleNavClick = useCallback((e: React.MouseEvent, href: string, anchor: string) => {
    e.preventDefault();
    const targetId = anchor;
    const targetElement = document.getElementById(targetId);

    // 🔹 If we're ALREADY on the homepage → smooth scroll directly
    if (pathname === "/" && targetElement) {
      const navHeight = 80;
      window.scrollTo({
        top: targetElement.offsetTop - navHeight,
        behavior: "smooth",
      });
      setOpen(false);
    }
    // 🔹 If we're ON ANY OTHER PAGE (like /studies) → go to homepage + target section
    else {
      router.push(`${href}#${targetId}`, { scroll: false });
      setOpen(false);
    }
  }, [pathname, router]);

  // ✅ Active section highlight (fixed matching)
  const onScroll = useCallback(() => {
    if (pathname !== "/") return; // Only run on homepage
    const scrollPosition = window.scrollY + 100;
    LINKS.forEach(({ anchor }) => {
      const element = document.getElementById(anchor);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(anchor);
        }
      }
    });
  }, [pathname]);

  // ✅ Auto-scroll to section when landing on homepage with #anchor
  useEffect(() => {
    if (pathname === "/") {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setTimeout(() => {
          const target = document.getElementById(hash);
          if (target) {
            const navHeight = 80;
            window.scrollTo({
              top: target.offsetTop - navHeight,
              behavior: "smooth",
            });
          }
        }, 100); // Small delay to let Hero/sections load fully
      }
    }
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  // ✅ Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, open]);

  // 🔧 Fix: handle menu toggle + disable hover during animation
  const handleToggle = () => {
    setIsToggling(true);
    setOpen(prev => !prev);
    // Re-enable hover after all animations finish (0.8s parent rotation + 0.35s icon swap)
    setTimeout(() => setIsToggling(false), 1200);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: "clamp(16px, 3vw, 32px)",
          left: "clamp(16px, 3vw, 32px)",
          right: isMobile ? "clamp(16px, 3vw, 32px)" : "auto",
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: isMobile ? "space-between" : "flex-start" }}>
          {/* ✅ Logo links cleanly back to homepage */}
          <div
            style={{
              flexShrink: 0,
              padding: "12px 24px",
              borderTopLeftRadius: "10px",
              borderBottomLeftRadius: "10px",
              borderTopRightRadius: isMobile ? "10px" : "0",
              borderBottomRightRadius: isMobile ? "10px" : "0",
              background: "#14141A",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
              marginRight: isMobile ? "0" : "-1px",
              zIndex: 2,
            }}
          >
            <Link href="/" style={{ textDecoration: "none" }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  color: "#CEFF1A",
                  fontSize: "clamp(13px, 2.4vw, 16px)",
                  letterSpacing: "0.09em",
                  whiteSpace: "nowrap",
                }}
              >
                ...JCN
              </span>
            </Link>
          </div>

          {/* 🔹 DESKTOP: Original inline layout — FIXED menu button */}
          {!isMobile && (
            <motion.div
              layout
              transition={{
                layout: {
                  duration: 0.7,
                  ease: [0.25, 1, 0.5, 1],
                },
              }}
              style={{
                display: "flex",
                alignItems: "center",
                background: "#14141A",
                borderTopLeftRadius: "0",
                borderBottomLeftRadius: "0",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
                padding: "12px 20px",
                width: "fit-content",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                overflow: "hidden",
                zIndex: 1,
              }}
            >
              <AnimatePresence mode="popLayout">
                {open &&
                  LINKS.map(({ label, href, anchor }, i) => (
                    <Link
                      key={label}
                      href={`${href}#${anchor}`}
                      onClick={(e) => handleNavClick(e, href, anchor)}
                      className="nav-link"
                      style={{
                        position: "relative",
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        fontSize: "clamp(10px, 1.5vw, 12px)",
                        letterSpacing: "0.08em",
                        color: activeSection === anchor ? "#CEFF1A" : "#F5F6FC",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        marginRight: "36px",
                        padding: "2px 0",
                      }}
                    >
                      <motion.span
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{
                          duration: 0.5,
                          delay: i * 0.1,
                          ease: [0.25, 1, 0.5, 1],
                        }}
                      >
                        {label}
                      </motion.span>
                    </Link>
                  ))}
              </AnimatePresence>

              {/* 🔧 FIXED Menu/Close button — no more X glimpse */}
              <button
                onClick={handleToggle}
                aria-label="Menu"
                aria-expanded={open}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "transparent",
                  border: "none",
                  borderRadius: "0",
                  padding: "4px 0",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <motion.span
                  animate={{ rotate: open ? 90 : 0 }}
                  // Disable hover during toggle to avoid rotation conflict
                  whileHover={isToggling ? undefined : { rotate: open ? 450 : 360 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                    // Fix: delay reverse rotation until X fully exits
                    delay: open ? 0 : 0.35,
                  }}
                  style={{ position: "relative", width: "12px", height: "12px" }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {open ? (
                      <motion.span
                        key="close"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ position: "absolute", inset: 0 }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: 0,
                            width: "100%",
                            height: "2px",
                            background: "#CEFF1A",
                            transform: "translateY(-50%) rotate(45deg)",
                            borderRadius: "1px",
                          }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: 0,
                            width: "100%",
                            height: "2px",
                            background: "#CEFF1A",
                            transform: "translateY(-50%) rotate(-45deg)",
                            borderRadius: "1px",
                          }}
                        />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="menu"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{
                          position: "absolute", inset: 0,
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: "3px",
                        }}
                      >
                        {[0, 1, 2, 3].map((i) => (
                          <span key={i} style={{ width: "4px", height: "4px", borderRadius: "1px", background: "#CEFF1A" }} />
                        ))}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", fontSize: "clamp(10px, 1.5vw, 12px)", letterSpacing: "0.08em", color: "#CEFF1A", whiteSpace: "nowrap" }}>
                  {open ? "CLOSE" : "MENU"}
                </span>
              </button>
            </motion.div>
          )}

          {/* 🔹 MOBILE: Hamburger button + right-side dropdown — unchanged */}
          {isMobile && (
            <>
              {/* Hamburger button — right side */}
              <button
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Menu"
                aria-expanded={open}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#14141A",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 18px",
                  cursor: "pointer",
                  flexShrink: 0,
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                }}
              >
                <motion.span
                  animate={{ rotate: open ? 90 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ position: "relative", width: "14px", height: "14px" }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {open ? (
                      <motion.span
                        key="close"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ position: "absolute", inset: 0 }}
                      >
                        <span style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "2px", background: "#CEFF1A", transform: "translateY(-50%) rotate(45deg)", borderRadius: "1px" }} />
                        <span style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "2px", background: "#CEFF1A", transform: "translateY(-50%) rotate(-45deg)", borderRadius: "1px" }} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="menu"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "3px" }}
                      >
                        {[0, 1, 2, 3].map((i) => (
                          <span key={i} style={{ width: "4px", height: "4px", borderRadius: "1px", background: "#CEFF1A" }} />
                        ))}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.08em", color: "#CEFF1A", whiteSpace: "nowrap" }}>
                  {open ? "CLOSE" : "MENU"}
                </span>
              </button>

              {/* Mobile dropdown panel — right-aligned */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 12px)",
                      right: 0,
                      minWidth: "200px",
                      background: "#14141A",
                      borderRadius: "12px",
                      padding: "10px",
                      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.35)",
                      zIndex: 99,
                      transformOrigin: "top right",
                    }}
                  >
                    {/* Arrow pointer */}
                    <div style={{
                      position: "absolute",
                      top: "-6px",
                      right: "28px",
                      width: "12px",
                      height: "12px",
                      background: "#14141A",
                      transform: "rotate(45deg)",
                      borderRadius: "2px",
                    }} />

                    {LINKS.map(({ label, href, anchor }, i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
                      >
                        <Link
                          href={`${href}#${anchor}`}
                          onClick={(e) => handleNavClick(e, href, anchor)}
                          className="nav-link-mobile"
                          style={{
                            display: "block",
                            position: "relative",
                            fontFamily: "var(--font-display)",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            fontSize: "13px",
                            letterSpacing: "0.08em",
                            color: activeSection === anchor ? "#CEFF1A" : "#F5F6FC",
                            textDecoration: "none",
                            padding: "14px 18px",
                            borderRadius: "8px",
                            background: activeSection === anchor ? "rgba(206, 255, 26, 0.08)" : "transparent",
                            transition: "background 0.2s ease, color 0.2s ease",
                          }}
                        >
                          {label}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </motion.header>

      {/* Backdrop overlay for mobile */}
      <AnimatePresence>
        {isMobile && open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.45)",
              backdropFilter: "blur(4px)",
              zIndex: 99,
            }}
          />
        )}
      </AnimatePresence>

      <style>{`
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #CEFF1A;
          transition: width 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .nav-link:hover::after { width: 100%; }
        .nav-link:hover { color: #CEFF1A; }

        .nav-link-mobile:hover {
          background: rgba(206, 255, 26, 0.08) !important;
          color: #CEFF1A !important;
        }
      `}</style>
    </>
  );
}