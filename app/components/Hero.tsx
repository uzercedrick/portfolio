"use client";
import { motion } from "framer-motion";
import { useState, KeyboardEvent } from "react";
import Link from "next/link";
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
          background: #CEFF1A;
          opacity: 0.6;
          animation: v1-ping 1s cubic-bezier(0,0,0.2,1) infinite;
        }
        .v1-dot-core {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          background: #CEFF1A;
        }
        @media (prefers-reduced-motion: reduce) {
          .v1-dot-ping { animation: none; opacity: 0; }
        }

        /* MOBILE FIXES - HIGH PRIORITY */
        @media (max-width: 480px) {
          /* Force exact 2-line name layout */
          .hero-name {
            font-size: clamp(26px, 7.5vw, 34px) !important;
            line-height: 1.2 !important;
            white-space: pre-line !important;
            word-break: keep-all !important;
          }

          /* Clean description layout */
          .hero-desc {
            font-size: clamp(13px, 3.2vw, 15px) !important;
            line-height: 1.7 !important;
            text-align: center !important;
            max-width: 380px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            padding: 0 8px !important;
            white-space: normal !important;
            text-wrap: pretty;
          }
        }

        /* Button sizing */
        @media (max-width: 480px) {
          .hero-btn {
            width: auto !important;
            max-width: 90% !important;
            padding: 14px 24px !important;
          }
        }
      `}</style>

      <div style={{ overflowX: "hidden" }}>
        <section
          id="hero"
          style={{
            position: "relative",
            minHeight: "100vh",
            background: "#14141A",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            className="container"
            style={{
              position: "relative",
              zIndex: 3,
              width: "100%",
              maxWidth: "1100px",
              padding: "80px 24px 60px",
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
                  color: "#CEFF1A",
                  marginTop: "-30px",
                  marginBottom: "30px",
                  padding: "6px 2px",
                  width: "100%",
                  transition: "color .2s ease",
                  userSelect: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#D8FF48")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#CEFF1A")}
              >
                <span className="v1-dot" aria-hidden="true">
                  <span className="v1-dot-ping" />
                  <span className="v1-dot-core" />
                </span>
                <span>V1.0</span>
              </motion.div>

              <motion.p
                variants={up}
                className={zalando.className}
                style={{
                  fontWeight: 700,
                  fontSize: "clamp(22px, 3.2vw, 26px)",
                  lineHeight: 1,
                  letterSpacing: "0.06em",
                  color: "#F5F6FC",
                  marginBottom: "12px",
                }}
              >
                HI I&apos;M
              </motion.p>

              {/* EXACT 2-LINE NAME LAYOUT */}
              <motion.h1
                variants={up}
                className={`${zalando.className} hero-name`}
                style={{
                  fontWeight: 900,
                  fontSize: "clamp(38px, 6vw, 68px)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  color: "#CEFF1A",
                  marginBottom: "32px",
                  textTransform: "uppercase",
                  whiteSpace: "pre-line",
                }}
              >
                JHON CEDRICK F.
                <br />
                NUNGAY
              </motion.h1>

              {/* CLEANED DESCRIPTION */}
              <motion.p
                variants={up}
                className={`${mono.className} hero-desc`}
                style={{
                  fontSize: "clamp(18px, 2.4vw, 22px)",
                  fontWeight: 400,
                  lineHeight: 1.6,
                  letterSpacing: "0.02em",
                  color: "rgba(245,246,252,0.9)",
                  margin: "0 auto 48px",
                  maxWidth: "760px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    background: "#CEFF1A",
                    color: "#14141A",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "2px",
                    marginBottom: "4px",
                  }}
                >
                  UX/UI Designer
                </span>{" "}
                passionate about creating intuitive, accessible, and user-centered digital experiences. Combining creative design with practical technical knowledge to build solutions that work for both users and businesses.
              </motion.p>

              <motion.div
                variants={up}
                style={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Link
                  href="/studies"
                  prefetch={true}
                  className={`${mono.className} hero-btn`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    background: "#CEFF1A",
                    color: "#14141A",
                    fontWeight: 700,
                    fontSize: "clamp(14px, 1.6vw, 16px)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    padding: "18px 40px",
                    borderRadius: "6px",
                    textDecoration: "none",
                    transition: "background .2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.background = "#D8FF48")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.background = "#CEFF1A")
                  }
                >
                  VIEW MY STUDIES <span style={{ fontSize: "20px", lineHeight: 1 }}>→</span>
                </Link>

                <button
                  type="button"
                  onClick={openContactForm}
                  className={`${mono.className} hero-btn`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    background: "transparent",
                    color: "#F5F6FC",
                    border: "2px solid #F5F6FC",
                    fontWeight: 700,
                    fontSize: "clamp(14px, 1.6vw, 16px)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    padding: "18px 40px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all .2s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = "#F5F6FC";
                    el.style.color = "#14141A";
                    el.style.borderColor = "#F5F6FC";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = "transparent";
                    el.style.color = "#F5F6FC";
                    el.style.borderColor = "#F5F6FC";
                  }}
                >
                  CONTACT ME
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      <ThunderScrollButton />

      <AboutPortfolioModal open={siteAboutOpen} onClose={closeAboutSite} />
    </>
  );
}