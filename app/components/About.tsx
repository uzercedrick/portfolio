"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { mono, zalando } from "../fonts";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ICE_WHITE = "#F5F6FC";
const DARK_GRAY = "rgba(245,246,252,0.75)";
const MUTED_GRAY = "rgba(245,246,252,0.65)";
const CURVE_RED = "#e63946";

const DETAILS = [
  { label: "EDUCATION", value: "BS Information Technology" },
  { label: "LOCATION", value: "Navotas, Philippines" },
  { label: "ACHIEVEMENT", value: "Research Congress Awardee" },
  { label: "ROLE", value: "UX/UI Designer" },
  { label: "OPEN TO", value: "Full Time & Hybrid" },
];

const INFO_ITEMS = [
  { title: "PROJECTS", lines: ["2 Created Projects", "Led UX/UI Design"] },
  { title: "AWARD", lines: ["Research Congress Awardee 2025", "for Capstone System"] },
  { title: "YEAR GRADUATED", lines: ["Graduated June 30, 2026"] },
];

type Category = { id: string; number: string; label: string; description: string };

const CATEGORIES: Category[] = [
  {
    id: "design",
    number: "01",
    label: "DESIGN",
    description:
      "Wireframing, UX/UI Design, Code Prototyping — from low-fidelity layouts to interactive prototypes that feel production-ready.",
  },
  {
    id: "stack",
    number: "02",
    label: "STACKS",
    description:
      "HTML, CSS, JavaScript, React, Tailwind CSS — semantic markup, responsive styling, and component-based interfaces.",
  },
  {
    id: "tools",
    number: "03",
    label: "TOOLS",
    description:
      "Figma, Miro, VS Code, Git & GitHub, and version-controlled development.",
  },
];

const TILT = [-2, 0, 2];

function SkillCurve({ inView }: { inView: boolean }) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const gestureLocked = useRef(false);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(CATEGORIES.length - 1, i));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
    setActive(clamped);
  };

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActive(Math.max(0, Math.min(CATEGORIES.length - 1, idx)));
  };

  const lockGesture = () => {
    gestureLocked.current = true;
    setTimeout(() => (gestureLocked.current = false), 500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) < 40 || gestureLocked.current) return;
    lockGesture();
    if (deltaY > 0) goTo(active + 1);
    else goTo(active - 1);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 12 || gestureLocked.current) return;
    lockGesture();
    if (e.deltaY > 0) goTo(active + 1);
    else goTo(active - 1);
  };

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-[46px] block h-[44px] w-full md:top-[30px] md:h-[120px]"
      >
        <path
          d="M 0 100 Q 600 20 1200 100"
          fill="none"
          stroke={CURVE_RED}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="6 8"
        />
      </svg>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        className="no-scrollbar relative flex w-full snap-x snap-mandatory overflow-x-auto overscroll-y-none scroll-smooth pt-10 pb-6"
      >
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.15, ease: EASE }}
            className={`flex w-full flex-shrink-0 snap-always flex-col items-center px-[5vw] text-center ${
              i === 0 ? "snap-start" : i === CATEGORIES.length - 1 ? "snap-end" : "snap-center"
            }`}
          >
            <span
              className="block font-black leading-[0.8] tracking-[-0.03em] text-transparent"
              style={{
                fontFamily: zalando.style.fontFamily,
                fontSize: "clamp(70px, 9vw, 110px)",
                WebkitTextStroke: `1.8px ${DARK_GRAY}`,
                transform: `rotate(${TILT[i]}deg)`,
                margin: "0 0 8px 0",
              }}
            >
              {cat.number}
            </span>

            <span
              className="inline-block rounded px-4 py-1.5 font-black uppercase tracking-[0.05em] text-[#14141A]"
              style={{
                fontFamily: zalando.style.fontFamily,
                fontSize: "clamp(15px, 1.8vw, 20px)",
                background: DARK_GRAY,
                transform: `rotate(${TILT[i]}deg)`,
                margin: "0 0 14px 0",
              }}
            >
              • {cat.label} •
            </span>

            <p
              className={`${mono.className} max-w-[550px]`}
              style={{
                fontSize: "clamp(16px, 1.9vw, 20px)",
                lineHeight: 1.7,
                color: MUTED_GRAY,
                margin: 0,
              }}
            >
              {cat.description}
            </p>
          </motion.div>
        ))}
      </div>

      <p
        className={`${mono.className} mt-6 text-center text-xs tracking-[0.25em] text-[#F5F6FC]/30`}
      >
        SWIPE TO EXPLORE
      </p>
    </div>
  );
}

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <section id="about" ref={ref} className="about-section">
      <div className="coord-label tl" aria-hidden="true">X <span className="val">00</span> · Y <span className="val">01</span></div>
      <div className="coord-label tr" aria-hidden="true">PLATE <span className="val">02</span> / ABOUT</div>

      <div className="container" style={{ position: "relative", zIndex: 3, width: "100%", margin: "0 auto", padding: "clamp(60px, 8vw, 100px) clamp(24px, 4vw, 64px)", maxWidth: "1020px", boxSizing: "border-box" }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ marginBottom: "clamp(48px, 6vw, 64px)", textAlign: "left" }}
        >
          <p
            style={{
              fontFamily: mono.style.fontFamily,
              fontSize: "12px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: MUTED_GRAY,
              margin: "0 0 8px 0",
            }}
          >
            BACKGROUND
          </p>
          <h2
            style={{
              fontFamily: zalando.style.fontFamily,
              fontWeight: 800,
              textTransform: "uppercase",
              fontSize: "clamp(22px, 3.2vw, 32px)",
              letterSpacing: "0.18em",
              color: ICE_WHITE,
              margin: 0,
            }}
          >
            ABOUT ME
          </h2>
        </motion.div>

        <div className="about-grid">
          <motion.div
            className="cell-text"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          >
            <h3
              style={{
                fontFamily: zalando.style.fontFamily,
                fontWeight: 800,
                fontSize: "clamp(20px, 2.8vw, 28px)",
                letterSpacing: "0.08em",
                color: ICE_WHITE,
                marginBottom: "12px",
              }}
            >
              Who I Am
            </h3>
            <p
              className={`${mono.className} about-desc`}
              style={{
                fontSize: "clamp(15px, 1.9vw, 17px)",
                lineHeight: 1.8,
                color: DARK_GRAY,
                maxWidth: "480px",
                margin: 0,
              }}
            >
              BS Information Technology graduate bridging design and development. I create user-centered digital experiences that are both intuitive and technically feasible — including a Research Congress-recognized classroom monitoring platform.
            </p>
          </motion.div>

          <motion.div
            className="cell-plain-info"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          >
            {INFO_ITEMS.map((item) => (
              <div key={item.title} className="info-item">
                <p
                  style={{
                    fontFamily: zalando.style.fontFamily,
                    fontWeight: 800,
                    fontSize: "clamp(14px, 1.8vw, 16px)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: DARK_GRAY,
                    margin: "0 0 4px 0",
                  }}
                >
                  {item.title}
                </p>
                <p
                  className={mono.className}
                  style={{
                    fontSize: "clamp(13px, 1.7vw, 15px)",
                    lineHeight: 1.6,
                    color: ICE_WHITE,
                    margin: 0,
                  }}
                >
                  {item.lines.map((l, i) => (
                    <span key={i}>
                      {l}
                      {i < item.lines.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="cell-details"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            <div className="details-grid">
              {DETAILS.map((d) => (
                <div key={d.label} className="details-item">
                  <p
                    style={{
                      fontFamily: zalando.style.fontFamily,
                      fontWeight: 700,
                      fontSize: "clamp(13px, 1.8vw, 15px)",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: ICE_WHITE,
                      marginBottom: "4px",
                    }}
                  >
                    {d.label}
                  </p>
                  <p
                    className={mono.className}
                    style={{
                      fontSize: "clamp(12px, 1.6vw, 14px)",
                      color: MUTED_GRAY,
                      margin: 0,
                    }}
                  >
                    {d.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div style={{ marginTop: "clamp(50px, 5vw, 70px)", width: "100%" }}>
          <SkillCurve inView={inView} />
        </div>
      </div>

      <style>{`
        .about-section {
          position: relative;
          min-height: 100vh;
          background: transparent;
          overflow: hidden;
          width: 100%;
        }

        .coord-label {
          position: absolute;
          z-index: 2;
          pointer-events: none;
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(245,246,252,0.45);
        }
        .coord-label.tl { top: 24px; left: 72px; }
        .coord-label.tr { top: 24px; right: 72px; }
        .coord-label .val { color: rgba(245,246,252,0.75); font-weight: 500; }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: clamp(28px, 3.5vw, 52px);
          row-gap: clamp(44px, 5.5vw, 64px);
          align-items: start;
          width: 100%;
        }
        .about-grid .cell-text        { grid-column: 1; justify-self: start; width: 100%; }
        .about-grid .cell-plain-info  { grid-column: 2; justify-self: end; width: 100%; max-width: 360px; }
        .about-grid .cell-details     { grid-column: 1 / -1; align-self: stretch; justify-self: stretch; }

        .cell-plain-info {
          display: flex;
          flex-direction: column;
        }
        .info-item {
          padding: 14px 0;
          border-top: none;
        }
        .info-item:not(:first-child) {
          border-top: 1px solid #F5F6FC;
        }
        .info-item:last-child {
          border-bottom: 1px solid #F5F6FC;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: clamp(20px, 2.5vw, 28px) clamp(28px, 3.5vw, 48px);
          width: 100%;
          padding-top: clamp(20px, 2.5vw, 28px);
        }

        @media (max-width: 900px) {
          .coord-label { display: none; }
          .about-grid { grid-template-columns: 1fr; row-gap: 40px; }
          .about-grid .cell-text        { grid-column: 1; }
          .about-grid .cell-plain-info  { grid-column: 1; justify-self: start; max-width: 100% !important; }
          .about-grid .cell-details     { grid-column: 1; align-self: auto; }

          .info-item {
            padding: 16px 0;
          }

          .details-grid {
            grid-template-columns: 1fr 1fr;
            gap: 24px 20px;
            padding-top: 20px;
          }
          .details-item {
            padding-bottom: 4px;
          }
        }

        @media (max-width: 420px) {
          .details-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}