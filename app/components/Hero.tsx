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

        .site-logo {
          position: fixed;
          top: 44px;
          left: 48px;
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
          pointer-events: none;
          user-select: none;
        }
        .site-logo-mark {
          position: relative;
          width: 30px;
          height: 30px;
          border: 1px solid rgba(245,246,252,0.35);
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(20,20,26,0.4);
          backdrop-filter: blur(4px);
        }
        .site-logo-mark::before,
        .site-logo-mark::after {
          content: "";
          position: absolute;
          width: 5px;
          height: 5px;
          border-color: rgba(245,246,252,0.6);
        }
        .site-logo-mark::before {
          top: -1px;
          left: -1px;
          border-top: 1px solid;
          border-left: 1px solid;
        }
        .site-logo-mark::after {
          bottom: -1px;
          right: -1px;
          border-bottom: 1px solid;
          border-right: 1px solid;
        }
        .site-logo-mark span {
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.02em;
          color: #F5F6FC;
        }
        .site-logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }
        .site-logo-name {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: rgba(245,246,252,0.85);
        }
        .site-logo-sub {
          font-size: 8px;
          font-weight: 500;
          letter-spacing: 0.24em;
          color: rgba(245,246,252,0.4);
        }
        @media (max-width: 900px) {
          .site-logo { top: 28px; left: 24px; }
          .site-logo-mark { width: 26px; height: 26px; }
        }

        .hero-section {
          position: relative;
          min-height: 100vh;
          background: transparent;
          overflow: hidden;
          display: flex;
          align-items: center;
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
            align-items: center !important;
            justify-content: center !important;
            gap: 28px !important;
          }
          .hero-text {
            text-align: left !important;
            align-items: flex-start !important;
            width: 100%;
            max-width: 480px;
            margin: 0 auto;
          }
          .hero-name {
            font-size: clamp(24px, 7vw, 38px) !important;
            line-height: 1.15 !important;
            white-space: normal !important;
            text-align: left !important;
          }
          .hero-desc {
            font-size: clamp(14px, 4vw, 16px) !important;
            line-height: 1.75 !important;
            max-width: 100% !important;
            text-align: left !important;
            margin: 16px 0 24px 0 !important;
          }
          .hero-btn-group {
            justify-content: flex-start !important;
          }
          .hero-profile-img {
            width: clamp(220px, 62vw, 340px) !important;
          }
          .name-row {
            justify-content: flex-start !important;
            text-align: left !important;
          }
          .spec-tag {
            font-size: 8px !important;
          }
          .coord-label { display: none; }
        }

        /* Extra safety net for very small phones (SE, small Androids) */
        @media (max-width: 380px) {
          .hero-desc {
            font-size: 13.5px !important;
            line-height: 1.7 !important;
          }
          .hero-name {
            font-size: 22px !important;
          }
          .container {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
      `}</style>

      <div className="site-logo" aria-hidden="true">
        <div className="site-logo-mark">
          <span>JN</span>
        </div>
        <div className="site-logo-text">
          <span className="site-logo-name">JCN</span>
          <span className="site-logo-sub">DESIGN LOG · 01</span>
        </div>
      </div>

      <div style={{ overflowX: "hidden" }}>
        <section id="hero" className="hero-section">
          <div className="coord-label tl" aria-hidden="true">X <span className="val">00</span> · Y <span className="val">00</span></div>
          <div className="coord-label tr" aria-hidden="true">PLATE <span className="val">01</span> / HERO</div>

          <div
            className="container"
            style={{
              position: "relative",
              zIndex: 3,
              width: "100%",
              maxWidth: "100%",
              padding: "80px clamp(24px, 4vw, 64px) 100px",
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
                      JHON CEDRICK F<span style={{ color: "#e63946" }}>.</span> NUNGAY
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
        </section>
      </div>

      <ThunderScrollButton />

      <AboutPortfolioModal open={siteAboutOpen} onClose={closeAboutSite} />
    </>
  );
}