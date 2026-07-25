"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MdEmail } from "react-icons/md";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { mono, zalando } from "../fonts";
import FormPopup from "./Form";

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];
const DARK_GRAY = "rgba(245,246,252,0.75)";
const ICE_WHITE = "#F5F6FC";
const MUTED_GRAY = "rgba(245,246,252,0.65)";
const BG = "#14141A";

const CONTACT_ITEMS = [
  { eyebrow: "EMAIL",    Icon: MdEmail,    text: "jhoncedrick.fuentes@gmail.com", href: "mailto:jhoncedrick.fuentes@gmail.com" },
  { eyebrow: "GITHUB",   Icon: FaGithub,   text: "github.com/uzercedrick",          href: "https://github.com/uzercedrick/" },
  { eyebrow: "LINKEDIN", Icon: FaLinkedinIn,text: "linkedin.com/in/jcnungay",         href: "https://linkedin.com/in/jcnungay" },
];

type ContactProps = {
  isFormOpen?: boolean;
  onOpenForm?: () => void;
  onCloseForm?: () => void;
};

function RevealLine({
  text,
  style,
  inView,
  delay = 0,
  duration = 0.65,
}: {
  text: string;
  style?: React.CSSProperties;
  inView: boolean;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.h3
      style={{
        fontFamily: zalando.style.fontFamily,
        fontWeight: 800,
        textTransform: "uppercase",
        color: ICE_WHITE,
        lineHeight: 1.15,
        margin: 0,
        ...style,
      }}
      initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.3 }}
      animate={inView ? { clipPath: "inset(0 0% 0 0)", opacity: 1 } : {}}
      transition={{ duration, ease: E, delay }}
    >
      {text}
    </motion.h3>
  );
}

type CharSegment = { text: string; color?: string } | { break: true };

function CharReveal({
  segments,
  style,
  inView,
  charDelay = 0.04,
  startDelay = 0,
}: {
  segments: CharSegment[];
  style?: React.CSSProperties;
  inView: boolean;
  charDelay?: number;
  startDelay?: number;
}) {
  let count = 0;
  return (
    <motion.h3
      style={{
        fontFamily: zalando.style.fontFamily,
        fontWeight: 800,
        textTransform: "uppercase",
        lineHeight: 1.15,
        margin: 0,
        ...style,
      }}
    >
      {segments.map((seg, si) => {
        if ("break" in seg) return <br key={`br-${si}`} />;
        return seg.text.split("").map((char, ci) => {
          const idx = count++;
          return (
            <motion.span
              key={`${si}-${ci}`}
              initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0)" } : {}}
              transition={{ duration: 0.35, ease: E, delay: startDelay + idx * charDelay }}
              style={{ display: "inline-block", color: seg.color }}
            >
              {char}
            </motion.span>
          );
        });
      })}
    </motion.h3>
  );
}

export default function Contact({ isFormOpen, onOpenForm, onCloseForm }: ContactProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px -80px 0px" });
  const [internalOpen, setInternalOpen] = useState(false);

  const openForm = () => onOpenForm ? onOpenForm() : setInternalOpen(true);
  const closeForm = () => onCloseForm ? onCloseForm() : setInternalOpen(false);

  const downloadResume = async () => {
    try {
      const res = await fetch("/resume.pdf");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Jhon-Cedrick-Nungay-Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) { console.error("Download failed", err); }
  };

  const formOpen = isFormOpen !== undefined ? isFormOpen : internalOpen;

  return (
    <section id="contact" ref={ref} style={{ background: BG, padding: "clamp(70px, 9vw, 110px) 0" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 28px" }}>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: E }}
          style={{ marginBottom: "clamp(50px, 7vw, 70px)" }}
        >
          <p style={{ fontFamily: mono.style.fontFamily, fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: MUTED_GRAY, margin: 0 }}>
            CONTACT
          </p>
        </motion.div>

        {/* Modern Editorial Grid */}
        <div className="contact-grid">
          {/* Left Column — Heading & CTA */}
          <div className="col-main">
            <RevealLine inView={inView} delay={0.1} text="GOT A VISION?"
              style={{ fontSize: "clamp(34px, 4.2vw, 52px)" }} />
            <RevealLine inView={inView} delay={0.85} text="I'D LOVE TO"
              style={{ fontSize: "clamp(34px, 4.2vw, 52px)", margin: "0.12em 0" }} />
            <CharReveal inView={inView} startDelay={1.6}
              style={{ fontSize: "clamp(34px, 4.2vw, 52px)", marginBottom: "36px" }}
              segments={[
                { text: "HEAR ALL", color: ICE_WHITE },
                { break: true },
                { text: "ABOUT ", color: ICE_WHITE },
                { text: "IT.", color: DARK_GRAY },
              ]} />

            <motion.button
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 2.3, ease: E }}
              onClick={downloadResume}
              className={mono.className}
              style={{
                display: "inline-flex", alignItems: "center", gap: "12px",
                background: "transparent", color: ICE_WHITE,
                border: `1px solid ${DARK_GRAY}`,
                fontWeight: 500, fontSize: "clamp(13px, 1.5vw, 15px)",
                letterSpacing: "0.16em", textTransform: "uppercase",
                padding: "14px 28px", borderRadius: "2px",
                cursor: "pointer", transition: "all 0.25s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = ICE_WHITE;
                e.currentTarget.style.color = BG;
                e.currentTarget.style.borderColor = ICE_WHITE;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = ICE_WHITE;
                e.currentTarget.style.borderColor = DARK_GRAY;
              }}
            >
              DOWNLOAD RESUME ↓
            </motion.button>

            {/* Bottom CTA + New Text Button Side-by-Side */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8, ease: E }}
              style={{ marginTop: "clamp(40px, 5vw, 60px)", display: "flex", alignItems: "flex-end", gap: "clamp(24px, 3vw, 36px)", flexWrap: "wrap" }}
            >
              <div>
                <h2 style={{ fontFamily: zalando.style.fontFamily, fontWeight: 800, fontSize: "clamp(22px, 3vw, 32px)", color: ICE_WHITE, textTransform: "uppercase", lineHeight: 1.2, margin: 0 }}>
                  LET&apos;S BUILD
                </h2>
                <h2 style={{ fontFamily: zalando.style.fontFamily, fontWeight: 800, fontSize: "clamp(22px, 3vw, 32px)", color: DARK_GRAY, textTransform: "uppercase", lineHeight: 1.2, margin: "0 0 8px" }}>
                  SOMETHING GREAT
                </h2>
                <p style={{ fontFamily: mono.style.fontFamily, fontSize: "13px", color: MUTED_GRAY, margin: 0 }}>
                  OPEN TO PROJECTS, COLLABORATIONS & OPPORTUNITIES
                </p>
              </div>

              {/* ✅ Modern Text Button — replaces circle button */}
              <motion.button
                onClick={openForm}
                initial={{ opacity: 0, x: 12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.0, ease: E }}
                whileHover={{ x: 4 }}
                style={{
                  fontFamily: zalando.style.fontFamily,
                  fontWeight: 800,
                  fontSize: "clamp(15px, 2vw, 20px)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: ICE_WHITE,
                  background: "transparent",
                  border: "none",
                  borderBottom: `1px solid ${DARK_GRAY}`,
                  padding: "8px 0",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = DARK_GRAY;
                  e.currentTarget.style.borderBottomColor = ICE_WHITE;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = ICE_WHITE;
                  e.currentTarget.style.borderBottomColor = DARK_GRAY;
                }}
              >
                START →
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column — Contact List Only */}
          <div className="col-details">
            <p style={{ fontFamily: mono.style.fontFamily, fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: MUTED_GRAY, marginBottom: "18px" }}>
              WHERE TO FIND ME
            </p>

            {CONTACT_ITEMS.map(({ eyebrow, Icon, text, href }, i) => (
              <motion.a
                key={eyebrow}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease: E }}
                style={{ display: "block", padding: "10px 0", borderBottom: `1px solid ${MUTED_GRAY}`, textDecoration: "none" }}
                className="contact-link"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <Icon size={18} style={{ color: DARK_GRAY, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontFamily: mono.style.fontFamily, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED_GRAY, margin: 0 }}>
                      {eyebrow}
                    </p>
                    <p style={{ fontFamily: mono.style.fontFamily, fontSize: "13px", color: ICE_WHITE, margin: "2px 0 0" }}>
                      {text}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          column-gap: clamp(50px, 7vw, 90px);
          align-items: start;
        }

        .col-main { grid-column: 1 / 2; }
        .col-details { grid-column: 2 / 3; }

        .contact-link:hover { border-bottom-color: ${ICE_WHITE}; }
        .contact-link:hover p:last-child { color: ${DARK_GRAY}; }

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
            row-gap: 48px;
          }
          .col-main, .col-details { grid-column: 1; }
        }
      `}</style>

      <FormPopup isOpen={formOpen} onClose={closeForm} />
    </section>
  );
}