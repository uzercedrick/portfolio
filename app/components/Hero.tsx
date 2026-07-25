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

        /* MOBILE FIXES */
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
          .hero-btn {
            padding: 11px 22px !important;
            font-size: 13px !important;
          }
          .hero-profile-img {
            width: clamp(240px, 70vw, 360px) !important;
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
            width: "100%",
          }}
        >
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
                {/* Profile Image */}
                <motion.div
                  variants={up}
                  className="hero-profile-img"
                  style={{
                    flex: "0 0 auto",
                    position: "relative",
                    width: "clamp(280px, 32vw, 420px)",
                    aspectRatio: "1365 / 1767",
                    overflow: "hidden",
                    borderRadius: "2px",
                  }}
                >
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
                </motion.div>

                {/* Text Content */}
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
                  {/* NAME - Darker gray */}
                  <motion.h1
                    variants={up}
                    className={`${zalando.className} hero-name`}
                    style={{
                      fontWeight: 900,
                      fontSize: "clamp(28px, 3.6vw, 44px)",
                      lineHeight: 1,
                      letterSpacing: "-0.01em",
                      color: "rgba(245,246,252,0.75)",
                      marginBottom: "18px",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      width: "100%",
                    }}
                  >
                    JHON CEDRICK F. NUNGAY
                  </motion.h1>

                  {/* DESCRIPTION */}
                  <motion.p
                    variants={up}
                    className={`${mono.className} hero-desc`}
                    style={{
                      fontSize: "clamp(15px, 1.8vw, 18px)",
                      fontWeight: 400,
                      lineHeight: 1.7,
                      letterSpacing: "0.01em",
                      color: "rgba(245,246,252,0.65)",
                      margin: "0 0 28px 0",
                      maxWidth: "560px",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#F5F6FC",
                      }}
                    >
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
                    {/* ✅ LIME BUTTON → GRAY BUTTON */}
                    <Link
                      href="/studies"
                      prefetch={true}
                      className={`${mono.className} hero-btn`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        background: "rgba(245,246,252,0.75)",
                        color: "#14141A",
                        fontWeight: 700,
                        fontSize: "clamp(13px, 1.3vw, 15px)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        padding: "12px 28px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        transition: "background .2s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(245,246,252,0.9)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(245,246,252,0.75)")
                      }
                    >
                      VIEW MY STUDIES <span style={{ fontSize: "18px", lineHeight: 1 }}>→</span>
                    </Link>

                    <button
                      type="button"
                      onClick={openContactForm}
                      className={`${mono.className} hero-btn`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        background: "transparent",
                        color: "#F5F6FC",
                        border: "2px solid #F5F6FC",
                        fontWeight: 700,
                        fontSize: "clamp(13px, 1.3vw, 15px)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        padding: "12px 28px",
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