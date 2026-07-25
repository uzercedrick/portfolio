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
// Concept — "registration mark": the circle + crosshair used in print
// production to align color plates, rebuilt as a live instrument that reads
// scroll position. Ice-white body, ink linework, one signal-red accent
// reserved for the progress arc and the fire moment. On click the crosshair
// morphs into an arrow; a hairline dial (instrument ticks) rings the mark;
// a monospace caption reads out scroll % on hover, like a spec-sheet label.
//
// All motion runs through Framer Motion's motion values (useScroll,
// useSpring, useTransform) rather than manual state + CSS keyframes, so the
// progress ring settles with real spring physics and OS-level reduced-motion
// is honored automatically via <MotionConfig reducedMotion="user">.
//
// Requires framer-motion ^10 (useMotionValueEvent). Renamed from the
// original ThunderScrollButton — update the import at the call site, or
// rename the export back if you'd rather keep the old name.
// ---------------------------------------------------------------------------

const ICE = "#f5f6fc";
const INK = "#16171d";
const GRAPHITE = "#6b6d78";
const HAIRLINE = "#d8d9e4";
const SIGNAL = "#ff4d2e";

const SIZE = 56;
const RING_R = 24;
const RING_C = 2 * Math.PI * RING_R;
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const HALF = 32;
const BEAM_EXTRA = 26;
const VIEW_BOX = `${-HALF} ${-HALF - BEAM_EXTRA} ${HALF * 2} ${HALF * 2 + BEAM_EXTRA}`;

// Instrument-dial ticks around the ring — precomputed once, not per render.
// Every 6th tick reads as a "cardinal" mark (longer, brighter), the rest sit
// quiet at low opacity, like minute marks on a theodolite.
const TICKS = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
  const major = i % 6 === 0;
  const rIn = major ? 21.5 : 24.5;
  const rOut = major ? 27.5 : 26.5;
  return {
    key: i,
    x1: +(Math.cos(angle) * rIn).toFixed(2),
    y1: +(Math.sin(angle) * rIn).toFixed(2),
    x2: +(Math.cos(angle) * rOut).toFixed(2),
    y2: +(Math.sin(angle) * rOut).toFixed(2),
    major,
  };
});

export default function ScrollToTopButton() {
  const reduceMotion = useReducedMotion();

  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pct, setPct] = useState(0);
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

  useMotionValueEvent(scrollY, "change", (v) => setVisible(v > 300));
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
  }, [smoothProgress]);

  const handleLeave = useCallback(() => {
    hoveringRef.current = false;
    setHovering(false);
  }, []);

  const handleClick = useCallback(() => {
    setFireId((id) => id + 1);
    setFiring(true);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    if (fireTimeout.current) clearTimeout(fireTimeout.current);
    fireTimeout.current = setTimeout(() => setFiring(false), reduceMotion ? 180 : 820);
  }, [reduceMotion]);

  return (
    <MotionConfig reducedMotion="user" transition={{ ease: EASE }}>
      <style>{`
        .stt-btn {
          position: fixed;
          bottom: 32px;
          right: 28px;
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
          outline: 2px solid ${SIGNAL};
          outline-offset: 4px;
          border-radius: 50%;
        }
        .stt-face {
          filter: drop-shadow(0 1px 2px rgba(22, 23, 29, 0.12)) drop-shadow(0 8px 18px rgba(22, 23, 29, 0.10));
        }
        .stt-caption {
          position: absolute;
          right: calc(100% + 14px);
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          pointer-events: none;
          white-space: nowrap;
        }
        .stt-caption-text {
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
          text-align: right;
          line-height: 1.15;
        }
        .stt-caption-label {
          font-size: 8px;
          letter-spacing: 0.16em;
          color: ${GRAPHITE};
          text-transform: uppercase;
        }
        .stt-caption-value {
          font-size: 12px;
          color: ${INK};
          font-weight: 600;
        }
        .stt-caption-rule {
          width: 18px;
          height: 1px;
          background: ${HAIRLINE};
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
            whileHover={{ scale: 1.045 }}
            whileTap={{ scale: 0.93 }}
          >
            <AnimatePresence>
              {hovering && (
                <motion.div
                  className="stt-caption"
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="stt-caption-text">
                    <div className="stt-caption-label">Scroll</div>
                    <div className="stt-caption-value">{pct.toString().padStart(2, "0")}%</div>
                  </div>
                  <div className="stt-caption-rule" />
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
              {/* Base plate + hairline ring */}
              <circle cx="0" cy="0" r={RING_R} fill={ICE} stroke={HAIRLINE} strokeWidth="1" />

              {/* Instrument dial */}
              {TICKS.map((t) => (
                <line
                  key={t.key}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke={INK}
                  strokeWidth={t.major ? 1.1 : 0.7}
                  strokeLinecap="round"
                  opacity={t.major ? 0.5 : 0.22}
                />
              ))}

              {/* Scroll-progress arc — spring-smoothed, one signal accent */}
              <motion.circle
                cx="0"
                cy="0"
                r={RING_R}
                fill="none"
                stroke={SIGNAL}
                strokeWidth="2"
                strokeLinecap="round"
                transform="rotate(-90)"
                strokeDasharray={RING_C}
                style={{ strokeDashoffset: dashOffset }}
              />

              {/* Fire pulse — a single radar-style ping on click */}
              <AnimatePresence>
                {firing && !reduceMotion && (
                  <motion.circle
                    key={`pulse-${fireId}`}
                    cx="0"
                    cy="0"
                    r={RING_R}
                    fill="none"
                    stroke={SIGNAL}
                    strokeWidth="1.4"
                    initial={{ opacity: 0.65, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.55 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: EASE }}
                  />
                )}
              </AnimatePresence>

              {/* Fire beam — a plumb-line drawn upward, then fades */}
              <AnimatePresence>
                {firing && !reduceMotion && (
                  <motion.line
                    key={`beam-${fireId}`}
                    x1="0"
                    y1={-RING_R}
                    x2="0"
                    y2={-RING_R - 26}
                    stroke={SIGNAL}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0.9 }}
                    animate={{ pathLength: 1, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.62, ease: EASE }}
                  />
                )}
              </AnimatePresence>

              {/* Registration mark ↔ arrow morph */}
              <AnimatePresence>
                {firing ? (
                  <motion.g
                    key="arrow"
                    initial={{ opacity: 0, scale: 0.5, rotate: -35 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  >
                    <line x1="0" y1="-8" x2="0" y2="8" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
                    <path
                      d="M -6,-2 L 0,-8 L 6,-2"
                      fill="none"
                      stroke={INK}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.g>
                ) : (
                  <motion.g
                    key="crosshair"
                    initial={{ opacity: 0, scale: 0.5, rotate: 35 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: -20 }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  >
                    <line x1="-9" y1="0" x2="9" y2="0" stroke={INK} strokeWidth="1" />
                    <line x1="0" y1="-9" x2="0" y2="9" stroke={INK} strokeWidth="1" />
                    <circle cx="0" cy="0" r="4" fill="none" stroke={INK} strokeWidth="1" />
                  </motion.g>
                )}
              </AnimatePresence>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}