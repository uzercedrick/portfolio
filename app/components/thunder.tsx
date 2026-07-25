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

// ---------------------------------------------------------------------------
// Tech + Editorial redesign of your registration-mark scroll instrument.
// All original motion architecture preserved; new visual layer adds:
//   • print‑plate corner registration marks
//   • micro‑grid base plate (graph‑paper stock)
//   • 48‑count, three‑tier instrument dial (major / semi / minor)
//   • cardinal degree numerals + coordinate labels
//   • editorial spec‑sheet caption plate with corner brackets
//   • gauged outer ring (deliberate gap, not a perfect circle)
//   • calibrated crosshair (center dot + arm ticks)
//   • arrow morph carries a tiny signal‑red chevron
// ---------------------------------------------------------------------------

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

const HALF = 36;
const VIEW_BOX = `${-HALF} ${-HALF} ${HALF * 2} ${HALF * 2}`;

// 48‑count instrument dial — three tiers.
// Major every 6, semi every 3, minor the rest. Like a theodolite.
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

// Four corner registration marks — the "L" brackets that define a print plate.
const CORNERS = [
  { d: "M -30 -26 L -30 -30 L -26 -30" },
  { d: "M  26 -30 L  30 -30 L  30 -26" },
  { d: "M -30  26 L -30  30 L -26  30" },
  { d: "M  26  30 L  30  30 L  30  26" },
];

// Cardinal numerals on the dial face — editorial/technical reference.
const CARDINALS = [
  { x: 0, y: -16.5, text: "0" },
  { x: 16.5, y: 2, text: "90" },
  { x: 0, y: 20, text: "180" },
  { x: -16.5, y: 2, text: "270" },
];

export default function ScrollToTopButton() {
  const reduceMotion = useReducedMotion();

  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pct, setPct] = useState(0);
  const [scrollYpx, setScrollYpx] = useState(0);
  const [firing, setFiring] = useState(false);
  const [fireId, setFireId] = useState(0);

  const hoveringRef = useRef(false);
  const fireTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 1000 : 210,
    damping: reduceMotion ? 100 : 32,
    mass: 0.4,
  });
  const dashOffset = useTransform(smoothProgress, (p) => RING_C * (1 - p));

  useMotionValueEvent(scrollY, "change", (v) => {
    setVisible(v > 260);
    if (hoveringRef.current) setScrollYpx(Math.round(v));
  });
  useMotionValueEvent(smoothProgress, "change", (v) => {
    if (hoveringRef.current) setPct(Math.round(v * 100));
  });

  useEffect(() => {
    return () => {
      if (fireTimeout.current) clearTimeout(fireTimeout.current);
    };
  }, []);

  const handleEnter = useCallback(() => {
    hoveringRef.current = true;
    setHovering(true);
    setPct(Math.round(smoothProgress.get() * 100));
    setScrollYpx(Math.round(scrollY.get()));
  }, [smoothProgress, scrollY]);

  const handleLeave = useCallback(() => {
    hoveringRef.current = false;
    setHovering(false);
  }, []);

  const handleClick = useCallback(() => {
    setFireId((id) => id + 1);
    setFiring(true);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    if (fireTimeout.current) clearTimeout(fireTimeout.current);
    fireTimeout.current = setTimeout(
      () => setFiring(false),
      reduceMotion ? 180 : 820
    );
  }, [reduceMotion]);

  return (
    <MotionConfig reducedMotion="user" transition={{ ease: EASE }}>
      <style>{`
        .stt-btn {
          position: fixed;
          bottom: 36px;
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
          z-index: 999;
          -webkit-tap-highlight-color: transparent;
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
          filter:
            drop-shadow(0 1px 2px rgba(10, 11, 16, 0.10))
            drop-shadow(0 10px 24px rgba(10, 11, 16, 0.08));
        }

        /* ── Editorial spec‑sheet caption plate ── */
        .stt-plate {
          position: absolute;
          right: calc(100% + 18px);
          top: 50%;
          transform: translateY(-50%);
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
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", monospace;
          font-size: 5px;
          fill: ${GRAPHITE};
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
            {/* ── Spec‑sheet caption plate ── */}
            <AnimatePresence>
              {hovering && (
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
                {/* Micro‑grid — engineering / graph‑paper stock */}
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

              {/* ── Corner registration marks (print plate) ── */}
              <g
                stroke={INK}
                strokeWidth="0.9"
                fill="none"
                opacity="0.55"
              >
                {CORNERS.map((c, i) => (
                  <path key={i} d={c.d} />
                ))}
              </g>

              {/* ── Base plate: micro‑grid under a paper wash ── */}
              <circle cx="0" cy="0" r={RING_R + 2} fill="url(#microGrid)" />
              <circle
                cx="0"
                cy="0"
                r={RING_R + 2}
                fill={PAPER}
                opacity="0.55"
              />

              {/* ── Outer gauged ring: hairline + deliberate ink gap ── */}
              <circle
                cx="0"
                cy="0"
                r={RING_R + 2}
                fill="none"
                stroke={HAIRLINE}
                strokeWidth="0.8"
              />
              <circle
                cx="0"
                cy="0"
                r={RING_R + 2}
                fill="none"
                stroke={INK}
                strokeWidth="0.9"
                strokeDasharray="18 147"
                strokeDashoffset="-9"
                opacity="0.4"
              />

              {/* ── Inner dashed reference ring ── */}
              <circle
                cx="0"
                cy="0"
                r="22"
                fill="none"
                stroke={HAIRLINE}
                strokeWidth="0.6"
                strokeDasharray="1 2"
              />

              {/* ── 48‑count instrument dial ── */}
              {TICKS.map((t) => (
                <line
                  key={t.key}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke={INK}
                  strokeWidth={t.major ? 1 : t.semi ? 0.75 : 0.5}
                  strokeLinecap="round"
                  opacity={t.major ? 0.55 : t.semi ? 0.3 : 0.18}
                />
              ))}

              {/* ── Cardinal numerals ── */}
              {CARDINALS.map((c) => (
                <text
                  key={c.text}
                  x={c.x}
                  y={c.y}
                  textAnchor="middle"
                  className="stt-coord-label"
                  opacity="0.7"
                >
                  {c.text}
                </text>
              ))}

              {/* ── Scroll‑progress arc (spring‑smoothed) ── */}
              <motion.circle
                cx="0"
                cy="0"
                r={RING_R}
                fill="none"
                stroke={SIGNAL}
                strokeWidth="1.6"
                strokeLinecap="round"
                transform="rotate(-90)"
                strokeDasharray={RING_C}
                style={{ strokeDashoffset: dashOffset }}
              />

              {/* ── Fire pulse ── */}
              <AnimatePresence>
                {firing && !reduceMotion && (
                  <motion.circle
                    key={`pulse-${fireId}`}
                    cx="0"
                    cy="0"
                    r={RING_R}
                    fill="none"
                    stroke={SIGNAL}
                    strokeWidth="1"
                    initial={{ opacity: 0.7, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.65, ease: EASE }}
                  />
                )}
              </AnimatePresence>

              {/* ── Fire plumb beam ── */}
              <AnimatePresence>
                {firing && !reduceMotion && (
                  <motion.line
                    key={`beam-${fireId}`}
                    x1="0"
                    y1={-RING_R - 2}
                    x2="0"
                    y2={-RING_R - 14}
                    stroke={SIGNAL}
                    strokeWidth="1"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0.9 }}
                    animate={{ pathLength: 1, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: EASE }}
                  />
                )}
              </AnimatePresence>

              {/* ── Registration mark ↔ arrow morph ── */}
              <AnimatePresence mode="wait">
                {firing ? (
                  <motion.g
                    key="arrow"
                    initial={{ opacity: 0, scale: 0.5, rotate: -25 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  >
                    <line
                      x1="0"
                      y1="-9"
                      x2="0"
                      y2="9"
                      stroke={INK}
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M -7,-3 L 0,-10 L 7,-3"
                      fill="none"
                      stroke={INK}
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Signal‑red chevron inside the arrow */}
                    <path
                      d="M -3,2 L 0,-1 L 3,2"
                      fill="none"
                      stroke={SIGNAL}
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.g>
                ) : (
                  <motion.g
                    key="crosshair"
                    initial={{ opacity: 0, scale: 0.5, rotate: 30 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: -20 }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  >
                    {/* Calibrated crosshair arms */}
                    <line
                      x1="-10"
                      y1="0"
                      x2="10"
                      y2="0"
                      stroke={INK}
                      strokeWidth="0.9"
                    />
                    <line
                      x1="0"
                      y1="-10"
                      x2="0"
                      y2="10"
                      stroke={INK}
                      strokeWidth="0.9"
                    />
                    {/* Small tick marks on each arm — instrument feel */}
                    <line x1="-6" y1="-0.8" x2="-6" y2="0.8" stroke={INK} strokeWidth="0.6" />
                    <line x1="6"  y1="-0.8" x2="6"  y2="0.8" stroke={INK} strokeWidth="0.6" />
                    <line x1="-0.8" y1="-6" x2="0.8" y2="-6" stroke={INK} strokeWidth="0.6" />
                    <line x1="-0.8" y1="6"  x2="0.8" y2="6"  stroke={INK} strokeWidth="0.6" />
                    {/* Center ring + solid dot */}
                    <circle cx="0" cy="0" r="4.5" fill="none" stroke={INK} strokeWidth="0.9" />
                    <circle cx="0" cy="0" r="1.2" fill={INK} />
                  </motion.g>
                )}
              </AnimatePresence>

              {/* ── Coordinate labels ── */}
              <text x="-25" y="34" className="stt-coord-label" opacity="0.55">
                Ø {SIZE}
              </text>
              <text x="25" y="34" textAnchor="end" className="stt-coord-label" opacity="0.55">
                R {RING_R}
              </text>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}