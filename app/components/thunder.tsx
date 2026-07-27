"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const PAPER = "#fafbff";
const STOCK = "#f4f5fb";
const INK = "#0a0b10";
const GRAPHITE = "#5a5c68";
const HAIRLINE = "#c8cad6";
const SIGNAL = "#e63946";

const SIZE = 64;
const RING_R = 24;
const RING_C = 2 * Math.PI * RING_R;
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

// Smooth ease-out curve — starts fast, decelerates gracefully
function easeOutCustom(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

const HALF = 36;
const VIEW_BOX = `${-HALF} ${-HALF} ${HALF * 2} ${HALF * 2}`;

const TICKS = Array.from({ length: 48 }, (_, i) => {
  const angle = (i / 48) * Math.PI * 2 - Math.PI / 2;
  const major = i % 6 === 0;
  const semi = i % 3 === 0 && !major;
  const rIn = major ? 19.5 : semi ? 21.5 : 23;
  const rOut = major ? 27.5 : semi ? 26.5 : 25.8;
  return {
    key: i,
    x1: +Math.cos(angle) * rIn,
    y1: +Math.sin(angle) * rIn,
    x2: +Math.cos(angle) * rOut,
    y2: +Math.sin(angle) * rOut,
    major,
    semi,
  };
});

const CORNERS = [
  { d: "M -30 -26 L -30 -30 L -26 -30" },
  { d: "M  26 -30 L  30 -30 L  30 -26" },
  { d: "M -30  26 L -30  30 L -26  30" },
  { d: "M  26  30 L  30  30 L  30  26" },
];

const CARDINALS = [
  { x: 0, y: -16.5, text: "0" },
  { x: 16.5, y: 2, text: "90" },
  { x: 0, y: 20, text: "180" },
  { x: -16.5, y: 2, text: "270" },
];

export default function ScrollToTopButton() {
  const reduceMotion = useReducedMotion();

  const [visible, setVisible] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [pct, setPct] = useState(0);
  const [scrollYpx, setScrollYpx] = useState(0);
  const [firing, setFiring] = useState(false);
  const [fireId, setFireId] = useState(0);

  const panelHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fireTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRafId = useRef<number | null>(null);

  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 1000 : 210,
    damping: reduceMotion ? 100 : 32,
    mass: 0.4,
  });
  const dashOffset = useTransform(smoothProgress, (p) => RING_C * (1 - p));

  // ✅ FIX: scroll handler ONLY updates UI — never cancels the animation
  // Cancellation now happens ONLY on real user-input events (see below)
  useMotionValueEvent(scrollY, "change", (v) => {
    setVisible(v > 260);
    setScrollYpx(Math.round(v));
    setShowPanel(true);

    if (panelHideTimer.current) clearTimeout(panelHideTimer.current);
    panelHideTimer.current = setTimeout(() => setShowPanel(false), 1200);
  });

  useMotionValueEvent(smoothProgress, "change", (v) => {
    setPct(Math.round(v * 100));
  });

  // ✅ Cancel animation ONLY when the user physically interacts
  // (wheel scroll, finger touch, or keyboard navigation)
  useEffect(() => {
    const cancelScroll = () => {
      if (scrollRafId.current !== null) {
        cancelAnimationFrame(scrollRafId.current);
        scrollRafId.current = null;
      }
    };

    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener("wheel", cancelScroll, opts);
    window.addEventListener("touchstart", cancelScroll, opts);
    window.addEventListener("touchmove", cancelScroll, opts);
    window.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", " ", "Home", "End"].includes(e.key)) {
        cancelScroll();
      }
    });

    return () => {
      window.removeEventListener("wheel", cancelScroll);
      window.removeEventListener("touchstart", cancelScroll);
      window.removeEventListener("touchmove", cancelScroll);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (fireTimeout.current) clearTimeout(fireTimeout.current);
      if (panelHideTimer.current) clearTimeout(panelHideTimer.current);
      if (scrollRafId.current !== null) cancelAnimationFrame(scrollRafId.current);
    };
  }, []);

  const handleEnter = useCallback(() => {
    setShowPanel(true);
    if (panelHideTimer.current) clearTimeout(panelHideTimer.current);
  }, []);

  const handleLeave = useCallback(() => {
    panelHideTimer.current = setTimeout(() => setShowPanel(false), 400);
  }, []);

  // ─── Buttery-smooth scroll-to-top via requestAnimationFrame ───
  const smoothScrollToTop = useCallback(() => {
    const startY = window.scrollY || window.pageYOffset;
    if (startY <= 0) return;

    // Always cancel any in-progress animation first (restart cleanly)
    if (scrollRafId.current !== null) {
      cancelAnimationFrame(scrollRafId.current);
      scrollRafId.current = null;
    }

    // Distance-aware duration: short = snappy, long = luxurious but capped
    const baseDuration = 420;
    const per1000px = 180;
    const maxDuration = 1100;
    const distanceFactor = Math.min(1, startY / 3000);
    const duration = Math.min(
      maxDuration,
      baseDuration + (startY / 1000) * per1000px * (0.5 + distanceFactor * 0.5)
    );

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / duration);
      const eased = easeOutCustom(rawProgress);
      const currentY = startY * (1 - eased);

      window.scrollTo(0, currentY);

      if (rawProgress < 1) {
        scrollRafId.current = requestAnimationFrame(tick);
      } else {
        scrollRafId.current = null;
        window.scrollTo(0, 0); // hard snap to exact top
      }
    };

    scrollRafId.current = requestAnimationFrame(tick);
  }, []);

  const handleClick = useCallback(() => {
    setFireId((id) => id + 1);
    setFiring(true);

    if (reduceMotion) {
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      smoothScrollToTop();
    }

    if (fireTimeout.current) clearTimeout(fireTimeout.current);
    fireTimeout.current = setTimeout(
      () => setFiring(false),
      reduceMotion ? 180 : 820
    );
  }, [reduceMotion, smoothScrollToTop]);

  return (
    <MotionConfig reducedMotion="user" transition={{ ease: EASE }}>
      <style>{`
        .stt-btn {
          position: fixed;
          bottom: 92px;
          right: 32px;
          width: ${SIZE}px;
          height: ${SIZE}px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          z-index: 45;
          -webkit-tap-highlight-color: transparent;
          will-change: transform, opacity;
          transform: translateZ(0);
        }
        .stt-btn:focus-visible {
          outline: none;
        }
        .stt-btn:focus-visible .stt-face {
          outline: 1.5px solid ${SIGNAL};
          outline-offset: 6px;
          border-radius: 0;
        }
        .stt-face {
          will-change: transform, filter;
          transform: translateZ(0);
          filter:
            drop-shadow(0 1px 2px rgba(10, 11, 16, 0.10))
            drop-shadow(0 10px 24px rgba(10, 11, 16, 0.08));
        }

        .stt-plate {
          position: absolute;
          right: calc(100% + 18px);
          top: 50%;
          transform: translateY(-50%) translateZ(0);
          will-change: transform, opacity;
          pointer-events: none;
          white-space: nowrap;
          background: ${PAPER};
          border: 1px solid ${HAIRLINE};
          padding: 10px 14px;
        }
        .stt-plate::before,
        .stt-plate::after {
          content: "";
          position: absolute;
          width: 6px;
          height: 6px;
          border: 1px solid ${INK};
        }
        .stt-plate::before {
          top: -1px;
          left: -1px;
          border-right: none;
          border-bottom: none;
        }
        .stt-plate::after {
          bottom: -1px;
          right: -1px;
          border-left: none;
          border-top: none;
        }
        .stt-plate-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .stt-mono {
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
        }
        .stt-plate-label {
          font-size: 8px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${GRAPHITE};
        }
        .stt-plate-val {
          font-size: 14px;
          color: ${INK};
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }
        .stt-plate-rule {
          flex: none;
          width: 22px;
          height: 1px;
          background: ${SIGNAL};
        }
        .stt-plate-sub {
          font-size: 8px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${GRAPHITE};
          margin-top: 5px;
          display: flex;
          justify-content: space-between;
          gap: 14px;
        }
        .stt-plate-sub b {
          color: ${INK};
          font-weight: 500;
        }
        .stt-coord-label {
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
          font-size: 5px;
          fill: ${GRAPHITE};
        }

        @media (max-width: 900px) {
          .stt-btn {
            bottom: 108px;
            right: 20px;
          }
        }
      `}</style>

      <AnimatePresence>
        {visible && (
          <motion.button
            type="button"
            aria-label="Scroll to top"
            className="stt-btn"
            onClick={handleClick}
            onHoverStart={handleEnter}
            onHoverEnd={handleLeave}
            onFocus={handleEnter}
            onBlur={handleLeave}
            initial={{ opacity: 0, scale: 0.72, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.72, y: 10 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
          >
            <AnimatePresence>
              {showPanel && (
                <motion.div
                  className="stt-plate stt-mono"
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="stt-plate-row">
                    <div>
                      <div className="stt-plate-label">Scroll</div>
                      <div className="stt-plate-val">
                        {pct.toString().padStart(2, "0")}%
                      </div>
                    </div>
                    <div className="stt-plate-rule" />
                    <div>
                      <div className="stt-plate-label">Ref</div>
                      <div className="stt-plate-val">TOP</div>
                    </div>
                  </div>
                  <div className="stt-plate-sub">
                    <span>
                      Y <b>{scrollYpx.toLocaleString()}</b>px
                    </span>
                    <span>
                      PLATE <b>01</b>
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <svg
              className="stt-face"
              width={SIZE}
              height={SIZE}
              viewBox={VIEW_BOX}
              style={{ overflow: "visible" }}
            >
              <defs>
                <pattern
                  id="microGrid"
                  width="4"
                  height="4"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 4 0 L 0 0 0 4"
                    fill="none"
                    stroke={HAIRLINE}
                    strokeWidth="0.35"
                    opacity="0.6"
                  />
                </pattern>
              </defs>

              <g stroke={INK} strokeWidth="0.9" fill="none" opacity="0.55">
                {CORNERS.map((c, i) => (<path key={i} d={c.d} />))}
              </g>

              <circle cx="0" cy="0" r={RING_R + 2} fill="url(#microGrid)" />
              <circle cx="0" cy="0" r={RING_R + 2} fill={PAPER} opacity="0.55" />

              <circle cx="0" cy="0" r={RING_R + 2} fill="none" stroke={HAIRLINE} strokeWidth="0.8" />
              <circle cx="0" cy="0" r={RING_R + 2} fill="none" stroke={INK} strokeWidth="0.9" strokeDasharray="18 147" strokeDashoffset="-9" opacity="0.4" />

              <circle cx="0" cy="0" r="22" fill="none" stroke={HAIRLINE} strokeWidth="0.6" strokeDasharray="1 2" />

              {TICKS.map((t) => (
                <line
                  key={t.key}
                  x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                  stroke={INK} strokeWidth={t.major ? 1 : t.semi ? 0.75 : 0.5}
                  strokeLinecap="round"
                  opacity={t.major ? 0.55 : t.semi ? 0.3 : 0.18}
                />
              ))}

              {CARDINALS.map((c) => (
                <text key={c.text} x={c.x} y={c.y} textAnchor="middle" className="stt-coord-label" opacity="0.7">
                  {c.text}
                </text>
              ))}

              <motion.circle
                cx="0" cy="0" r={RING_R}
                fill="none" stroke={SIGNAL} strokeWidth="1.6" strokeLinecap="round"
                transform="rotate(-90)"
                strokeDasharray={RING_C}
                style={{ strokeDashoffset: dashOffset }}
              />

              <AnimatePresence>
                {firing && !reduceMotion && (
                  <motion.circle
                    key={`pulse-${fireId}`} cx="0" cy="0" r={RING_R}
                    fill="none" stroke={SIGNAL} strokeWidth="1"
                    initial={{ opacity: 0.7, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.65, ease: EASE }}
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {firing && !reduceMotion && (
                  <motion.line
                    key={`beam-${fireId}`}
                    x1="0" y1={-RING_R - 2} x2="0" y2={-RING_R - 14}
                    stroke={SIGNAL} strokeWidth="1" strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0.9 }}
                    animate={{ pathLength: 1, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: EASE }}
                  />
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {firing ? (
                  <motion.g
                    key="arrow"
                    initial={{ opacity: 0, scale: 0.5, rotate: -25 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  >
                    <line x1="0" y1="-9" x2="0" y2="9" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M -7,-3 L 0,-10 L 7,-3" fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M -3,2 L 0,-1 L 3,2" fill="none" stroke={SIGNAL} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.g>
                ) : (
                  <motion.g
                    key="crosshair"
                    initial={{ opacity: 0, scale: 0.5, rotate: 30 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: -20 }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  >
                    <line x1="-10" y1="0" x2="10" y2="0" stroke={INK} strokeWidth="0.9" />
                    <line x1="0" y1="-10" x2="0" y2="10" stroke={INK} strokeWidth="0.9" />
                    <line x1="-6" y1="-0.8" x2="-6" y2="0.8" stroke={INK} strokeWidth="0.6" />
                    <line x1="6" y1="-0.8" x2="6" y2="0.8" stroke={INK} strokeWidth="0.6" />
                    <line x1="-0.8" y1="-6" x2="0.8" y2="-6" stroke={INK} strokeWidth="0.6" />
                    <line x1="-0.8" y1="6" x2="0.8" y2="6" stroke={INK} strokeWidth="0.6" />
                    <circle cx="0" cy="0" r="4.5" fill="none" stroke={INK} strokeWidth="0.9" />
                    <circle cx="0" cy="0" r="1.2" fill={INK} />
                  </motion.g>
                )}
              </AnimatePresence>

              <text x="-25" y="34" className="stt-coord-label" opacity="0.55">Ø {SIZE}</text>
              <text x="25" y="34" textAnchor="end" className="stt-coord-label" opacity="0.55">R {RING_R}</text>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}