"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";

const E = [0.25, 1.1, 0.35, 1] as [number, number, number, number];

// --- Core Shapes (unchanged) ---
const BOLT_FILL_DOWN = "M21.2,-1.6 L11.9,16.9 L26.2,16.5 L9.2,32.5 L23.7,33.7 L7.8,49.5 L20.4,50.6 L4.4,65.4 L15.0,67.2 L8.5,83.8 L9.5,84.2 L17.0,66.8 L7.6,66.6 L23.6,51.4 L12.2,50.5 L28.3,34.3 L14.8,33.5 L31.8,17.5 L18.1,15.1 L26.8,1.6 Z";
const BOLT_FILL_UP = "M21.2,85.8 L11.9,67.3 L26.2,67.7 L9.2,51.7 L23.7,50.5 L7.8,34.7 L20.4,33.6 L4.4,18.8 L15.0,17.0 L8.5,0.4 L9.5,0.0 L17.0,17.4 L7.6,17.6 L23.6,32.8 L12.2,33.7 L28.3,49.9 L14.8,50.7 L31.8,66.7 L18.1,69.1 L26.8,82.6 Z";
const FORK_FILL_DOWN = "M28.0,18.3 L36.9,24.3 L32.2,30.1 L39.7,36.3 L40.3,35.7 L33.8,29.9 L39.1,23.7 L30.0,15.7 Z";
const FORK_FILL_UP = "M28.0,65.7 L36.9,59.7 L32.2,53.9 L39.7,47.7 L40.3,48.3 L33.8,54.1 L39.1,60.3 L30.0,68.3 Z";
const ARROW_CHEVRON_DOWN = "M9,98 L-2,80 L9,88 L20,80 Z";
const ARROW_CHEVRON_UP = "M9,-14 L-2,4 L9,-4 L20,4 Z";

const BOLT_CENTER_X = 9;
const BOLT_CENTER_Y = 42;

const LEADER_DOWN_1 = "M21,-1 L26,7 L20,10 L25,17";
const LEADER_UP_1 = "M21,85 L26,77 L20,74 L25,67";
const EXTRA_FORK_DOWN_1 = "M16,32 L26,29 L21,40 L28,38";
const EXTRA_FORK_UP_1 = "M16,52 L26,55 L21,44 L28,46";
const EXTRA_FORK_DOWN_2 = "M11,50 L19,47 L14,60";
const EXTRA_FORK_UP_2 = "M11,34 L19,37 L14,24";
const EXTRA_FORK_DOWN_3 = "M19,34 L29,31 L23,42";
const EXTRA_FORK_UP_3 = "M14,50 L4,53 L10,42";

const IMPACT_LEADERS_DOWN = ["M8,50 L-3,45 L1,53", "M22,51 L33,46 L28,56", "M9,84 L-2,79 L3,88", "M9,84 L18,90 L13,95"];
const IMPACT_LEADERS_UP = ["M21,-1 L32,4 L27,-6", "M8,34 L-3,38 L1,30", "M21,-1 L14,-9 L20,-13", "M12,17 L2,13 L7,22"];
const SPARKS_DOWN = ["M9,84 L-6,79", "M9,84 L-4,89", "M9,84 L3,96", "M22,51 L33,45", "M22,51 L31,58", "M8,50 L-3,44", "M26,17 L37,12"];
const SPARKS_UP = ["M21,-1 L32,3", "M21,-1 L31,-9", "M21,-1 L19,-13", "M21,-1 L10,-9", "M8,34 L-3,29", "M8,34 L-4,42", "M22,51 L33,56"];
const ARCS_DOWN = ["M-6,12 L6,20 L-2,30 L8,38", "M40,15 L30,25 L42,33 L28,42", "M-8,52 L4,60 L-4,68"];
const ARCS_UP = ["M40,66 L28,58 L40,48 L30,38", "M-6,64 L4,54 L-6,46 L6,36", "M42,26 L32,18 L42,10"];

const IDLE_MINI_ZAPS = ["M13,26 L19,24", "M22,42 L28,40", "M9,58 L15,56", "M18,10 L24,8"];
const STATIC_PARTICLES = [{ x: -8, y: 12 }, { x: 42, y: 8 }, { x: -10, y: 44 }, { x: 44, y: 40 }, { x: 18, y: -6 }, { x: 28, y: 88 }];
const PARTICLE_OFFSETS = [{ tx: 2.1, ty: -1.8, bx: 8.4, by: -6.7 }, { tx: -3.2, ty: 2.5, bx: -9.1, by: 7.3 }, { tx: 1.7, ty: 3.1, bx: 6.2, by: 8.9 }, { tx: -2.4, ty: -2.9, bx: -7.8, by: -8.2 }, { tx: 3.5, ty: 0.8, bx: 10.3, by: 2.1 }, { tx: -1.1, ty: -3.4, bx: -5.6, by: -9.7 }];
const BURST_OFFSETS = [{ bx: 12.3, by: -8.7 }, { bx: -11.6, by: 9.2 }, { bx: 7.8, by: 14.1 }, { bx: -9.4, by: -12.5 }];

const EXPLOSION_OFFSETS = [{ ex: 0, ey: -22, er: 2.2 }, { ex: 16, ey: -16, er: 2.0 }, { ex: 22, ey: 0, er: 2.3 }, { ex: 16, ey: 16, er: 1.9 }, { ex: 0, ey: 22, er: 2.1 }, { ex: -16, ey: 16, er: 2.0 }, { ex: -22, ey: 0, er: 2.2 }, { ex: -16, ey: -16, er: 1.9 }];
const EXPLOSION_STREAKS = ["M9,42 L9,18", "M9,42 L25,26", "M9,42 L31,42", "M9,42 L25,58", "M9,42 L9,66", "M9,42 L-7,58", "M9,42 L-13,42", "M9,42 L-7,26"];

type StyleWithVars = CSSProperties & Record<string, string | number>;

export default function ThunderScrollButton() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);
  const [thunderAnim, setThunderAnim] = useState<{ dir: "down" | "up"; id: number }>({ dir: "down", id: 0 });
  const [impactId, setImpactId] = useState(0);
  const [explosionId, setExplosionId] = useState(0);
  const wasVisible = useRef(false);

  const triggerImpact = () => setImpactId(p => p + 1);
  const triggerExplosion = () => setExplosionId(p => p + 1);

  // Detect touch/low-power devices once, so we can trim decorative density
  // and filter complexity without dropping any effect category entirely.
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse), (max-width: 768px)");
    const update = () => setIsLowPower(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isVisible = window.scrollY > 300;
      if (isVisible && !wasVisible.current) {
        setThunderAnim(p => ({ dir: "down", id: p.id + 1 }));
        triggerImpact();
      }
      wasVisible.current = isVisible;
      setShowBackToTop(isVisible);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    setThunderAnim(p => ({ dir: "up", id: p.id + 1 }));
    triggerImpact();
    triggerExplosion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const dir = thunderAnim.dir;
  const BOLT_FILL = dir === "down" ? BOLT_FILL_DOWN : BOLT_FILL_UP;
  const FORK_FILL = dir === "down" ? FORK_FILL_DOWN : FORK_FILL_UP;
  const ARROW_CHEVRON = dir === "down" ? ARROW_CHEVRON_DOWN : ARROW_CHEVRON_UP;
  const leader1 = dir === "down" ? LEADER_DOWN_1 : LEADER_UP_1;
  const extraFork1 = dir === "down" ? EXTRA_FORK_DOWN_1 : EXTRA_FORK_UP_1;
  const extraFork2 = dir === "down" ? EXTRA_FORK_DOWN_2 : EXTRA_FORK_UP_2;
  const extraFork3 = dir === "down" ? EXTRA_FORK_DOWN_3 : EXTRA_FORK_UP_3;
  const boltClass = dir === "down" ? "bolt-fill bolt-strike-down" : "bolt-fill bolt-strike-up";
  const forkClass = dir === "down" ? "fork-fill fork-strike-down" : "fork-fill fork-strike-up";

  // Trimmed element sets for touch / low-power devices — every effect
  // category (particles, sparks, arcs, explosion) still renders, just
  // fewer instances of each, which cuts filter/paint cost substantially.
  const sparks = useMemo(() => {
    const full = dir === "down" ? SPARKS_DOWN : SPARKS_UP;
    return isLowPower ? full.slice(0, 4) : full;
  }, [dir, isLowPower]);

  const arcs = useMemo(() => {
    const full = dir === "down" ? ARCS_DOWN : ARCS_UP;
    return isLowPower ? full.slice(0, 2) : full;
  }, [dir, isLowPower]);

  const impactLeaders = useMemo(() => {
    const full = dir === "down" ? IMPACT_LEADERS_DOWN : IMPACT_LEADERS_UP;
    return isLowPower ? full.slice(0, 2) : full;
  }, [dir, isLowPower]);

  const staticParticles = useMemo(
    () => (isLowPower ? STATIC_PARTICLES.slice(0, 3) : STATIC_PARTICLES),
    [isLowPower]
  );
  const burstParticles = useMemo(
    () => (isLowPower ? STATIC_PARTICLES.slice(0, 2) : STATIC_PARTICLES.slice(0, 4)),
    [isLowPower]
  );
  const idleZaps = useMemo(
    () => (isLowPower ? IDLE_MINI_ZAPS.slice(0, 2) : IDLE_MINI_ZAPS),
    [isLowPower]
  );
  const explosionOffsets = useMemo(
    () => (isLowPower ? EXPLOSION_OFFSETS.slice(0, 4) : EXPLOSION_OFFSETS),
    [isLowPower]
  );
  const explosionStreaks = useMemo(
    () => (isLowPower ? EXPLOSION_STREAKS.slice(0, 4) : EXPLOSION_STREAKS),
    [isLowPower]
  );

  const particleStyles = useMemo(() =>
    staticParticles.map((_, i) => {
      const o = PARTICLE_OFFSETS[i % PARTICLE_OFFSETS.length];
      return { "--tx": `${o.tx}px`, "--ty": `${o.ty}px`, "--bx": `${o.bx}px`, "--by": `${o.by}px`, animationDelay: `${i * 0.32}s` } as StyleWithVars;
    }), [staticParticles]
  );

  const burstStyles = useMemo(() =>
    burstParticles.map((_, i) => {
      const o = BURST_OFFSETS[i % BURST_OFFSETS.length];
      return { "--bx": `${o.bx}px`, "--by": `${o.by}px`, animationDelay: `${0.08 + i * 0.03}s` } as StyleWithVars;
    }), [burstParticles]
  );

  const explosionStyles = useMemo(() =>
    explosionOffsets.map((o, i) => ({ "--ex": `${o.ex}px`, "--ey": `${o.ey}px`, "--er": `${o.er}px`, animationDelay: `${i * 0.02}s` } as StyleWithVars)),
    [explosionOffsets]
  );

  return (
    <>
      <style>{`
        /* Base: GPU-accelerated with restored glow */
        .bolt-fill { 
          fill: #f5faff; 
          transform-box: fill-box; 
          will-change: transform, opacity, filter;
          filter: drop-shadow(0 0 4px #ff7733) drop-shadow(0 0 8px rgba(255,120,50,0.4));
        }
        .fork-fill { 
          fill: #eef7ff; 
          transform-box: fill-box; 
          will-change: transform, opacity, filter;
          filter: drop-shadow(0 0 3px #ff9955) drop-shadow(0 0 6px rgba(255,140,70,0.35));
        }
        .arrow-fill { 
          fill: #ffffff; 
          transform-box: fill-box; 
          transform-origin: ${BOLT_CENTER_X}px ${BOLT_CENTER_Y}px; 
          will-change: transform, opacity, filter;
          filter: drop-shadow(0 0 5px #ffffff) drop-shadow(0 0 12px rgba(100,160,255,0.6));
        }
        .leader-path, .extra-fork, .impact-leader, .arc-path, .spark-path, .idle-zap-path { 
          fill: none; 
          stroke-linecap: round; 
          stroke-linejoin: round; 
          stroke-dasharray: 1; 
        }
        .leader-path { stroke: #ffbb88; stroke-width: 0.7; opacity: 0; filter: drop-shadow(0 0 2px #ff7744); }
        .extra-fork { stroke: #ffaa66; stroke-width: 1.2; filter: drop-shadow(0 0 2px #ff8833); }
        .impact-leader { stroke: #ff9955; stroke-width: 1; filter: drop-shadow(0 0 3px #ff6622); }
        .arc-path { stroke: #ff8844; stroke-width: 0.8; opacity: 0; filter: drop-shadow(0 0 2px #ff5511); }
        .spark-path { stroke: #ffcc99; stroke-width: 1.1; filter: drop-shadow(0 0 3px #ff9944); }
        .idle-zap-path { stroke: #ffddaa; stroke-width: 0.7; opacity: 0; filter: drop-shadow(0 0 2px #ffaa55); }
        .static-particle { fill: #ffddbb; opacity: 0; filter: drop-shadow(0 0 2px #ff9944); }

        /* --- Smoother Slower Animations --- */
        @keyframes idle-mini-zap {
          0%, 85%, 100% { stroke-dashoffset: 1; opacity: 0; }
          92% { stroke-dashoffset: 0; opacity: 0.8; }
          95% { stroke-dashoffset: -1; opacity: 0; }
        }
        .idle-mini-zap { animation: idle-mini-zap 5.2s infinite ease-out; }

        @keyframes static-float {
          0%, 100% { opacity: 0.15; transform: translate(0, 0) scale(0.85); }
          50% { opacity: 0.45; transform: translate(var(--tx), var(--ty)) scale(1.1); }
        }
        .static-float { animation: static-float 4.5s infinite ease-in-out; }

        @keyframes idle-bolt-flicker {
          0%, 88%, 100% { opacity: 1; filter: drop-shadow(0 0 4px #ff7733) drop-shadow(0 0 8px rgba(255,120,50,0.4)); }
          91% { opacity: 0.85; }
          94% { opacity: 1; filter: drop-shadow(0 0 7px #ffaa55) drop-shadow(0 0 16px rgba(255,150,80,0.6)); }
          97% { opacity: 0.9; }
        }

        @keyframes strike-down {
          0%   { opacity: 0; transform-origin: center bottom; transform: scaleX(1.3) scaleY(3.5) translateY(-120px); filter: drop-shadow(0 0 6px #ff2200) drop-shadow(0 0 14px #ff4400) drop-shadow(0 0 24px #ff7700); }
          10%  { opacity: 1; transform-origin: center bottom; transform: scaleX(1.2) scaleY(2.2) translateY(-40px); filter: drop-shadow(0 0 10px #ff1100) drop-shadow(0 0 22px #ff3300) drop-shadow(0 0 36px #ff6600); }
          22%  { opacity: 1; transform-origin: center bottom; transform: scaleX(1.1) scaleY(1.3) translateY(-6px); filter: drop-shadow(0 0 12px #ff2200) drop-shadow(0 0 28px #ff5500) drop-shadow(0 0 40px #ff8833); }
          35%  { opacity: 1; transform-origin: center bottom; transform: scaleX(1.03) scaleY(0.98) translateY(1px); filter: drop-shadow(0 0 10px #ff4422) drop-shadow(0 0 24px #ff7744) drop-shadow(0 0 32px #ffaa77); }
          50%  { opacity: 1; transform-origin: center bottom; transform: scaleX(1) scaleY(1.01) translateY(0); filter: drop-shadow(0 0 6px #ff6644) drop-shadow(0 0 16px #ff9977) drop-shadow(0 0 24px #ffccaa); }
          100% { opacity: 1; transform-origin: center bottom; transform: scale(1); filter: drop-shadow(0 0 4px #ff7733) drop-shadow(0 0 8px rgba(255,120,50,0.4)); }
        }

        @keyframes strike-up {
          0%   { opacity: 0; transform-origin: center top; transform: scaleX(1.3) scaleY(3.5) translateY(120px); filter: drop-shadow(0 0 6px #ff2200) drop-shadow(0 0 14px #ff4400) drop-shadow(0 0 24px #ff7700); }
          10%  { opacity: 1; transform-origin: center top; transform: scaleX(1.2) scaleY(2.2) translateY(40px); filter: drop-shadow(0 0 10px #ff1100) drop-shadow(0 0 22px #ff3300) drop-shadow(0 0 36px #ff6600); }
          22%  { opacity: 1; transform-origin: center top; transform: scaleX(1.1) scaleY(1.3) translateY(6px); filter: drop-shadow(0 0 12px #ff2200) drop-shadow(0 0 28px #ff5500) drop-shadow(0 0 40px #ff8833); }
          35%  { opacity: 1; transform-origin: center top; transform: scaleX(1.03) scaleY(0.98) translateY(-1px); filter: drop-shadow(0 0 10px #ff4422) drop-shadow(0 0 24px #ff7744) drop-shadow(0 0 32px #ffaa77); }
          50%  { opacity: 1; transform-origin: center top; transform: scaleX(1) scaleY(1.01) translateY(0); filter: drop-shadow(0 0 6px #ff6644) drop-shadow(0 0 16px #ff9977) drop-shadow(0 0 24px #ffccaa); }
          100% { opacity: 1; transform-origin: center top; transform: scale(1); filter: drop-shadow(0 0 4px #ff7733) drop-shadow(0 0 8px rgba(255,120,50,0.4)); }
        }

        @keyframes bolt-fill-heat {
          0%   { fill: #ff5522; }
          10%  { fill: #ff4400; }
          22%  { fill: #ff6611; }
          35%  { fill: #ff8833; }
          50%  { fill: #ffaa66; }
          100% { fill: #f5faff; }
        }
        @keyframes fork-fill-heat {
          0%   { fill: #ff6633; }
          10%  { fill: #ff5511; }
          22%  { fill: #ff7722; }
          35%  { fill: #ff9944; }
          50%  { fill: #ffbb77; }
          100% { fill: #eef7ff; }
        }

        .bolt-strike-down { animation: strike-down 0.85s ease-out both, bolt-fill-heat 0.85s ease-out both, idle-bolt-flicker 4.8s 0.85s infinite ease-in-out; }
        .bolt-strike-up   { animation: strike-up 0.85s ease-out both, bolt-fill-heat 0.85s ease-out both, idle-bolt-flicker 4.8s 0.85s infinite ease-in-out; }
        .fork-strike-down { animation: strike-down 0.85s ease-out 0.04s both, fork-fill-heat 0.85s ease-out 0.04s both; transform-origin: center bottom; }
        .fork-strike-up   { animation: strike-up 0.85s ease-out 0.04s both, fork-fill-heat 0.85s ease-out 0.04s both; transform-origin: center top; }
        .extra-delay      { animation-delay: 0.08s; }

        @keyframes leader-draw-heat {
          0% { stroke-dashoffset: 1; opacity: 0; stroke: #ff4411; }
          3% { opacity: 0.9; stroke: #ff3300; filter: drop-shadow(0 0 4px #ff2200); }
          10% { stroke-dashoffset: 0; opacity: 0; stroke: #ff6622; }
        }
        .leader-draw { animation: leader-draw-heat 0.75s linear both; }

        @keyframes leader-burst-heat {
          0%, 35% { stroke-dashoffset: 1; opacity: 0; stroke: #ff5522; }
          38% { stroke-dashoffset: 0; opacity: 1; stroke: #ff3300; filter: drop-shadow(0 0 6px #ff2200) drop-shadow(0 0 12px #ff5500); }
          75% { stroke-dashoffset: -1; opacity: 0; }
        }
        .leader-burst { animation: leader-burst-heat 0.75s ease-out both; }

        @keyframes arc-flicker-heat {
          0%, 35%, 100% { opacity: 0; stroke-dashoffset: 1; stroke: #ff5522; }
          38% { opacity: 0.6; stroke-dashoffset: 0; stroke: #ff3300; filter: drop-shadow(0 0 4px #ff2200); }
          55% { opacity: 0; }
        }
        .arc-flicker { animation: arc-flicker-heat 0.65s ease-out both; }

        @keyframes spark-burst-heat {
          0%   { stroke-dashoffset: 1; opacity: 0; stroke: #ff9955; }
          32%  { stroke-dashoffset: 0; opacity: 1; stroke: #ff6622; filter: drop-shadow(0 0 5px #ff3300) drop-shadow(0 0 10px #ff5500); }
          100% { stroke-dashoffset: -1; opacity: 0; }
        }
        .spark-burst { animation: spark-burst-heat 0.65s ease-out both; }

        @keyframes extra-fork-heat {
          0%, 10%  { stroke: #ff4411; filter: drop-shadow(0 0 4px #ff2200); }
          20%      { stroke: #ff5522; }
          35%      { stroke: #ff7744; }
          50%      { stroke: #ffaa77; filter: none; }
          100%     { stroke: #ffbb99; }
        }
        .fork-strike-down.extra-fork, .fork-strike-up.extra-fork { animation: strike-down 0.85s ease-out 0.04s both, fork-fill-heat 0.85s ease-out 0.04s both, extra-fork-heat 0.85s ease-out 0.04s both; }
        .fork-strike-up.extra-fork { animation-name: strike-up, fork-fill-heat, extra-fork-heat; }

        @keyframes button-impact-jolt {
          0%   { transform: scale(1) translate(0,0); }
          8%   { transform: scale(1.05) translate(-0.8px, 0.6px); }
          18%  { transform: scale(0.98) translate(0.8px, -0.6px); }
          30%  { transform: scale(1.02) translate(-0.5px, 0.5px); }
          100% { transform: scale(1) translate(0,0); }
        }
        .button-impact { animation: button-impact-jolt 0.75s cubic-bezier(.32,.08,.22,.98) both; will-change: transform; }

        @keyframes static-burst {
          0%, 28% { opacity: 0; transform: translate(0,0) scale(0.5); }
          35% { opacity: 0.9; transform: translate(var(--bx), var(--by)) scale(1.25); filter: drop-shadow(0 0 3px #ff9944); }
          100% { opacity: 0; transform: translate(calc(var(--bx) * 1.4), calc(var(--by) * 1.4)) scale(0.7); }
        }
        .static-burst { animation: static-burst 0.75s ease-out both; }

        @keyframes arrow-pop {
          0%, 22%  { opacity: 0; transform: scale(0.35); }
          28%      { opacity: 1; transform: scale(1.25); filter: drop-shadow(0 0 7px #ffffff) drop-shadow(0 0 16px rgba(100,160,255,0.7)); }
          100%     { opacity: 1; transform: scale(1); }
        }
        @keyframes arrow-idle-pulse {
          0%, 100% { opacity: 0.85; filter: drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 8px rgba(100,160,255,0.5)); }
          50%      { opacity: 1; filter: drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 14px rgba(120,180,255,0.7)); }
        }
        .arrow-anim { animation: arrow-pop 0.75s cubic-bezier(.32,1.5,.6,1) both, arrow-idle-pulse 3.2s 0.75s infinite ease-in-out; }

        @keyframes explosion-flash {
          0%   { opacity: 0; transform: scale(0.25); filter: drop-shadow(0 0 10px #ff6600) drop-shadow(0 0 24px #ff3300); }
          18%  { opacity: 1; transform: scale(1.6); filter: drop-shadow(0 0 16px #ff8800) drop-shadow(0 0 32px #ff5500); }
          100% { opacity: 0; transform: scale(3); filter: drop-shadow(0 0 0 transparent); }
        }
        .explosion-flash { animation: explosion-flash 0.85s ease-out both; transform-origin: ${BOLT_CENTER_X}px ${BOLT_CENTER_Y}px; }

        @keyframes explosion-particle {
          0%   { opacity: 0; transform: translate(0, 0) scale(0.3); fill: #ffdd88; }
          12%  { opacity: 1; transform: translate(calc(var(--ex) * 0.3), calc(var(--ey) * 0.3)) scale(1.3); fill: #ffaa44; filter: drop-shadow(0 0 4px #ff6600); }
          40%  { opacity: 1; transform: translate(calc(var(--ex) * 0.7), calc(var(--ey) * 0.7)) scale(1.0); fill: #ff7722; filter: drop-shadow(0 0 5px #ff4400); }
          100% { opacity: 0; transform: translate(var(--ex), var(--ey)) scale(0.3); fill: #551100; }
        }
        .explosion-particle { animation: explosion-particle 0.9s cubic-bezier(.22,.72,.32,1) both; transform-box: fill-box; }

        @keyframes explosion-streak {
          0%   { stroke-dashoffset: 1; opacity: 0; stroke: #ffcc88; stroke-width: 1.8; filter: drop-shadow(0 0 3px #ff7722); }
          18%  { stroke-dashoffset: 0; opacity: 1; stroke: #ff8833; stroke-width: 2.2; filter: drop-shadow(0 0 5px #ff5500); }
          100% { stroke-dashoffset: -1; opacity: 0; stroke: #772200; stroke-width: 0.6; }
        }
        .explosion-streak { animation: explosion-streak 0.75s ease-out both; }

        @keyframes explosion-ring {
          0%   { opacity: 1; stroke-width: 3.5; r: 2; stroke: #ff9933; filter: drop-shadow(0 0 4px #ff6600); }
          100% { opacity: 0; stroke-width: 0.5; r: 42; stroke: #882200; }
        }
        .explosion-ring { fill: none; animation: explosion-ring 0.8s ease-out both; transform-origin: ${BOLT_CENTER_X}px ${BOLT_CENTER_Y}px; }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }

        /* Button base */
        .thunder-button {
          pointer-events: auto;
          position: fixed;
          bottom: 170px;
          right: 24px;
          width: 104px;
          height: 128px;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
          will-change: opacity, transform;
          filter: drop-shadow(0 0 6px rgba(255,100,50,0.3));
        }

        /* Freeze every animation inside the button while it's off-screen —
           the idle loops (static-float, idle-mini-zap, idle-bolt-flicker,
           arrow-idle-pulse) would otherwise run forever from page load
           even before the user has scrolled far enough to see the button. */
        .thunder-button[data-visible="false"] svg * {
          animation-play-state: paused !important;
        }

        /* Lower-power / touch devices: cut the costliest part — stacked
           multi-stop drop-shadow filters — down to a single stop each.
           Motion/timing/color choreography is untouched. */
        @media (pointer: coarse), (max-width: 768px) {
          .thunder-button { filter: none; will-change: opacity, transform; }
          .bolt-fill, .fork-fill, .arrow-fill { will-change: transform, opacity; }

          .bolt-fill { filter: drop-shadow(0 0 5px rgba(255,130,50,0.55)); }
          .fork-fill { filter: drop-shadow(0 0 4px rgba(255,150,80,0.5)); }
          .arrow-fill { filter: drop-shadow(0 0 6px rgba(150,190,255,0.65)); }

          @keyframes strike-down {
            0%   { opacity: 0; transform-origin: center bottom; transform: scaleX(1.3) scaleY(3.5) translateY(-120px); filter: drop-shadow(0 0 10px #ff3300); }
            22%  { opacity: 1; transform-origin: center bottom; transform: scaleX(1.1) scaleY(1.3) translateY(-6px); filter: drop-shadow(0 0 16px #ff5500); }
            50%  { opacity: 1; transform-origin: center bottom; transform: scaleX(1) scaleY(1.01) translateY(0); filter: drop-shadow(0 0 10px #ff8844); }
            100% { opacity: 1; transform-origin: center bottom; transform: scale(1); filter: drop-shadow(0 0 5px rgba(255,130,50,0.55)); }
          }
          @keyframes strike-up {
            0%   { opacity: 0; transform-origin: center top; transform: scaleX(1.3) scaleY(3.5) translateY(120px); filter: drop-shadow(0 0 10px #ff3300); }
            22%  { opacity: 1; transform-origin: center top; transform: scaleX(1.1) scaleY(1.3) translateY(6px); filter: drop-shadow(0 0 16px #ff5500); }
            50%  { opacity: 1; transform-origin: center top; transform: scaleX(1) scaleY(1.01) translateY(0); filter: drop-shadow(0 0 10px #ff8844); }
            100% { opacity: 1; transform-origin: center top; transform: scale(1); filter: drop-shadow(0 0 5px rgba(255,130,50,0.55)); }
          }
          @keyframes idle-bolt-flicker {
            0%, 88%, 100% { opacity: 1; filter: drop-shadow(0 0 5px rgba(255,130,50,0.55)); }
            91% { opacity: 0.85; }
            94% { opacity: 1; filter: drop-shadow(0 0 8px rgba(255,170,90,0.65)); }
            97% { opacity: 0.9; }
          }
          @keyframes explosion-flash {
            0%   { opacity: 0; transform: scale(0.25); filter: drop-shadow(0 0 12px #ff5500); }
            18%  { opacity: 1; transform: scale(1.6); filter: drop-shadow(0 0 18px #ff6600); }
            100% { opacity: 0; transform: scale(3); filter: drop-shadow(0 0 0 transparent); }
          }
        }
      `}</style>

      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showBackToTop ? 1 : 0, scale: showBackToTop ? 1 : 0.8 }}
        transition={{ duration: 0.4, ease: E }}
        className="thunder-button"
        data-visible={showBackToTop}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        aria-label="Back to top"
      >
        <span key={`jolt-${impactId}`} className="button-impact" style={{ position: "absolute", inset: 0 }} />

        <svg
          key={`${thunderAnim.id}-svg`}
          width="64" height="104" viewBox="-22 -12 64 100"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "relative", overflow: "visible" }}
        >
          {staticParticles.map((p, i) => (
            <circle key={`static-${i}`} cx={p.x} cy={p.y} r="0.9" className="static-particle static-float" style={particleStyles[i]} />
          ))}

          {burstParticles.map((p, i) => (
            <circle key={`burst-${impactId}-${i}`} cx={p.x} cy={p.y} r="1.1" fill="#ffccaa" className="static-burst" style={burstStyles[i]} />
          ))}

          {arcs.map((d, i) => (
            <path key={`arc-${i}`} className="arc-path arc-flicker" pathLength={1} d={d} style={{ animationDelay: `${0.04 + i * 0.025}s` } as StyleWithVars} />
          ))}

          {idleZaps.map((d, i) => (
            <path key={`idle-zap-${i}`} className="idle-zap-path idle-mini-zap" pathLength={1} d={d} style={{ animationDelay: `${i * 1.3}s` } as StyleWithVars} />
          ))}

          <path className={`extra-fork ${dir === "down" ? "fork-strike-down" : "fork-strike-up"} extra-delay`} pathLength={1} d={extraFork1} />
          <path className={`extra-fork ${dir === "down" ? "fork-strike-down" : "fork-strike-up"} extra-delay`} pathLength={1} d={extraFork2} />
          {!isLowPower && (
            <path className={`extra-fork ${dir === "down" ? "fork-strike-down" : "fork-strike-up"}`} pathLength={1} d={extraFork3} style={{ animationDelay: "0.12s" } as StyleWithVars} />
          )}

          {impactLeaders.map((d, i) => (
            <path key={`leader-${impactId}-${i}`} className="impact-leader leader-burst" pathLength={1} d={d} style={{ animationDelay: `${0.04 + i * 0.02}s` } as StyleWithVars} />
          ))}

          <path key={`stepped-leader-${thunderAnim.id}`} className="leader-path leader-draw" pathLength={1} d={leader1} />
          <path key={`fork-${thunderAnim.id}`} className={forkClass} d={FORK_FILL} />
          <path key={`bolt-${thunderAnim.id}`} className={boltClass} d={BOLT_FILL} />
          <path key={`arrow-${thunderAnim.id}`} className="arrow-fill arrow-anim" d={ARROW_CHEVRON} />

          {sparks.map((d, i) => (
            <path key={`spark-${i}`} className="spark-path spark-burst" pathLength={1} d={d} style={{ animationDelay: `${0.04 + i * 0.015}s` } as StyleWithVars} />
          ))}

          <g key={`explosion-${explosionId}`} style={{ opacity: dir === "up" ? 1 : 0 }}>
            <circle cx={BOLT_CENTER_X} cy={BOLT_CENTER_Y} r="14" fill="#ffaa55" className="explosion-flash" />
            <circle cx={BOLT_CENTER_X} cy={BOLT_CENTER_Y} r="2" className="explosion-ring" style={{ animationDelay: "0.06s" } as StyleWithVars} />
            {explosionStreaks.map((d, i) => (
              <path key={`ex-streak-${i}`} className="explosion-streak" pathLength={1} d={d} style={{ animationDelay: `${0.03 + i * 0.01}s` } as StyleWithVars} />
            ))}
            {explosionOffsets.map((o, i) => (
              <circle key={`ex-particle-${i}`} cx={BOLT_CENTER_X} cy={BOLT_CENTER_Y} r={o.er} className="explosion-particle" style={explosionStyles[i]} />
            ))}
          </g>
        </svg>
      </motion.button>
    </>
  );
}