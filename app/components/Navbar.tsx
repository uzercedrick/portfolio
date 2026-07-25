"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Your exact font stack
const DISPLAY_FONT = "'Zalando Sans Expanded', sans-serif";
const MONO_FONT = "'Ubuntu Sans Mono', monospace";

const DARK_GRAY = "rgba(245,246,252,0.75)";
const ICE_WHITE = "#F5F6FC";
const MUTED_GRAY = "rgba(245,246,252,0.55)";
const BG = "#14141A";

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
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent, href: string, anchor: string) => {
    e.preventDefault();
    const targetId = anchor;
    const targetElement = document.getElementById(targetId);

    if (pathname === "/" && targetElement) {
      const navHeight = 80;
      window.scrollTo({
        top: targetElement.offsetTop - navHeight,
        behavior: "smooth",
      });
      setOpen(false);
    } else {
      router.push(`${href}#${targetId}`, { scroll: false });
      setOpen(false);
    }
  }, [pathname, router]);

  const onScroll = useCallback(() => {
    if (pathname !== "/") return;
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
        }, 100);
      }
    }
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, open]);

  const handleToggle = () => {
    setIsToggling(true);
    setOpen(prev => !prev);
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
          {/* Logo — Zalando Sans Expanded */}
          <div
            style={{
              flexShrink: 0,
              ...(!isMobile && {
                padding: "12px 22px",
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
                background: BG,
                border: `1px solid rgba(245,246,252,0.08)`,
                borderRight: "none",
                marginRight: "-1px",
                zIndex: 2,
              }),
            }}
          >
            <Link href="/" style={{ textDecoration: "none" }}>
              <span
                style={{
                  fontFamily: DISPLAY_FONT,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  color: ICE_WHITE,
                  fontSize: "clamp(13px, 2.4vw, 16px)",
                  letterSpacing: "0.14em",
                  whiteSpace: "nowrap",
                }}
              >
                JCN
              </span>
            </Link>
          </div>

          {/* Desktop Navigation — Ubuntu Sans Mono */}
          {!isMobile && (
            <motion.div
              layout
              transition={{ layout: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } }}
              style={{
                display: "flex",
                alignItems: "center",
                background: BG,
                border: `1px solid rgba(245,246,252,0.08)`,
                borderTopRightRadius: "8px",
                borderBottomRightRadius: "8px",
                padding: "12px 24px",
                width: "fit-content",
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
                        fontFamily: MONO_FONT,
                        fontWeight: 500,
                        textTransform: "uppercase",
                        fontSize: "11px",
                        letterSpacing: "0.2em",
                        color: activeSection === anchor ? ICE_WHITE : DARK_GRAY,
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        marginRight: "36px",
                        padding: "2px 0",
                        transition: "color 0.2s ease",
                      }}
                    >
                      <motion.span
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] }}
                      >
                        {label}
                      </motion.span>
                    </Link>
                  ))}
              </AnimatePresence>

              {/* Menu Button — Ubuntu Sans Mono */}
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
                  whileHover={isToggling ? undefined : { rotate: open ? 450 : 360 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: open ? 0 : 0.35 }}
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
                        <span style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "1px", background: ICE_WHITE, transform: "translateY(-50%) rotate(45deg)" }} />
                        <span style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "1px", background: ICE_WHITE, transform: "translateY(-50%) rotate(-45deg)" }} />
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
                          <span key={i} style={{ width: "4px", height: "4px", borderRadius: "1px", background: DARK_GRAY }} />
                        ))}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
                <span style={{ fontFamily: MONO_FONT, fontWeight: 500, textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.2em", color: DARK_GRAY, whiteSpace: "nowrap" }}>
                  {open ? "CLOSE" : "MENU"}
                </span>
              </button>
            </motion.div>
          )}

          {/* Mobile Navigation — Ubuntu Sans Mono */}
          {isMobile && (
            <>
              <button
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Menu"
                aria-expanded={open}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: BG,
                  border: `1px solid rgba(245,246,252,0.08)`,
                  borderRadius: "8px",
                  padding: "12px 18px",
                  cursor: "pointer",
                  flexShrink: 0,
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
                        <span style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "1px", background: ICE_WHITE, transform: "translateY(-50%) rotate(45deg)" }} />
                        <span style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "1px", background: ICE_WHITE, transform: "translateY(-50%) rotate(-45deg)" }} />
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
                          <span key={i} style={{ width: "4px", height: "4px", borderRadius: "1px", background: DARK_GRAY }} />
                        ))}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
                <span style={{ fontFamily: MONO_FONT, fontWeight: 500, textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.2em", color: DARK_GRAY, whiteSpace: "nowrap" }}>
                  {open ? "CLOSE" : "MENU"}
                </span>
              </button>

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
                      background: BG,
                      border: `1px solid rgba(245,246,252,0.08)`,
                      borderRadius: "10px",
                      padding: "8px 0",
                      zIndex: 99,
                      transformOrigin: "top right",
                    }}
                  >
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
                            fontFamily: MONO_FONT,
                            fontWeight: 500,
                            textTransform: "uppercase",
                            fontSize: "12px",
                            letterSpacing: "0.2em",
                            color: activeSection === anchor ? ICE_WHITE : DARK_GRAY,
                            textDecoration: "none",
                            padding: "14px 20px",
                            transition: "color 0.2s ease, background 0.2s ease",
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
              background: "rgba(0, 0, 0, 0.55)",
              backdropFilter: "blur(6px)",
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
          height: 1px;
          background: ${ICE_WHITE};
          transition: width 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .nav-link:hover::after { width: 100%; }
        .nav-link:hover { color: ${ICE_WHITE}; }

        .nav-link-mobile:hover {
          color: ${ICE_WHITE} !important;
          background: rgba(245,246,252,0.03) !important;
        }
      `}</style>
    </>
  );
}