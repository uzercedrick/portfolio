"use client";
import { motion } from "framer-motion";
import { useState, KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { mono, zalando } from "../fonts";
import AboutPortfolioModal from "./AboutPortfolioModal";
import ThunderScrollButton from "./thunder";

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.25 } },
};
const up = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: E } },
};

type HeroProps = {
  openContactForm?: () => void;
};

export default function Hero({ openContactForm }: HeroProps) {
  const [siteAboutOpen, setSiteAboutOpen] = useState(false);

  const openAboutSite = () => setSiteAboutOpen(true);
  const closeAboutSite = () => setSiteAboutOpen(false);
  const onV1Key = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openAboutSite();
    }
  };

  return (
    <>
      <style>{`
        @keyframes v1-ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .v1-dot { position: relative; display: inline-flex; width: 6px; height: 6px; }
        .v1-dot-ping {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: rgba(245,246,252,0.75);
          opacity: 0.6;
          animation: v1-ping 1s cubic-bezier(0,0,0.2,1) infinite;
        }
        .v1-dot-core {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          background: rgba(245,246,252,0.75);
        }
        @media (prefers-reduced-motion: reduce) {
          .v1-dot-ping { animation: none; opacity: 0; }
        }

        .hero-section {
          position: relative;
          min-height: 100vh;
          background: #14141A;
          overflow: hidden;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(245,246,252,0.14) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,246,252,0.14) 1px, transparent 1px);
          background-size: 48px 48px;
          opacity: 0.55;
        }
        .hero-section::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(245,246,252,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,246,252,0.12) 1px, transparent 1px);
          background-size: 192px 192px;
          opacity: 0.7;
        }

        .reg-mark {
          position: absolute;
          z-index: 2;
          pointer-events: none;
          width: 28px;
          height: 28px;
          border: 1px solid rgba(245,246,252,0.25);
        }
        .reg-mark.tl { top: 28px; left: 28px; border-right: none; border-bottom: none; }
        .reg-mark.tr { top: 28px; right: 28px; border-left: none; border-bottom: none; }
        .reg-mark.bl { bottom: 28px; left: 28px; border-right: none; border-top: none; }
        .reg-mark.br { bottom: 28px; right: 28px; border-left: none; border-top: none; }
        .reg-mark::before, .reg-mark::after {
          content: '';
          position: absolute;
          background: rgba(245,246,252,0.45);
        }
        .reg-mark::before { width: 1px; height: 8px; }
        .reg-mark::after  { width: 8px; height: 1px; }
        .reg-mark.tl::before { top: -1px; left: 50%; transform: translateX(-50%); }
        .reg-mark.tl::after  { top: 50%; left: -1px; transform: translateY(-50%); }
        .reg-mark.tr::before { top: -1px; right: 50%; transform: translateX(50%); }
        .reg-mark.tr::after  { top: 50%; right: -1px; transform: translateY(-50%); }
        .reg-mark.bl::before { bottom: -1px; left: 50%; transform: translateX(-50%); }
        .reg-mark.bl::after  { bottom: 50%; left: -1px; transform: translateY(-50%); }
        .reg-mark.br::before { bottom: -1px; right: 50%; transform: translateX(50%); }
        .reg-mark.br::after  { bottom: 50%; right: -1px; transform: translateY(-50%); }

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
        .coord-label.bl { bottom: 24px; left: 72px; }
        .coord-label.br { bottom: 24px; right: 72px; }
        .coord-label .val { color: rgba(245,246,252,0.75); font-weight: 500; }

        .edge-rule-left {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          pointer-events: none;
          display: flex;
          align-items: center;
        }
        .edge-rule-left .line { width: 40px; height: 1px; background: rgba(245,246,252,0.25); }
        .edge-rule-left .label {
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
          font-size: 8px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(245,246,252,0.45);
          padding-left: 10px;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }

        .photo-frame { position: relative; }
        .photo-frame .tick {
          position: absolute;
          z-index: 3;
          background: rgba(245,246,252,0.45);
        }
        .photo-frame .tick.t { top: -1px; left: 50%; transform: translateX(-50%); width: 14px; height: 1px; }
        .photo-frame .tick.b { bottom: -1px; left: 50%; transform: translateX(-50%); width: 14px; height: 1px; }
        .photo-frame .tick.l { left: -1px; top: 50%; transform: translateY(-50%); width: 1px; height: 14px; }
        .photo-frame .tick.r { right: -1px; top: 50%; transform: translateY(-50%); width: 1px; height: 14px; }

        .photo-cap {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          z-index: 3;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
          font-size: 8px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(245,246,252,0.65);
          pointer-events: none;
        }
        .photo-cap b { color: #F5F6FC; font-weight: 500; }

        .spec-tag {
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(245,246,252,0.45);
          font-weight: 500;
          white-space: nowrap;
          padding: 3px 8px;
          border: 1px solid rgba(245,246,252,0.12);
          border-radius: 2px;
        }
        .name-row {
          display: flex;
          align-items: baseline;
          gap: 16px;
          flex-wrap: wrap;
          width: 100%;
        }

        .spec-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px clamp(24px, 4vw, 64px);
          border-top: 1px solid rgba(245,246,252,0.08);
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(245,246,252,0.45);
          pointer-events: none;
        }
        .spec-bar .group { display: flex; gap: 28px; align-items: center; }
        .spec-bar .item { display: flex; align-items: center; gap: 8px; }
        .spec-bar .dot { width: 5px; height: 5px; border-radius: 50%; background: #e63946; }
        .spec-bar b { color: rgba(245,246,252,0.75); font-weight: 500; }
        .spec-bar .rule { width: 24px; height: 1px; background: rgba(245,246,252,0.25); }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
          font-weight: 500;
          font-size: clamp(13px, 1.5vw, 15px);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 14px 28px;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .btn-solid {
          background: transparent;
          color: #F5F6FC;
          border: 1px solid #F5F6FC;
        }
        .btn-solid:hover {
          background: #F5F6FC;
          color: #14141A;
          border-color: #F5F6FC;
        }

        .btn-outline {
          background: transparent;
          color: #F5F6FC;
          border: 1px solid #F5F6FC;
        }
        .btn-outline:hover {
          background: #F5F6FC;
          color: #14141A;
          border-color: #F5F6FC;
        }

        @media (max-width: 900px) {
          .hero-content-wrap {
            flex-direction: column !important;
            text-align: center !important;
            justify-content: center !important;
            gap: 32px !important;
          }
          .hero-text {
            text-align: center !important;
            align-items: center !important;
          }
          .hero-name {
            font-size: clamp(24px, 6vw, 40px) !important;
            line-height: 1.1 !important;
            white-space: normal !important;
          }
          .hero-desc {
            font-size: clamp(14px, 3.2vw, 16px) !important;
            line-height: 1.7 !important;
            max-width: 100% !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .hero-btn-group {
            justify-content: center !important;
          }
          .hero-profile-img {
            width: clamp(240px, 70vw, 360px) !important;
          }
          .name-row { justify-content: center; }
          .reg-mark { display: none; }
          .coord-label { display: none; }
          .edge-rule-left { display: none; }
          .spec-bar {
            flex-direction: column;
            gap: 10px;
            padding: 12px 24px;
          }
          .spec-bar .group { gap: 16px; }
        }
      `}</style>

      <div style={{ overflowX: "hidden" }}>
        <section id="hero" className="hero-section">
          <div className="reg-mark tl" aria-hidden="true" />
          <div className="reg-mark tr" aria-hidden="true" />
          <div className="reg-mark bl" aria-hidden="true" />
          <div className="reg-mark br" aria-hidden="true" />

          <div className="coord-label tl" aria-hidden="true">X <span className="val">00</span> · Y <span className="val">00</span></div>
          <div className="coord-label tr" aria-hidden="true">PLATE <span className="val">01</span> / HERO</div>
          <div className="coord-label bl" aria-hidden="true">GRID <span className="val">48</span> · MAJOR <span className="val">192</span></div>
          <div className="coord-label br" aria-hidden="true">SECTION <span className="val">01</span></div>

          <div className="edge-rule-left" aria-hidden="true">
            <div className="line" />
            <div className="label">Registration · Vertical Datum</div>
          </div>

          <div
            className="container"
            style={{
              position: "relative",
              zIndex: 3,
              width: "100%",
              maxWidth: "100%",
              padding: "80px clamp(24px, 4vw, 64px) 60px",
              boxSizing: "border-box",
            }}
          >
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              style={{ width: "100%" }}
            >
              <motion.div
                variants={up}
                onClick={openAboutSite}
                onKeyDown={onV1Key}
                role="button"
                tabIndex={0}
                aria-label="View portfolio website build info (V1.0)"
                className={mono.className}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "8px",
                  cursor: "pointer",
                  pointerEvents: "auto",
                  fontWeight: 500,
                  fontSize: "11px",
                  lineHeight: 1,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(245,246,252,0.75)",
                  marginBottom: "48px",
                  padding: "6px 2px",
                  width: "100%",
                  transition: "color .2s ease",
                  userSelect: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(245,246,252,0.9)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,246,252,0.75)")}
              >
                <span className="v1-dot" aria-hidden="true">
                  <span className="v1-dot-ping" />
                  <span className="v1-dot-core" />
                </span>
                <span>V1.0</span>
              </motion.div>

              <div
                className="hero-content-wrap"
                style={{
                  display: "flex",
                  gap: "clamp(28px, 3.5vw, 56px)",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                <motion.div
                  variants={up}
                  className="hero-profile-img photo-frame"
                  style={{
                    flex: "0 0 auto",
                    position: "relative",
                    width: "clamp(280px, 32vw, 420px)",
                    aspectRatio: "1365 / 1767",
                    overflow: "hidden",
                    borderRadius: "2px",
                    border: "1px solid rgba(245,246,252,0.12)",
                  }}
                >
                  <div className="tick t" aria-hidden="true" />
                  <div className="tick b" aria-hidden="true" />
                  <div className="tick l" aria-hidden="true" />
                  <div className="tick r" aria-hidden="true" />
                  <Image
                    src="/nungay.jpg"
                    alt="Profile photo"
                    fill
                    style={{ 
                      objectFit: "cover",
                      objectPosition: "center 18%"
                    }}
                    sizes="(max-width: 900px) 320px, 420px"
                    priority
                  />
                  <div className="photo-cap" aria-hidden="true">
                    <span>FIG. <b>01</b></span>
                    <span>Ø <b>32vw</b> · 1365×1767</span>
                  </div>
                </motion.div>

                <div
                  className="hero-text"
                  style={{
                    flex: "1 1 380px",
                    minWidth: "320px",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <motion.div variants={up} className="name-row" style={{ width: "100%" }}>
                    <h1
                      className={`${zalando.className} hero-name`}
                      style={{
                        fontWeight: 900,
                        fontSize: "clamp(28px, 3.6vw, 44px)",
                        lineHeight: 1,
                        letterSpacing: "-0.01em",
                        color: "#F5F6FC",
                        marginBottom: 0,
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                        flex: "1 1 auto",
                      }}
                    >
                      JHON CEDRICK <span style={{ color: "#e63946" }}>.</span> NUNGAY
                    </h1>
                    <span className="spec-tag" aria-hidden="true">UX/UI · DESIGNER</span>
                  </motion.div>

                  <motion.p
                    variants={up}
                    className={`${mono.className} hero-desc`}
                    style={{
                      fontSize: "clamp(15px, 1.8vw, 18px)",
                      fontWeight: 400,
                      lineHeight: 1.7,
                      letterSpacing: "0.01em",
                      color: "rgba(245,246,252,0.65)",
                      margin: "18px 0 28px 0",
                      maxWidth: "560px",
                      width: "100%",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#F5F6FC" }}>
                      UX/UI Designer
                    </span>{" "}
                    passionate about building intuitive, user-first digital experiences. I blend clean design thinking with practical technical know-how to turn complex needs into simple, usable interfaces. From wireframes to interactive prototypes, I focus on creating products that feel natural to use and deliver real value for both people and teams.
                  </motion.p>

                  <motion.div
                    variants={up}
                    className="hero-btn-group"
                    style={{
                      display: "flex",
                      gap: "14px",
                      flexWrap: "wrap",
                      justifyContent: "flex-start",
                      width: "100%",
                    }}
                  >
                    <Link
                      href="/studies"
                      prefetch={true}
                      className="hero-btn btn-solid"
                      style={{ textDecoration: "none" }}
                    >
                      VIEW MY STUDIES <span style={{ fontSize: "18px", lineHeight: 1 }}>→</span>
                    </Link>

                    <button
                      type="button"
                      onClick={openContactForm}
                      className="hero-btn btn-outline"
                    >
                      CONTACT ME
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="spec-bar" aria-hidden="true">
            <div className="group">
              <div className="item"><span className="dot" /> SYSTEM <b>ACTIVE</b></div>
              <div className="rule" />
              <div className="item">FRAME <b>01</b> / <b>06</b></div>
            </div>
            <div className="group">
              <div className="item">SCROLL <b>READY</b></div>
              <div className="rule" />
              <div className="item">BUILD <b>V1.0</b> · 2026</div>
            </div>
          </div>
        </section>
      </div>

      <ThunderScrollButton />

      <AboutPortfolioModal open={siteAboutOpen} onClose={closeAboutSite} />
    </>
  );
}