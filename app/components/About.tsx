"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence, PanInfo } from "framer-motion";
import { mono, zalando } from "../fonts";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ACCENT = "#CEFF1A";
const BG = "#14141A";

const DETAILS = [
  { label: "EDUCATION", value: "Bs Information Technology" },
  { label: "LOCATION", value: "Navotas, Philippines" },
  { label: "ACHIEVEMENT", value: "Research Congress Awardee" },
  { label: "ROLE", value: "UX/UI Designer" },
  { label: "OPEN TO", value: "Full Time & Hybrid" },
];

const CARDS = [
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
      "Figma, Miro, VS Code, GitHub — design, prototyping, flow mapping, and version-controlled development.",
  },
];

const cardVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

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
      {/* Fixed curve: higher position + flatter arc to sit in middle of the number */}
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-[30px] h-[100px] w-full md:top-[35px] md:h-[120px]"
      >
        {/* New path: flatter arc (control point closer to end points) + positioned to cross middle of the number */}
        <path
          d="M 0 95 Q 600 75 1200 95"
          fill="none"
          stroke={ACCENT}
          strokeWidth="1.5"
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
        className="no-scrollbar relative flex w-full snap-x snap-mandatory overflow-x-auto overscroll-y-none scroll-smooth pt-12 md:pt-14 pb-6"
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
                WebkitTextStroke: "1.8px #CEFF1A",
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
                background: ACCENT,
                transform: `rotate(${TILT[i]}deg)`,
                margin: "0 0 14px 0",
              }}
            >
              • {cat.label} •
            </span>

            <p
              className={`${mono.className} max-w-[550px] text-[#F5F6FC]/80`}
              style={{
                fontSize: "clamp(16px, 1.9vw, 20px)",
                lineHeight: 1.65,
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

  const [[page, direction], setPage] = useState([0, 0]);
  const cardIndex = ((page % CARDS.length) + CARDS.length) % CARDS.length;
  const activeCard = CARDS[cardIndex];

  const paginate = (dir: number) => setPage(([p]) => [p + dir, dir]);
  const onCardDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50) paginate(1);
    if (info.offset.x > 50) paginate(-1);
  };

  return (
    <section
      id="about"
      ref={ref}
      style={{ background: BG, padding: "clamp(60px, 8vw, 100px) 0", width: "100%", overflow: "hidden" }}
    >
      <div className="container" style={{ width: "100%", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ marginBottom: "clamp(40px, 5vw, 50px)", textAlign: "center" }}
        >
          <h2
            className="about-title"
            style={{
              fontFamily: zalando.style.fontFamily,
              fontWeight: 900,
              textTransform: "uppercase",
              fontSize: "clamp(36px, 5.5vw, 56px)",
              letterSpacing: "0.15em",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            <span style={{ color: "#F5F6FC" }}>A LITTLE</span>
            <br />
            <span style={{ color: ACCENT }}>BACKGROUND</span>
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
                fontWeight: 900,
                textTransform: "uppercase",
                fontSize: "clamp(28px, 3.4vw, 38px)",
                letterSpacing: "0.1em",
                color: ACCENT,
                marginBottom: "16px",
              }}
            >
              ABOUT ME
            </h3>
            <p
              className={`${mono.className} about-desc`}
              style={{
                fontSize: "clamp(18px, 2.2vw, 24px)",
                lineHeight: 1.75,
                color: "rgba(245,246,252,0.9)",
                maxWidth: "460px",
              }}
            >
              <span
                style={{
                  background: ACCENT,
                  color: BG,
                  fontWeight: 600,
                  padding: "2px 6px",
                  borderRadius: "2px",
                  WebkitBoxDecorationBreak: "clone",
                  boxDecorationBreak: "clone",
                }}
              >
                BS Information Technology
              </span>{" "}
              graduate bridging design and development. I create user-centered digital experiences that are both intuitive and technically feasible – including a Research Congress-recognized classroom monitoring platform.
            </p>
          </motion.div>

          <motion.div
            className="cell-image"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          >
            <div
              className="profile-img"
              style={{
                position: "relative",
                width: "clamp(240px, 25vw, 320px)",
                aspectRatio: "4 / 5",
                overflow: "hidden",
                borderRadius: "4px",
              }}
            >
              <Image
                src="/nnnungay.jpg"
                alt="Profile photo"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 220px, 320px"
                priority
              />
            </div>
          </motion.div>

          <motion.div
            className="cell-card"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            style={{ position: "relative", width: "100%", maxWidth: "270px", minHeight: "clamp(260px, 52vw, 340px)" }}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={cardIndex}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: EASE }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={onCardDragEnd}
                whileTap={{ cursor: "grabbing", scale: 0.98 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: ACCENT,
                  borderRadius: "24px",
                  padding: "clamp(14px, 4vw, 20px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  gap: "8px",
                  cursor: "grab",
                  overflow: "hidden",
                }}
              >
                <p
                  style={{
                    fontFamily: zalando.style.fontFamily,
                    fontWeight: 950,
                    textTransform: "uppercase",
                    fontSize: "clamp(15px, 4vw, 20px)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    color: BG,
                    margin: 0,
                  }}
                >
                  {activeCard.title}
                </p>
                <p
                  className={mono.className}
                  style={{
                    fontSize: "clamp(12px, 2.8vw, 14px)",
                    lineHeight: 1.5,
                    fontWeight: 600,
                    color: BG,
                    margin: 0,
                  }}
                >
                  {activeCard.lines.map((l, i) => (
                    <span key={i}>
                      {l}
                      {i < activeCard.lines.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </motion.div>
            </AnimatePresence>

            <div style={{ display: "flex", gap: "8px", marginTop: "16px", justifyContent: "center" }}>
              {CARDS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage([i, i > cardIndex ? 1 : -1])}
                  aria-label={`Go to card ${i + 1}`}
                  style={{
                    width: i === cardIndex ? "22px" : "8px",
                    height: "8px",
                    borderRadius: "999px",
                    border: "none",
                    background: i === cardIndex ? ACCENT : "rgba(245,246,252,0.2)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* DIVIDER + INFO: divider left, text bigger, tighter spacing */}
          <motion.div
            className="cell-details"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            style={{ display: "flex", gap: "20px", width: "100%" }}
          >
            <div
              style={{
                width: "6px",
                background: ACCENT,
                flexShrink: 0,
                alignSelf: "stretch",
              }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "clamp(6px, 1vw, 10px) clamp(32px, 4vw, 56px)",
                flex: 1,
                width: "100%",
              }}
            >
              {DETAILS.map((d) => (
                <div key={d.label}>
                  <p
                    className="info-label"
                    style={{
                      fontFamily: zalando.style.fontFamily,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      fontSize: "clamp(16px, 2.2vw, 20px)",
                      letterSpacing: "0.08em",
                      color: ACCENT,
                      marginBottom: "1px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {d.label}
                  </p>
                  <p
                    className={mono.className}
                    style={{
                      fontSize: "clamp(15px, 2.1vw, 19px)",
                      color: "rgba(245,246,252,0.95)",
                    }}
                  >
                    {d.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div style={{ marginTop: "clamp(40px, 4vw, 60px)", width: "100%" }}>
          <SkillCurve inView={inView} />
        </div>
      </div>

      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: clamp(300px, 36vw, 460px) 1fr;
          grid-template-rows: auto auto;
          column-gap: clamp(24px, 3vw, 48px);
          row-gap: clamp(48px, 6vw, 72px);
          align-items: center;
          justify-items: center;
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }
        .about-grid .cell-text    { grid-column: 1; grid-row: 1; justify-self: start; width: 100%; }
        .about-grid .cell-image   { grid-column: 2; grid-row: 1; display: flex; justify-content: flex-start; }
        .about-grid .cell-card    { grid-column: 1; grid-row: 2; justify-self: center; align-self: stretch; }
        .about-grid .cell-details { grid-column: 2; grid-row: 2; align-self: stretch; justify-self: start; }

        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr; row-gap: 40px; }
          .about-grid .cell-text    { grid-column: 1; grid-row: 1; }
          .about-grid .cell-image   { grid-column: 1; grid-row: 2; justify-self: center; }
          .about-grid .cell-card    { grid-column: 1; grid-row: 3; justify-self: center; width: 290px !important; max-width: 90% !important; }
          .about-grid .cell-details { grid-column: 1; grid-row: 4; align-self: auto; }

          .about-title {
            font-size: clamp(28px, 7vw, 38px) !important;
            letter-spacing: 0.1em !important;
            max-width: 100% !important;
            margin: 0 auto !important;
          }

          .about-desc {
            font-size: clamp(14px, 3.8vw, 16px) !important;
            line-height: 1.7 !important;
            max-width: 100% !important;
          }

          .profile-img {
            width: clamp(200px, 55vw, 260px) !important;
          }

          .cell-card {
            max-width: 290px !important;
            min-height: clamp(230px, 48vw, 300px) !important;
          }
          .cell-card > div {
            padding: clamp(12px, 4vw, 18px) !important;
          }
          .cell-card p:first-child {
            font-size: clamp(14px, 4vw, 18px) !important;
          }

          .info-label {
            font-size: clamp(14px, 3vw, 16px) !important;
            letter-spacing: 0.06em !important;
            white-space: nowrap !important;
          }
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}